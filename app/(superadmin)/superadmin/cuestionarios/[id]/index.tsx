import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import EditorBaremos from "@/components/superadmin/cuestionarios/EditorBaremos";
import EditorInformacionTest from "@/components/superadmin/cuestionarios/EditorInformacionTest";
import EditorOpciones from "@/components/superadmin/cuestionarios/EditorOpciones";
import EditorPreguntas from "@/components/superadmin/cuestionarios/EditorPreguntas";
import EditorRevisionTest from "@/components/superadmin/cuestionarios/EditorRevisionTest";
import EditorSubescalas from "@/components/superadmin/cuestionarios/EditorSubescalas";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
    actualizarTestAdmin,
    normalizarCodigoTest,
    obtenerSubescalasAdmin,
    obtenerTestAdminPorId,
    type CrearTestAdmin,
    type PreguntaAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import type { OpcionTest, SubescalaTest, Test } from "@/types/cuestionarios";

// ==========================================================
// TIPOS
// ==========================================================

type InfoTest = Omit<CrearTestAdmin, "estado">;

type Etapa =
    "informacion" | "subescalas" | "preguntas" | "baremos" | "revision";

const ETAPAS: {
    id: Etapa;
    nombre: string;
    icono: keyof typeof Ionicons.glyphMap;
}[] = [
        {
            id: "informacion",
            nombre: "Información",
            icono: "document-text-outline",
        },
        {
            id: "subescalas",
            nombre: "Subescalas",
            icono: "layers-outline",
        },
        {
            id: "preguntas",
            nombre: "Preguntas y opciones",
            icono: "help-circle-outline",
        },
        {
            id: "baremos",
            nombre: "Baremos",
            icono: "analytics-outline",
        },
        {
            id: "revision",
            nombre: "Revisión",
            icono: "checkmark-circle-outline",
        },
    ];

// ==========================================================
// UTILIDADES
// ==========================================================

function desdeTest(test: Test): InfoTest {
    return {
        codigo: test.codigo,
        nombre: test.nombre,
        descripcion: test.descripcion,
        instrucciones: test.instrucciones,
        poblacion_objetivo: test.poblacion_objetivo,
        tipo_aplicacion: test.tipo_aplicacion,
        tiene_subescalas: test.tiene_subescalas,
        version: test.version,
    };
}

function opcional(valor: string | null): string | null {
    return valor?.trim() || null;
}

function necesitaOpciones(tipo: string): boolean {
    return (
        tipo === "opcion_unica" || tipo === "opcion_multiple" || tipo === "escala"
    );
}

// ==========================================================
// PANTALLA
// ==========================================================

export default function EditarCuestionarioScreen() {
    const parametros = useLocalSearchParams<{
        id: string | string[];
    }>();

    const idTest = Array.isArray(parametros.id)
        ? parametros.id[0]
        : parametros.id;

    const router = useRouter();

    const { width } = useWindowDimensions();
    const esTelefono = width < 768;

    // ========================================================
    // TEMA
    // ========================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");
    const secondarySurface = useThemeColor({}, "surfaceSecondary");

    const textColor = useThemeColor({}, "text");
    const secondaryColor = useThemeColor({}, "textSecondary");

    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");

    const onPrimary = useThemeColor({}, "textOnPrimary");

    const borderColor = useThemeColor({}, "border");
    const dangerColor = useThemeColor({}, "danger");
    const successColor = useThemeColor({}, "success");

    // ========================================================
    // ESTADOS
    // ========================================================

    const [test, setTest] = useState<Test | null>(null);

    const [formulario, setFormulario] = useState<InfoTest | null>(null);

    const [subescalas, setSubescalas] = useState<SubescalaTest[]>([]);

    const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>([]);

    const [preguntaOpcionesId, setPreguntaOpcionesId] = useState<string | null>(
        null,
    );

    const [etapa, setEtapa] = useState<Etapa>("informacion");

    const [revisionVersion, setRevisionVersion] = useState(0);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [mensaje, setMensaje] = useState<string | null>(null);

    // ========================================================
    // CARGAR CUESTIONARIO
    // ========================================================

    const cargar = useCallback(async () => {
        if (!idTest) {
            setError("No se recibió el identificador del cuestionario.");
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            setError(null);

            const [testObtenido, subescalasObtenidas] = await Promise.all([
                obtenerTestAdminPorId(idTest),
                obtenerSubescalasAdmin(idTest),
            ]);

            setTest(testObtenido);

            setFormulario(testObtenido ? desdeTest(testObtenido) : null);

            setSubescalas(subescalasObtenidas);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo cargar el cuestionario.",
            );
        } finally {
            setCargando(false);
        }
    }, [idTest]);

    useFocusEffect(
        useCallback(() => {
            void cargar();

            return undefined;
        }, [cargar]),
    );

    // ========================================================
    // CALLBACKS DE LOS EDITORES
    // ========================================================

    const onCambioSubescalas = useCallback((lista: SubescalaTest[]) => {
        setSubescalas(lista);
    }, []);

    const onCambioPreguntas = useCallback((lista: PreguntaAdmin[]) => {
        setPreguntas(lista);
    }, []);

    const onCambioOpciones = useCallback(
        (lista: OpcionTest[]) => {
            setPreguntas((anteriores) =>
                anteriores.map((pregunta) =>
                    pregunta.id_pregunta === preguntaOpcionesId
                        ? {
                            ...pregunta,
                            opcion_test: lista,
                        }
                        : pregunta,
                ),
            );
        },
        [preguntaOpcionesId],
    );

    // ========================================================
    // INFORMACIÓN DERIVADA
    // ========================================================

    const etapasVisibles = useMemo(
        () =>
            ETAPAS.filter(
                (item) => item.id !== "subescalas" || test?.tiene_subescalas,
            ),
        [test?.tiene_subescalas],
    );

    const preguntaSeleccionada =
        preguntas.find((pregunta) => pregunta.id_pregunta === preguntaOpcionesId) ??
        null;

    const subescalasActivas = subescalas.filter((subescala) => subescala.estado);

    // ========================================================
    // NAVEGACIÓN ENTRE ETAPAS
    // ========================================================

    function cambiarEtapa(nueva: Etapa) {
        if (guardando) return;

        setMensaje(null);
        setError(null);

        if (nueva === "revision") {
            setRevisionVersion((version) => version + 1);
        }

        setEtapa(nueva);
    }

    // ========================================================
    // GUARDAR INFORMACIÓN GENERAL
    // ========================================================

    async function guardarInformacion() {
        if (!formulario || !test || guardando) {
            return;
        }

        if (!formulario.codigo.trim() || !formulario.nombre.trim()) {
            setError("El código y el nombre son obligatorios.");
            return;
        }

        if (
            !["autoadministrado", "profesional"].includes(formulario.tipo_aplicacion)
        ) {
            setError("Selecciona un tipo de aplicación válido.");
            return;
        }

        if (
            test.tiene_subescalas &&
            !formulario.tiene_subescalas &&
            subescalas.length > 0
        ) {
            setError(
                "El cuestionario ya tiene subescalas. " +
                "Revisa sus preguntas y asociaciones " +
                "antes de deshabilitarlas.",
            );
            return;
        }

        try {
            setGuardando(true);
            setError(null);
            setMensaje(null);

            const actualizado = await actualizarTestAdmin(test.id_test, {
                codigo: normalizarCodigoTest(formulario.codigo),

                nombre: formulario.nombre.trim(),

                descripcion: opcional(formulario.descripcion),

                instrucciones: opcional(formulario.instrucciones),

                poblacion_objetivo: opcional(formulario.poblacion_objetivo),

                tipo_aplicacion: formulario.tipo_aplicacion,

                tiene_subescalas: formulario.tiene_subescalas,

                version: opcional(formulario.version),
            });

            setTest(actualizado);
            setFormulario(desdeTest(actualizado));

            setMensaje("Información general actualizada.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron guardar los cambios.",
            );
        } finally {
            setGuardando(false);
        }
    }

    // ========================================================
    // BOTÓN PRINCIPAL
    // ========================================================

    function botonPrincipal(
        titulo: string,
        accion: () => void,
        inactivo = false,
    ) {
        return (
            <Pressable
                onPress={accion}
                disabled={inactivo}
                style={({ pressed }) => ({
                    minHeight: 48,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: primaryColor,
                    opacity: inactivo ? 0.55 : pressed ? 0.8 : 1,
                })}
            >
                <View
                    style={{
                        minHeight: 48,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {inactivo && guardando ? (
                        <ActivityIndicator color={onPrimary} size="small" />
                    ) : (
                        <Ionicons name="save-outline" size={18} color={onPrimary} />
                    )}

                    <Text
                        style={{
                            color: onPrimary,
                            fontFamily: "Nunito-Bold",
                            fontSize: 13,
                        }}
                    >
                        {titulo}
                    </Text>
                </View>
            </Pressable>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <ScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    width: "100%",
                    maxWidth: 1180,
                    alignSelf: "center",
                    paddingHorizontal: esTelefono ? 16 : 32,
                    paddingTop: esTelefono ? 20 : 30,
                    paddingBottom: 120,
                    gap: 20,
                }}
            >
                {/* VOLVER */}

                <Pressable
                    onPress={() => router.push("/superadmin/cuestionarios" as never)}
                    style={{
                        alignSelf: "flex-start",
                    }}
                >
                    <View
                        style={{
                            minHeight: 42,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 9,
                        }}
                    >
                        <Ionicons name="arrow-back" color={primaryColor} size={20} />

                        <Text
                            style={{
                                color: primaryColor,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 13,
                            }}
                        >
                            Volver a cuestionarios
                        </Text>
                    </View>
                </Pressable>

                {/* ESTADO DE CARGA */}

                {cargando ? (
                    <View
                        style={{
                            minHeight: 220,
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <ActivityIndicator color={primaryColor} size="large" />

                        <Text style={{ color: secondaryColor }}>
                            Cargando cuestionario...
                        </Text>
                    </View>
                ) : !test ? (
                    <View
                        style={{
                            padding: 24,
                            borderWidth: 1,
                            borderColor,
                            borderRadius: 16,
                            backgroundColor: surfaceColor,
                            gap: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: "Nunito-Bold",
                                color: textColor,
                            }}
                        >
                            No se pudo abrir el cuestionario
                        </Text>

                        <Text style={{ color: dangerColor }}>
                            {error ?? "No existe un cuestionario con ese identificador."}
                        </Text>

                        <Pressable onPress={() => void cargar()}>
                            <Text
                                style={{
                                    color: primaryColor,
                                    fontFamily: "Nunito-Bold",
                                }}
                            >
                                Intentar nuevamente
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <>
                        {/* ENCABEZADO */}

                        <View
                            style={{
                                flexDirection: esTelefono ? "column" : "row",
                                alignItems: esTelefono ? "stretch" : "center",
                                gap: 12,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    gap: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: textColor,
                                        fontFamily: "Nunito-Bold",
                                        fontSize: esTelefono ? 23 : 30,
                                    }}
                                >
                                    {test.nombre}
                                </Text>

                                <Text
                                    style={{
                                        color: secondaryColor,
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
                                    }}
                                >
                                    {test.codigo} · Versión {test.version ?? "sin definir"}
                                </Text>
                            </View>

                            <View
                                style={{
                                    alignSelf: "flex-start",
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 999,
                                    backgroundColor: test.estado
                                        ? primarySoftColor
                                        : secondarySurface,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 12,
                                        color: test.estado ? successColor : secondaryColor,
                                    }}
                                >
                                    {test.estado ? "Publicado" : "Borrador / inactivo"}
                                </Text>
                            </View>
                        </View>

                        {/* NAVEGACIÓN */}

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: 9,
                                paddingVertical: 3,
                            }}
                        >
                            {etapasVisibles.map((item) => {
                                const activa = etapa === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => cambiarEtapa(item.id)}
                                        style={{
                                            minHeight: 47,
                                            paddingHorizontal: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: activa ? primaryColor : borderColor,
                                            backgroundColor: activa ? primarySoftColor : surfaceColor,
                                        }}
                                    >
                                        <View
                                            style={{
                                                minHeight: 45,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <Ionicons
                                                name={item.icono}
                                                size={18}
                                                color={activa ? primaryColor : secondaryColor}
                                            />

                                            <Text
                                                style={{
                                                    color: activa ? primaryColor : textColor,
                                                    fontFamily: activa
                                                        ? "Nunito-Bold"
                                                        : "Nunito-SemiBold",
                                                    fontSize: 12,
                                                }}
                                            >
                                                {item.nombre}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        {/* MENSAJES */}

                        {!!mensaje && (
                            <View
                                style={{
                                    backgroundColor: primarySoftColor,
                                    borderRadius: 12,
                                    padding: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        color: successColor,
                                        fontFamily: "Nunito-SemiBold",
                                        fontSize: 13,
                                    }}
                                >
                                    {mensaje}
                                </Text>
                            </View>
                        )}

                        {!!error && (
                            <View
                                style={{
                                    borderColor: dangerColor,
                                    borderWidth: 1,
                                    borderRadius: 12,
                                    padding: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        color: dangerColor,
                                        fontSize: 13,
                                    }}
                                >
                                    {error}
                                </Text>
                            </View>
                        )}

                        {/* INFORMACIÓN GENERAL */}

                        {etapa === "informacion" && formulario && (
                            <View style={{ gap: 14 }}>
                                <EditorInformacionTest
                                    value={formulario}
                                    onChange={setFormulario}
                                    disabled={guardando}
                                />

                                {botonPrincipal(
                                    guardando ? "Guardando..." : "Guardar cambios",
                                    () => void guardarInformacion(),
                                    guardando,
                                )}
                            </View>
                        )}

                        {/* SUBESCALAS */}

                        {etapa === "subescalas" && test.tiene_subescalas && (
                            <EditorSubescalas
                                idTest={test.id_test}
                                onCambio={onCambioSubescalas}
                            />
                        )}

                        {/* PREGUNTAS Y OPCIONES */}

                        {etapa === "preguntas" && (
                            <View style={{ gap: 22 }}>
                                {test.tiene_subescalas && subescalasActivas.length === 0 && (
                                    <View
                                        style={{
                                            borderWidth: 1,
                                            borderColor: dangerColor,
                                            borderRadius: 12,
                                            padding: 13,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: dangerColor,
                                                fontSize: 12,
                                            }}
                                        >
                                            Registra al menos una subescala activa antes de crear
                                            preguntas.
                                        </Text>

                                        <Pressable
                                            onPress={() => cambiarEtapa("subescalas")}
                                            style={{
                                                marginTop: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: primaryColor,
                                                    fontFamily: "Nunito-Bold",
                                                }}
                                            >
                                                Ir a subescalas
                                            </Text>
                                        </Pressable>
                                    </View>
                                )}

                                <EditorPreguntas
                                    idTest={test.id_test}
                                    tieneSubescalas={test.tiene_subescalas}
                                    subescalas={subescalasActivas}
                                    disabled={
                                        test.tiene_subescalas && subescalasActivas.length === 0
                                    }
                                    onCambio={onCambioPreguntas}
                                />

                                {/* EDITOR DE OPCIONES */}

                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor,
                                        borderRadius: 18,
                                        padding: esTelefono ? 15 : 20,
                                        backgroundColor: surfaceColor,
                                        gap: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 18,
                                            color: textColor,
                                        }}
                                    >
                                        Editar opciones de una pregunta
                                    </Text>

                                    <Text
                                        style={{
                                            color: secondaryColor,
                                            fontSize: 12,
                                            lineHeight: 19,
                                        }}
                                    >
                                        Selecciona una pregunta de opción única, múltiple o escala
                                        para administrar sus respuestas.
                                    </Text>

                                    {preguntas.filter((pregunta) =>
                                        necesitaOpciones(pregunta.tipo_pregunta),
                                    ).length === 0 ? (
                                        <Text
                                            style={{
                                                color: secondaryColor,
                                                fontSize: 12,
                                            }}
                                        >
                                            No hay preguntas con opciones registradas.
                                        </Text>
                                    ) : (
                                        <View
                                            style={{
                                                gap: 9,
                                            }}
                                        >
                                            {preguntas
                                                .filter((pregunta) =>
                                                    necesitaOpciones(pregunta.tipo_pregunta),
                                                )
                                                .map((pregunta) => {
                                                    const seleccionada =
                                                        preguntaOpcionesId === pregunta.id_pregunta;

                                                    return (
                                                        <Pressable
                                                            key={pregunta.id_pregunta}
                                                            onPress={() =>
                                                                setPreguntaOpcionesId(
                                                                    seleccionada ? null : pregunta.id_pregunta,
                                                                )
                                                            }
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: seleccionada
                                                                    ? primaryColor
                                                                    : borderColor,
                                                                borderRadius: 12,
                                                                padding: 12,
                                                                backgroundColor: seleccionada
                                                                    ? primarySoftColor
                                                                    : secondarySurface,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    gap: 9,
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                        minWidth: 0,
                                                                        gap: 4,
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontFamily: "Nunito-Bold",
                                                                            color: textColor,
                                                                            fontSize: 13,
                                                                        }}
                                                                    >
                                                                        {pregunta.codigo} · {pregunta.enunciado}
                                                                    </Text>

                                                                    <Text
                                                                        style={{
                                                                            color: secondaryColor,
                                                                            fontSize: 11,
                                                                        }}
                                                                    >
                                                                        {pregunta.opcion_test?.length ?? 0} opciones
                                                                        registradas
                                                                    </Text>
                                                                </View>

                                                                <Ionicons
                                                                    name={
                                                                        seleccionada ? "chevron-up" : "chevron-down"
                                                                    }
                                                                    color={primaryColor}
                                                                    size={19}
                                                                />
                                                            </View>
                                                        </Pressable>
                                                    );
                                                })}
                                        </View>
                                    )}

                                    {preguntaSeleccionada &&
                                        necesitaOpciones(preguntaSeleccionada.tipo_pregunta) && (
                                            <View
                                                style={{
                                                    paddingTop: 15,
                                                    borderTopWidth: 1,
                                                    borderTopColor: borderColor,
                                                }}
                                            >
                                                <EditorOpciones
                                                    key={preguntaSeleccionada.id_pregunta}
                                                    idPregunta={preguntaSeleccionada.id_pregunta}
                                                    puntua={preguntaSeleccionada.puntua}
                                                    onCambio={onCambioOpciones}
                                                />
                                            </View>
                                        )}
                                </View>
                            </View>
                        )}

                        {/* BAREMOS */}

                        {etapa === "baremos" && (
                            <EditorBaremos
                                idTest={test.id_test}
                                subescalas={subescalasActivas}
                            />
                        )}

                        {/* REVISIÓN Y PUBLICACIÓN */}

                        {etapa === "revision" && (
                            <EditorRevisionTest
                                key={`${test.id_test}-${revisionVersion}`}
                                idTest={test.id_test}
                                onPublicado={() => void cargar()}
                                onDespublicado={() => void cargar()}
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
