import React from "react";

import { ScrollView, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function SuperAdminDashboard() {
    const { profile } = useAuth();

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");

    const secondaryColor = useThemeColor({}, "secondary");
    const secondarySoftColor = useThemeColor({}, "secondarySoft");

    const accentColor = useThemeColor({}, "accent");
    const accentSoftColor = useThemeColor({}, "accentSoft");

    // ======================================================
    // USUARIO
    // ======================================================

    const nombreUsuario =
        profile?.nombre_preferido?.trim() || profile?.nombres?.trim() || "Usuario";

    // ======================================================
    // UI
    // ======================================================

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor,
            }}
            contentContainerStyle={{
                paddingHorizontal: 28,
                paddingTop: 26,
                paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* ==================================================
                ENCABEZADO
            ================================================== */}

            <View
                style={{
                    marginBottom: 26,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 28,
                        color: textColor,
                    }}
                >
                    Panel de Control General
                </Text>

                <Text
                    style={{
                        marginTop: 5,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                        color: textSecondaryColor,
                    }}
                >
                    Bienvenido, {nombreUsuario}. Aquí podrás administrar el ecosistema de
                    Kiri.
                </Text>
            </View>

            {/* ==================================================
                ACCIONES RÁPIDAS
            ================================================== */}

            <View
                style={{
                    padding: 20,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor,
                    backgroundColor: surfaceColor,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 18,
                        color: textColor,
                    }}
                >
                    Acciones rápidas
                </Text>

                <View
                    style={{
                        marginTop: 18,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            minWidth: 190,
                            paddingHorizontal: 18,
                            paddingVertical: 14,
                            borderRadius: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: primarySoftColor,
                        }}
                    >
                        <Ionicons name="mail-outline" size={20} color={primaryColor} />

                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 13,
                                color: primaryColor,
                            }}
                        >
                            Revisar solicitudes
                        </Text>
                    </View>

                    <View
                        style={{
                            minWidth: 190,
                            paddingHorizontal: 18,
                            paddingVertical: 14,
                            borderRadius: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: secondarySoftColor,
                        }}
                    >
                        <Ionicons
                            name="business-outline"
                            size={20}
                            color={secondaryColor}
                        />

                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 13,
                                color: secondaryColor,
                            }}
                        >
                            Agregar institución
                        </Text>
                    </View>

                    <View
                        style={{
                            minWidth: 190,
                            paddingHorizontal: 18,
                            paddingVertical: 14,
                            borderRadius: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: accentSoftColor,
                        }}
                    >
                        <Ionicons name="clipboard-outline" size={20} color={accentColor} />

                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 13,
                                color: accentColor,
                            }}
                        >
                            Crear cuestionario
                        </Text>
                    </View>
                </View>
            </View>

            {/* ==================================================
                KPIS
            ================================================== */}

            <View
                style={{
                    marginTop: 24,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 16,
                }}
            >
                {/* SOLICITUDES */}

                <View
                    style={{
                        flexGrow: 1,
                        flexBasis: 180,
                        minWidth: 180,
                        padding: 20,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: surfaceColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 12,
                                color: textSecondaryColor,
                            }}
                        >
                            SOLICITUDES
                        </Text>

                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: primarySoftColor,
                            }}
                        >
                            <Ionicons name="mail-outline" size={18} color={primaryColor} />
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 18,
                            fontFamily: "Nunito-Bold",
                            fontSize: 30,
                            color: textColor,
                        }}
                    >
                        3
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: textMutedColor,
                        }}
                    >
                        Requieren validación
                    </Text>
                </View>

                {/* INSTITUCIONES ACTIVAS */}

                <View
                    style={{
                        flexGrow: 1,
                        flexBasis: 180,
                        minWidth: 180,
                        padding: 20,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: surfaceColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 12,
                                color: textSecondaryColor,
                            }}
                        >
                            INST. ACTIVAS
                        </Text>

                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: secondarySoftColor,
                            }}
                        >
                            <Ionicons
                                name="business-outline"
                                size={18}
                                color={secondaryColor}
                            />
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 18,
                            fontFamily: "Nunito-Bold",
                            fontSize: 30,
                            color: textColor,
                        }}
                    >
                        48
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: textMutedColor,
                        }}
                    >
                        Instituciones activas
                    </Text>
                </View>

                {/* USUARIOS */}

                <View
                    style={{
                        flexGrow: 1,
                        flexBasis: 180,
                        minWidth: 180,
                        padding: 20,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: surfaceColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 12,
                                color: textSecondaryColor,
                            }}
                        >
                            USUARIOS
                        </Text>

                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: primarySoftColor,
                            }}
                        >
                            <Ionicons name="people-outline" size={18} color={primaryColor} />
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 18,
                            fontFamily: "Nunito-Bold",
                            fontSize: 30,
                            color: textColor,
                        }}
                    >
                        14,820
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: textMutedColor,
                        }}
                    >
                        Usuarios registrados
                    </Text>
                </View>

                {/* CUESTIONARIOS */}

                <View
                    style={{
                        flexGrow: 1,
                        flexBasis: 180,
                        minWidth: 180,
                        padding: 20,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: surfaceColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 12,
                                color: textSecondaryColor,
                            }}
                        >
                            CUESTIONARIOS
                        </Text>

                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: secondarySoftColor,
                            }}
                        >
                            <Ionicons
                                name="clipboard-outline"
                                size={18}
                                color={secondaryColor}
                            />
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 18,
                            fontFamily: "Nunito-Bold",
                            fontSize: 30,
                            color: textColor,
                        }}
                    >
                        18
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: textMutedColor,
                        }}
                    >
                        Cuestionarios activos
                    </Text>
                </View>
            </View>

            {/* ==================================================
                CONTENIDO DE PRUEBA
            ================================================== */}

            <View
                style={{
                    marginTop: 24,
                    minHeight: 320,
                    padding: 22,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor,
                    backgroundColor: surfaceColor,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 19,
                        color: textColor,
                    }}
                >
                    Crecimiento y adopción de la comunidad
                </Text>

                <Text
                    style={{
                        marginTop: 5,
                        fontFamily: "Nunito-Medium",
                        fontSize: 13,
                        color: textSecondaryColor,
                    }}
                >
                    Esta sección será reemplazada posteriormente por los gráficos reales
                    del dashboard.
                </Text>

                <View
                    style={{
                        flex: 1,
                        minHeight: 220,
                        marginTop: 20,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: surfaceSecondaryColor,
                    }}
                >
                    <Ionicons name="analytics-outline" size={42} color={primaryColor} />

                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 14,
                            color: textSecondaryColor,
                        }}
                    >
                        Área reservada para gráficas
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
