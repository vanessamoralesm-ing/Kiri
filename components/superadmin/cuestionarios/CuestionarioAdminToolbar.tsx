import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Pressable, Text, TextInput, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export type FiltroEstadoCuestionario = "todos" | "activos" | "inactivos";

interface Props {
    busqueda: string;

    filtroEstado: FiltroEstadoCuestionario;

    onCambiarBusqueda: (valor: string) => void;

    onCambiarFiltro: (filtro: FiltroEstadoCuestionario) => void;
}

const FILTROS: {
    valor: FiltroEstadoCuestionario;
    texto: string;
}[] = [
        {
            valor: "todos",
            texto: "Todos",
        },
        {
            valor: "activos",
            texto: "Activos",
        },
        {
            valor: "inactivos",
            texto: "Inactivos",
        },
    ];

export default function CuestionariosAdminToolbar({
    busqueda,
    filtroEstado,
    onCambiarBusqueda,
    onCambiarFiltro,
}: Props) {
    const { esTelefono } = useResponsiveLayout();

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const placeholderColor = useThemeColor({}, "placeholder");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    return (
        <View
            style={{
                width: "100%",

                flexDirection: esTelefono ? "column" : "row",

                alignItems: esTelefono ? "stretch" : "center",

                gap: 12,
            }}
        >
            {/* BÚSQUEDA */}

            <View
                style={{
                    flex: esTelefono ? undefined : 1,

                    width: esTelefono ? "100%" : undefined,

                    minHeight: 48,

                    paddingHorizontal: 14,

                    borderWidth: 1,
                    borderColor,

                    borderRadius: 14,

                    flexDirection: "row",

                    alignItems: "center",

                    backgroundColor: surfaceColor,
                }}
            >
                <Ionicons name="search-outline" size={19} color={textSecondaryColor} />

                <TextInput
                    value={busqueda}
                    onChangeText={onCambiarBusqueda}
                    placeholder="Buscar por nombre o código..."
                    placeholderTextColor={placeholderColor}
                    autoCapitalize="none"
                    style={{
                        flex: 1,

                        minWidth: 0,

                        marginLeft: 10,

                        paddingVertical: 0,

                        fontFamily: "Nunito-Medium",

                        fontSize: 14,

                        color: textColor,
                    }}
                />

                {busqueda.length > 0 && (
                    <Pressable onPress={() => onCambiarBusqueda("")} hitSlop={8}>
                        <Ionicons
                            name="close-circle"
                            size={19}
                            color={textSecondaryColor}
                        />
                    </Pressable>
                )}
            </View>

            {/* FILTROS */}

            <View
                style={{
                    flexDirection: "row",

                    alignItems: "center",

                    gap: 6,

                    padding: 4,

                    borderRadius: 14,

                    backgroundColor: surfaceSecondaryColor,
                }}
            >
                {FILTROS.map((filtro) => {
                    const activo = filtroEstado === filtro.valor;

                    return (
                        <Pressable
                            key={filtro.valor}
                            onPress={() => onCambiarFiltro(filtro.valor)}
                            style={({ pressed }) => ({
                                flex: esTelefono ? 1 : undefined,

                                minHeight: 38,

                                paddingHorizontal: esTelefono ? 8 : 14,

                                borderRadius: 11,

                                alignItems: "center",

                                justifyContent: "center",

                                opacity: pressed ? 0.75 : 1,

                                backgroundColor: activo ? primarySoftColor : "transparent",
                            })}
                        >
                            <Text
                                style={{
                                    fontFamily: activo ? "Nunito-Bold" : "Nunito-SemiBold",

                                    fontSize: 12,

                                    color: activo ? primaryColor : textSecondaryColor,
                                }}
                            >
                                {filtro.texto}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
