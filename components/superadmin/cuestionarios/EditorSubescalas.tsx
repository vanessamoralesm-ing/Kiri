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
    actualizarSubescalaAdmin,
    cambiarEstadoSubescalaAdmin,
    crearSubescalaAdmin,
    normalizarCodigoTest,
    obtenerSubescalasAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import type { SubescalaTest } from "@/types/cuestionarios";

// ==========================================================
// TIPOS
// ==========================================================

interface EditorSubescalasProps {
    idTest: string;

    disabled?: boolean;

    onCambio?: (subescalas: SubescalaTest[]) => void;
}

interface FormularioSubescala {
    codigo: string;

    nombre: string;

    descripcion: string;

    orden: string;

    incluyeTotal: boolean;
}

// ==========================================================
// UTILIDADES
// ==========================================================

function formularioInicial(orden: number): FormularioSubescala {
    return {
        codigo: "",

        nombre: "",

        descripcion: "",

        orden: String(orden),

        incluyeTotal: true,
    };
}

function obtenerMensajeError(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado.";
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EditorSubescalas({
    idTest,
    disabled = false,
    onCambio,
}: EditorSubescalasProps) {
    // ======================================================
    // RESPONSIVE
    // ======================================================

    const { width } = useWindowDimensions();

    const esTelefono = width < 768;

    // ======================================================
    // TEMA
    // ======================================================

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const inputBackground = useThemeColor({}, "inputBackground");

    const inputBorder = useThemeColor({}, "inputBorder");

    const placeholderColor = useThemeColor({}, "placeholder");

    const borderColor = useThemeColor({}, "border");

    const dangerColor = useThemeColor({}, "danger");

    const successColor = useThemeColor({}, "success");

    // ======================================================
    // ESTADOS
    // ======================================================

    const [subescalas, setSubescalas] = useState<SubescalaTest[]>([]);

    const [cargando, setCargando] = useState(true);

    const [guardando, setGuardando] = useState(false);

    const [modificandoEstado, setModificandoEstado] = useState<string | null>(
        null,
    );

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [idSubescalaEditando, setIdSubescalaEditando] = useState<string | null>(
        null,
    );

    const [formulario, setFormulario] = useState<FormularioSubescala>(
        formularioInicial(1),
    );

    const [error, setError] = useState<string | null>(null);

    const [mensaje, setMensaje] = useState<string | null>(null);

    // Evita repetir la carga cuando el componente padre
    // proporciona un callback nuevo en cada render.

    const onCambioRef = useRef(onCambio);

    useEffect(() => {
        onCambioRef.current = onCambio;
    }, [onCambio]);

    // ======================================================
    // CARGA DE SUBESCALAS
    // ======================================================

    const cargarSubescalas = useCallback(async () => {
        if (!idTest) {
            setSubescalas([]);
            setCargando(false);

            return;
        }

        try {
            setCargando(true);
            setError(null);

            const resultado = await obtenerSubescalasAdmin(idTest);

            setSubescalas(resultado);

            onCambioRef.current?.(resultado);
        } catch (err) {
            console.error("Error al cargar subescalas:", err);

            setError(obtenerMensajeError(err));
        } finally {
            setCargando(false);
        }
    }, [idTest]);

    useEffect(() => {
        void cargarSubescalas();
    }, [cargarSubescalas]);

    // ======================================================
    // DATOS DERIVADOS
    // ======================================================

    const subescalasOrdenadas = [...subescalas].sort((a, b) => a.orden - b.orden);

    const activas = subescalas.filter((subescala) => subescala.estado).length;

    const siguienteOrden =
        subescalas.reduce(
            (maximo, subescala) => Math.max(maximo, subescala.orden),
            0,
        ) + 1;

    const formularioBloqueado = disabled || guardando;

    // ======================================================
    // FORMULARIO
    // ======================================================

    function actualizarFormulario<K extends keyof FormularioSubescala>(
        campo: K,
        valor: FormularioSubescala[K],
    ) {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));

        if (error) {
            setError(null);
        }
    }

    function nuevaSubescala() {
        if (disabled || guardando) {
            return;
        }

        setIdSubescalaEditando(null);

        setFormulario(formularioInicial(siguienteOrden));

        setError(null);
        setMensaje(null);

        setMostrarFormulario(true);
    }

    function editarSubescala(subescala: SubescalaTest) {
        if (disabled || guardando) {
            return;
        }

        setIdSubescalaEditando(subescala.id_subescala);

        setFormulario({
            codigo: subescala.codigo,

            nombre: subescala.nombre,

            descripcion: subescala.descripcion ?? "",

            orden: String(subescala.orden),

            incluyeTotal: subescala.incluye_total,
        });

        setError(null);
        setMensaje(null);

        setMostrarFormulario(true);
    }

    function cancelarFormulario() {
        if (guardando) {
            return;
        }

        setMostrarFormulario(false);

        setIdSubescalaEditando(null);

        setFormulario(formularioInicial(siguienteOrden));

        setError(null);
    }

    // ======================================================
    // VALIDACIÓN
    // ======================================================

    function validarFormulario(): string | null {
        const codigo = normalizarCodigoTest(formulario.codigo);

        const nombre = formulario.nombre.trim();

        if (!codigo) {
            return "Debes ingresar el código de la subescala.";
        }

        if (!nombre) {
            return "Debes ingresar el nombre de la subescala.";
        }

        const orden = Number(formulario.orden);

        if (!Number.isInteger(orden) || orden < 1) {
            return "El orden debe ser un número entero mayor que cero.";
        }

        const codigoDuplicado = subescalas.some(
            (subescala) =>
                subescala.id_subescala !== idSubescalaEditando &&
                normalizarCodigoTest(subescala.codigo) === codigo,
        );

        if (codigoDuplicado) {
            return `Ya existe una subescala con el código "${codigo}".`;
        }

        const ordenDuplicado = subescalas.some(
            (subescala) =>
                subescala.id_subescala !== idSubescalaEditando &&
                subescala.orden === orden,
        );

        if (ordenDuplicado) {
            return `El orden ${orden} ya está asignado a otra subescala.`;
        }

        return null;
    }

    // ======================================================
    // GUARDAR
    // ======================================================

    async function guardarSubescala() {
        if (formularioBloqueado || !idTest) {
            return;
        }

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);

            return;
        }

        const editando = idSubescalaEditando !== null;

        try {
            setGuardando(true);

            setError(null);
            setMensaje(null);

            const datos = {
                codigo: normalizarCodigoTest(formulario.codigo),

                nombre: formulario.nombre.trim(),

                descripcion: formulario.descripcion.trim() || null,

                orden: Number(formulario.orden),

                incluye_total: formulario.incluyeTotal,
            };

            if (idSubescalaEditando) {
                await actualizarSubescalaAdmin(idSubescalaEditando, datos);
            } else {
                await crearSubescalaAdmin({
                    id_test: idTest,

                    ...datos,

                    estado: true,
                });
            }

            // El formulario se cierra después de
            // guardar correctamente.

            setMostrarFormulario(false);

            setIdSubescalaEditando(null);

            setFormulario(formularioInicial(siguienteOrden + 1));

            setMensaje(
                editando
                    ? "La subescala se actualizó correctamente."
                    : "La subescala se registró correctamente.",
            );

            await cargarSubescalas();
        } catch (err) {
            console.error("Error al guardar subescala:", err);

            setError(obtenerMensajeError(err));
        } finally {
            setGuardando(false);
        }
    }

    // ======================================================
    // ACTIVAR / DESACTIVAR
    // ======================================================

    async function cambiarEstado(subescala: SubescalaTest) {
        if (disabled || modificandoEstado !== null) {
            return;
        }

        try {
            setModificandoEstado(subescala.id_subescala);

            setError(null);
            setMensaje(null);

            await cambiarEstadoSubescalaAdmin(
                subescala.id_subescala,
                !subescala.estado,
            );

            await cargarSubescalas();

            setMensaje(
                subescala.estado
                    ? "La subescala se desactivó correctamente."
                    : "La subescala se activó correctamente.",
            );
        } catch (err) {
            console.error("Error al cambiar el estado:", err);

            setError(obtenerMensajeError(err));
        } finally {
            setModificandoEstado(null);
        }
    }

    // ======================================================
    // ESTILOS COMPARTIDOS
    // ======================================================

    const estiloCampo = {
        width: "100%" as const,

        minHeight: 50,

        paddingHorizontal: 14,

        paddingVertical: 11,

        borderWidth: 1,

        borderColor: inputBorder,

        borderRadius: 12,

        backgroundColor: inputBackground,

        fontFamily: "Nunito-Medium",

        fontSize: 14,

        color: textColor,
    };

    const estiloEtiqueta = {
        fontFamily: "Nunito-SemiBold",

        fontSize: 13,

        color: textColor,
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                width: "100%",

                gap: 18,
            }}
        >
            {/* ==============================================
                ENCABEZADO
            ============================================== */}

            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",

                    alignItems: esTelefono ? "stretch" : "center",

                    justifyContent: "space-between",

                    gap: 14,
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
                            fontFamily: "Nunito-Bold",

                            fontSize: esTelefono ? 20 : 23,

                            color: textColor,
                        }}
                    >
                        Subescalas
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 13,

                            lineHeight: 19,

                            color: textSecondaryColor,
                        }}
                    >
                        Organiza las dimensiones que evalúa el cuestionario.
                    </Text>
                </View>

                {!mostrarFormulario && (
                    <Pressable
                        onPress={nuevaSubescala}
                        disabled={disabled}
                        style={({ pressed }) => ({
                            minHeight: 46,

                            paddingHorizontal: 16,

                            borderRadius: 12,

                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent: "center",

                            gap: 8,

                            backgroundColor: primaryColor,

                            opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
                        })}
                    >
                        <Ionicons name="add" size={20} color={textOnPrimaryColor} />

                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",

                                fontSize: 13,

                                color: textOnPrimaryColor,
                            }}
                        >
                            Nueva subescala
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* ==============================================
                RESUMEN
            ============================================== */}

            <View
                style={{
                    flexDirection: "row",

                    flexWrap: "wrap",

                    gap: 10,
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 13,

                        paddingVertical: 9,

                        borderRadius: 11,

                        backgroundColor: primarySoftColor,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: 12,

                            color: primaryColor,
                        }}
                    >
                        {subescalas.length} registradas
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: 13,

                        paddingVertical: 9,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 11,

                        backgroundColor: surfaceColor,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",

                            fontSize: 12,

                            color: successColor,
                        }}
                    >
                        {activas} activas
                    </Text>
                </View>
            </View>

            {/* ==============================================
                FORMULARIO
            ============================================== */}

            {mostrarFormulario && (
                <View
                    style={{
                        width: "100%",

                        padding: esTelefono ? 16 : 22,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 18,

                        backgroundColor: surfaceColor,

                        gap: 18,
                    }}
                >
                    {/* TÍTULO */}

                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            gap: 12,
                        }}
                    >
                        <View
                            style={{
                                width: 42,

                                height: 42,

                                borderRadius: 12,

                                backgroundColor: primarySoftColor,

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="layers-outline" size={22} color={primaryColor} />
                        </View>

                        <View
                            style={{
                                flex: 1,

                                minWidth: 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: 17,

                                    color: textColor,
                                }}
                            >
                                {idSubescalaEditando
                                    ? "Editar subescala"
                                    : "Registrar subescala"}
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 12,

                                    color: textSecondaryColor,
                                }}
                            >
                                Completa la información de esta dimensión.
                            </Text>
                        </View>
                    </View>

                    {/* CÓDIGO Y ORDEN */}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",

                            gap: 14,
                        }}
                    >
                        <View
                            style={{
                                flex: 2,

                                minWidth: 0,

                                gap: 8,
                            }}
                        >
                            <Text style={estiloEtiqueta}>Código *</Text>

                            <TextInput
                                value={formulario.codigo}
                                onChangeText={(valor) => actualizarFormulario("codigo", valor)}
                                placeholder="Ej.: ANSIEDAD"
                                placeholderTextColor={placeholderColor}
                                autoCapitalize="characters"
                                editable={!formularioBloqueado}
                                style={estiloCampo}
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,

                                minWidth: 0,

                                gap: 8,
                            }}
                        >
                            <Text style={estiloEtiqueta}>Orden *</Text>

                            <TextInput
                                value={formulario.orden}
                                onChangeText={(valor) =>
                                    actualizarFormulario("orden", valor.replace(/[^0-9]/g, ""))
                                }
                                placeholder="1"
                                placeholderTextColor={placeholderColor}
                                keyboardType="number-pad"
                                editable={!formularioBloqueado}
                                style={estiloCampo}
                            />
                        </View>
                    </View>

                    {/* NOMBRE */}

                    <View
                        style={{
                            gap: 8,
                        }}
                    >
                        <Text style={estiloEtiqueta}>Nombre de la subescala *</Text>

                        <TextInput
                            value={formulario.nombre}
                            onChangeText={(valor) => actualizarFormulario("nombre", valor)}
                            placeholder="Ej.: Ansiedad e insomnio"
                            placeholderTextColor={placeholderColor}
                            editable={!formularioBloqueado}
                            style={estiloCampo}
                        />
                    </View>

                    {/* DESCRIPCIÓN */}

                    <View
                        style={{
                            gap: 8,
                        }}
                    >
                        <Text style={estiloEtiqueta}>Descripción</Text>

                        <TextInput
                            value={formulario.descripcion}
                            onChangeText={(valor) =>
                                actualizarFormulario("descripcion", valor)
                            }
                            placeholder="Describe qué evalúa esta subescala"
                            placeholderTextColor={placeholderColor}
                            editable={!formularioBloqueado}
                            multiline
                            textAlignVertical="top"
                            style={{
                                ...estiloCampo,

                                minHeight: 105,
                            }}
                        />
                    </View>

                    {/* INCLUYE TOTAL */}

                    <View
                        style={{
                            padding: 14,

                            borderWidth: 1,

                            borderColor,

                            borderRadius: 13,

                            backgroundColor: surfaceSecondaryColor,

                            flexDirection: "row",

                            alignItems: "center",

                            gap: 12,
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

                                    fontSize: 13,

                                    color: textColor,
                                }}
                            >
                                Incluir en el puntaje total
                            </Text>

                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",

                                    fontSize: 11,

                                    lineHeight: 17,

                                    color: textSecondaryColor,
                                }}
                            >
                                Indica si esta subescala contribuye al resultado total del
                                cuestionario.
                            </Text>
                        </View>

                        <Switch
                            value={formulario.incluyeTotal}
                            onValueChange={(valor) =>
                                actualizarFormulario("incluyeTotal", valor)
                            }
                            disabled={formularioBloqueado}
                            trackColor={{
                                false: inputBorder,

                                true: primaryColor,
                            }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* ERROR */}

                    {error && (
                        <View
                            style={{
                                padding: 13,

                                borderWidth: 1,

                                borderColor: dangerColor,

                                borderRadius: 11,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Medium",

                                    fontSize: 12,

                                    lineHeight: 18,

                                    color: dangerColor,
                                }}
                            >
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* ACCIONES */}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column-reverse" : "row",

                            justifyContent: "flex-end",

                            gap: 10,
                        }}
                    >
                        <Pressable
                            onPress={cancelarFormulario}
                            disabled={guardando}
                            style={({ pressed }) => ({
                                minHeight: 48,

                                paddingHorizontal: 18,

                                borderWidth: 1,

                                borderColor,

                                borderRadius: 12,

                                backgroundColor: surfaceColor,

                                alignItems: "center",

                                justifyContent: "center",

                                opacity: guardando ? 0.5 : pressed ? 0.7 : 1,
                            })}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-SemiBold",

                                    fontSize: 13,

                                    color: textColor,
                                }}
                            >
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={guardarSubescala}
                            disabled={formularioBloqueado}
                            style={({ pressed }) => ({
                                minHeight: 48,

                                paddingHorizontal: 20,

                                borderRadius: 12,

                                backgroundColor: primaryColor,

                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: "center",

                                gap: 8,

                                opacity: formularioBloqueado ? 0.5 : pressed ? 0.8 : 1,
                            })}
                        >
                            {guardando ? (
                                <ActivityIndicator size="small" color={textOnPrimaryColor} />
                            ) : (
                                <Ionicons
                                    name="save-outline"
                                    size={18}
                                    color={textOnPrimaryColor}
                                />
                            )}

                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: 13,

                                    color: textOnPrimaryColor,
                                }}
                            >
                                {guardando
                                    ? "Guardando..."
                                    : idSubescalaEditando
                                        ? "Guardar cambios"
                                        : "Registrar subescala"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* ==============================================
                MENSAJES
            ============================================== */}

            {!mostrarFormulario && error && (
                <View
                    style={{
                        padding: 13,

                        borderWidth: 1,

                        borderColor: dangerColor,

                        borderRadius: 12,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 12,

                            color: dangerColor,
                        }}
                    >
                        {error}
                    </Text>
                </View>
            )}

            {mensaje && (
                <View
                    style={{
                        padding: 13,

                        borderRadius: 12,

                        backgroundColor: surfaceSecondaryColor,

                        flexDirection: "row",

                        alignItems: "center",

                        gap: 9,
                    }}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={19}
                        color={successColor}
                    />

                    <Text
                        style={{
                            flex: 1,

                            fontFamily: "Nunito-Medium",

                            fontSize: 12,

                            color: successColor,
                        }}
                    >
                        {mensaje}
                    </Text>
                </View>
            )}

            {/* ==============================================
                CARGANDO
            ============================================== */}

            {cargando && (
                <View
                    style={{
                        minHeight: 150,

                        alignItems: "center",

                        justifyContent: "center",

                        gap: 10,
                    }}
                >
                    <ActivityIndicator size="small" color={primaryColor} />

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 12,

                            color: textSecondaryColor,
                        }}
                    >
                        Cargando subescalas...
                    </Text>
                </View>
            )}

            {/* ==============================================
                ESTADO VACÍO
            ============================================== */}

            {!cargando && subescalas.length === 0 && !mostrarFormulario && (
                <View
                    style={{
                        minHeight: 190,

                        padding: 24,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 18,

                        backgroundColor: surfaceColor,

                        alignItems: "center",

                        justifyContent: "center",

                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            width: 60,

                            height: 60,

                            borderRadius: 18,

                            backgroundColor: primarySoftColor,

                            alignItems: "center",

                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="layers-outline" size={28} color={primaryColor} />
                    </View>

                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: 16,

                            textAlign: "center",

                            color: textColor,
                        }}
                    >
                        Aún no hay subescalas
                    </Text>

                    <Text
                        style={{
                            maxWidth: 420,

                            fontFamily: "Nunito-Medium",

                            fontSize: 12,

                            lineHeight: 19,

                            textAlign: "center",

                            color: textSecondaryColor,
                        }}
                    >
                        Registra las dimensiones del cuestionario antes de asignarlas a las
                        preguntas.
                    </Text>
                </View>
            )}

            {/* ==============================================
                LISTADO
            ============================================== */}

            {!cargando && subescalasOrdenadas.length > 0 && (
                <View
                    style={{
                        gap: 12,
                    }}
                >
                    {subescalasOrdenadas.map((subescala) => {
                        const cambiando = modificandoEstado === subescala.id_subescala;

                        return (
                            <View
                                key={subescala.id_subescala}
                                style={{
                                    width: "100%",

                                    padding: esTelefono ? 16 : 20,

                                    borderWidth: 1,

                                    borderColor,

                                    borderRadius: 16,

                                    backgroundColor: surfaceColor,

                                    gap: 15,
                                }}
                            >
                                {/* ENCABEZADO */}

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "flex-start",

                                        gap: 12,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 43,

                                            height: 43,

                                            borderRadius: 12,

                                            backgroundColor: primarySoftColor,

                                            alignItems: "center",

                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 15,

                                                color: primaryColor,
                                            }}
                                        >
                                            {subescala.orden}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,

                                            minWidth: 0,

                                            gap: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 15,

                                                lineHeight: 21,

                                                color: textColor,
                                            }}
                                        >
                                            {subescala.nombre}
                                        </Text>

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 11,

                                                color: textMutedColor,
                                            }}
                                        >
                                            {subescala.codigo}
                                        </Text>

                                        {subescala.descripcion && (
                                            <Text
                                                style={{
                                                    marginTop: 4,

                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 12,

                                                    lineHeight: 18,

                                                    color: textSecondaryColor,
                                                }}
                                            >
                                                {subescala.descripcion}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* ETIQUETAS */}

                                <View
                                    style={{
                                        flexDirection: "row",

                                        flexWrap: "wrap",

                                        gap: 8,
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingHorizontal: 10,

                                            paddingVertical: 6,

                                            borderRadius: 999,

                                            backgroundColor: subescala.estado
                                                ? primarySoftColor
                                                : surfaceSecondaryColor,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 11,

                                                color: subescala.estado ? primaryColor : textMutedColor,
                                            }}
                                        >
                                            {subescala.estado ? "Activa" : "Inactiva"}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            paddingHorizontal: 10,

                                            paddingVertical: 6,

                                            borderRadius: 999,

                                            backgroundColor: surfaceSecondaryColor,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 11,

                                                color: textSecondaryColor,
                                            }}
                                        >
                                            {subescala.incluye_total
                                                ? "Incluye puntaje total"
                                                : "Sin puntaje total"}
                                        </Text>
                                    </View>
                                </View>

                                {/* ACCIONES */}

                                <View
                                    style={{
                                        borderTopWidth: 1,

                                        borderTopColor: borderColor,

                                        paddingTop: 13,

                                        flexDirection: esTelefono ? "column" : "row",

                                        alignItems: "stretch",

                                        gap: 10,
                                    }}
                                >
                                    <Pressable
                                        onPress={() => editarSubescala(subescala)}
                                        disabled={disabled || guardando || cambiando}
                                        style={({ pressed }) => ({
                                            flex: esTelefono ? undefined : 1,

                                            minHeight: 43,

                                            paddingHorizontal: 13,

                                            borderRadius: 11,

                                            backgroundColor: primarySoftColor,

                                            flexDirection: "row",

                                            alignItems: "center",

                                            justifyContent: "center",

                                            gap: 7,

                                            opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
                                        })}
                                    >
                                        <Ionicons
                                            name="create-outline"
                                            size={17}
                                            color={primaryColor}
                                        />

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 12,

                                                color: primaryColor,
                                            }}
                                        >
                                            Editar
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => cambiarEstado(subescala)}
                                        disabled={disabled || cambiando || guardando}
                                        style={({ pressed }) => ({
                                            flex: esTelefono ? undefined : 1,

                                            minHeight: 43,

                                            paddingHorizontal: 13,

                                            borderWidth: 1,

                                            borderColor,

                                            borderRadius: 11,

                                            backgroundColor: surfaceSecondaryColor,

                                            flexDirection: "row",

                                            alignItems: "center",

                                            justifyContent: "center",

                                            gap: 7,

                                            opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
                                        })}
                                    >
                                        {cambiando ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={textSecondaryColor}
                                            />
                                        ) : (
                                            <Ionicons
                                                name={
                                                    subescala.estado ? "eye-off-outline" : "eye-outline"
                                                }
                                                size={17}
                                                color={textSecondaryColor}
                                            />
                                        )}

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 12,

                                                color: textSecondaryColor,
                                            }}
                                        >
                                            {cambiando
                                                ? "Actualizando..."
                                                : subescala.estado
                                                    ? "Desactivar"
                                                    : "Activar"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
