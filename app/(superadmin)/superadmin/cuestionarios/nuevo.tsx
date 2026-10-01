import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import EditorInformacionTest from "@/components/superadmin/cuestionarios/EditorInformacionTest";

import {
    crearTestAdmin,
    normalizarCodigoTest,
    type CrearTestAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import { useThemeColor } from "@/hooks/use-theme-color";

type InformacionTest = Omit<CrearTestAdmin, "estado">;

const VALORES_INICIALES: InformacionTest = {
    codigo: "",
    nombre: "",
    descripcion: null,
    instrucciones: null,
    poblacion_objetivo: null,
    tipo_aplicacion: "autoadministrado",
    tiene_subescalas: false,
    version: null,
};

function textoOpcional(valor: string | null) {
    return valor?.trim() || null;
}

export default function NuevoCuestionarioScreen() {
    const router = useRouter();

    const { width } = useWindowDimensions();

    const esTelefono = width < 768;

    const [formulario, setFormulario] =
        useState<InformacionTest>(VALORES_INICIALES);

    const [guardando, setGuardando] = useState(false);

    const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");
    const textColor = useThemeColor({}, "text");
    const secondaryColor = useThemeColor({}, "textSecondary");
    const primaryColor = useThemeColor({}, "primary");
    const borderColor = useThemeColor({}, "border");
    const dangerColor = useThemeColor({}, "danger");
    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    async function guardarTest() {
        if (guardando) return;

        setErrorFormulario(null);

        const codigo = normalizarCodigoTest(formulario.codigo);

        const nombre = formulario.nombre.trim();

        if (!codigo) {
            setErrorFormulario("Debes ingresar el código del cuestionario.");
            return;
        }

        if (!nombre) {
            setErrorFormulario("Debes ingresar el nombre del cuestionario.");
            return;
        }

        try {
            setGuardando(true);

            const nuevoTest = await crearTestAdmin({
                codigo,
                nombre,
                descripcion: textoOpcional(formulario.descripcion),
                instrucciones: textoOpcional(formulario.instrucciones),
                poblacion_objetivo: textoOpcional(formulario.poblacion_objetivo),
                tipo_aplicacion:
                    formulario.tipo_aplicacion || "autoadministrado",
                tiene_subescalas: formulario.tiene_subescalas,
                version: textoOpcional(formulario.version),
                estado: false,
            });

            router.replace(`/superadmin/cuestionarios/${nuevoTest.id_test}` as never);
        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo registrar el cuestionario.";

            setErrorFormulario(mensaje);

            Alert.alert("Error al registrar", mensaje);
        } finally {
            setGuardando(false);
        }
    }

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor,
            }}
            contentContainerStyle={{
                width: "100%",
                maxWidth: 1050,
                alignSelf: "center",
                paddingHorizontal: esTelefono ? 16 : 32,
                paddingTop: esTelefono ? 24 : 36,
                paddingBottom: 120,
                gap: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* ENCABEZADO */}

            <View style={{ gap: 18 }}>
                <Pressable
                    onPress={() => router.back()}
                    disabled={guardando}
                    style={({ pressed }) => ({
                        alignSelf: "flex-start",
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 9,
                        }}
                    >
                        <Ionicons name="arrow-back" size={20} color={primaryColor} />

                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 14,
                                color: primaryColor,
                            }}
                        >
                            Volver a cuestionarios
                        </Text>
                    </View>
                </Pressable>

                <View style={{ gap: 8 }}>
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: esTelefono ? 26 : 34,
                            color: textColor,
                        }}
                    >
                        Registrar nuevo test
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 14,
                            lineHeight: 22,
                            color: secondaryColor,
                        }}
                    >
                        Completa los datos generales. Posteriormente podrás configurar las
                        subescalas, preguntas y baremos.
                    </Text>
                </View>
            </View>

            {/* INDICADOR DE ETAPA */}

            <View
                style={{
                    padding: 15,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor,
                    backgroundColor: surfaceColor,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: primaryColor,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            color: textOnPrimaryColor,
                        }}
                    >
                        1
                    </Text>
                </View>

                <View style={{ flex: 1, gap: 3 }}>
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 14,
                            color: textColor,
                        }}
                    >
                        Información general
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: secondaryColor,
                        }}
                    >
                        Primer paso: crear el registro del test.
                    </Text>
                </View>
            </View>

            {/* FORMULARIO */}

            <EditorInformacionTest
                value={formulario}
                onChange={setFormulario}
                disabled={guardando}
            />

            {/* ERROR */}

            {errorFormulario && (
                <View
                    style={{
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: dangerColor,
                        padding: 15,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 13,
                            lineHeight: 20,
                            color: dangerColor,
                        }}
                    >
                        {errorFormulario}
                    </Text>
                </View>
            )}

            {/* ACCIONES */}

            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",
                    alignItems: "stretch",
                    justifyContent: "flex-end",
                    gap: 12,
                }}
            >
                <Pressable
                    onPress={() => router.back()}
                    disabled={guardando}
                    style={({ pressed }) => ({
                        width: esTelefono ? "100%" : 140,
                        minHeight: 52,
                        borderWidth: 1,
                        borderColor,
                        borderRadius: 13,
                        backgroundColor: surfaceColor,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 14,
                            color: textColor,
                        }}
                    >
                        Cancelar
                    </Text>
                </Pressable>

                <Pressable
                    onPress={guardarTest}
                    disabled={guardando}
                    style={({ pressed }) => ({
                        width: esTelefono ? "100%" : 220,
                        minHeight: 52,
                        borderRadius: 13,
                        backgroundColor: primaryColor,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        opacity: guardando ? 0.65 : pressed ? 0.8 : 1,
                    })}
                >
                    {guardando ? (
                        <ActivityIndicator size="small" color={textOnPrimaryColor} />
                    ) : (
                        <Ionicons
                            name="save-outline"
                            size={20}
                            color={textOnPrimaryColor}
                        />
                    )}

                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 14,
                            color: textOnPrimaryColor,
                        }}
                    >
                        {guardando ? "Guardando..." : "Guardar y continuar"}
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
