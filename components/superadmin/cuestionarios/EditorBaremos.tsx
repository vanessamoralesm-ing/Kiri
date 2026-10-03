import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
    actualizarBaremoAdmin,
    cambiarEstadoBaremoAdmin,
    crearBaremoAdmin,
    crearRangoBaremoAdmin,
    normalizarCodigoTest,
    obtenerBaremosAdmin,
    obtenerRangosBaremoAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import type {
    BaremoTest,
    RangoBaremo,
    SubescalaTest,
    TipoValorBaremo,
} from "@/types/cuestionarios";

// ==========================================================
// TIPOS
// ==========================================================

interface Props {
    idTest: string;
    subescalas?: SubescalaTest[];
    disabled?: boolean;
}

interface FormularioBaremo {
    codigo: string;
    nombre: string;
    descripcion: string;
    poblacion: string;
    sexoAplicable: string;
    edadMinima: string;
    edadMaxima: string;
    tipoValor: TipoValorBaremo;
    version: string;
    fuente: string;
}

interface FormularioRango {
    idSubescala: string | null;
    nivel: string;
    valorMinimo: string;
    valorMaximo: string;
    interpretacion: string;
    orden: string;
}

interface CampoProps {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholderText?: string;
    numeric?: boolean;
    multiline?: boolean;
    disabled?: boolean;
    guardando?: boolean;
}

// ==========================================================
// CONSTANTES
// ==========================================================

const TIPOS_VALOR: {
    value: TipoValorBaremo;
    label: string;
}[] = [
        { value: "puntaje_directo", label: "Puntaje directo" },
        { value: "puntaje_total", label: "Puntaje total" },
        { value: "percentil", label: "Percentil" },
        { value: "puntaje_t", label: "Puntaje T" },
        { value: "eneatipo", label: "Eneatipo" },
    ];

const BAREMO_INICIAL: FormularioBaremo = {
    codigo: "",
    nombre: "",
    descripcion: "",
    poblacion: "",
    sexoAplicable: "",
    edadMinima: "",
    edadMaxima: "",
    tipoValor: "puntaje_total",
    version: "",
    fuente: "",
};

const RANGO_INICIAL: FormularioRango = {
    idSubescala: null,
    nivel: "",
    valorMinimo: "",
    valorMaximo: "",
    interpretacion: "",
    orden: "1",
};

// ==========================================================
// UTILIDADES
// ==========================================================

function errorTexto(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }

    if (err && typeof err === "object") {
        const error = err as {
            message?: string;
            code?: string;
            details?: string;
            hint?: string;
        };

        return (
            [
                error.message,
                error.code ? `Código: ${error.code}` : null,
                error.details,
                error.hint,
            ]
                .filter(Boolean)
                .join("\n") || "Ocurrió un error."
        );
    }

    return typeof err === "string" ? err : "Ocurrió un error.";
}

function opcional(texto: string): string | null {
    return texto.trim() || null;
}

function numeroOpcional(texto: string): number | null {
    return texto.trim() ? Number(texto) : null;
}

// ==========================================================
// CAMPO DE TEXTO
// Declarado fuera del componente principal para evitar
// perder el foco al actualizar los formularios.
// ==========================================================

const Campo = memo(function Campo({
    label,
    value,
    onChangeText,
    placeholderText = "",
    numeric = false,
    multiline = false,
    disabled = false,
    guardando = false,
}: CampoProps) {
    const text = useThemeColor({}, "text");
    const inputBackground = useThemeColor({}, "inputBackground");
    const inputBorder = useThemeColor({}, "inputBorder");
    const placeholder = useThemeColor({}, "placeholder");

    return (
        <View
            style={{
                flex: 1,
                minWidth: 0,
                gap: 7,
            }}
        >
            <Text
                style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 13,
                    color: text,
                }}
            >
                {label}
            </Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholderText}
                placeholderTextColor={placeholder}
                keyboardType={numeric ? "decimal-pad" : "default"}
                editable={!disabled && !guardando}
                multiline={multiline}
                scrollEnabled={false}
                textAlignVertical={multiline ? "top" : "center"}
                style={{
                    minHeight: multiline ? 90 : 48,
                    paddingHorizontal: 14,
                    paddingVertical: multiline ? 12 : 8,
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: 12,
                    backgroundColor: inputBackground,
                    color: text,
                    fontFamily: "Nunito-Medium",
                    fontSize: 14,
                }}
            />
        </View>
    );
});

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function EditorBaremos({
    idTest,
    subescalas = [],
    disabled = false,
}: Props) {
    const { width } = useWindowDimensions();
    const esTelefono = width < 768;

    // ========================================================
    // TEMA
    // ========================================================

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

    // ========================================================
    // ESTADOS
    // ========================================================

    const [baremos, setBaremos] = useState<BaremoTest[]>([]);
    const [rangos, setRangos] = useState<RangoBaremo[]>([]);

    const [baremoSeleccionado, setBaremoSeleccionado] = useState<string | null>(
        null,
    );

    const [cargando, setCargando] = useState(true);
    const [cargandoRangos, setCargandoRangos] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);

    const [formulario, setFormulario] = useState<FormularioBaremo>({
        ...BAREMO_INICIAL,
    });

    const [mostrarRango, setMostrarRango] = useState(false);

    const [formularioRango, setFormularioRango] = useState<FormularioRango>({
        ...RANGO_INICIAL,
    });

    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    // ========================================================
    // CARGA DE BAREMOS
    // ========================================================

    const cargarBaremos = useCallback(async () => {
        if (!idTest) {
            setBaremos([]);
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            setError(null);

            const datos = await obtenerBaremosAdmin(idTest);

            setBaremos(datos);
        } catch (err) {
            console.error("Error cargando baremos:", err);
            setError(errorTexto(err));
        } finally {
            setCargando(false);
        }
    }, [idTest]);

    // ========================================================
    // CARGA DE RANGOS
    // ========================================================

    const cargarRangos = useCallback(async (idBaremo: string) => {
        try {
            setCargandoRangos(true);

            const datos = await obtenerRangosBaremoAdmin(idBaremo);

            setRangos(datos);
        } catch (err) {
            console.error("Error cargando rangos:", err);
            setError(errorTexto(err));
        } finally {
            setCargandoRangos(false);
        }
    }, []);

    useEffect(() => {
        void cargarBaremos();
    }, [cargarBaremos]);

    useEffect(() => {
        if (baremoSeleccionado) {
            void cargarRangos(baremoSeleccionado);
        } else {
            setRangos([]);
            setMostrarRango(false);
        }
    }, [baremoSeleccionado, cargarRangos]);

    const seleccionado =
        baremos.find((baremo) => baremo.id_baremo === baremoSeleccionado) ?? null;

    // ========================================================
    // FORMULARIO DE BAREMO
    // ========================================================

    function actualizar<K extends keyof FormularioBaremo>(
        campo: K,
        valor: FormularioBaremo[K],
    ) {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));

        setError(null);
        setMensaje(null);
    }

    function nuevoBaremo() {
        setEditandoId(null);
        setFormulario({ ...BAREMO_INICIAL });
        setMostrarFormulario(true);
        setError(null);
        setMensaje(null);
    }

    function editarBaremo(baremo: BaremoTest) {
        setEditandoId(baremo.id_baremo);

        setFormulario({
            codigo: baremo.codigo,
            nombre: baremo.nombre,
            descripcion: baremo.descripcion ?? "",
            poblacion: baremo.poblacion ?? "",
            sexoAplicable: baremo.sexo_aplicable ?? "",
            edadMinima: baremo.edad_minima == null ? "" : String(baremo.edad_minima),
            edadMaxima: baremo.edad_maxima == null ? "" : String(baremo.edad_maxima),
            tipoValor: baremo.tipo_valor,
            version: baremo.version ?? "",
            fuente: baremo.fuente ?? "",
        });

        setMostrarFormulario(true);
        setError(null);
        setMensaje(null);
    }

    // ========================================================
    // VALIDACIÓN DEL BAREMO
    // ========================================================

    function validarBaremo(): string | null {
        if (!formulario.codigo.trim()) {
            return "Ingresa el código.";
        }

        if (!formulario.nombre.trim()) {
            return "Ingresa el nombre.";
        }

        const edadMin = numeroOpcional(formulario.edadMinima);
        const edadMax = numeroOpcional(formulario.edadMaxima);

        if (
            (edadMin !== null && (!Number.isInteger(edadMin) || edadMin < 0)) ||
            (edadMax !== null && (!Number.isInteger(edadMax) || edadMax < 0))
        ) {
            return "Las edades deben ser números enteros no negativos.";
        }

        if (edadMin !== null && edadMax !== null && edadMin > edadMax) {
            return "La edad mínima no puede superar la edad máxima.";
        }

        const codigo = normalizarCodigoTest(formulario.codigo);

        if (
            baremos.some(
                (baremo) => baremo.id_baremo !== editandoId && baremo.codigo === codigo,
            )
        ) {
            return "Ya existe un baremo con ese código.";
        }

        return null;
    }

    // ========================================================
    // GUARDAR BAREMO
    // ========================================================

    async function guardarBaremo() {
        if (disabled || guardando) return;

        const validacion = validarBaremo();

        if (validacion) {
            setError(validacion);
            return;
        }

        try {
            setGuardando(true);
            setError(null);
            setMensaje(null);

            const datos = {
                codigo: normalizarCodigoTest(formulario.codigo),
                nombre: formulario.nombre.trim(),
                descripcion: opcional(formulario.descripcion),
                poblacion: opcional(formulario.poblacion),
                sexo_aplicable: opcional(formulario.sexoAplicable),
                edad_minima: numeroOpcional(formulario.edadMinima),
                edad_maxima: numeroOpcional(formulario.edadMaxima),
                tipo_valor: formulario.tipoValor,
                version: opcional(formulario.version),
                fuente: opcional(formulario.fuente),
            };

            let idGuardado = editandoId;

            if (editandoId) {
                await actualizarBaremoAdmin(editandoId, datos);
            } else {
                const nuevo = await crearBaremoAdmin({
                    ...datos,
                    id_test: idTest,
                    estado: true,
                });

                idGuardado = nuevo.id_baremo;
            }

            await cargarBaremos();

            if (idGuardado) {
                setBaremoSeleccionado(idGuardado);
            }

            setMostrarFormulario(false);
            setMensaje("Baremo guardado correctamente.");
        } catch (err) {
            console.error("Error guardando baremo:", err);
            setError(errorTexto(err));
        } finally {
            setGuardando(false);
        }
    }

    // ========================================================
    // ACTIVAR / DESACTIVAR BAREMO
    // ========================================================

    async function cambiarEstado(baremo: BaremoTest) {
        if (disabled || guardando) return;

        try {
            setGuardando(true);
            setError(null);
            setMensaje(null);

            await cambiarEstadoBaremoAdmin(baremo.id_baremo, !baremo.estado);

            await cargarBaremos();

            setMensaje(
                baremo.estado
                    ? "Baremo desactivado correctamente."
                    : "Baremo activado correctamente.",
            );
        } catch (err) {
            console.error("Error cambiando estado del baremo:", err);
            setError(errorTexto(err));
        } finally {
            setGuardando(false);
        }
    }

    // ========================================================
    // FORMULARIO DE RANGOS
    // ========================================================

    function actualizarRango<K extends keyof FormularioRango>(
        campo: K,
        valor: FormularioRango[K],
    ) {
        setFormularioRango((actual) => ({
            ...actual,
            [campo]: valor,
        }));

        setError(null);
        setMensaje(null);
    }

    function nuevoRango() {
        const orden =
            rangos.reduce((max, rango) => Math.max(max, rango.orden), 0) + 1;

        setFormularioRango({
            ...RANGO_INICIAL,
            orden: String(orden),
        });

        setMostrarRango(true);
        setError(null);
        setMensaje(null);
    }

    // ========================================================
    // GUARDAR RANGO
    // ========================================================

    async function guardarRango() {
        if (disabled || guardando || !baremoSeleccionado) {
            return;
        }

        const minimo = Number(formularioRango.valorMinimo);
        const maximo = Number(formularioRango.valorMaximo);
        const orden = Number(formularioRango.orden);

        if (!formularioRango.nivel.trim()) {
            setError("Ingresa el nivel de interpretación.");
            return;
        }

        if (
            !formularioRango.valorMinimo.trim() ||
            !formularioRango.valorMaximo.trim() ||
            !Number.isFinite(minimo) ||
            !Number.isFinite(maximo)
        ) {
            setError("Ingresa valores mínimo y máximo válidos.");
            return;
        }

        if (minimo > maximo) {
            setError("El valor mínimo no puede superar al máximo.");
            return;
        }

        if (!Number.isInteger(orden) || orden < 1) {
            setError("El orden debe ser un entero mayor que cero.");
            return;
        }

        try {
            setGuardando(true);
            setError(null);
            setMensaje(null);

            await crearRangoBaremoAdmin({
                id_baremo: baremoSeleccionado,
                id_subescala: formularioRango.idSubescala,
                nivel: formularioRango.nivel.trim(),
                valor_minimo: minimo,
                valor_maximo: maximo,
                interpretacion: opcional(formularioRango.interpretacion),
                orden,
                estado: true,
            });

            await cargarRangos(baremoSeleccionado);

            setMostrarRango(false);
            setMensaje("Rango registrado correctamente.");
        } catch (err) {
            console.error("Error guardando rango:", err);
            setError(errorTexto(err));
        } finally {
            setGuardando(false);
        }
    }

    // ========================================================
    // PROPIEDADES COMUNES DE LOS CAMPOS
    // ========================================================

    const propiedadesCampo = {
        disabled,
        guardando,
    };

    // ========================================================
    // INTERFAZ
    // ========================================================

    return (
        <View
            style={{
                width: "100%",
                gap: 18,
            }}
        >
            {/* ENCABEZADO */}

            <View
                style={{
                    flexDirection: esTelefono ? "column" : "row",
                    alignItems: esTelefono ? "stretch" : "center",
                    gap: 12,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 21,
                            color: text,
                        }}
                    >
                        Baremos
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            color: secondary,
                        }}
                    >
                        Configura los criterios de interpretación del test.
                    </Text>
                </View>

                {!mostrarFormulario && (
                    <Pressable
                        disabled={disabled || guardando}
                        onPress={nuevoBaremo}
                        style={{
                            minHeight: 46,
                            paddingHorizontal: 18,
                            borderRadius: 12,
                            backgroundColor: primary,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            opacity: disabled || guardando ? 0.5 : 1,
                        }}
                    >
                        <Ionicons name="add" size={19} color={onPrimary} />

                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                color: onPrimary,
                            }}
                        >
                            Nuevo baremo
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* FORMULARIO DE BAREMO */}

            {mostrarFormulario && (
                <View
                    style={{
                        padding: esTelefono ? 16 : 22,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 17,
                        backgroundColor: surface,
                        gap: 15,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 17,
                            color: text,
                        }}
                    >
                        {editandoId ? "Editar baremo" : "Registrar baremo"}
                    </Text>

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",
                            gap: 12,
                        }}
                    >
                        <Campo
                            {...propiedadesCampo}
                            label="Código *"
                            value={formulario.codigo}
                            onChangeText={(valor) => actualizar("codigo", valor)}
                            placeholderText="Ej.: BAREMO-GENERAL"
                        />

                        <Campo
                            {...propiedadesCampo}
                            label="Nombre *"
                            value={formulario.nombre}
                            onChangeText={(valor) => actualizar("nombre", valor)}
                            placeholderText="Baremo general"
                        />
                    </View>

                    <Campo
                        {...propiedadesCampo}
                        label="Descripción"
                        value={formulario.descripcion}
                        onChangeText={(valor) => actualizar("descripcion", valor)}
                        multiline
                    />

                    <Campo
                        {...propiedadesCampo}
                        label="Población"
                        value={formulario.poblacion}
                        onChangeText={(valor) => actualizar("poblacion", valor)}
                        placeholderText="Ej.: Adultos"
                    />

                    <Campo
                        {...propiedadesCampo}
                        label="Sexo aplicable"
                        value={formulario.sexoAplicable}
                        onChangeText={(valor) => actualizar("sexoAplicable", valor)}
                        placeholderText="Ej.: Todos"
                    />

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",
                            gap: 12,
                        }}
                    >
                        <Campo
                            {...propiedadesCampo}
                            label="Edad mínima"
                            value={formulario.edadMinima}
                            numeric
                            onChangeText={(valor) =>
                                actualizar("edadMinima", valor.replace(/\D/g, ""))
                            }
                        />

                        <Campo
                            {...propiedadesCampo}
                            label="Edad máxima"
                            value={formulario.edadMaxima}
                            numeric
                            onChangeText={(valor) =>
                                actualizar("edadMaxima", valor.replace(/\D/g, ""))
                            }
                        />
                    </View>

                    {/* TIPO DE VALOR */}

                    <View style={{ gap: 9 }}>
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                color: text,
                            }}
                        >
                            Tipo de valor
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 8,
                            }}
                        >
                            {TIPOS_VALOR.map((tipo) => {
                                const activo = formulario.tipoValor === tipo.value;

                                return (
                                    <Pressable
                                        key={tipo.value}
                                        disabled={disabled || guardando}
                                        onPress={() => actualizar("tipoValor", tipo.value)}
                                        style={{
                                            paddingHorizontal: 13,
                                            paddingVertical: 11,
                                            borderRadius: 11,
                                            borderWidth: 1,
                                            borderColor: activo ? primary : border,
                                            backgroundColor: activo ? primarySoft : surfaceSecondary,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: activo ? primary : secondary,
                                                fontFamily: "Nunito-SemiBold",
                                                fontSize: 12,
                                            }}
                                        >
                                            {tipo.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",
                            gap: 12,
                        }}
                    >
                        <Campo
                            {...propiedadesCampo}
                            label="Versión"
                            value={formulario.version}
                            onChangeText={(valor) => actualizar("version", valor)}
                        />

                        <Campo
                            {...propiedadesCampo}
                            label="Fuente"
                            value={formulario.fuente}
                            onChangeText={(valor) => actualizar("fuente", valor)}
                        />
                    </View>

                    {!!error && (
                        <Text
                            style={{
                                color: danger,
                                fontSize: 12,
                            }}
                        >
                            {error}
                        </Text>
                    )}

                    {/* ACCIONES DEL BAREMO */}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column-reverse" : "row",
                            justifyContent: "flex-end",
                            gap: 10,
                        }}
                    >
                        <Pressable
                            disabled={guardando}
                            onPress={() => {
                                setMostrarFormulario(false);
                                setError(null);
                            }}
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
                            onPress={guardarBaremo}
                            style={{
                                minHeight: 46,
                                paddingHorizontal: 18,
                                borderRadius: 12,
                                backgroundColor: primary,
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: guardando || disabled ? 0.5 : 1,
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
                                    Guardar baremo
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            )}

            {/* MENSAJES */}

            {!!mensaje && (
                <Text
                    style={{
                        color: success,
                        fontSize: 12,
                    }}
                >
                    {mensaje}
                </Text>
            )}

            {!mostrarFormulario && !!error && (
                <Text
                    style={{
                        color: danger,
                        fontSize: 12,
                    }}
                >
                    {error}
                </Text>
            )}

            {/* LISTADO DE BAREMOS */}

            {cargando ? (
                <ActivityIndicator color={primary} />
            ) : baremos.length === 0 ? (
                <View
                    style={{
                        padding: 28,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 16,
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Ionicons name="analytics-outline" size={38} color={primary} />

                    <Text
                        style={{
                            color: secondary,
                            textAlign: "center",
                        }}
                    >
                        Aún no se han configurado baremos.
                    </Text>
                </View>
            ) : (
                <View style={{ gap: 10 }}>
                    {baremos.map((baremo) => {
                        const activo = baremoSeleccionado === baremo.id_baremo;

                        return (
                            <View
                                key={baremo.id_baremo}
                                style={{
                                    padding: 15,
                                    borderWidth: 1,
                                    borderColor: activo ? primary : border,
                                    borderRadius: 15,
                                    backgroundColor: surface,
                                    gap: 12,
                                }}
                            >
                                <Pressable
                                    onPress={() =>
                                        setBaremoSeleccionado(activo ? null : baremo.id_baremo)
                                    }
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
                                                flex: 1,
                                                minWidth: 0,
                                                gap: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Bold",
                                                    fontSize: 15,
                                                    color: text,
                                                }}
                                            >
                                                {baremo.nombre}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: secondary,
                                                }}
                                            >
                                                {baremo.codigo}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: secondary,
                                                }}
                                            >
                                                {baremo.tipo_valor.replace(/_/g, " ")}
                                            </Text>
                                        </View>

                                        <Ionicons
                                            name={activo ? "chevron-up" : "chevron-down"}
                                            size={22}
                                            color={primary}
                                        />
                                    </View>
                                </Pressable>

                                <View
                                    style={{
                                        flexDirection: esTelefono ? "column" : "row",
                                        gap: 9,
                                    }}
                                >
                                    <Pressable
                                        disabled={disabled || guardando}
                                        onPress={() => editarBaremo(baremo)}
                                        style={{
                                            flex: esTelefono ? undefined : 1,
                                            minHeight: 42,
                                            borderRadius: 11,
                                            backgroundColor: primarySoft,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",
                                                color: primary,
                                            }}
                                        >
                                            Editar
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        disabled={disabled || guardando}
                                        onPress={() => cambiarEstado(baremo)}
                                        style={{
                                            flex: esTelefono ? undefined : 1,
                                            minHeight: 42,
                                            borderWidth: 1,
                                            borderColor: border,
                                            borderRadius: 11,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: secondary,
                                            }}
                                        >
                                            {baremo.estado ? "Desactivar" : "Activar"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* RANGOS DEL BAREMO SELECCIONADO */}

            {seleccionado && (
                <View
                    style={{
                        padding: esTelefono ? 15 : 20,
                        borderWidth: 1,
                        borderColor: border,
                        borderRadius: 17,
                        backgroundColor: surface,
                        gap: 14,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 17,
                            color: text,
                        }}
                    >
                        Rangos: {seleccionado.nombre}
                    </Text>

                    {!mostrarRango && (
                        <Pressable
                            disabled={disabled || guardando}
                            onPress={nuevoRango}
                            style={{
                                minHeight: 45,
                                borderRadius: 11,
                                backgroundColor: primarySoft,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <Ionicons name="add" size={18} color={primary} />

                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    color: primary,
                                }}
                            >
                                Agregar rango
                            </Text>
                        </Pressable>
                    )}

                    {/* FORMULARIO DE RANGO */}

                    {mostrarRango && (
                        <View
                            style={{
                                gap: 13,
                            }}
                        >
                            <Campo
                                {...propiedadesCampo}
                                label="Nivel *"
                                value={formularioRango.nivel}
                                onChangeText={(valor) => actualizarRango("nivel", valor)}
                                placeholderText="Ej.: Bajo, moderado, alto"
                            />

                            <View
                                style={{
                                    flexDirection: esTelefono ? "column" : "row",
                                    gap: 12,
                                }}
                            >
                                <Campo
                                    {...propiedadesCampo}
                                    label="Valor mínimo *"
                                    numeric
                                    value={formularioRango.valorMinimo}
                                    onChangeText={(valor) =>
                                        actualizarRango("valorMinimo", valor)
                                    }
                                />

                                <Campo
                                    {...propiedadesCampo}
                                    label="Valor máximo *"
                                    numeric
                                    value={formularioRango.valorMaximo}
                                    onChangeText={(valor) =>
                                        actualizarRango("valorMaximo", valor)
                                    }
                                />
                            </View>

                            <Campo
                                {...propiedadesCampo}
                                label="Interpretación"
                                value={formularioRango.interpretacion}
                                onChangeText={(valor) =>
                                    actualizarRango("interpretacion", valor)
                                }
                                multiline
                            />

                            <Campo
                                {...propiedadesCampo}
                                label="Orden *"
                                value={formularioRango.orden}
                                numeric
                                onChangeText={(valor) =>
                                    actualizarRango("orden", valor.replace(/\D/g, ""))
                                }
                            />

                            {/* SELECCIÓN DE SUBESCALA */}

                            {subescalas.length > 0 && (
                                <View
                                    style={{
                                        gap: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: text,
                                            fontSize: 13,
                                        }}
                                    >
                                        Subescala
                                    </Text>

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: 8,
                                            }}
                                        >
                                            {[
                                                {
                                                    id_subescala: null,
                                                    nombre: "Puntaje general",
                                                },
                                                ...subescalas
                                                    .filter((s) => s.estado)
                                                    .map((s) => ({
                                                        id_subescala: s.id_subescala,
                                                        nombre: s.nombre,
                                                    })),
                                            ].map((item) => {
                                                const activo =
                                                    formularioRango.idSubescala === item.id_subescala;

                                                return (
                                                    <Pressable
                                                        key={item.id_subescala ?? "general"}
                                                        disabled={disabled || guardando}
                                                        onPress={() =>
                                                            actualizarRango("idSubescala", item.id_subescala)
                                                        }
                                                        style={{
                                                            padding: 11,
                                                            borderWidth: 1,
                                                            borderColor: activo ? primary : border,
                                                            borderRadius: 10,
                                                            backgroundColor: activo
                                                                ? primarySoft
                                                                : surfaceSecondary,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: activo ? primary : secondary,
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            {item.nombre}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })}
                                        </View>
                                    </ScrollView>
                                </View>
                            )}

                            {!!error && (
                                <Text
                                    style={{
                                        color: danger,
                                        fontSize: 12,
                                    }}
                                >
                                    {error}
                                </Text>
                            )}

                            {/* ACCIONES DEL RANGO */}

                            <View
                                style={{
                                    flexDirection: esTelefono ? "column-reverse" : "row",
                                    justifyContent: "flex-end",
                                    gap: 10,
                                }}
                            >
                                <Pressable
                                    disabled={guardando}
                                    onPress={() => {
                                        setMostrarRango(false);
                                        setError(null);
                                    }}
                                    style={{
                                        padding: 13,
                                        borderWidth: 1,
                                        borderColor: border,
                                        borderRadius: 11,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: text,
                                        }}
                                    >
                                        Cancelar
                                    </Text>
                                </Pressable>

                                <Pressable
                                    disabled={guardando || disabled}
                                    onPress={guardarRango}
                                    style={{
                                        padding: 13,
                                        borderRadius: 11,
                                        backgroundColor: primary,
                                        alignItems: "center",
                                        opacity: guardando || disabled ? 0.5 : 1,
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
                                            Guardar rango
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {/* LISTADO DE RANGOS */}

                    {cargandoRangos ? (
                        <ActivityIndicator color={primary} />
                    ) : (
                        rangos.map((rango) => (
                            <View
                                key={rango.id_rango}
                                style={{
                                    padding: 13,
                                    borderRadius: 12,
                                    backgroundColor: surfaceSecondary,
                                    gap: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        color: text,
                                    }}
                                >
                                    {rango.nivel}
                                </Text>

                                <Text
                                    style={{
                                        color: primary,
                                        fontSize: 12,
                                    }}
                                >
                                    {rango.valor_minimo} – {rango.valor_maximo}
                                </Text>

                                {!!rango.interpretacion && (
                                    <Text
                                        style={{
                                            color: secondary,
                                            fontSize: 12,
                                            lineHeight: 18,
                                        }}
                                    >
                                        {rango.interpretacion}
                                    </Text>
                                )}
                            </View>
                        ))
                    )}
                </View>
            )}
        </View>
    );
}
