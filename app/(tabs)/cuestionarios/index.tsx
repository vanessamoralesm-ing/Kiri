import SearchBar from "@/components/ui/SearchBar";
import { useThemeColor } from "@/hooks/use-theme-color";

import {
    obtenerTestsConConteoPreguntas,
} from "@/services/cuestionarios/cuestionarios.service";

import type {
    TestConConteoPreguntas,
} from "@/services/cuestionarios/cuestionarios.service";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";


// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const TIPOS_APLICACION = [
    "Todos",
    "Autoadministrado",
    "Profesional",
] as const;

type TipoFiltro = typeof TIPOS_APLICACION[number];


// ==========================================================
// COMPONENTE
// ==========================================================

export default function CuestionariosPantalla() {

    const router = useRouter();


    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const textMutedColor = useThemeColor({}, "textMuted");
    const borderColor = useThemeColor({}, "border");
    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");
    const secondaryColor = useThemeColor({}, "secondary");
    const secondarySoftColor = useThemeColor({}, "secondarySoft");
    const accentColor = useThemeColor({}, "accent");
    const accentSoftColor = useThemeColor({}, "accentSoft");


    // ======================================================
    // ESTADOS
    // ======================================================

    const [cuestionarios, setCuestionarios] =
        useState<TestConConteoPreguntas[]>([]);

    const [busqueda, setBusqueda] = useState("");

    const [tipoSeleccionado, setTipoSeleccionado] =
        useState<TipoFiltro>("Todos");

    const [cargando, setCargando] = useState(true);

    const [error, setError] =
        useState<string | null>(null);


    // ======================================================
    // CARGAR CUESTIONARIOS
    // ======================================================

    const cargarCuestionarios = async () => {

        try {

            setCargando(true);
            setError(null);

            const tests =
                await obtenerTestsConConteoPreguntas();

            setCuestionarios(tests);

        } catch (error) {

            console.error(
                "Error cargando cuestionarios:",
                error
            );

            setCuestionarios([]);

            setError(
                "No fue posible cargar los cuestionarios."
            );

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {
        cargarCuestionarios();
    }, []);


    // ======================================================
    // FILTRADO
    // ======================================================

    const cuestionariosFiltrados =
        cuestionarios.filter((cuestionario) => {

            const texto =
                busqueda.trim().toLowerCase();

            const coincideBusqueda =
                texto === "" ||
                cuestionario.nombre
                    .toLowerCase()
                    .includes(texto) ||
                cuestionario.codigo
                    .toLowerCase()
                    .includes(texto) ||
                (cuestionario.descripcion ?? "")
                    .toLowerCase()
                    .includes(texto) ||
                (cuestionario.poblacion_objetivo ?? "")
                    .toLowerCase()
                    .includes(texto);

            const coincideTipo =
                tipoSeleccionado === "Todos"
                    ? true
                    : tipoSeleccionado === "Profesional"
                        ? cuestionario.tipo_aplicacion === "profesional"
                        : cuestionario.tipo_aplicacion === "autoadministrado";

            return coincideBusqueda && coincideTipo;
        });


    // ======================================================
    // NAVEGACIÓN
    // ======================================================

    const irACuestionario = (codigo: string) => {

        router.push({
            pathname: "/cuestionarios/[id]",
            params: {
                id: codigo,
            },
        } as any);
    };


    // ======================================================
    // APARIENCIA
    // ======================================================

    const obtenerApariencia = (
        cuestionario: TestConConteoPreguntas
    ) => {

        if (cuestionario.tipo_aplicacion === "profesional") {

            return {
                icono:
                    "medkit-outline" as keyof typeof Ionicons.glyphMap,

                color: accentColor,
                fondo: accentSoftColor,
            };
        }

        if (cuestionario.tiene_subescalas) {

            return {
                icono:
                    "analytics-outline" as keyof typeof Ionicons.glyphMap,

                color: secondaryColor,
                fondo: secondarySoftColor,
            };
        }

        return {
            icono:
                "document-text-outline" as keyof typeof Ionicons.glyphMap,

            color: primaryColor,
            fondo: primarySoftColor,
        };
    };


    // ======================================================
    // CARGANDO
    // ======================================================

    if (cargando) {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator
                    size="large"
                    color={primaryColor}
                />

                <Text
                    style={{
                        marginTop: 12,
                        fontFamily: "Nunito-Medium",
                        fontSize: 15,
                        color: textSecondaryColor,
                    }}
                >
                    Cargando cuestionarios...
                </Text>
            </View>
        );
    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 24,
                }}
            >
                <Ionicons
                    name="cloud-offline-outline"
                    size={48}
                    color={accentColor}
                />

                <Text
                    style={{
                        marginTop: 12,
                        fontFamily: "Nunito-Bold",
                        fontSize: 18,
                        color: textColor,
                        textAlign: "center",
                    }}
                >
                    {error}
                </Text>

                <Pressable
                    onPress={cargarCuestionarios}
                    style={{
                        marginTop: 20,
                        backgroundColor: primaryColor,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 12,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 14,
                            color: "#FFFFFF",
                        }}
                    >
                        Intentar nuevamente
                    </Text>
                </Pressable>
            </View>
        );
    }


    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
            >

                {/* ==================================================
                    PRESENTACIÓN
                ================================================== */}

                <View className="mb-5">

                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 26,
                            color: textColor,
                        }}
                    >
                        Explora tu bienestar
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontFamily: "Nunito-Medium",
                            fontSize: 16,
                            lineHeight: 22,
                            color: textSecondaryColor,
                        }}
                    >
                        Explora los instrumentos disponibles y selecciona la evaluación que corresponda a tus necesidades.
                    </Text>

                </View>


                {/* ==================================================
                    BUSCADOR
                ================================================== */}

                <SearchBar
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="Buscar cuestionario..."
                    style={{
                        marginBottom: 22,
                    }}
                />


                {/* ==================================================
                    FILTROS
                ================================================== */}

                <ScrollView
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: 10,
                        paddingRight: 16,
                    }}
                    style={{
                        marginBottom: 22,
                    }}
                >
                    {TIPOS_APLICACION.map((tipo) => {

                        const seleccionado =
                            tipoSeleccionado === tipo;

                        return (
                            <Pressable
                                key={tipo}
                                onPress={() =>
                                    setTipoSeleccionado(tipo)
                                }
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 999,
                                    backgroundColor:
                                        seleccionado
                                            ? primaryColor
                                            : surfaceSecondaryColor,
                                    borderWidth:
                                        seleccionado
                                            ? 0
                                            : 1,
                                    borderColor,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily:
                                            seleccionado
                                                ? "Nunito-Bold"
                                                : "Nunito-Medium",
                                        fontSize: 14,
                                        color:
                                            seleccionado
                                                ? "#FFFFFF"
                                                : textSecondaryColor,
                                    }}
                                >
                                    {tipo}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>


                {/* ==================================================
                    LISTA
                ================================================== */}

                <View className="gap-5">

                    {cuestionariosFiltrados.map(
                        (cuestionario) => {

                            const apariencia =
                                obtenerApariencia(
                                    cuestionario
                                );

                            const numeroPreguntas =
                                cuestionario
                                    .pregunta_test?.[0]
                                    ?.count ?? 0;

                            const esProfesional =
                                cuestionario.tipo_aplicacion ===
                                "profesional";

                            const fondoTipoAplicacion =
                                esProfesional
                                    ? accentSoftColor
                                    : secondarySoftColor;

                            const colorTipoAplicacion =
                                esProfesional
                                    ? accentColor
                                    : secondaryColor;

                            return (
                                <Pressable
                                    key={cuestionario.id_test}
                                    onPress={() =>
                                        irACuestionario(
                                            cuestionario.codigo
                                        )
                                    }
                                    style={{
                                        backgroundColor: surfaceColor,
                                        borderRadius: 24,
                                        padding: 20,
                                        borderWidth: 1,
                                        borderColor,
                                        shadowColor: "#000000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 6,
                                        elevation: 4,
                                    }}
                                >

                                    {/* CABECERA */}

                                    <View className="flex-row justify-between items-start mb-3">

                                        <View
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 16,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor:
                                                    apariencia.fondo,
                                            }}
                                        >
                                            <Ionicons
                                                name={
                                                    apariencia.icono
                                                }
                                                size={28}
                                                color={
                                                    apariencia.color
                                                }
                                            />
                                        </View>


                                        {/* CÓDIGO */}

                                        <View
                                            style={{
                                                backgroundColor:
                                                    surfaceSecondaryColor,
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 999,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-SemiBold",
                                                    fontSize: 11,
                                                    color:
                                                        textSecondaryColor,
                                                }}
                                            >
                                                {
                                                    cuestionario.codigo
                                                }
                                            </Text>
                                        </View>

                                    </View>


                                    {/* NOMBRE */}

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 20,
                                            color: textColor,
                                        }}
                                    >
                                        {cuestionario.nombre}
                                    </Text>


                                    {/* DESCRIPCIÓN */}

                                    <Text
                                        style={{
                                            marginTop: 5,
                                            fontFamily: "Nunito-Medium",
                                            fontSize: 14,
                                            lineHeight: 20,
                                            color: textSecondaryColor,
                                        }}
                                    >
                                        {
                                            cuestionario.descripcion ??
                                            "Información del instrumento no disponible."
                                        }
                                    </Text>


                                    {/* INFORMACIÓN */}

                                    <View className="flex-row flex-wrap items-center mt-4 gap-3">

                                        <View className="flex-row items-center">

                                            <Ionicons
                                                name="document-text-outline"
                                                size={15}
                                                color={textMutedColor}
                                            />

                                            <Text
                                                style={{
                                                    marginLeft: 5,
                                                    fontFamily:
                                                        "Nunito-Medium",
                                                    fontSize: 12,
                                                    color:
                                                        textSecondaryColor,
                                                }}
                                            >
                                                {numeroPreguntas}{" "}
                                                {
                                                    numeroPreguntas === 1
                                                        ? "pregunta"
                                                        : "preguntas"
                                                }
                                            </Text>

                                        </View>


                                        {
                                            cuestionario.poblacion_objetivo && (

                                                <View className="flex-row items-center">

                                                    <Ionicons
                                                        name="people-outline"
                                                        size={15}
                                                        color={
                                                            textMutedColor
                                                        }
                                                    />

                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            marginLeft: 5,
                                                            maxWidth: 180,
                                                            fontFamily:
                                                                "Nunito-Medium",
                                                            fontSize: 12,
                                                            color:
                                                                textSecondaryColor,
                                                        }}
                                                    >
                                                        {
                                                            cuestionario
                                                                .poblacion_objetivo
                                                        }
                                                    </Text>

                                                </View>
                                            )
                                        }

                                    </View>


                                    {/* TIPO DE APLICACIÓN */}

                                    <View className="flex-row justify-between items-center mt-5">

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 999,
                                                backgroundColor:
                                                    fondoTipoAplicacion,
                                            }}
                                        >
                                            <Ionicons
                                                name={
                                                    esProfesional
                                                        ? "medkit-outline"
                                                        : "person-outline"
                                                }
                                                size={14}
                                                color={
                                                    colorTipoAplicacion
                                                }
                                            />

                                            <Text
                                                style={{
                                                    marginLeft: 4,
                                                    fontFamily:
                                                        "Nunito-Medium",
                                                    fontSize: 11,
                                                    color:
                                                        colorTipoAplicacion,
                                                }}
                                            >
                                                {
                                                    esProfesional
                                                        ? "Aplicación profesional"
                                                        : "Autoadministrado"
                                                }
                                            </Text>
                                        </View>


                                        {/* INICIAR */}

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingHorizontal: 8,
                                                paddingVertical: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-SemiBold",
                                                    fontSize: 13,
                                                    color: primaryColor,
                                                }}
                                            >
                                                Iniciar test
                                            </Text>

                                            <Ionicons
                                                name="chevron-forward"
                                                size={18}
                                                color={primaryColor}
                                            />
                                        </View>

                                    </View>

                                </Pressable>
                            );
                        }
                    )}

                </View>


                {/* ==================================================
                    SIN RESULTADOS
                ================================================== */}

                {
                    cuestionariosFiltrados.length === 0 && (

                        <View className="items-center py-12 px-6">

                            <Ionicons
                                name="search-outline"
                                size={42}
                                color={accentColor}
                            />

                            <Text
                                style={{
                                    marginTop: 12,
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 18,
                                    color: textColor,
                                }}
                            >
                                No encontramos cuestionarios
                            </Text>

                            <Text
                                style={{
                                    marginTop: 5,
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 14,
                                    lineHeight: 20,
                                    color: textSecondaryColor,
                                    textAlign: "center",
                                }}
                            >
                                Intenta realizar otra búsqueda o cambiar el tipo de aplicación.
                            </Text>

                        </View>
                    )
                }


                {/* ==================================================
                    PRIVACIDAD
                ================================================== */}

                <View
                    style={{
                        marginTop: 24,
                        padding: 20,
                        borderRadius: 24,
                        backgroundColor: primaryColor,
                    }}
                >
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={28}
                        color="#FFFFFF"
                    />

                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: "Nunito-Bold",
                            fontSize: 22,
                            color: "#FFFFFF",
                        }}
                    >
                        Privacidad garantizada
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontFamily: "Nunito-Medium",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#EAF2FF",
                        }}
                    >
                        Tus resultados son privados y están protegidos. Solo tú decides si deseas compartirlos con un profesional de la salud.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}