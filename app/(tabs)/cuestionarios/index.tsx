import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useRouter,
} from "expo-router";

import SearchBar from "@/components/ui/SearchBar";

import {
    supabase,
} from "@/lib/supabase";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// TIPOS
// ==========================================================

interface TestSupabase {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    instrucciones: string | null;
    poblacion_objetivo: string | null;

    tipo_aplicacion:
    | "autoadministrado"
    | "profesional";

    tiene_subescalas: boolean;
    version: string | null;
    estado: boolean;

    pregunta_test?: {
        count: number;
    }[];
}


const TIPOS_APLICACION = [
    "Todos",
    "Autoadministrado",
    "Profesional",
] as const;


type TipoFiltro =
    typeof TIPOS_APLICACION[number];


// ==========================================================
// COMPONENTE
// ==========================================================

export default function CuestionariosPantalla() {

    const router =
        useRouter();


    // ========================================================
    // TEMA
    // ========================================================

    const backgroundColor =
        useThemeColor(
            {},
            "background"
        );

    const surfaceColor =
        useThemeColor(
            {},
            "surface"
        );

    const surfaceSecondaryColor =
        useThemeColor(
            {},
            "surfaceSecondary"
        );

    const textColor =
        useThemeColor(
            {},
            "text"
        );

    const textSecondaryColor =
        useThemeColor(
            {},
            "textSecondary"
        );

    const textMutedColor =
        useThemeColor(
            {},
            "textMuted"
        );

    const borderColor =
        useThemeColor(
            {},
            "border"
        );

    const primaryColor =
        useThemeColor(
            {},
            "primary"
        );

    const primarySoftColor =
        useThemeColor(
            {},
            "primarySoft"
        );

    const secondarySoftColor =
        useThemeColor(
            {},
            "secondarySoft"
        );

    const accentSoftColor =
        useThemeColor(
            {},
            "accentSoft"
        );

    const accentColor =
        useThemeColor(
            {},
            "accent"
        );


    // ========================================================
    // ESTADOS
    // ========================================================

    const [
        cuestionarios,
        setCuestionarios,
    ] =
        useState<TestSupabase[]>([]);


    const [
        busqueda,
        setBusqueda,
    ] =
        useState("");


    const [
        tipoSeleccionado,
        setTipoSeleccionado,
    ] =
        useState<TipoFiltro>(
            "Todos"
        );


    const [
        cargando,
        setCargando,
    ] =
        useState(true);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );


    // ========================================================
    // CARGAR CUESTIONARIOS
    // ========================================================

    useEffect(() => {

        cargarCuestionarios();

    }, []);


    const cargarCuestionarios =
        async () => {

            try {

                setCargando(true);
                setError(null);


                const {
                    data: {
                        user,
                    },
                    error:
                    errorAuth,
                } =
                    await supabase.auth.getUser();


                if (errorAuth) {
                    throw errorAuth;
                }


                if (!user) {

                    setCuestionarios([]);

                    setError(
                        "Debes iniciar sesión para acceder a los cuestionarios."
                    );

                    return;
                }


                const {
                    data,
                    error:
                    errorSupabase,
                } =
                    await supabase

                        .from("test")

                        .select(`
              id_test,
              codigo,
              nombre,
              descripcion,
              instrucciones,
              poblacion_objetivo,
              tipo_aplicacion,
              tiene_subescalas,
              version,
              estado,
              pregunta_test(count)
            `)

                        .eq(
                            "estado",
                            true
                        )

                        .order(
                            "nombre",
                            {
                                ascending:
                                    true,
                            }
                        );


                if (errorSupabase) {
                    throw errorSupabase;
                }


                setCuestionarios(
                    (data ?? []) as TestSupabase[]
                );


            } catch (error) {

                console.error(
                    "Error cargando cuestionarios:",
                    error
                );


                setError(
                    "No fue posible cargar los cuestionarios."
                );


            } finally {

                setCargando(false);

            }

        };


    // ========================================================
    // FILTRADO
    // ========================================================

    const cuestionariosFiltrados =
        cuestionarios.filter(
            (
                cuestionario
            ) => {

                const texto =
                    busqueda
                        .trim()
                        .toLowerCase();


                const coincideBusqueda =
                    texto === "" ||

                    cuestionario.nombre
                        .toLowerCase()
                        .includes(texto) ||

                    cuestionario.codigo
                        .toLowerCase()
                        .includes(texto) ||

                    (
                        cuestionario.descripcion ??
                        ""
                    )
                        .toLowerCase()
                        .includes(texto) ||

                    (
                        cuestionario.poblacion_objetivo ??
                        ""
                    )
                        .toLowerCase()
                        .includes(texto);


                const coincideTipo =
                    tipoSeleccionado ===
                        "Todos"

                        ? true

                        : tipoSeleccionado ===
                            "Profesional"

                            ? cuestionario.tipo_aplicacion ===
                            "profesional"

                            : cuestionario.tipo_aplicacion ===
                            "autoadministrado";


                return (
                    coincideBusqueda &&
                    coincideTipo
                );

            }
        );


    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    const irACuestionario =
        (
            codigo: string
        ) => {

            router.push(
                `/cuestionarios/${codigo}` as never
            );

        };


    // ========================================================
    // APARIENCIA
    // ========================================================

    const obtenerApariencia =
        (
            cuestionario:
                TestSupabase
        ) => {

            if (
                cuestionario.tipo_aplicacion ===
                "profesional"
            ) {

                return {
                    icono:
                        "medkit-outline" as keyof typeof Ionicons.glyphMap,

                    color:
                        "#B8A8F8",

                    fondo:
                        accentSoftColor,
                };

            }


            if (
                cuestionario.tiene_subescalas
            ) {

                return {
                    icono:
                        "analytics-outline" as keyof typeof Ionicons.glyphMap,

                    color:
                        "#7BBF9A",

                    fondo:
                        secondarySoftColor,
                };

            }


            return {
                icono:
                    "document-text-outline" as keyof typeof Ionicons.glyphMap,

                color:
                    "#4F8EF7",

                fondo:
                    primarySoftColor,
            };

        };


    // ========================================================
    // CARGANDO
    // ========================================================

    if (cargando) {

        return (

            <View
                style={{
                    flex: 1,

                    backgroundColor,

                    alignItems:
                        "center",

                    justifyContent:
                        "center",
                }}
            >

                <ActivityIndicator
                    size="large"
                    color={
                        primaryColor
                    }
                />


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            15,

                        color:
                            textSecondaryColor,

                        marginTop:
                            12,
                    }}
                >
                    Cargando cuestionarios...
                </Text>

            </View>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <View
                style={{
                    flex: 1,

                    backgroundColor,

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    paddingHorizontal:
                        24,
                }}
            >

                <Ionicons
                    name="cloud-offline-outline"
                    size={48}
                    color={
                        accentColor
                    }
                />


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            18,

                        color:
                            textColor,

                        marginTop:
                            12,

                        textAlign:
                            "center",
                    }}
                >
                    {error}
                </Text>


                <Pressable
                    onPress={
                        cargarCuestionarios
                    }

                    style={{
                        backgroundColor:
                            primaryColor,

                        paddingHorizontal:
                            24,

                        paddingVertical:
                            12,

                        borderRadius:
                            12,

                        marginTop:
                            20,
                    }}
                >

                    <Text
                        style={{
                            fontFamily:
                                "Nunito-SemiBold",

                            fontSize:
                                14,

                            color:
                                "#FFFFFF",
                        }}
                    >
                        Intentar nuevamente
                    </Text>

                </Pressable>

            </View>

        );

    }


    // ========================================================
    // UI
    // ========================================================

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
                    paddingHorizontal:
                        16,

                    paddingTop:
                        12,

                    paddingBottom:
                        100,
                }}

                showsVerticalScrollIndicator={
                    false
                }

                keyboardShouldPersistTaps="handled"

                bounces={false}

                overScrollMode="never"
            >

                {/* =================================================
            PRESENTACIÓN
        ================================================= */}

                <View className="mb-5">

                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                26,

                            color:
                                textColor,
                        }}
                    >
                        Explora tu bienestar
                    </Text>


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                16,

                            lineHeight:
                                22,

                            color:
                                textSecondaryColor,

                            marginTop:
                                8,
                        }}
                    >
                        Explora los instrumentos disponibles y selecciona la evaluación que corresponda a tus necesidades.
                    </Text>

                </View>


                {/* =================================================
            BUSCADOR
        ================================================= */}

                <SearchBar
                    value={
                        busqueda
                    }

                    onChangeText={
                        setBusqueda
                    }

                    placeholder="Buscar cuestionario..."

                    style={{
                        marginBottom:
                            22,
                    }}
                />


                {/* =================================================
            FILTROS
        ================================================= */}

                <ScrollView
                    horizontal
                    nestedScrollEnabled

                    showsHorizontalScrollIndicator={
                        false
                    }

                    contentContainerStyle={{
                        gap:
                            10,

                        paddingRight:
                            16,
                    }}

                    style={{
                        marginBottom:
                            22,
                    }}
                >

                    {
                        TIPOS_APLICACION.map(
                            (
                                tipo
                            ) => {

                                const seleccionado =
                                    tipoSeleccionado ===
                                    tipo;


                                return (

                                    <Pressable
                                        key={
                                            tipo
                                        }

                                        onPress={() =>
                                            setTipoSeleccionado(
                                                tipo
                                            )
                                        }

                                        style={{
                                            paddingHorizontal:
                                                16,

                                            paddingVertical:
                                                8,

                                            borderRadius:
                                                999,

                                            backgroundColor:
                                                seleccionado
                                                    ? primaryColor
                                                    : surfaceSecondaryColor,

                                            borderWidth:
                                                seleccionado
                                                    ? 0
                                                    : 1,

                                            borderColor:
                                                borderColor,
                                        }}
                                    >

                                        <Text
                                            style={{
                                                fontFamily:
                                                    seleccionado
                                                        ? "Nunito-Bold"
                                                        : "Nunito-Medium",

                                                fontSize:
                                                    14,

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

                            }
                        )
                    }

                </ScrollView>


                {/* =================================================
            LISTA
        ================================================= */}

                <View className="gap-5">

                    {
                        cuestionariosFiltrados.map(
                            (
                                cuestionario
                            ) => {

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


                                return (

                                    <Pressable
                                        key={
                                            cuestionario.id_test
                                        }

                                        onPress={() =>
                                            irACuestionario(
                                                cuestionario.codigo
                                            )
                                        }

                                        style={{
                                            backgroundColor:
                                                surfaceColor,

                                            borderRadius:
                                                24,

                                            padding:
                                                20,

                                            borderWidth:
                                                1,

                                            borderColor:
                                                borderColor,

                                            shadowColor:
                                                "#000000",

                                            shadowOffset: {
                                                width: 0,
                                                height: 3,
                                            },

                                            shadowOpacity:
                                                0.1,

                                            shadowRadius:
                                                6,

                                            elevation:
                                                4,
                                        }}
                                    >

                                        <View className="flex-row justify-between items-start mb-3">

                                            {/* Icono */}

                                            <View
                                                style={{
                                                    width:
                                                        48,

                                                    height:
                                                        48,

                                                    borderRadius:
                                                        16,

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

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


                                            {/* Código */}

                                            <View
                                                style={{
                                                    backgroundColor:
                                                        surfaceSecondaryColor,

                                                    paddingHorizontal:
                                                        12,

                                                    paddingVertical:
                                                        6,

                                                    borderRadius:
                                                        999,
                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-SemiBold",

                                                        fontSize:
                                                            11,

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


                                        {/* Nombre */}

                                        <Text
                                            style={{
                                                fontFamily:
                                                    "Nunito-Bold",

                                                fontSize:
                                                    20,

                                                color:
                                                    textColor,
                                            }}
                                        >
                                            {
                                                cuestionario.nombre
                                            }
                                        </Text>


                                        {/* Descripción */}

                                        <Text
                                            style={{
                                                fontFamily:
                                                    "Nunito-Medium",

                                                fontSize:
                                                    14,

                                                lineHeight:
                                                    20,

                                                color:
                                                    textSecondaryColor,

                                                marginTop:
                                                    5,
                                            }}
                                        >
                                            {
                                                cuestionario.descripcion ??
                                                "Información del instrumento no disponible."
                                            }
                                        </Text>


                                        {/* Información */}

                                        <View className="flex-row flex-wrap items-center mt-4 gap-3">

                                            <View className="flex-row items-center">

                                                <Ionicons
                                                    name="document-text-outline"
                                                    size={15}
                                                    color={
                                                        textMutedColor
                                                    }
                                                />

                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-Medium",

                                                        fontSize:
                                                            12,

                                                        color:
                                                            textSecondaryColor,

                                                        marginLeft:
                                                            5,
                                                    }}
                                                >
                                                    {numeroPreguntas}{" "}
                                                    {
                                                        numeroPreguntas ===
                                                            1
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
                                                                fontFamily:
                                                                    "Nunito-Medium",

                                                                fontSize:
                                                                    12,

                                                                color:
                                                                    textSecondaryColor,

                                                                marginLeft:
                                                                    5,

                                                                maxWidth:
                                                                    180,
                                                            }}
                                                        >
                                                            {
                                                                cuestionario.poblacion_objetivo
                                                            }
                                                        </Text>

                                                    </View>

                                                )
                                            }

                                        </View>


                                        {/* Tipo e iniciar */}

                                        <View className="flex-row justify-between items-center mt-5">

                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",

                                                    alignItems:
                                                        "center",

                                                    paddingHorizontal:
                                                        12,

                                                    paddingVertical:
                                                        6,

                                                    borderRadius:
                                                        999,

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
                                                        esProfesional
                                                            ? "#B8A8F8"
                                                            : "#7BBF9A"
                                                    }
                                                />


                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-Medium",

                                                        fontSize:
                                                            11,

                                                        color:
                                                            esProfesional
                                                                ? "#B8A8F8"
                                                                : "#7BBF9A",

                                                        marginLeft:
                                                            4,
                                                    }}
                                                >
                                                    {
                                                        esProfesional
                                                            ? "Aplicación profesional"
                                                            : "Autoadministrado"
                                                    }
                                                </Text>

                                            </View>


                                            <Pressable
                                                onPress={() =>
                                                    irACuestionario(
                                                        cuestionario.codigo
                                                    )
                                                }

                                                className="flex-row items-center px-2 py-2"
                                            >

                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-SemiBold",

                                                        fontSize:
                                                            13,

                                                        color:
                                                            primaryColor,
                                                    }}
                                                >
                                                    Iniciar test
                                                </Text>


                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={18}
                                                    color={
                                                        primaryColor
                                                    }
                                                />

                                            </Pressable>

                                        </View>

                                    </Pressable>

                                );

                            }
                        )
                    }

                </View>


                {/* =================================================
            SIN RESULTADOS
        ================================================= */}

                {
                    cuestionariosFiltrados.length ===
                    0 && (

                        <View className="items-center py-12 px-6">

                            <Ionicons
                                name="search-outline"
                                size={42}
                                color={
                                    accentColor
                                }
                            />

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        18,

                                    color:
                                        textColor,

                                    marginTop:
                                        12,
                                }}
                            >
                                No encontramos cuestionarios
                            </Text>


                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Medium",

                                    fontSize:
                                        14,

                                    lineHeight:
                                        20,

                                    color:
                                        textSecondaryColor,

                                    textAlign:
                                        "center",

                                    marginTop:
                                        5,
                                }}
                            >
                                Intenta realizar otra búsqueda o cambiar el tipo de aplicación.
                            </Text>

                        </View>

                    )
                }


                {/* =================================================
            PRIVACIDAD
        ================================================= */}

                <View
                    style={{
                        backgroundColor:
                            primaryColor,

                        borderRadius:
                            24,

                        padding:
                            20,

                        marginTop:
                            24,
                    }}
                >

                    <Ionicons
                        name="shield-checkmark-outline"
                        size={28}
                        color="#FFFFFF"
                    />


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                22,

                            color:
                                "#FFFFFF",

                            marginTop:
                                10,
                        }}
                    >
                        Privacidad garantizada
                    </Text>


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                14,

                            lineHeight:
                                20,

                            color:
                                "#EAF2FF",

                            marginTop:
                                8,
                        }}
                    >
                        Tus resultados son privados y están protegidos. Solo tú decides si deseas compartirlos con un profesional de la salud.
                    </Text>

                </View>

            </ScrollView>

        </View>

    );

}