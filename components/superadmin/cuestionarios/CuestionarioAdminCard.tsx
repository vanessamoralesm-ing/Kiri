import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Pressable, Text, View } from "react-native";

import type { TestAdmin } from "@/services/superadmin/cuestionarioAdmin.service";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

interface Props {
    test: TestAdmin;

    procesando?: boolean;

    onEditar: (test: TestAdmin) => void;

    onCambiarEstado: (test: TestAdmin) => void;
}

export default function CuestionarioAdminCard({
    test,
    procesando = false,
    onEditar,
    onCambiarEstado,
}: Props) {
    const { esTelefono } = useResponsiveLayout();

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const successColor = useThemeColor({}, "success");

    const cantidadPreguntas = test.pregunta_test?.[0]?.count ?? 0;

    return (
        <View
            style={{
                width: "100%",

                padding: esTelefono ? 16 : 20,

                borderWidth: 1,
                borderColor,

                borderRadius: 18,

                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",

                    alignItems: esTelefono ? "stretch" : "flex-start",

                    gap: 16,
                }}
            >
                {/* ICONO */}

                <View
                    style={{
                        width: 48,
                        height: 48,

                        borderRadius: 15,

                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,

                        backgroundColor: primarySoftColor,
                    }}
                >
                    <Ionicons name="clipboard-outline" size={23} color={primaryColor} />
                </View>

                {/* INFORMACIÓN */}

                <View
                    style={{
                        flex: 1,

                        minWidth: 0,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            flexWrap: "wrap",

                            gap: 8,
                        }}
                    >
                        <Text
                            style={{
                                flexShrink: 1,

                                fontFamily: "Nunito-Bold",

                                fontSize: 17,
                                lineHeight: 23,

                                color: textColor,
                            }}
                        >
                            {test.nombre}
                        </Text>

                        <View
                            style={{
                                paddingHorizontal: 9,

                                paddingVertical: 4,

                                borderRadius: 999,

                                backgroundColor: test.estado
                                    ? primarySoftColor
                                    : surfaceSecondaryColor,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: 10,

                                    color: test.estado ? successColor : textMutedColor,
                                }}
                            >
                                {test.estado ? "ACTIVO" : "INACTIVO"}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 5,

                            fontFamily: "Nunito-SemiBold",

                            fontSize: 12,

                            color: primaryColor,
                        }}
                    >
                        {test.codigo}
                    </Text>

                    {test.descripcion ? (
                        <Text
                            numberOfLines={esTelefono ? 3 : 2}
                            style={{
                                marginTop: 8,

                                fontFamily: "Nunito-Medium",

                                fontSize: 13,
                                lineHeight: 19,

                                color: textSecondaryColor,
                            }}
                        >
                            {test.descripcion}
                        </Text>
                    ) : null}

                    {/* METADATOS */}

                    <View
                        style={{
                            marginTop: 12,

                            flexDirection: "row",

                            flexWrap: "wrap",

                            alignItems: "center",

                            gap: 14,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",

                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="help-circle-outline"
                                size={15}
                                color={textMutedColor}
                            />

                            <Text
                                style={{
                                    marginLeft: 5,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 12,

                                    color: textSecondaryColor,
                                }}
                            >
                                {cantidadPreguntas}{" "}
                                {cantidadPreguntas === 1 ? "pregunta" : "preguntas"}
                            </Text>
                        </View>

                        {test.version ? (
                            <View
                                style={{
                                    flexDirection: "row",

                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="git-branch-outline"
                                    size={15}
                                    color={textMutedColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 5,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 12,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Versión {test.version}
                                </Text>
                            </View>
                        ) : null}

                        {test.tiene_subescalas ? (
                            <View
                                style={{
                                    flexDirection: "row",

                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="layers-outline"
                                    size={15}
                                    color={textMutedColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 5,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 12,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Subescalas
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* ACCIONES */}

                <View
                    style={{
                        flexDirection: "row",

                        alignItems: "center",

                        alignSelf: esTelefono ? "stretch" : "center",

                        gap: 8,
                    }}
                >
                    <Pressable
                        onPress={() => onEditar(test)}
                        style={({ pressed }) => ({
                            flex: esTelefono ? 1 : undefined,

                            minHeight: 42,

                            paddingHorizontal: 14,

                            borderWidth: 1,
                            borderColor,

                            borderRadius: 12,

                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent: "center",

                            opacity: pressed ? 0.7 : 1,

                            backgroundColor: surfaceColor,
                        })}
                    >
                        <Ionicons name="create-outline" size={17} color={primaryColor} />

                        <Text
                            style={{
                                marginLeft: 6,

                                fontFamily: "Nunito-SemiBold",

                                fontSize: 12,

                                color: textColor,
                            }}
                        >
                            Editar
                        </Text>
                    </Pressable>

                    <Pressable
                        disabled={procesando}
                        onPress={() => onCambiarEstado(test)}
                        style={({ pressed }) => ({
                            flex: esTelefono ? 1 : undefined,

                            minHeight: 42,

                            paddingHorizontal: 14,

                            borderRadius: 12,

                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent: "center",

                            opacity: procesando ? 0.5 : pressed ? 0.7 : 1,

                            backgroundColor: surfaceSecondaryColor,
                        })}
                    >
                        <Ionicons
                            name={
                                test.estado ? "pause-circle-outline" : "play-circle-outline"
                            }
                            size={17}
                            color={test.estado ? textSecondaryColor : successColor}
                        />

                        <Text
                            style={{
                                marginLeft: 6,

                                fontFamily: "Nunito-SemiBold",

                                fontSize: 12,

                                color: test.estado ? textSecondaryColor : successColor,
                            }}
                        >
                            {test.estado ? "Desactivar" : "Activar"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
