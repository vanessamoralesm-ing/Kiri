import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import React, { useCallback, useMemo, useRef, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import CuestionarioAdminCard from "@/components/superadmin/cuestionarios/CuestionarioAdminCard";

import CuestionariosAdminKpi from "@/components/superadmin/cuestionarios/CuestionarioAdminKpi";

import CuestionariosAdminToolbar, {
    type FiltroEstadoCuestionario,
} from "@/components/superadmin/cuestionarios/CuestionarioAdminToolbar";

import {
    despublicarTestAdmin,
    obtenerTestsAdmin,
    publicarTestAdmin,
    type TestAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// UTILIDADES
// ==========================================================

type ErrorSupabase = {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
};

function obtenerMensajeError(error: unknown): string {
    if (typeof error === "string" && error.trim()) {
        return error;
    }

    if (error && typeof error === "object") {
        const err = error as ErrorSupabase;

        const partes = [
            err.message,
            err.code ? `Código: ${err.code}` : null,
            err.details,
            err.hint ? `Sugerencia: ${err.hint}` : null,
        ].filter(Boolean);

        if (partes.length > 0) {
            return partes.join("\n");
        }
    }

    return "Ocurrió un error inesperado. Consulta la consola.";
}

function registrarError(contexto: string, error: unknown) {
    console.error(contexto, error);

    if (error && typeof error === "object") {
        const err = error as ErrorSupabase;

        console.error("Detalles del error:", {
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint,
        });
    }
}

// ==========================================================
// PANTALLA
// ==========================================================

export default function CuestionariosSuperAdminScreen() {
    const router = useRouter();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const dangerColor = useThemeColor({}, "danger");

    // ======================================================
    // ESTADOS
    // ======================================================

    const [tests, setTests] = useState<TestAdmin[]>([]);

    const [cargando, setCargando] = useState(true);

    const [actualizando, setActualizando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [errorAccion, setErrorAccion] = useState<string | null>(null);

    const [busqueda, setBusqueda] = useState("");

    const [filtroEstado, setFiltroEstado] =
        useState<FiltroEstadoCuestionario>("todos");

    const [testProcesando, setTestProcesando] = useState<string | null>(null);

    // Impide solicitudes simultáneas incluso antes
    // de que React actualice el estado visual.
    const operacionEnCurso = useRef(false);

    // Evita que una respuesta antigua sobrescriba
    // una carga más reciente.
    const solicitudActual = useRef(0);

    // ======================================================
    // CARGA DE CUESTIONARIOS
    // ======================================================

    const cargarTests = useCallback(async (mostrarCarga = true) => {
        const solicitud = ++solicitudActual.current;

        try {
            if (mostrarCarga) {
                setCargando(true);
            }

            setError(null);

            const datos = await obtenerTestsAdmin();

            if (solicitud !== solicitudActual.current) {
                return;
            }

            setTests(datos);
        } catch (err) {
            if (solicitud !== solicitudActual.current) {
                return;
            }

            registrarError("Error cargando cuestionarios:", err);

            setError(
                "No fue posible cargar los cuestionarios.\n\n" +
                obtenerMensajeError(err),
            );
        } finally {
            if (mostrarCarga && solicitud === solicitudActual.current) {
                setCargando(false);
            }
        }
    }, []);

    // Recarga el listado cuando la pantalla
    // vuelve a recibir el foco.
    useFocusEffect(
        useCallback(() => {
            void cargarTests();

            return () => {
                solicitudActual.current += 1;
            };
        }, [cargarTests]),
    );

    // ======================================================
    // ACTUALIZAR MANUALMENTE
    // ======================================================

    async function refrescar() {
        if (actualizando || cargando || operacionEnCurso.current) {
            return;
        }

        try {
            setActualizando(true);
            setErrorAccion(null);

            await cargarTests(false);
        } finally {
            setActualizando(false);
        }
    }

    // ======================================================
    // RESUMEN
    // ======================================================

    const resumen = useMemo(() => {
        const total = tests.length;

        const activos = tests.filter((test) => test.estado).length;

        return {
            total,
            activos,
            inactivos: total - activos,
        };
    }, [tests]);

    // ======================================================
    // BÚSQUEDA Y FILTROS
    // ======================================================

    const testsFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();

        return tests.filter((test) => {
            const coincideBusqueda =
                !termino ||
                test.nombre.toLowerCase().includes(termino) ||
                test.codigo.toLowerCase().includes(termino) ||
                (test.descripcion ?? "").toLowerCase().includes(termino);

            const coincideEstado =
                filtroEstado === "todos" ||
                (filtroEstado === "activos" && test.estado) ||
                (filtroEstado === "inactivos" && !test.estado);

            return coincideBusqueda && coincideEstado;
        });
    }, [tests, busqueda, filtroEstado]);

    // ======================================================
    // NAVEGACIÓN
    // ======================================================

    function crearNuevo() {
        router.push("/superadmin/cuestionarios/nuevo" as never);
    }

    function editarTest(test: TestAdmin) {
        router.push(`/superadmin/cuestionarios/${test.id_test}` as never);
    }

    // ======================================================
    // PUBLICAR / DESPUBLICAR
    // ======================================================

    async function cambiarEstado(test: TestAdmin) {
        if (operacionEnCurso.current || actualizando) {
            return;
        }

        operacionEnCurso.current = true;

        try {
            setTestProcesando(test.id_test);
            setErrorAccion(null);

            console.log("Iniciando cambio de estado:", {
                idTest: test.id_test,
                nombre: test.nombre,
                estadoActual: test.estado,
                nuevoEstado: !test.estado,
            });

            // La publicación debe pasar por las
            // validaciones del servicio existente.
            const actualizado = test.estado
                ? await despublicarTestAdmin(test.id_test)
                : await publicarTestAdmin(test.id_test);

            if (
                actualizado.id_test !== test.id_test ||
                actualizado.estado === test.estado
            ) {
                throw new Error(
                    "El servicio no confirmó el cambio " + "de estado del cuestionario.",
                );
            }

            // Invalida cargas anteriores que todavía
            // pudieran estar pendientes.
            solicitudActual.current += 1;

            setTests((actuales) =>
                actuales.map((item) =>
                    item.id_test === test.id_test
                        ? {
                            ...item,
                            ...actualizado,
                        }
                        : item,
                ),
            );

            console.log("Estado actualizado correctamente:", {
                idTest: actualizado.id_test,
                estado: actualizado.estado,
            });
        } catch (err) {
            registrarError("Error cambiando el estado del cuestionario:", err);

            const mensaje = obtenerMensajeError(err);

            setErrorAccion(
                `No se pudo ${test.estado ? "despublicar" : "publicar"
                } "${test.nombre}".\n\n${mensaje}`,
            );
        } finally {
            operacionEnCurso.current = false;
            setTestProcesando(null);
        }
    }

    // ======================================================
    // RESPONSIVE
    // ======================================================

    const paddingHorizontal = esTelefono
        ? PADDING_RESPONSIVE.telefono
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.escritorio;

    const columnasKpi = esEscritorio ? 3 : esTablet ? 2 : 1;

    const gapKpi = 14;

    // flexBasis no es necesario: mantenemos
    // los anchos responsive originales.
    const anchoKpi =
        columnasKpi === 1 ? "100%" : columnasKpi === 2 ? "48%" : "32%";

    const hayFiltros = busqueda.trim().length > 0 || filtroEstado !== "todos";

    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingHorizontal,
                    paddingTop: esTelefono ? 22 : 30,
                    paddingBottom: 120,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={actualizando}
                        onRefresh={refrescar}
                        tintColor={primaryColor}
                        colors={[primaryColor]}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        width: "100%",
                        maxWidth: MAX_WIDTHS.dashboard,
                        alignSelf: "center",
                    }}
                >
                    {/* ======================================
                        ENCABEZADO
                    ====================================== */}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",
                            alignItems: esTelefono ? "stretch" : "flex-start",
                            justifyContent: "space-between",
                            gap: 18,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: esTelefono ? 25 : 30,
                                    lineHeight: esTelefono ? 32 : 38,
                                    color: textColor,
                                }}
                            >
                                Cuestionarios
                            </Text>

                            <Text
                                style={{
                                    maxWidth: 680,
                                    marginTop: 7,
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 14,
                                    lineHeight: 21,
                                    color: textSecondaryColor,
                                }}
                            >
                                Administra los instrumentos de evaluación disponibles en Kiri,
                                sus preguntas, opciones, baremos y configuración.
                            </Text>
                        </View>

                        {/* REGISTRAR NUEVO */}

                        <Pressable
                            onPress={crearNuevo}
                            accessibilityRole="button"
                            accessibilityLabel="Registrar nuevo cuestionario"
                            style={({ pressed }) => ({
                                alignSelf: esTelefono ? "stretch" : "flex-start",
                                minHeight: 50,
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 14,
                                backgroundColor: primaryColor,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 9,
                                opacity: pressed ? 0.8 : 1,
                            })}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={21}
                                color={textOnPrimaryColor}
                            />

                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 14,
                                    color: textOnPrimaryColor,
                                    textAlign: "center",
                                }}
                            >
                                Registrar nuevo
                            </Text>
                        </Pressable>
                    </View>

                    {/* ======================================
                        KPIs
                    ====================================== */}

                    <View
                        style={{
                            marginTop: 28,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: gapKpi,
                        }}
                    >
                        <View
                            style={{
                                width: anchoKpi as `${number}%`,
                            }}
                        >
                            <CuestionariosAdminKpi
                                titulo="Cuestionarios"
                                valor={resumen.total}
                                icono="clipboard-outline"
                                descripcion="Total registrados en el sistema"
                            />
                        </View>

                        <View
                            style={{
                                width: anchoKpi as `${number}%`,
                            }}
                        >
                            <CuestionariosAdminKpi
                                titulo="Activos"
                                valor={resumen.activos}
                                icono="checkmark-circle-outline"
                                descripcion="Disponibles para los usuarios"
                                variante="success"
                            />
                        </View>

                        <View
                            style={{
                                width: anchoKpi as `${number}%`,
                            }}
                        >
                            <CuestionariosAdminKpi
                                titulo="Inactivos"
                                valor={resumen.inactivos}
                                icono="pause-circle-outline"
                                descripcion="No visibles para los usuarios"
                                variante="neutral"
                            />
                        </View>
                    </View>

                    {/* ======================================
                        ERROR DE PUBLICACIÓN
                    ====================================== */}

                    {errorAccion && (
                        <View
                            style={{
                                marginTop: 22,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: dangerColor,
                                borderRadius: 14,
                                backgroundColor: surfaceColor,
                                flexDirection: "row",
                                alignItems: "flex-start",
                                gap: 12,
                            }}
                        >
                            <Ionicons
                                name="alert-circle-outline"
                                size={22}
                                color={dangerColor}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    gap: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
                                        lineHeight: 20,
                                        color: textColor,
                                    }}
                                >
                                    {errorAccion}
                                </Text>

                                <Pressable
                                    onPress={() => setErrorAccion(null)}
                                    accessibilityRole="button"
                                    style={{
                                        alignSelf: "flex-start",
                                        paddingVertical: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 12,
                                            color: primaryColor,
                                        }}
                                    >
                                        Cerrar mensaje
                                    </Text>
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={() => setErrorAccion(null)}
                                hitSlop={10}
                                accessibilityRole="button"
                                accessibilityLabel="Cerrar error"
                            >
                                <Ionicons name="close" size={19} color={textSecondaryColor} />
                            </Pressable>
                        </View>
                    )}

                    {/* ======================================
                        LISTADO
                    ====================================== */}

                    <View
                        style={{
                            marginTop: 28,
                            padding: esTelefono ? 16 : 20,
                            borderWidth: 1,
                            borderColor,
                            borderRadius: 20,
                            backgroundColor: surfaceColor,
                        }}
                    >
                        {/* TÍTULO DEL LISTADO */}

                        <View
                            style={{
                                marginBottom: 18,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 18,
                                    color: textColor,
                                }}
                            >
                                Instrumentos registrados
                            </Text>

                            <Text
                                style={{
                                    marginTop: 4,
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 12,
                                    color: textSecondaryColor,
                                }}
                            >
                                {testsFiltrados.length}{" "}
                                {testsFiltrados.length === 1
                                    ? "cuestionario encontrado"
                                    : "cuestionarios encontrados"}
                            </Text>
                        </View>

                        {/* BÚSQUEDA Y FILTROS */}

                        <CuestionariosAdminToolbar
                            busqueda={busqueda}
                            filtroEstado={filtroEstado}
                            onCambiarBusqueda={setBusqueda}
                            onCambiarFiltro={setFiltroEstado}
                        />

                        {/* ==================================
                            CARGANDO
                        ================================== */}

                        {cargando ? (
                            <View
                                style={{
                                    minHeight: 240,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,
                                }}
                            >
                                <ActivityIndicator size="large" color={primaryColor} />

                                <Text
                                    style={{
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
                                        color: textSecondaryColor,
                                    }}
                                >
                                    Cargando cuestionarios...
                                </Text>
                            </View>
                        ) : error ? (
                            /* ==============================
                                              ERROR DE CARGA
                                          ============================== */

                            <View
                                style={{
                                    minHeight: 220,
                                    marginTop: 18,
                                    padding: 20,
                                    borderRadius: 16,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,
                                }}
                            >
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={38}
                                    color={dangerColor}
                                />

                                <Text
                                    style={{
                                        fontFamily: "Nunito-SemiBold",
                                        fontSize: 14,
                                        lineHeight: 21,
                                        textAlign: "center",
                                        color: textColor,
                                    }}
                                >
                                    {error}
                                </Text>

                                <Pressable
                                    onPress={() => void cargarTests()}
                                    accessibilityRole="button"
                                    style={({ pressed }) => ({
                                        minHeight: 44,
                                        paddingHorizontal: 18,
                                        borderRadius: 12,
                                        backgroundColor: primaryColor,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: pressed ? 0.75 : 1,
                                    })}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 12,
                                            color: textOnPrimaryColor,
                                        }}
                                    >
                                        Intentar nuevamente
                                    </Text>
                                </Pressable>
                            </View>
                        ) : testsFiltrados.length === 0 ? (
                            /* ==============================
                                              ESTADO VACÍO
                                          ============================== */

                            <View
                                style={{
                                    minHeight: 260,
                                    marginTop: 18,
                                    padding: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,
                                }}
                            >
                                <View
                                    style={{
                                        width: 66,
                                        height: 66,
                                        borderRadius: 20,
                                        backgroundColor: primarySoftColor,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={hayFiltros ? "search-outline" : "clipboard-outline"}
                                        size={31}
                                        color={primaryColor}
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        textAlign: "center",
                                        color: textColor,
                                    }}
                                >
                                    {hayFiltros
                                        ? "No se encontraron cuestionarios"
                                        : "Aún no hay cuestionarios registrados"}
                                </Text>

                                <Text
                                    style={{
                                        maxWidth: 420,
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
                                        lineHeight: 20,
                                        textAlign: "center",
                                        color: textSecondaryColor,
                                    }}
                                >
                                    {hayFiltros
                                        ? "Prueba con otros términos de búsqueda o cambia el filtro seleccionado."
                                        : "Comienza registrando tu primer instrumento de evaluación."}
                                </Text>

                                {hayFiltros ? (
                                    <Pressable
                                        onPress={() => {
                                            setBusqueda("");
                                            setFiltroEstado("todos");
                                        }}
                                        accessibilityRole="button"
                                        style={({ pressed }) => ({
                                            minHeight: 43,
                                            paddingHorizontal: 17,
                                            borderWidth: 1,
                                            borderColor,
                                            borderRadius: 12,
                                            backgroundColor: surfaceSecondaryColor,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: pressed ? 0.7 : 1,
                                        })}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",
                                                fontSize: 12,
                                                color: textColor,
                                            }}
                                        >
                                            Limpiar filtros
                                        </Text>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={crearNuevo}
                                        accessibilityRole="button"
                                        style={({ pressed }) => ({
                                            minHeight: 45,
                                            paddingHorizontal: 18,
                                            borderRadius: 12,
                                            backgroundColor: primaryColor,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 8,
                                            opacity: pressed ? 0.8 : 1,
                                        })}
                                    >
                                        <Ionicons name="add" size={19} color={textOnPrimaryColor} />

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",
                                                fontSize: 12,
                                                color: textOnPrimaryColor,
                                            }}
                                        >
                                            Registrar cuestionario
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        ) : (
                            /* ==============================
                                              TARJETAS
                                          ============================== */

                            <View
                                style={{
                                    width: "100%",
                                    marginTop: 18,
                                    gap: 12,
                                }}
                            >
                                {testsFiltrados.map((test) => (
                                    <CuestionarioAdminCard
                                        key={test.id_test}
                                        test={test}
                                        procesando={testProcesando !== null}
                                        onEditar={editarTest}
                                        onCambiarEstado={cambiarEstado}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
