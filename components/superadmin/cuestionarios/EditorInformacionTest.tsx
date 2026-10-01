
import React from "react";

import {
    Pressable,
    Switch,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import type {
    CrearTestAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

// ==========================================================
// TIPOS
// ==========================================================

type Informacion = Omit<
    CrearTestAdmin,
    "estado"
>;

interface Props {
    value: Informacion;

    onChange: (
        value: Informacion,
    ) => void;

    disabled?: boolean;
}

const APLICACIONES: {
    valor: Informacion["tipo_aplicacion"];
    titulo: string;
    descripcion: string;
}[] = [
        {
            valor: "autoadministrado",
            titulo: "Autoadministrado",
            descripcion:
                "La persona contesta el cuestionario.",
        },
        {
            valor: "profesional",
            titulo: "Profesional",
            descripcion:
                "Aplicado por un profesional autorizado.",
        },
    ];

// ==========================================================
// CAMPO REUTILIZABLE
// ==========================================================

interface CampoProps {
    value: string;

    onChangeText: (
        value: string,
    ) => void;

    titulo: string;
    sugerencia: string;

    multiline?: boolean;
    disabled: boolean;

    placeholderColor: string;
    inputBackground: string;
    inputBorder: string;
    textColor: string;
}

function Campo({
    value,
    onChangeText,
    titulo,
    sugerencia,
    multiline = false,
    disabled,
    placeholderColor,
    inputBackground,
    inputBorder,
    textColor,
}: CampoProps) {
    return (
        <View
            style={{
                width: "100%",
                gap: 7,
            }}
        >
            <Text
                style={{
                    color: textColor,
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 13,
                }}
            >
                {titulo}
            </Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={sugerencia}
                placeholderTextColor={
                    placeholderColor
                }
                editable={!disabled}
                multiline={multiline}
                textAlignVertical={
                    multiline
                        ? "top"
                        : "center"
                }
                style={{
                    width: "100%",
                    minHeight:
                        multiline
                            ? 96
                            : 50,
                    paddingHorizontal: 14,
                    paddingVertical:
                        multiline
                            ? 12
                            : 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor:
                        inputBorder,
                    backgroundColor:
                        inputBackground,
                    color: textColor,
                    fontFamily:
                        "Nunito-Medium",
                    fontSize: 14,
                }}
            />
        </View>
    );
}

// ==========================================================
// EDITOR
// ==========================================================

export default function EditorInformacionTest({
    value,
    onChange,
    disabled = false,
}: Props) {
    const {
        width,
    } = useWindowDimensions();

    const telefono =
        width < 768;

    const surface =
        useThemeColor(
            {},
            "surface",
        );

    const secondary =
        useThemeColor(
            {},
            "surfaceSecondary",
        );

    const text =
        useThemeColor(
            {},
            "text",
        );

    const textSecondary =
        useThemeColor(
            {},
            "textSecondary",
        );

    const primary =
        useThemeColor(
            {},
            "primary",
        );

    const primarySoft =
        useThemeColor(
            {},
            "primarySoft",
        );

    const border =
        useThemeColor(
            {},
            "border",
        );

    const inputBackground =
        useThemeColor(
            {},
            "inputBackground",
        );

    const inputBorder =
        useThemeColor(
            {},
            "inputBorder",
        );

    const placeholder =
        useThemeColor(
            {},
            "placeholder",
        );

    // ========================================================
    // ACTUALIZACIÓN
    // ========================================================

    function cambiar<
        K extends keyof Informacion
    >(
        campo: K,
        valor: Informacion[K],
    ) {
        onChange({
            ...value,
            [campo]: valor,
        });
    }

    function campoProps(
        campo:
            | "codigo"
            | "nombre"
            | "descripcion"
            | "instrucciones"
            | "poblacion_objetivo"
            | "version",
    ) {
        return {
            value:
                value[campo] ?? "",

            onChangeText: (
                nuevo: string,
            ) => cambiar(
                campo,
                nuevo,
            ),

            disabled,
            placeholderColor:
                placeholder,
            inputBackground,
            inputBorder,
            textColor: text,
        };
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                width: "100%",
                borderWidth: 1,
                borderColor: border,
                backgroundColor: surface,
                borderRadius: 18,
                padding: telefono
                    ? 16
                    : 24,
                gap: 19,
            }}
        >
            {/* ENCABEZADO */}

            <View
                style={{
                    gap: 6,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 20,
                        color: text,
                    }}
                >
                    Información general
                </Text>

                <Text
                    style={{
                        color:
                            textSecondary,
                        fontSize: 12,
                        lineHeight: 19,
                    }}
                >
                    Identifica el instrumento y
                    configura su aplicación.
                </Text>
            </View>

            {/* CÓDIGO Y NOMBRE */}

            <View
                style={{
                    flexDirection:
                        telefono
                            ? "column"
                            : "row",
                    gap: 14,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Campo
                        {...campoProps(
                            "codigo",
                        )}
                        titulo="Código *"
                        sugerencia="Ej.: PHQ-9"
                    />
                </View>

                <View
                    style={{
                        flex: 2,
                        minWidth: 0,
                    }}
                >
                    <Campo
                        {...campoProps(
                            "nombre",
                        )}
                        titulo="Nombre *"
                        sugerencia="Nombre del cuestionario"
                    />
                </View>
            </View>

            {/* DESCRIPCIÓN */}

            <Campo
                {...campoProps(
                    "descripcion",
                )}
                titulo="Descripción"
                sugerencia="Propósito del instrumento"
                multiline
            />

            {/* INSTRUCCIONES */}

            <Campo
                {...campoProps(
                    "instrucciones",
                )}
                titulo="Instrucciones"
                sugerencia="Indicaciones para el usuario"
                multiline
            />

            {/* POBLACIÓN */}

            <Campo
                {...campoProps(
                    "poblacion_objetivo",
                )}
                titulo="Población objetivo"
                sugerencia="Ej.: Personas adultas"
            />

            {/* TIPO DE APLICACIÓN */}

            <View
                style={{
                    gap: 9,
                }}
            >
                <Text
                    style={{
                        fontFamily:
                            "Nunito-SemiBold",
                        fontSize: 13,
                        color: text,
                    }}
                >
                    Tipo de aplicación *
                </Text>

                <View
                    style={{
                        flexDirection:
                            telefono
                                ? "column"
                                : "row",
                        gap: 10,
                    }}
                >
                    {APLICACIONES.map(
                        (item) => {
                            const elegido =
                                value.tipo_aplicacion ===
                                item.valor;

                            return (
                                <Pressable
                                    key={
                                        item.valor
                                    }
                                    disabled={
                                        disabled
                                    }
                                    onPress={() =>
                                        cambiar(
                                            "tipo_aplicacion",
                                            item.valor,
                                        )
                                    }
                                    style={({
                                        pressed,
                                    }) => ({
                                        flex: 1,
                                        minWidth: 0,

                                        borderWidth:
                                            elegido
                                                ? 2
                                                : 1,

                                        borderColor:
                                            elegido
                                                ? primary
                                                : border,

                                        borderRadius:
                                            12,

                                        backgroundColor:
                                            elegido
                                                ? primarySoft
                                                : secondary,

                                        padding: 13,

                                        opacity:
                                            disabled
                                                ? 0.6
                                                : pressed
                                                    ? 0.8
                                                    : 1,
                                    })}
                                >
                                    <View
                                        style={{
                                            gap: 4,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    elegido
                                                        ? primary
                                                        : text,

                                                fontFamily:
                                                    "Nunito-Bold",

                                                fontSize:
                                                    13,
                                            }}
                                        >
                                            {elegido
                                                ? "◉"
                                                : "○"}{" "}
                                            {item.titulo}
                                        </Text>

                                        <Text
                                            style={{
                                                color:
                                                    textSecondary,

                                                fontSize:
                                                    11,

                                                lineHeight:
                                                    16,
                                            }}
                                        >
                                            {
                                                item.descripcion
                                            }
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        },
                    )}
                </View>
            </View>

            {/* VERSIÓN */}

            <Campo
                {...campoProps(
                    "version",
                )}
                titulo="Versión"
                sugerencia="Ej.: 1.0"
            />

            {/* SUBESCALAS */}

            <View
                style={{
                    flexDirection:
                        "row",

                    gap: 12,

                    alignItems:
                        "center",

                    borderWidth:
                        1,

                    borderColor:
                        border,

                    padding:
                        13,

                    borderRadius:
                        12,
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
                            fontFamily:
                                "Nunito-Bold",

                            color: text,

                            fontSize:
                                13,
                        }}
                    >
                        Utiliza subescalas
                    </Text>

                    <Text
                        style={{
                            color:
                                textSecondary,

                            fontSize:
                                11,

                            lineHeight:
                                17,
                        }}
                    >
                        Habilita las dimensiones
                        que conforman el
                        instrumento.
                    </Text>
                </View>

                <Switch
                    value={
                        value.tiene_subescalas
                    }
                    onValueChange={(
                        nuevo,
                    ) =>
                        cambiar(
                            "tiene_subescalas",
                            nuevo,
                        )
                    }
                    disabled={
                        disabled
                    }
                    trackColor={{
                        false:
                            inputBorder,

                        true:
                            primary,
                    }}
                    thumbColor="#FFFFFF"
                />
            </View>
        </View>
    );
}
