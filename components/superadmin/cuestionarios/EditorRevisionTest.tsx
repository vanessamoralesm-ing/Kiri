import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
    despublicarTestAdmin,
    obtenerTestCompletoAdmin,
    publicarTestAdmin,
    validarPublicacionTest,
    type TestCompletoAdmin,
    type ValidacionPublicacionTest,
} from "@/services/superadmin/cuestionarioAdmin.service";

interface Props {
    idTest: string;
    disabled?: boolean;
    onPublicado?: () => void;
    onDespublicado?: () => void;
}

function obtenerError(error: unknown) {
    return error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado.";
}

export default function EditorRevisionTest({
    idTest,
    disabled = false,
    onPublicado,
    onDespublicado,
}: Props) {
    const { width } = useWindowDimensions();
    const esTelefono = width < 768;

    const surface = useThemeColor({}, "surface");
    const surfaceSecondary = useThemeColor({}, "surfaceSecondary");
    const text = useThemeColor({}, "text");
    const secondary = useThemeColor({}, "textSecondary");
    const primary = useThemeColor({}, "primary");
    const primarySoft = useThemeColor({}, "primarySoft");
    const onPrimary = useThemeColor({}, "textOnPrimary");
    const border = useThemeColor({}, "border");
    const danger = useThemeColor({}, "danger");
    const success = useThemeColor({}, "success");

    const [test, setTest] = useState<TestCompletoAdmin | null>(null);
    const [validacion, setValidacion] =
        useState<ValidacionPublicacionTest | null>(null);

    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const cargarRevision = useCallback(async () => {
        if (!idTest) {
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            setError(null);

            const [datos, resultado] = await Promise.all([
                obtenerTestCompletoAdmin(idTest),
                validarPublicacionTest(idTest),
            ]);

            setTest(datos);
            setValidacion(resultado);
        } catch (err) {
            setError(obtenerError(err));
        } finally {
            setCargando(false);
        }
    }, [idTest]);

    useEffect(() => {
        void cargarRevision();
    }, [cargarRevision]);

    async function publicar() {
        if (!test || disabled || procesando) return;

        try {
            setProcesando(true);
            setError(null);

            // Validar nuevamente antes de publicar.
            const resultado = await validarPublicacionTest(idTest);
            setValidacion(resultado);

            if (!resultado.valido) {
                setError("Debes corregir los problemas indicados antes de publicar.");
                return;
            }

            await publicarTestAdmin(idTest);
            await cargarRevision();

            setMensaje("El cuestionario se publicó correctamente.");
            onPublicado?.();
        } catch (err) {
            setError(obtenerError(err));
        } finally {
            setProcesando(false);
        }
    }

    async function despublicar() {
        if (!test || disabled || procesando) return;

        try {
            setProcesando(true);
            setError(null);

            await despublicarTestAdmin(idTest);
            await cargarRevision();

            setMensaje("El cuestionario se despublicó correctamente.");
            onDespublicado?.();
        } catch (err) {
            setError(obtenerError(err));
        } finally {
            setProcesando(false);
        }
    }

    function confirmarDespublicacion() {
        Alert.alert(
            "Despublicar cuestionario",
            "El cuestionario dejará de estar disponible para los usuarios.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Despublicar",
                    style: "destructive",
                    onPress: () => void despublicar(),
                },
            ],
        );
    }

    const totalPreguntas = test?.pregunta_test?.length ?? 0;
    const totalOpciones =
        test?.pregunta_test?.reduce(
            (acumulado, pregunta) => acumulado + (pregunta.opcion_test?.length ?? 0),
            0,
        ) ?? 0;

    const totalSubescalas = test?.subescala?.length ?? 0;
    const totalBaremos = test?.baremo_test?.length ?? 0;

    if (cargando) {
        return (
            <View
                style={{
                    minHeight: 230,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                <ActivityIndicator size="large" color={primary} />
                <Text style={{ color: secondary }}>Revisando cuestionario...</Text>
            </View>
        );
    }

    if (!test) {
        return (
            <View
                style={{
                    padding: 24,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: 16,
                    backgroundColor: surface,
                }}
            >
                <Text style={{ color: danger }}>
                    {error ?? "No se encontró el cuestionario."}
                </Text>

                <Pressable onPress={() => void cargarRevision()}>
                    <Text
                        style={{
                            marginTop: 14,
                            color: primary,
                            fontFamily: "Nunito-Bold",
                        }}
                    >
                        Reintentar
                    </Text>
                </Pressable>
            </View>
        );
    }

    const resumen = [
        {
            label: "Preguntas",
            valor: totalPreguntas,
            icono: "help-circle-outline" as const,
        },
        {
            label: "Opciones",
            valor: totalOpciones,
            icono: "list-outline" as const,
        },
        {
            label: "Subescalas",
            valor: totalSubescalas,
            icono: "layers-outline" as const,
        },
        {
            label: "Baremos",
            valor: totalBaremos,
            icono: "analytics-outline" as const,
        },
    ];

    return (
        <View style={{ width: "100%", gap: 20 }}>
            {/* ENCABEZADO */}
            <View style={{ gap: 6 }}>
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: esTelefono ? 21 : 25,
                        color: text,
                    }}
                >
                    Revisión del cuestionario
                </Text>

                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 13,
                        lineHeight: 20,
                        color: secondary,
                    }}
                >
                    Comprueba la información del instrumento antes de ponerlo a
                    disposición de los usuarios.
                </Text>
            </View>

            {/* INFORMACIÓN GENERAL */}
            <View
                style={{
                    padding: esTelefono ? 16 : 22,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: 18,
                    backgroundColor: surface,
                    gap: 12,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 13,
                            backgroundColor: primarySoft,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="clipboard-outline" size={23} color={primary} />
                    </View>

                    <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 17,
                                color: text,
                            }}
                        >
                            {test.nombre}
                        </Text>
                        <Text style={{ fontSize: 12, color: secondary }}>
                            {test.codigo}
                        </Text>
                    </View>
                </View>

                {!!test.descripcion && (
                    <Text
                        style={{
                            fontSize: 13,
                            lineHeight: 20,
                            color: secondary,
                        }}
                    >
                        {test.descripcion}
                    </Text>
                )}

                <View
                    style={{
                        padding: 12,
                        borderRadius: 11,
                        backgroundColor: surfaceSecondary,
                        gap: 5,
                    }}
                >
                    <Text style={{ fontSize: 12, color: secondary }}>
                        Población objetivo: {test.poblacion_objetivo || "Sin definir"}
                    </Text>

                    <Text style={{ fontSize: 12, color: secondary }}>
                        Aplicación: {test.tipo_aplicacion}
                    </Text>

                    <Text style={{ fontSize: 12, color: secondary }}>
                        Versión: {test.version || "Sin definir"}
                    </Text>

                    <Text style={{ fontSize: 12, color: secondary }}>
                        Subescalas: {test.tiene_subescalas ? "Sí" : "No"}
                    </Text>
                </View>
            </View>

            {/* INDICADORES */}
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                {resumen.map((item) => (
                    <View
                        key={item.label}
                        style={{
                            width: esTelefono ? "100%" : "48%",
                            minHeight: 90,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: border,
                            borderRadius: 14,
                            backgroundColor: surface,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor: primarySoft,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name={item.icono} size={21} color={primary} />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 23,
                                    color: text,
                                }}
                            >
                                {item.valor}
                            </Text>

                            <Text style={{ fontSize: 12, color: secondary }}>
                                {item.label}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* VALIDACIÓN */}
            <View
                style={{
                    padding: esTelefono ? 16 : 22,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: 18,
                    backgroundColor: surface,
                    gap: 14,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Ionicons
                        name={
                            validacion?.valido
                                ? "checkmark-circle-outline"
                                : "alert-circle-outline"
                        }
                        size={25}
                        color={validacion?.valido ? success : danger}
                    />

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 16,
                                color: text,
                            }}
                        >
                            Validación de publicación
                        </Text>

                        <Text style={{ fontSize: 12, color: secondary }}>
                            {validacion?.valido
                                ? "El test cumple las validaciones configuradas."
                                : "Hay elementos que debes revisar."}
                        </Text>
                    </View>
                </View>

                {(validacion?.errores ?? []).map((item, index) => (
                    <View
                        key={`${index}-${item}`}
                        style={{
                            flexDirection: "row",
                            gap: 9,
                            padding: 12,
                            borderRadius: 11,
                            backgroundColor: surfaceSecondary,
                        }}
                    >
                        <Ionicons name="alert-circle-outline" size={18} color={danger} />

                        <Text
                            style={{
                                flex: 1,
                                fontSize: 12,
                                lineHeight: 18,
                                color: text,
                            }}
                        >
                            {item}
                        </Text>
                    </View>
                ))}

                <View
                    style={{
                        padding: 12,
                        borderRadius: 11,
                        backgroundColor: primarySoft,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            lineHeight: 19,
                            color: primary,
                        }}
                    >
                        Revisa también las puntuaciones, los rangos de los baremos y la
                        adecuación del instrumento a la población objetivo. Estas
                        comprobaciones todavía no forman parte de la validación automática.
                    </Text>
                </View>
            </View>

            {/* MENSAJES */}
            {!!error && <Text style={{ color: danger, fontSize: 13 }}>{error}</Text>}

            {!!mensaje && (
                <Text style={{ color: success, fontSize: 13 }}>{mensaje}</Text>
            )}

            {/* ACCIONES */}
            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",
                    gap: 12,
                }}
            >
                <Pressable
                    disabled={procesando}
                    onPress={() => void cargarRevision()}
                    style={{
                        flex: esTelefono ? undefined : 1,
                        minHeight: 49,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 12,
                        backgroundColor: surface,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",
                            color: text,
                        }}
                    >
                        Actualizar revisión
                    </Text>
                </Pressable>

                <Pressable
                    disabled={
                        disabled || procesando || (!test.estado && !validacion?.valido)
                    }
                    onPress={
                        test.estado ? confirmarDespublicacion : () => void publicar()
                    }
                    style={{
                        flex: esTelefono ? undefined : 1,
                        minHeight: 49,
                        borderRadius: 12,
                        backgroundColor: test.estado ? surfaceSecondary : primary,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity:
                            disabled || procesando || (!test.estado && !validacion?.valido)
                                ? 0.5
                                : 1,
                    }}
                >
                    {procesando ? (
                        <ActivityIndicator color={test.estado ? text : onPrimary} />
                    ) : (
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                color: test.estado ? text : onPrimary,
                            }}
                        >
                            {test.estado
                                ? "Despublicar cuestionario"
                                : "Publicar cuestionario"}
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
