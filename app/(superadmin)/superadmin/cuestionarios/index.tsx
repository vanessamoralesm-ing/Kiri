import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import React, { useCallback, useMemo, useState } from "react";

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
    FiltroEstadoCuestionario,
} from "@/components/superadmin/cuestionarios/CuestionarioAdminToolbar";

import {
    cambiarEstadoTestAdmin,
    obtenerTestsAdmin,
    type TestAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function CuestionariosSuperAdminScreen() {
    const router = useRouter();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const primaryColor = useThemeColor({}, "primary");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const dangerColor = useThemeColor({}, "danger");

    // ======================================================
    // ESTADOS
    // ======================================================

    const [tests, setTests] = useState<TestAdmin[]>([]);

    const [cargando, setCargando] = useState(true);

    const [actualizando, setActualizando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [busqueda, setBusqueda] = useState("");

    const [filtroEstado, setFiltroEstado] =
        useState<FiltroEstadoCuestionario>("todos");

    const [testProcesando, setTestProcesando] = useState<string | null>(null);

    // ======================================================
    // CARGA
    // ======================================================

    const cargarTests = useCallback(async (mostrarCarga = true) => {
        try {
            if (mostrarCarga) {
                setCargando(true);
            }

            setError(null);

            const datos = await obtenerTestsAdmin();

            setTests(datos);
        } catch (err) {
            console.error("Error cargando cuestionarios:", err);

            setError("No fue posible cargar los cuestionarios.");
        } finally {
            if (mostrarCarga) {
                setCargando(false);
            }
        }
    }, []);

    /*
     * Esto permite actualizar automáticamente
     * el listado al regresar desde:
     *
     * - nuevo.tsx
     * - [id]/index.tsx
     */
    useFocusEffect(
        useCallback(() => {
            cargarTests();

            return undefined;
        }, [cargarTests]),
    );

    // ======================================================
    // REFRESH
    // ======================================================

    async function refrescar() {
        try {
            setActualizando(true);

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
    // FILTRO
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
    // ESTADO DEL TEST
    // ======================================================

    async function cambiarEstado(test: TestAdmin) {
        if (testProcesando) {
            return;
        }

        try {
            setTestProcesando(test.id_test);

            const actualizado = await cambiarEstadoTestAdmin(
                test.id_test,
                !test.estado,
            );

            setTests((actuales) =>
                actuales.map((item) =>
                    item.id_test === test.id_test
                        ? {
                            ...item,
                            estado: actualizado.estado,
                        }
                        : item,
                ),
            );
        } catch (err) {
            console.error("Error cambiando estado del cuestionario:", err);

            setError("No fue posible cambiar el estado del cuestionario.");
        } finally {
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

    const anchoKpi =
        columnasKpi === 1 ? "100%" : columnasKpi === 2 ? "48.5%" : "32%";

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
                    <RefreshControl refreshing={actualizando} onRefresh={refrescar} />
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
                        HEADER
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
                                sus preguntas, opciones y configuración.
                            </Text>
                        </View>

                        {/* NUEVO */}

                        <Pressable
                            onPress={crearNuevo}
                            style={({ pressed }) => ({
                                width: esTelefono ? "100%" : undefined,

                                minHeight: 48,

                                paddingHorizontal: 18,

                                borderRadius: 14,

                                overflow: "hidden",

                                opacity: pressed ? 0.82 : 1,
                            })}
                        >
                            <View
                                style={{
                                    minHeight: 48,

                                    paddingHorizontal: 4,

                                    flexDirection: "row",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    borderRadius: 14,

                                    backgroundColor: primaryColor,
                                }}
                            >
                                <Ionicons name="add" size={20} color={textOnPrimaryColor} />

                                <Text
                                    style={{
                                        marginLeft: 8,

                                        fontFamily: "Nunito-Bold",

                                        fontSize: 13,

                                        color: textOnPrimaryColor,
                                    }}
                                >
                                    Nuevo cuestionario
                                </Text>
                            </View>
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
                                width: anchoKpi,
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
                                width: anchoKpi,
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
                                width: anchoKpi,
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

                        <CuestionariosAdminToolbar
                            busqueda={busqueda}
                            filtroEstado={filtroEstado}
                            onCambiarBusqueda={setBusqueda}
                            onCambiarFiltro={setFiltroEstado}
                        />

                        {/* CARGANDO */}

                        {cargando ? (
                            <View
                                style={{
                                    minHeight: 240,

                                    alignItems: "center",

                                    justifyContent: "center",
                                }}
                            >
                                <ActivityIndicator size="large" color={primaryColor} />

                                <Text
                                    style={{
                                        marginTop: 12,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 13,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Cargando cuestionarios...
                                </Text>
                            </View>
                        ) : error ? (
                            /* ERROR */

                            <View
                                style={{
                                    minHeight: 220,

                                    marginTop: 18,

                                    padding: 20,

                                    borderRadius: 16,

                                    alignItems: "center",

                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={38}
                                    color={dangerColor}
                                />

                                <Text
                                    style={{
                                        marginTop: 12,

                                        fontFamily: "Nunito-SemiBold",

                                        fontSize: 14,

                                        textAlign: "center",

                                        color: textColor,
                                    }}
                                >
                                    {error}
                                </Text>

                                <Pressable
                                    onPress={() => cargarTests()}
                                    style={({ pressed }) => ({
                                        marginTop: 14,

                                        minHeight: 42,

                                        paddingHorizontal: 16,

                                        borderRadius: 12,

                                        alignItems: "center",

                                        justifyContent: "center",

                                        opacity: pressed ? 0.7 : 1,

                                        backgroundColor: primaryColor,
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
                            /* VACÍO */

                            <View
                                style={{
                                    minHeight: 240,

                                    marginTop: 18,

                                    alignItems: "center",

                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={38}
                                    color={textSecondaryColor}
                                />

                                <Text
                                    style={{
                                        marginTop: 12,

                                        fontFamily: "Nunito-Bold",

                                        fontSize: 15,

                                        color: textColor,
                                    }}
                                >
                                    No se encontraron cuestionarios
                                </Text>

                                <Text
                                    style={{
                                        maxWidth: 400,

                                        marginTop: 5,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 13,

                                        lineHeight: 19,

                                        textAlign: "center",

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Prueba con otros términos de búsqueda o cambia el filtro
                                    seleccionado.
                                </Text>
                            </View>
                        ) : (
                            /* LISTA */

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
                                        procesando={testProcesando === test.id_test}
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
