import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Pressable, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import type {
    SolicitudInstitucion,
    TipoInstitucion,
} from "@/types/superadmin/solicitudes";

interface SolicitudesTableProps {
    solicitudes: SolicitudInstitucion[];

    solicitudSeleccionada: SolicitudInstitucion | null;

    pagina: number;
    totalPaginas: number;

    totalFiltradas: number;

    onSeleccionar: (solicitud: SolicitudInstitucion) => void;

    onCambiarPagina: (pagina: number) => void;
}

function obtenerNombreTipo(tipo: TipoInstitucion) {
    switch (tipo) {
        case "educacion_superior":
            return "Ed. Superior";

        case "escolar":
            return "Escolar K-12";

        case "salud":
            return "Red de Salud";
    }
}

export default function SolicitudesTable({
    solicitudes,
    solicitudSeleccionada,
    pagina,
    totalPaginas,
    totalFiltradas,
    onSeleccionar,
    onCambiarPagina,
}: SolicitudesTableProps) {
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

    function obtenerColoresTipo(tipo: TipoInstitucion) {
        if (tipo === "salud") {
            return {
                fondo: secondarySoftColor,
                color: secondaryColor,
            };
        }

        if (tipo === "escolar") {
            return {
                fondo: accentSoftColor,
                color: accentColor,
            };
        }

        return {
            fondo: primarySoftColor,
            color: primaryColor,
        };
    }

    return (
        <View
            style={{
                flex: 1.45,
                minWidth: 0,
                minHeight: 710,
                overflow: "hidden",
                borderWidth: 1,
                borderColor,
                borderRadius: 18,
                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    height: 58,
                    paddingHorizontal: 18,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 16,
                        color: textColor,
                    }}
                >
                    Registro de Peticiones
                </Text>

                <View
                    style={{
                        marginLeft: 10,
                        paddingHorizontal: 9,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: primarySoftColor,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 9,
                            color: primaryColor,
                        }}
                    >
                        {solicitudes.length} mostradas
                    </Text>
                </View>

                <View style={{ flex: 1 }} />

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="options-outline" size={16} color={primaryColor} />

                    <Text
                        style={{
                            marginLeft: 6,
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 11,
                            color: primaryColor,
                        }}
                    >
                        Ajustar columnas
                    </Text>
                </Pressable>
            </View>

            <View
                style={{
                    minHeight: 42,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: surfaceSecondaryColor,
                }}
            >
                <Text
                    style={{
                        flex: 1.55,
                        fontFamily: "Nunito-Bold",
                        fontSize: 10,
                        color: textSecondaryColor,
                    }}
                >
                    INSTITUCIÓN
                </Text>

                <Text
                    style={{
                        flex: 0.75,
                        fontFamily: "Nunito-Bold",
                        fontSize: 10,
                        color: textSecondaryColor,
                    }}
                >
                    SOLICITANTE
                </Text>

                <Text
                    style={{
                        width: 105,
                        fontFamily: "Nunito-Bold",
                        fontSize: 10,
                        color: textSecondaryColor,
                    }}
                >
                    TIPO
                </Text>
            </View>

            {solicitudes.length > 0 ? (
                solicitudes.map((solicitud) => {
                    const seleccionada =
                        solicitudSeleccionada?.id_solicitud === solicitud.id_solicitud;

                    const colores = obtenerColoresTipo(solicitud.institucion.tipo);

                    return (
                        <Pressable
                            key={solicitud.id_solicitud}
                            onPress={() => onSeleccionar(solicitud)}
                            style={{
                                minHeight: 86,
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: borderColor,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: seleccionada ? primarySoftColor : surfaceColor,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1.55,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    minWidth: 0,
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 11,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: colores.fondo,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 14,
                                            color: colores.color,
                                        }}
                                    >
                                        {solicitud.institucion.siglas}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: 11,
                                        minWidth: 0,
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 12,
                                            color: textColor,
                                        }}
                                    >
                                        {solicitud.institucion.nombre}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 3,
                                            fontFamily: "Nunito-Medium",
                                            fontSize: 10,
                                            color: textMutedColor,
                                        }}
                                    >
                                        {solicitud.institucion.sede}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 0.75,
                                    paddingHorizontal: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-SemiBold",
                                        fontSize: 11,
                                        color: textColor,
                                    }}
                                >
                                    {solicitud.solicitante.nombre}
                                </Text>

                                <Text
                                    numberOfLines={2}
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

                            <View
                                style={{
                                    width: 105,
                                    alignItems: "flex-start",
                                }}
                            >
                                <View
                                    style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        backgroundColor: colores.fondo,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 9,
                                            color: colores.color,
                                        }}
                                    >
                                        {obtenerNombreTipo(solicitud.institucion.tipo)}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                })
            ) : (
                <View
                    style={{
                        flex: 1,
                        minHeight: 350,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="search-outline" size={36} color={textMutedColor} />

                    <Text
                        style={{
                            marginTop: 12,
                            fontFamily: "Nunito-Bold",
                            fontSize: 14,
                            color: textColor,
                        }}
                    >
                        No encontramos solicitudes
                    </Text>

                    <Text
                        style={{
                            marginTop: 4,
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            color: textMutedColor,
                        }}
                    >
                        Prueba cambiando los filtros de búsqueda.
                    </Text>
                </View>
            )}

            <View style={{ flex: 1 }} />

            <View
                style={{
                    minHeight: 62,
                    paddingHorizontal: 18,
                    borderTopWidth: 1,
                    borderTopColor: borderColor,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 10,
                        color: textMutedColor,
                    }}
                >
                    Mostrando {solicitudes.length} de {totalFiltradas} solicitudes
                </Text>

                <View style={{ flex: 1 }} />

                <Pressable
                    disabled={pagina === 1}
                    onPress={() => onCambiarPagina(Math.max(1, pagina - 1))}
                    style={{
                        width: 30,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pagina === 1 ? 0.35 : 1,
                    }}
                >
                    <Ionicons name="chevron-back" size={16} color={textSecondaryColor} />
                </Pressable>

                {Array.from(
                    {
                        length: totalPaginas,
                    },
                    (_, indice) => indice + 1,
                ).map((numero) => (
                    <Pressable
                        key={numero}
                        onPress={() => onCambiarPagina(numero)}
                        style={{
                            width: 30,
                            height: 30,
                            marginHorizontal: 2,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: pagina === numero ? primaryColor : "transparent",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 10,
                                color:
                                    pagina === numero ? textOnPrimaryColor : textSecondaryColor,
                            }}
                        >
                            {numero}
                        </Text>
                    </Pressable>
                ))}

                <Pressable
                    disabled={pagina === totalPaginas}
                    onPress={() => onCambiarPagina(Math.min(totalPaginas, pagina + 1))}
                    style={{
                        width: 30,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pagina === totalPaginas ? 0.35 : 1,
                    }}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={textSecondaryColor}
                    />
                </Pressable>
            </View>
        </View>
    );
}
