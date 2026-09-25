import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
    crearOpcionAdmin,
    crearPreguntaAdmin,
    obtenerPreguntasAdmin,
    type PreguntaAdmin,
} from "@/services/superadmin/cuestionarioAdmin.service";

import type { SubescalaTest, TipoPregunta } from "@/types/cuestionarios";

// ==========================================================
// TIPOS
// ==========================================================

interface EditorPreguntasProps {
    idTest: string;

    tieneSubescalas?: boolean;

    subescalas?: SubescalaTest[];

    disabled?: boolean;

    onCambio?: (preguntas: PreguntaAdmin[]) => void;
}

interface OpcionBorrador {
    idTemporal: string;

    codigo: string;

    etiqueta: string;

    valorPuntaje: string;
}

interface PreguntaBorrador {
    codigo: string;

    enunciado: string;

    descripcionApoyo: string;

    tipoPregunta: TipoPregunta;

    idSubescala: string | null;

    obligatoria: boolean;

    puntua: boolean;

    esObservacional: boolean;

    permiteComentario: boolean;

    opciones: OpcionBorrador[];
}

// ==========================================================
// CONSTANTES
// ==========================================================

const TIPOS_PREGUNTA: {
    valor: TipoPregunta;
    label: string;
    descripcion: string;
    icono: keyof typeof Ionicons.glyphMap;
}[] = [
        {
            valor: "opcion_unica",
            label: "Opción única",
            descripcion: "El usuario selecciona una sola respuesta.",
            icono: "radio-button-on-outline",
        },
        {
            valor: "opcion_multiple",
            label: "Opción múltiple",
            descripcion: "Permite seleccionar varias respuestas.",
            icono: "checkbox-outline",
        },
        {
            valor: "escala",
            label: "Escala",
            descripcion: "Respuesta mediante una escala de valores.",
            icono: "options-outline",
        },
        {
            valor: "numero",
            label: "Número",
            descripcion: "El usuario introduce un valor numérico.",
            icono: "calculator-outline",
        },
        {
            valor: "texto",
            label: "Texto",
            descripcion: "Respuesta abierta escrita por el usuario.",
            icono: "text-outline",
        },
    ];

const PREGUNTA_INICIAL: PreguntaBorrador = {
    codigo: "",

    enunciado: "",

    descripcionApoyo: "",

    tipoPregunta: "opcion_unica",

    idSubescala: null,

    obligatoria: true,

    puntua: true,

    esObservacional: false,

    permiteComentario: false,

    opciones: [],
};

// ==========================================================
// UTILIDADES
// ==========================================================

function crearIdTemporal(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function crearOpcionVacia(numero: number): OpcionBorrador {
    return {
        idTemporal: crearIdTemporal(),

        codigo: `OP-${numero}`,

        etiqueta: "",

        valorPuntaje: "",
    };
}

function requiereOpciones(tipoPregunta: TipoPregunta): boolean {
    return (
        tipoPregunta === "opcion_unica" ||
        tipoPregunta === "opcion_multiple" ||
        tipoPregunta === "escala"
    );
}

// ==========================================================
// CAMPOS ESTABLES (FUERA DEL EDITOR PARA CONSERVAR EL FOCO)
// ==========================================================

interface CampoTextoProps {
    label: string;
    valor: string;
    placeholder: string;
    multiline?: boolean;
    obligatorio?: boolean;
    editable?: boolean;
    onChangeText: (valor: string) => void;
}

function CampoTexto({
    label,
    valor,
    placeholder,
    multiline = false,
    obligatorio = false,
    editable = true,
    onChangeText,
}: CampoTextoProps) {
    const textColor = useThemeColor({}, "text");
    const placeholderColor = useThemeColor({}, "placeholder");
    const inputBorder = useThemeColor({}, "inputBorder");
    const inputBackground = useThemeColor({}, "inputBackground");

    return (
        <View style={{ width: "100%", gap: 8 }}>
            <Text
                style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 13,
                    color: textColor,
                }}
            >
                {label}
                {obligatorio ? " *" : ""}
            </Text>
            <TextInput
                value={valor}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                editable={editable}
                multiline={multiline}
                scrollEnabled={false}
                textAlignVertical={multiline ? "top" : "center"}
                style={{
                    width: "100%",
                    minHeight: multiline ? 96 : 50,
                    paddingHorizontal: 14,
                    paddingVertical: multiline ? 13 : 9,
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: 12,
                    backgroundColor: inputBackground,
                    fontFamily: "Nunito-Medium",
                    fontSize: 14,
                    color: textColor,
                }}
            />
        </View>
    );
}

interface OpcionSwitchProps {
    titulo: string;
    descripcion: string;
    valor: boolean;
    onChange: (valor: boolean) => void;
    esTelefono: boolean;
    disabled?: boolean;
}

function OpcionSwitch({
    titulo,
    descripcion,
    valor,
    onChange,
    esTelefono,
    disabled = false,
}: OpcionSwitchProps) {
    const borderColor = useThemeColor({}, "border");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const inputBorder = useThemeColor({}, "inputBorder");
    const primaryColor = useThemeColor({}, "primary");

    return (
        <View
            style={{
                flex: 1,
                minWidth: esTelefono ? "100%" : 230,
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
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 13,
                        color: textColor,
                    }}
                >
                    {titulo}
                </Text>
                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 11,
                        lineHeight: 16,
                        color: textSecondaryColor,
                    }}
                >
                    {descripcion}
                </Text>
            </View>
            <Switch
                value={valor}
                onValueChange={onChange}
                disabled={disabled}
                trackColor={{ false: inputBorder, true: primaryColor }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EditorPreguntas({
    idTest,
    tieneSubescalas = false,
    subescalas = [],
    disabled = false,
    onCambio,
}: EditorPreguntasProps) {
    // ======================================================
    // RESPONSIVE
    // ======================================================

    const { width } = useWindowDimensions();

    const esTelefono = width < 768;

    const esEscritorio = width >= 1100;

    // ======================================================
    // TEMA
    // ======================================================

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const backgroundColor = useThemeColor({}, "background");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const inputBackground = useThemeColor({}, "inputBackground");

    const inputBorder = useThemeColor({}, "inputBorder");

    const placeholderColor = useThemeColor({}, "placeholder");

    const borderColor = useThemeColor({}, "border");

    const dangerColor = useThemeColor({}, "danger");

    const successColor = useThemeColor({}, "success");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    // ======================================================
    // ESTADOS
    // ======================================================

    const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>([]);

    const [formulario, setFormulario] = useState<PreguntaBorrador>({
        ...PREGUNTA_INICIAL,
    });

    const [cargando, setCargando] = useState(true);

    const [guardando, setGuardando] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // ======================================================
    // CARGA
    // ======================================================

    const cargarPreguntas = useCallback(async () => {
        if (!idTest) {
            return;
        }

        try {
            setCargando(true);

            setError(null);

            const resultado = await obtenerPreguntasAdmin(idTest);

            setPreguntas(resultado);

            onCambio?.(resultado);
        } catch (err) {
            console.error("Error cargando preguntas:", err);

            setError("No fue posible cargar las preguntas.");
        } finally {
            setCargando(false);
        }
    }, [idTest, onCambio]);

    useEffect(() => {
        void cargarPreguntas();
    }, [cargarPreguntas]);

    // ======================================================
    // INFORMACIÓN DERIVADA
    // ======================================================

    const siguienteOrden = preguntas.length + 1;

    const tipoActual = useMemo(
        () => TIPOS_PREGUNTA.find((tipo) => tipo.valor === formulario.tipoPregunta),
        [formulario.tipoPregunta],
    );

    const necesitaOpciones = requiereOpciones(formulario.tipoPregunta);

    // ======================================================
    // FORMULARIO
    // ======================================================

    function actualizarFormulario<K extends keyof PreguntaBorrador>(
        campo: K,
        valor: PreguntaBorrador[K],
    ) {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    }

    function seleccionarTipo(tipo: TipoPregunta) {
        setFormulario((actual) => {
            const debeTenerOpciones = requiereOpciones(tipo);

            let nuevasOpciones = actual.opciones;

            if (debeTenerOpciones && nuevasOpciones.length === 0) {
                nuevasOpciones = [crearOpcionVacia(1), crearOpcionVacia(2)];
            }

            if (!debeTenerOpciones) {
                nuevasOpciones = [];
            }

            return {
                ...actual,

                tipoPregunta: tipo,

                opciones: nuevasOpciones,

                puntua: tipo === "texto" ? false : actual.puntua,
            };
        });
    }

    function agregarOpcion() {
        setFormulario((actual) => ({
            ...actual,

            opciones: [
                ...actual.opciones,

                crearOpcionVacia(actual.opciones.length + 1),
            ],
        }));
    }

    function actualizarOpcion(
        idTemporal: string,
        campo: "codigo" | "etiqueta" | "valorPuntaje",
        valor: string,
    ) {
        setFormulario((actual) => ({
            ...actual,

            opciones: actual.opciones.map((opcion) =>
                opcion.idTemporal === idTemporal
                    ? {
                        ...opcion,
                        [campo]: valor,
                    }
                    : opcion,
            ),
        }));
    }

    function eliminarOpcion(idTemporal: string) {
        setFormulario((actual) => ({
            ...actual,

            opciones: actual.opciones.filter(
                (opcion) => opcion.idTemporal !== idTemporal,
            ),
        }));
    }

    // ======================================================
    // NUEVA PREGUNTA
    // ======================================================

    function abrirNuevaPregunta() {
        setFormulario({
            ...PREGUNTA_INICIAL,

            codigo: `P-${String(siguienteOrden).padStart(2, "0")}`,

            opciones: [crearOpcionVacia(1), crearOpcionVacia(2)],
        });

        setError(null);

        setMostrarFormulario(true);
    }

    function cancelarPregunta() {
        if (guardando) {
            return;
        }

        setFormulario({
            ...PREGUNTA_INICIAL,
        });

        setError(null);

        setMostrarFormulario(false);
    }

    // ======================================================
    // VALIDACIÓN
    // ======================================================

    function validarFormulario(): string | null {
        if (!formulario.codigo.trim()) {
            return "Debes ingresar el código de la pregunta.";
        }

        if (!formulario.enunciado.trim()) {
            return "Debes ingresar el enunciado de la pregunta.";
        }

        if (tieneSubescalas && !formulario.idSubescala) {
            return "Debes seleccionar una subescala.";
        }

        if (necesitaOpciones) {
            if (formulario.opciones.length < 2) {
                return "La pregunta debe contener al menos dos opciones.";
            }

            for (let i = 0; i < formulario.opciones.length; i++) {
                const opcion = formulario.opciones[i];

                if (!opcion.codigo.trim()) {
                    return `La opción ${i + 1} debe tener un código.`;
                }

                if (!opcion.etiqueta.trim()) {
                    return `La opción ${i + 1} debe tener una etiqueta.`;
                }

                if (formulario.puntua && opcion.valorPuntaje.trim() === "") {
                    return `La opción ${i + 1} debe tener un puntaje.`;
                }

                if (formulario.puntua && Number.isNaN(Number(opcion.valorPuntaje))) {
                    return `El puntaje de la opción ${i + 1} debe ser numérico.`;
                }
            }
        }

        return null;
    }

    // ======================================================
    // GUARDAR
    // ======================================================

    async function guardarPregunta() {
        if (guardando || disabled) {
            return;
        }

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);

            return;
        }

        try {
            setGuardando(true);

            setError(null);

            const preguntaCreada = await crearPreguntaAdmin({
                id_test: idTest,

                id_subescala: tieneSubescalas ? formulario.idSubescala : null,

                codigo: formulario.codigo,

                enunciado: formulario.enunciado,

                descripcion_apoyo: formulario.descripcionApoyo.trim() || null,

                tipo_pregunta: formulario.tipoPregunta,

                orden: siguienteOrden,

                obligatoria: formulario.obligatoria,

                puntua: formulario.puntua,

                es_observacional: formulario.esObservacional,

                permite_comentario: formulario.permiteComentario,

                estado: true,
            });

            // ==============================================
            // OPCIONES
            // ==============================================

            if (necesitaOpciones) {
                for (let index = 0; index < formulario.opciones.length; index++) {
                    const opcion = formulario.opciones[index];

                    await crearOpcionAdmin({
                        id_pregunta: preguntaCreada.id_pregunta,

                        codigo: opcion.codigo,

                        etiqueta: opcion.etiqueta,

                        valor_puntaje: formulario.puntua
                            ? Number(opcion.valorPuntaje)
                            : null,

                        orden: index + 1,

                        estado: true,
                    });
                }
            }

            await cargarPreguntas();

            setFormulario({
                ...PREGUNTA_INICIAL,
            });

            setMostrarFormulario(false);

            Alert.alert(
                "Pregunta registrada",
                "La pregunta fue agregada correctamente al cuestionario.",
            );
        } catch (err) {
            console.error("Error guardando pregunta:", err);

            const mensaje =
                err instanceof Error
                    ? err.message
                    : "No fue posible guardar la pregunta.";

            setError(mensaje);
        } finally {
            setGuardando(false);
        }
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                width: "100%",

                gap: 20,
            }}
        >
            {/* ==================================================
                ENCABEZADO
            ================================================== */}

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
                        Preguntas
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 13,

                            lineHeight: 19,

                            color: textSecondaryColor,
                        }}
                    >
                        Configura las preguntas y opciones que formarán parte del
                        cuestionario.
                    </Text>
                </View>

                {!mostrarFormulario && (
                    <Pressable
                        onPress={abrirNuevaPregunta}
                        disabled={disabled}
                        style={({ pressed }) => ({
                            minHeight: 46,

                            paddingHorizontal: 16,

                            borderRadius: 12,

                            backgroundColor: primaryColor,

                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent: "center",

                            gap: 8,

                            opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
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
                            Agregar pregunta
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* ==================================================
                FORMULARIO NUEVA PREGUNTA
            ================================================== */}

            {mostrarFormulario && (
                <View
                    style={{
                        width: "100%",

                        padding: esTelefono ? 16 : 22,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 18,

                        backgroundColor: surfaceColor,

                        gap: 20,
                    }}
                >
                    {/* HEADER */}

                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            gap: 12,
                        }}
                    >
                        <View
                            style={{
                                width: 40,

                                height: 40,

                                borderRadius: 12,

                                backgroundColor: primarySoftColor,

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Ionicons
                                name="help-circle-outline"
                                size={22}
                                color={primaryColor}
                            />
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
                                Nueva pregunta
                            </Text>

                            <Text
                                style={{
                                    marginTop: 2,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 12,

                                    color: textMutedColor,
                                }}
                            >
                                Pregunta {siguienteOrden}
                            </Text>
                        </View>
                    </View>

                    {/* CÓDIGO + SUBESCALA */}

                    <View
                        style={{
                            flexDirection: esTelefono ? "column" : "row",

                            gap: 14,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,

                                minWidth: 0,
                            }}
                        >
                            <CampoTexto
                                editable={!guardando && !disabled}
                                label="Código"
                                obligatorio
                                valor={formulario.codigo}
                                placeholder="Ej.: P-01"
                                onChangeText={(valor) => actualizarFormulario("codigo", valor)}
                            />
                        </View>

                        {tieneSubescalas && (
                            <View
                                style={{
                                    flex: 1,

                                    minWidth: 0,

                                    gap: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-SemiBold",

                                        fontSize: 13,

                                        color: textColor,
                                    }}
                                >
                                    Subescala *
                                </Text>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        gap: 8,
                                    }}
                                >
                                    {subescalas.map((subescala) => {
                                        const activa =
                                            formulario.idSubescala === subescala.id_subescala;

                                        return (
                                            <Pressable
                                                key={subescala.id_subescala}
                                                onPress={() =>
                                                    actualizarFormulario(
                                                        "idSubescala",
                                                        subescala.id_subescala,
                                                    )
                                                }
                                                style={{
                                                    minHeight: 48,

                                                    paddingHorizontal: 14,

                                                    borderWidth: 1,

                                                    borderColor: activa ? primaryColor : borderColor,

                                                    borderRadius: 12,

                                                    backgroundColor: activa
                                                        ? primarySoftColor
                                                        : surfaceSecondaryColor,

                                                    alignItems: "center",

                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: activa
                                                            ? "Nunito-Bold"
                                                            : "Nunito-SemiBold",

                                                        fontSize: 12,

                                                        color: activa ? primaryColor : textSecondaryColor,
                                                    }}
                                                >
                                                    {subescala.nombre}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* ENUNCIADO */}

                    <CampoTexto
                        editable={!guardando && !disabled}
                        label="Enunciado"
                        obligatorio
                        valor={formulario.enunciado}
                        placeholder="Escribe la pregunta que verá el usuario"
                        multiline
                        onChangeText={(valor) => actualizarFormulario("enunciado", valor)}
                    />

                    {/* AYUDA */}

                    <CampoTexto
                        editable={!guardando && !disabled}
                        label="Descripción de apoyo"
                        valor={formulario.descripcionApoyo}
                        placeholder="Texto adicional o aclaración opcional"
                        multiline
                        onChangeText={(valor) =>
                            actualizarFormulario("descripcionApoyo", valor)
                        }
                    />

                    {/* ==================================================
                        TIPO
                    ================================================== */}

                    <View
                        style={{
                            gap: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 13,

                                color: textColor,
                            }}
                        >
                            Tipo de pregunta *
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",

                                flexWrap: "wrap",

                                gap: 10,
                            }}
                        >
                            {TIPOS_PREGUNTA.map((tipo) => {
                                const activa = formulario.tipoPregunta === tipo.valor;

                                return (
                                    <Pressable
                                        key={tipo.valor}
                                        onPress={() => seleccionarTipo(tipo.valor)}
                                        style={({ pressed }) => ({
                                            width: esTelefono
                                                ? "100%"
                                                : esEscritorio
                                                    ? "31.8%"
                                                    : "48%",

                                            minHeight: 76,

                                            padding: 12,

                                            borderWidth: activa ? 2 : 1,

                                            borderColor: activa ? primaryColor : borderColor,

                                            borderRadius: 13,

                                            backgroundColor: activa
                                                ? primarySoftColor
                                                : surfaceSecondaryColor,

                                            flexDirection: "row",

                                            alignItems: "center",

                                            gap: 10,

                                            opacity: pressed ? 0.8 : 1,
                                        })}
                                    >
                                        <View
                                            style={{
                                                width: 36,

                                                height: 36,

                                                borderRadius: 10,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: activa ? primaryColor : surfaceColor,
                                            }}
                                        >
                                            <Ionicons
                                                name={tipo.icono}
                                                size={19}
                                                color={activa ? textOnPrimaryColor : textSecondaryColor}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,

                                                minWidth: 0,

                                                gap: 2,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Bold",

                                                    fontSize: 12,

                                                    color: activa ? primaryColor : textColor,
                                                }}
                                            >
                                                {tipo.label}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 10,

                                                    lineHeight: 14,

                                                    color: textSecondaryColor,
                                                }}
                                            >
                                                {tipo.descripcion}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {tipoActual && (
                            <View
                                style={{
                                    padding: 12,

                                    borderRadius: 11,

                                    backgroundColor: primarySoftColor,

                                    flexDirection: "row",

                                    gap: 8,
                                }}
                            >
                                <Ionicons
                                    name={tipoActual.icono}
                                    size={17}
                                    color={primaryColor}
                                />

                                <Text
                                    style={{
                                        flex: 1,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 11,

                                        lineHeight: 16,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    {tipoActual.descripcion}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ==================================================
                        CONFIGURACIÓN
                    ================================================== */}

                    <View
                        style={{
                            flexDirection: "row",

                            flexWrap: "wrap",

                            gap: 10,
                        }}
                    >
                        <OpcionSwitch
                            esTelefono={esTelefono}
                            disabled={disabled || guardando}
                            titulo="Obligatoria"
                            descripcion="Debe responderse para continuar."
                            valor={formulario.obligatoria}
                            onChange={(valor) => actualizarFormulario("obligatoria", valor)}
                        />

                        <OpcionSwitch
                            esTelefono={esTelefono}
                            disabled={disabled || guardando}
                            titulo="Puntúa"
                            descripcion="La respuesta aporta al resultado."
                            valor={formulario.puntua}
                            onChange={(valor) => actualizarFormulario("puntua", valor)}
                        />

                        <OpcionSwitch
                            esTelefono={esTelefono}
                            disabled={disabled || guardando}
                            titulo="Observacional"
                            descripcion="Registra información observacional."
                            valor={formulario.esObservacional}
                            onChange={(valor) =>
                                actualizarFormulario("esObservacional", valor)
                            }
                        />

                        <OpcionSwitch
                            esTelefono={esTelefono}
                            disabled={disabled || guardando}
                            titulo="Permite comentario"
                            descripcion="El usuario podrá agregar un comentario."
                            valor={formulario.permiteComentario}
                            onChange={(valor) =>
                                actualizarFormulario("permiteComentario", valor)
                            }
                        />
                    </View>

                    {/* ==================================================
                        OPCIONES
                    ================================================== */}

                    {necesitaOpciones && (
                        <View
                            style={{
                                gap: 14,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",

                                    alignItems: "center",

                                    justifyContent: "space-between",

                                    gap: 12,
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 15,

                                            color: textColor,
                                        }}
                                    >
                                        Opciones de respuesta
                                    </Text>

                                    <Text
                                        style={{
                                            marginTop: 2,

                                            fontFamily: "Nunito-Medium",

                                            fontSize: 11,

                                            color: textMutedColor,
                                        }}
                                    >
                                        Configura las respuestas y sus puntajes.
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={agregarOpcion}
                                    style={({ pressed }) => ({
                                        minHeight: 40,

                                        paddingHorizontal: 12,

                                        borderRadius: 10,

                                        backgroundColor: primarySoftColor,

                                        flexDirection: "row",

                                        alignItems: "center",

                                        gap: 5,

                                        opacity: pressed ? 0.75 : 1,
                                    })}
                                >
                                    <Ionicons name="add" size={17} color={primaryColor} />

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 11,

                                            color: primaryColor,
                                        }}
                                    >
                                        Añadir
                                    </Text>
                                </Pressable>
                            </View>

                            {formulario.opciones.map((opcion, index) => (
                                <View
                                    key={opcion.idTemporal}
                                    style={{
                                        padding: 14,

                                        borderWidth: 1,

                                        borderColor,

                                        borderRadius: 13,

                                        backgroundColor: surfaceSecondaryColor,

                                        gap: 12,
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
                                            Opción {index + 1}
                                        </Text>

                                        {formulario.opciones.length > 2 && (
                                            <Pressable
                                                onPress={() => eliminarOpcion(opcion.idTemporal)}
                                                hitSlop={8}
                                            >
                                                <Ionicons
                                                    name="trash-outline"
                                                    size={18}
                                                    color={dangerColor}
                                                />
                                            </Pressable>
                                        )}
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: esTelefono ? "column" : "row",

                                            gap: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: esTelefono ? "100%" : 130,
                                            }}
                                        >
                                            <CampoTexto
                                                editable={!guardando && !disabled}
                                                label="Código"
                                                valor={opcion.codigo}
                                                placeholder="OP-1"
                                                onChangeText={(valor) =>
                                                    actualizarOpcion(
                                                        opcion.idTemporal,

                                                        "codigo",

                                                        valor,
                                                    )
                                                }
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,

                                                minWidth: 0,
                                            }}
                                        >
                                            <CampoTexto
                                                editable={!guardando && !disabled}
                                                label="Etiqueta"
                                                valor={opcion.etiqueta}
                                                placeholder="Texto de la respuesta"
                                                onChangeText={(valor) =>
                                                    actualizarOpcion(
                                                        opcion.idTemporal,

                                                        "etiqueta",

                                                        valor,
                                                    )
                                                }
                                            />
                                        </View>

                                        {formulario.puntua && (
                                            <View
                                                style={{
                                                    width: esTelefono ? "100%" : 120,
                                                }}
                                            >
                                                <CampoTexto
                                                    editable={!guardando && !disabled}
                                                    label="Puntaje"
                                                    valor={opcion.valorPuntaje}
                                                    placeholder="0"
                                                    onChangeText={(valor) =>
                                                        actualizarOpcion(
                                                            opcion.idTemporal,

                                                            "valorPuntaje",

                                                            valor.replace(/[^0-9.-]/g, ""),
                                                        )
                                                    }
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* ERROR */}

                    {error && (
                        <View
                            style={{
                                padding: 13,

                                borderWidth: 1,

                                borderColor: dangerColor,

                                borderRadius: 11,

                                flexDirection: "row",

                                gap: 8,
                            }}
                        >
                            <Ionicons
                                name="alert-circle-outline"
                                size={19}
                                color={dangerColor}
                            />

                            <Text
                                style={{
                                    flex: 1,

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
                            onPress={cancelarPregunta}
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

                                opacity: pressed ? 0.7 : guardando ? 0.5 : 1,
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
                            onPress={guardarPregunta}
                            disabled={guardando}
                            style={({ pressed }) => ({
                                minHeight: 48,

                                paddingHorizontal: 20,

                                borderRadius: 12,

                                backgroundColor: primaryColor,

                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: "center",

                                gap: 8,

                                opacity: guardando ? 0.6 : pressed ? 0.8 : 1,
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
                                {guardando ? "Guardando..." : "Guardar pregunta"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* ==================================================
                CARGANDO
            ================================================== */}

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
                        Cargando preguntas...
                    </Text>
                </View>
            )}

            {/* ==================================================
                VACÍO
            ================================================== */}

            {!cargando && preguntas.length === 0 && !mostrarFormulario && (
                <View
                    style={{
                        minHeight: 220,

                        padding: 24,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 18,

                        backgroundColor: surfaceColor,

                        alignItems: "center",

                        justifyContent: "center",

                        gap: 10,
                    }}
                >
                    <View
                        style={{
                            width: 58,

                            height: 58,

                            borderRadius: 18,

                            backgroundColor: primarySoftColor,

                            alignItems: "center",

                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            name="help-circle-outline"
                            size={29}
                            color={primaryColor}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: 6,

                            fontFamily: "Nunito-Bold",

                            fontSize: 16,

                            textAlign: "center",

                            color: textColor,
                        }}
                    >
                        Aún no hay preguntas
                    </Text>

                    <Text
                        style={{
                            maxWidth: 420,

                            fontFamily: "Nunito-Medium",

                            fontSize: 12,

                            lineHeight: 18,

                            textAlign: "center",

                            color: textSecondaryColor,
                        }}
                    >
                        Agrega la primera pregunta para comenzar a construir este
                        cuestionario.
                    </Text>
                </View>
            )}

            {/* ==================================================
                PREGUNTAS GUARDADAS
            ================================================== */}

            {!cargando && preguntas.length > 0 && (
                <View
                    style={{
                        gap: 10,
                    }}
                >
                    {preguntas.map((pregunta, index) => {
                        const tipo = TIPOS_PREGUNTA.find(
                            (item) => item.valor === pregunta.tipo_pregunta,
                        );

                        return (
                            <View
                                key={pregunta.id_pregunta}
                                style={{
                                    padding: esTelefono ? 15 : 18,

                                    borderWidth: 1,

                                    borderColor,

                                    borderRadius: 15,

                                    backgroundColor: surfaceColor,

                                    flexDirection: esTelefono ? "column" : "row",

                                    alignItems: esTelefono ? "stretch" : "center",

                                    gap: 14,
                                }}
                            >
                                {/* ORDEN */}

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
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 14,

                                            color: primaryColor,
                                        }}
                                    >
                                        {index + 1}
                                    </Text>
                                </View>

                                {/* INFO */}

                                <View
                                    style={{
                                        flex: 1,

                                        minWidth: 0,

                                        gap: 6,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",

                                            flexWrap: "wrap",

                                            alignItems: "center",

                                            gap: 7,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 14,

                                                color: textColor,
                                            }}
                                        >
                                            {pregunta.codigo}
                                        </Text>

                                        {tipo && (
                                            <View
                                                style={{
                                                    paddingHorizontal: 8,

                                                    paddingVertical: 3,

                                                    borderRadius: 999,

                                                    backgroundColor: surfaceSecondaryColor,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-SemiBold",

                                                        fontSize: 10,

                                                        color: textSecondaryColor,
                                                    }}
                                                >
                                                    {tipo.label}
                                                </Text>
                                            </View>
                                        )}

                                        {!pregunta.estado && (
                                            <View
                                                style={{
                                                    paddingHorizontal: 8,

                                                    paddingVertical: 3,

                                                    borderRadius: 999,

                                                    backgroundColor: surfaceSecondaryColor,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-SemiBold",

                                                        fontSize: 10,

                                                        color: textMutedColor,
                                                    }}
                                                >
                                                    Inactiva
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-SemiBold",

                                            fontSize: 13,

                                            lineHeight: 19,

                                            color: textColor,
                                        }}
                                    >
                                        {pregunta.enunciado}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: "row",

                                            flexWrap: "wrap",

                                            gap: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 11,

                                                color: textMutedColor,
                                            }}
                                        >
                                            {pregunta.opcion_test?.length ?? 0} opciones
                                        </Text>

                                        {pregunta.obligatoria && (
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 11,

                                                    color: primaryColor,
                                                }}
                                            >
                                                Obligatoria
                                            </Text>
                                        )}

                                        {pregunta.puntua && (
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 11,

                                                    color: successColor,
                                                }}
                                            >
                                                Puntúa
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
