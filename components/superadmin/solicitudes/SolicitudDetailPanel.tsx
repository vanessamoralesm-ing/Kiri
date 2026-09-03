import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import type { SolicitudInstitucion } from "@/types/superadmin/solicitudes";

import SolicitudStatusBadge from "./SolicitudStatusBadge";

interface SolicitudDetailPanelProps {
    solicitud: SolicitudInstitucion | null;

    onAprobar: () => void;

    onSolicitarAntecedentes: () => void;

    onRechazar: () => void;
}

export default function SolicitudDetailPanel({
    solicitud,
    onAprobar,
    onSolicitarAntecedentes,
    onRechazar,
}: SolicitudDetailPanelProps) {
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

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const dangerColor = useThemeColor({}, "danger");

    if (!solicitud) {
        return (
            <View
                style={{
                    width: 390,
                    minWidth: 390,
                    minHeight: 500,
                    borderWidth: 1,
                    borderColor,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: surfaceColor,
                }}
            >
                <Ionicons
                    name="document-text-outline"
                    size={40}
                    color={textMutedColor}
                />

                <Text
                    style={{
                        marginTop: 12,
                        fontFamily: "Nunito-Bold",
                        fontSize: 14,
                        color: textColor,
                    }}
                >
                    Selecciona una solicitud
                </Text>
            </View>
        );
    }

    const iniciales = solicitud.solicitante.nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte.charAt(0))
        .join("");

    return (
        <View
            style={{
                width: 390,
                minWidth: 390,
                overflow: "hidden",
                borderWidth: 1,
                borderColor,
                borderRadius: 18,
                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                }}
            >
                <SolicitudStatusBadge estado={solicitud.estado} />

                <Text
                    style={{
                        marginTop: 10,
                        fontFamily: "Nunito-Bold",
                        fontSize: 20,
                        lineHeight: 26,
                        color: textColor,
                    }}
                >
                    Revisión de Afiliación #{solicitud.codigo}
                </Text>

                <Text
                    style={{
                        marginTop: 4,
                        fontFamily: "Nunito-Medium",
                        fontSize: 10,
                        color: textMutedColor,
                    }}
                >
                    Ingresada {solicitud.fecha_solicitud}, {solicitud.hora_solicitud}
                </Text>
            </View>

            <ScrollView
                style={{
                    maxHeight: 580,
                }}
                contentContainerStyle={{
                    padding: 18,
                    gap: 14,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        padding: 16,
                        borderRadius: 15,
                        backgroundColor: surfaceSecondaryColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="business-outline" size={19} color={primaryColor} />

                        <Text
                            style={{
                                marginLeft: 9,
                                fontFamily: "Nunito-Bold",
                                fontSize: 15,
                                color: textColor,
                            }}
                        >
                            Datos Institucionales
                        </Text>
                    </View>

                    <View
                        style={{
                            marginTop: 16,
                            flexDirection: "row",
                            gap: 16,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                Nombre Legal
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 11,
                                    color: textColor,
                                }}
                            >
                                {solicitud.institucion.nombre}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                RUT Institucional
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 11,
                                    color: textColor,
                                }}
                            >
                                {solicitud.institucion.rut}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 14,
                            flexDirection: "row",
                            gap: 16,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                Sede Principal
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 11,
                                    color: textColor,
                                }}
                            >
                                {solicitud.institucion.direccion}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                Matrícula Estimada
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 11,
                                    color: secondaryColor,
                                }}
                            >
                                {solicitud.institucion.matricula_estimada.toLocaleString()}{" "}
                                estudiantes
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 12,
                            backgroundColor: surfaceColor,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 9,
                                color: textSecondaryColor,
                            }}
                        >
                            MÓDULOS DE SALUD MENTAL SOLICITADOS
                        </Text>

                        <View
                            style={{
                                marginTop: 9,
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 6,
                            }}
                        >
                            {solicitud.modulos.map((modulo, indice) => (
                                <View
                                    key={modulo.id}
                                    style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 5,
                                        borderRadius: 6,
                                        backgroundColor:
                                            indice % 3 === 0
                                                ? primarySoftColor
                                                : indice % 3 === 1
                                                    ? secondarySoftColor
                                                    : accentSoftColor,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-SemiBold",
                                            fontSize: 9,
                                            color:
                                                indice % 3 === 0
                                                    ? primaryColor
                                                    : indice % 3 === 1
                                                        ? secondaryColor
                                                        : accentColor,
                                        }}
                                    >
                                        {modulo.nombre}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        padding: 16,
                        borderRadius: 15,
                        backgroundColor: surfaceSecondaryColor,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="person-outline" size={19} color={secondaryColor} />

                        <Text
                            style={{
                                marginLeft: 9,
                                fontFamily: "Nunito-Bold",
                                fontSize: 15,
                                color: textColor,
                            }}
                        >
                            Autoridad Solicitante
                        </Text>

                        {solicitud.solicitante.verificado && (
                            <View
                                style={{
                                    marginLeft: "auto",
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 999,
                                    backgroundColor: secondarySoftColor,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 8,
                                        color: secondaryColor,
                                    }}
                                >
                                    Verificado
                                </Text>
                            </View>
                        )}
                    </View>

                    <View
                        style={{
                            marginTop: 14,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 21,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: primaryColor,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 13,
                                    color: textOnPrimaryColor,
                                }}
                            >
                                {iniciales}
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 11,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 13,
                                    color: textColor,
                                }}
                            >
                                {solicitud.solicitante.nombre}
                            </Text>

                            <Text
                                style={{
                                    marginTop: 2,
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                {solicitud.solicitante.cargo}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 15,
                            flexDirection: "row",
                            gap: 14,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                Correo Institucional
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 10,
                                    color: primaryColor,
                                }}
                            >
                                {solicitud.solicitante.correo}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 9,
                                    color: textMutedColor,
                                }}
                            >
                                Teléfono de Enlace
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 10,
                                    color: textColor,
                                }}
                            >
                                {solicitud.solicitante.telefono}
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        padding: 15,
                        borderRadius: 15,
                        backgroundColor: surfaceSecondaryColor,
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
                                fontFamily: "Nunito-Bold",
                                fontSize: 12,
                                color: textColor,
                            }}
                        >
                            Documentación Adjunta ({solicitud.documentos} archivos)
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={15}
                                color={secondaryColor}
                            />

                            <Text
                                style={{
                                    marginLeft: 5,
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 9,
                                    color: secondaryColor,
                                }}
                            >
                                Firmas Validadas
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: borderColor,
                    backgroundColor: surfaceColor,
                }}
            >
                <Pressable
                    onPress={onAprobar}
                    style={({ pressed }) => ({
                        height: 46,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pressed ? 0.85 : 1,
                        backgroundColor: primaryColor,
                    })}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color={textOnPrimaryColor}
                    />

                    <Text
                        style={{
                            marginLeft: 8,
                            fontFamily: "Nunito-Bold",
                            fontSize: 12,
                            color: textOnPrimaryColor,
                        }}
                    >
                        Aprobar e Incorporar a Red Kiri
                    </Text>
                </Pressable>

                <View
                    style={{
                        marginTop: 10,
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <Pressable
                        onPress={onSolicitarAntecedentes}
                        style={({ pressed }) => ({
                            flex: 1,
                            minHeight: 42,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor,
                            borderRadius: 11,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed ? 0.75 : 1,
                            backgroundColor: surfaceColor,
                        })}
                    >
                        <Ionicons
                            name="document-text-outline"
                            size={16}
                            color={textSecondaryColor}
                        />

                        <Text
                            style={{
                                marginLeft: 6,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 10,
                                color: textSecondaryColor,
                            }}
                        >
                            Solicitar Antecedentes
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onRechazar}
                        style={({ pressed }) => ({
                            flex: 1,
                            minHeight: 42,
                            paddingHorizontal: 10,
                            borderRadius: 11,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed ? 0.75 : 1,
                            backgroundColor: "rgba(220, 38, 38, 0.10)",
                        })}
                    >
                        <Ionicons
                            name="close-circle-outline"
                            size={16}
                            color={dangerColor}
                        />

                        <Text
                            style={{
                                marginLeft: 6,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 10,
                                color: dangerColor,
                            }}
                        >
                            Rechazar Solicitud
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
