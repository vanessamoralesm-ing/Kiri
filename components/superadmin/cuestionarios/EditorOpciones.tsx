import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    Switch,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
    actualizarOpcionAdmin,
    cambiarEstadoOpcionAdmin,
    crearOpcionAdmin,
    normalizarCodigoTest,
    obtenerOpcionesAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import type { OpcionTest } from "@/types/cuestionarios";

interface Props {
    idPregunta: string;
    puntua?: boolean;
    disabled?: boolean;
    onCambio?: (opciones: OpcionTest[]) => void;
}

interface Formulario {
    codigo: string;
    etiqueta: string;
    valorPuntaje: string;
    orden: string;
}

const formularioVacio = (orden: number): Formulario => ({
    codigo: `OP-${orden}`,
    etiqueta: "",
    valorPuntaje: "",
    orden: String(orden),
});

function mensajeError(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado.";
}

export default function EditorOpciones({
    idPregunta,
    puntua = true,
    disabled = false,
    onCambio,
}: Props) {
    const { width } = useWindowDimensions();
    const esTelefono = width < 768;

    const surface = useThemeColor({}, "surface");
    const surfaceSecondary = useThemeColor({}, "surfaceSecondary");
    const text = useThemeColor({}, "text");
    const secondary = useThemeColor({}, "textSecondary");
    const muted = useThemeColor({}, "textMuted");
    const primary = useThemeColor({}, "primary");
    const primarySoft = useThemeColor({}, "primarySoft");
    const onPrimary = useThemeColor({}, "textOnPrimary");
    const border = useThemeColor({}, "border");
    const inputBackground = useThemeColor({}, "inputBackground");
    const inputBorder = useThemeColor({}, "inputBorder");
    const placeholder = useThemeColor({}, "placeholder");
    const danger = useThemeColor({}, "danger");
    const success = useThemeColor({}, "success");

    const [opciones, setOpciones] = useState<OpcionTest[]>([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [cambiandoId, setCambiandoId] = useState<string | null>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [formulario, setFormulario] = useState<Formulario>(formularioVacio(1));

    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const onCambioRef = useRef(onCambio);

    useEffect(() => {
        onCambioRef.current = onCambio;
    }, [onCambio]);

    const cargar = useCallback(async () => {
        if (!idPregunta) {
            setOpciones([]);
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            setError(null);

            const datos = await obtenerOpcionesAdmin(idPregunta);
            setOpciones(datos);
            onCambioRef.current?.(datos);
        } catch (err) {
            setError(mensajeError(err));
        } finally {
            setCargando(false);
        }
    }, [idPregunta]);

    useEffect(() => {
        void cargar();
    }, [cargar]);

    const siguienteOrden =
        opciones.reduce((max, opcion) => Math.max(max, opcion.orden), 0) + 1;

    function actualizar<K extends keyof Formulario>(
        campo: K,
        valor: Formulario[K],
    ) {
        setFormulario((actual) => ({ ...actual, [campo]: valor }));
        setError(null);
    }

    function nuevaOpcion() {
        setEditandoId(null);
        setFormulario(formularioVacio(siguienteOrden));
        setError(null);
        setMensaje(null);
        setMostrarFormulario(true);
    }

    function editar(opcion: OpcionTest) {
        setEditandoId(opcion.id_opcion);
        setFormulario({
            codigo: opcion.codigo,
            etiqueta: opcion.etiqueta,
            valorPuntaje:
                opcion.valor_puntaje == null ? "" : String(opcion.valor_puntaje),
            orden: String(opcion.orden),
        });
        setError(null);
        setMensaje(null);
        setMostrarFormulario(true);
    }

    function cancelar() {
        if (guardando) return;
        setMostrarFormulario(false);
        setEditandoId(null);
        setError(null);
    }

    function validar(): string | null {
        const codigo = normalizarCodigoTest(formulario.codigo);
        const orden = Number(formulario.orden);

        if (!codigo) return "Ingresa el código de la opción.";
        if (!formulario.etiqueta.trim()) {
            return "Ingresa la etiqueta de la opción.";
        }
        if (!Number.isInteger(orden) || orden < 1) {
            return "El orden debe ser un entero mayor que cero.";
        }

        if (
            opciones.some(
                (opcion) =>
                    opcion.id_opcion !== editandoId &&
                    normalizarCodigoTest(opcion.codigo) === codigo,
            )
        ) {
            return "Ya existe una opción con ese código.";
        }

        if (
            opciones.some(
                (opcion) => opcion.id_opcion !== editandoId && opcion.orden === orden,
            )
        ) {
            return "Ese número de orden ya está utilizado.";
        }

        if (puntua) {
            if (!formulario.valorPuntaje.trim()) {
                return "Ingresa el puntaje de la opción.";
            }
            if (!Number.isFinite(Number(formulario.valorPuntaje))) {
                return "El puntaje debe ser numérico.";
            }
        }

        return null;
    }

    async function guardar() {
        if (disabled || guardando || !idPregunta) return;

        const errorValidacion = validar();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const estabaEditando = editandoId !== null;

        try {
            setGuardando(true);
            setError(null);

            const datos = {
                codigo: normalizarCodigoTest(formulario.codigo),
                etiqueta: formulario.etiqueta.trim(),
                valor_puntaje: puntua ? Number(formulario.valorPuntaje) : null,
                orden: Number(formulario.orden),
            };

            if (editandoId) {
                await actualizarOpcionAdmin(editandoId, datos);
            } else {
                await crearOpcionAdmin({
                    ...datos,
                    id_pregunta: idPregunta,
                    estado: true,
                });
            }

            await cargar();
            setMostrarFormulario(false);
            setEditandoId(null);
            setMensaje(
                estabaEditando
                    ? "Opción actualizada correctamente."
                    : "Opción registrada correctamente.",
            );
        } catch (err) {
            setError(mensajeError(err));
        } finally {
            setGuardando(false);
        }
    }

    async function cambiarEstado(opcion: OpcionTest) {
        if (disabled || cambiandoId || guardando) return;

        try {
            setCambiandoId(opcion.id_opcion);
            setError(null);

            await cambiarEstadoOpcionAdmin(opcion.id_opcion, !opcion.estado);

            await cargar();
        } catch (err) {
            setError(mensajeError(err));
        } finally {
            setCambiandoId(null);
        }
    }

    const campo = {
        minHeight: 48,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: inputBorder,
        borderRadius: 12,
        backgroundColor: inputBackground,
        color: text,
        fontFamily: "Nunito-Medium",
        fontSize: 14,
    } as const;

    const etiqueta = {
        fontFamily: "Nunito-SemiBold",
        fontSize: 13,
        color: text,
        marginBottom: 7,
    } as const;

    return (
        <View style={{ width: "100%", gap: 16 }}>
            {/* ENCABEZADO */}
            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",
                    alignItems: esTelefono ? "stretch" : "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <View style={{ flex: 1, gap: 4 }}>
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 20,
                            color: text,
                        }}
                    >
                        Opciones de respuesta
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 12,
                            lineHeight: 19,
                            color: secondary,
                        }}
                    >
                        Configura las respuestas disponibles para esta pregunta.
                    </Text>
                </View>

                {!mostrarFormulario && (
                    <Pressable
                        disabled={disabled}
                        onPress={nuevaOpcion}
                        style={({ pressed }) => ({
                            minHeight: 46,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            backgroundColor: primary,
                            opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
                        })}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <Ionicons name="add" size={19} color={onPrimary} />
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 13,
                                    color: onPrimary,
                                }}
                            >
                                Nueva opción
                            </Text>
                        </View>
                    </Pressable>
                )}
            </View>

            {/* FORMULARIO */}
            {mostrarFormulario && (
                <View
                    style={{
                        padding: esTelefono ? 16 : 22,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 18,
                        backgroundColor: surface,
                        gap: 16,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 17,
                            color: text,
                        }}
                    >
                        {editandoId ? "Editar opción" : "Registrar opción"}
                    </Text>

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",
                            gap: 14,
                        }}
                    >
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={etiqueta}>Código *</Text>
                            <TextInput
                                value={formulario.codigo}
                                onChangeText={(valor) => actualizar("codigo", valor)}
                                placeholder="Ej.: OP-1"
                                placeholderTextColor={placeholder}
                                editable={!disabled && !guardando}
                                autoCapitalize="characters"
                                style={campo}
                            />
                        </View>

                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={etiqueta}>Orden *</Text>
                            <TextInput
                                value={formulario.orden}
                                onChangeText={(valor) =>
                                    actualizar("orden", valor.replace(/\D/g, ""))
                                }
                                keyboardType="number-pad"
                                placeholderTextColor={placeholder}
                                editable={!disabled && !guardando}
                                style={campo}
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={etiqueta}>Etiqueta *</Text>
                        <TextInput
                            value={formulario.etiqueta}
                            onChangeText={(valor) => actualizar("etiqueta", valor)}
                            placeholder="Texto que verá el usuario"
                            placeholderTextColor={placeholder}
                            editable={!disabled && !guardando}
                            style={campo}
                        />
                    </View>

                    {puntua && (
                        <View>
                            <Text style={etiqueta}>Valor del puntaje *</Text>
                            <TextInput
                                value={formulario.valorPuntaje}
                                onChangeText={(valor) =>
                                    actualizar(
                                        "valorPuntaje",
                                        valor.replace(/[^0-9.,-]/g, "").replace(",", "."),
                                    )
                                }
                                keyboardType="decimal-pad"
                                placeholder="Ej.: 0"
                                placeholderTextColor={placeholder}
                                editable={!disabled && !guardando}
                                style={campo}
                            />
                        </View>
                    )}

                    {!!error && (
                        <Text style={{ color: danger, fontSize: 12 }}>{error}</Text>
                    )}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column-reverse" : "row",
                            justifyContent: "flex-end",
                            gap: 10,
                        }}
                    >
                        <Pressable
                            disabled={guardando}
                            onPress={cancelar}
                            style={{
                                minHeight: 46,
                                paddingHorizontal: 18,
                                borderWidth: 1,
                                borderColor: border,
                                borderRadius: 12,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ color: text }}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            disabled={guardando || disabled}
                            onPress={guardar}
                            style={{
                                minHeight: 46,
                                paddingHorizontal: 18,
                                borderRadius: 12,
                                backgroundColor: primary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {guardando ? (
                                <ActivityIndicator color={onPrimary} />
                            ) : (
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        color: onPrimary,
                                    }}
                                >
                                    Guardar opción
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            )}

            {/* MENSAJES */}
            {!!mensaje && (
                <Text style={{ color: success, fontSize: 12 }}>{mensaje}</Text>
            )}

            {!mostrarFormulario && !!error && (
                <Text style={{ color: danger, fontSize: 12 }}>{error}</Text>
            )}

            {/* LISTADO */}
            {cargando ? (
                <ActivityIndicator color={primary} />
            ) : opciones.length === 0 ? (
                <View
                    style={{
                        padding: 28,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 16,
                        backgroundColor: surface,
                        alignItems: "center",
                        gap: 9,
                    }}
                >
                    <Ionicons name="list-circle-outline" size={38} color={primary} />
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            color: text,
                        }}
                    >
                        Aún no hay opciones
                    </Text>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 12,
                            color: secondary,
                        }}
                    >
                        Agrega las respuestas que estarán disponibles.
                    </Text>
                </View>
            ) : (
                <View style={{ gap: 10 }}>
                    {[...opciones]
                        .sort((a, b) => a.orden - b.orden)
                        .map((opcion) => (
                            <View
                                key={opcion.id_opcion}
                                style={{
                                    padding: 15,
                                    borderWidth: 1,
                                    borderColor: border,
                                    borderRadius: 14,
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
                                            width: 38,
                                            height: 38,
                                            borderRadius: 12,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: primarySoft,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",
                                                color: primary,
                                            }}
                                        >
                                            {opcion.orden}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",
                                                fontSize: 14,
                                                color: text,
                                            }}
                                        >
                                            {opcion.etiqueta}
                                        </Text>

                                        <Text style={{ fontSize: 11, color: muted }}>
                                            {opcion.codigo}
                                            {puntua && opcion.valor_puntaje != null
                                                ? ` · ${opcion.valor_puntaje} puntos`
                                                : ""}
                                        </Text>
                                    </View>

                                    <Switch
                                        value={opcion.estado}
                                        disabled={disabled || cambiandoId !== null}
                                        onValueChange={() => cambiarEstado(opcion)}
                                        trackColor={{
                                            false: inputBorder,
                                            true: primary,
                                        }}
                                    />
                                </View>

                                <Pressable
                                    disabled={disabled || guardando}
                                    onPress={() => editar(opcion)}
                                    style={{
                                        alignSelf: "flex-start",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 7,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 10,
                                        backgroundColor: surfaceSecondary,
                                    }}
                                >
                                    <Ionicons name="create-outline" size={17} color={primary} />
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-SemiBold",
                                            color: primary,
                                            fontSize: 12,
                                        }}
                                    >
                                        Editar
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                </View>
            )}
        </View>
    );
}
