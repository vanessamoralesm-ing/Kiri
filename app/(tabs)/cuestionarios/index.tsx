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

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import SearchBar from "@/components/ui/SearchBar";
import { supabase } from "@/lib/supabase";


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

    const router = useRouter();


    const [
        cuestionarios,
        setCuestionarios,
    ] = useState<TestSupabase[]>([]);


    const [
        busqueda,
        setBusqueda,
    ] = useState("");


    const [
        tipoSeleccionado,
        setTipoSeleccionado,
    ] = useState<TipoFiltro>(
        "Todos"
    );


    const [
        cargando,
        setCargando,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );


    // ======================================================
    // CARGAR CUESTIONARIOS
    // ======================================================

    useEffect(() => {

        cargarCuestionarios();

    }, []);


    const cargarCuestionarios =
        async () => {

            try {

                setCargando(true);
                setError(null);


                // Verificar sesión
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


                // Obtener tests
                const {
                    data,
                    error:
                        errorSupabase,
                } = await supabase

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


    // ======================================================
    // FILTRADO
    // ======================================================

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


    // ======================================================
    // NAVEGACIÓN
    // ======================================================

    const irACuestionario =
        (
            codigo: string
        ) => {

            router.push(
                `/cuestionarios/${codigo}` as never
            );

        };


    // ======================================================
    // APARIENCIA
    // ======================================================

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
                        "bg-purple-100",
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
                        "bg-emerald-100",
                };

            }


            return {
                icono:
                    "document-text-outline" as keyof typeof Ionicons.glyphMap,

                color:
                    "#4F8EF7",

                fondo:
                    "bg-blue-100",
            };

        };


    // ======================================================
    // CARGANDO
    // ======================================================

    if (cargando) {

        return (

            <View className="flex-1 bg-slate-50 items-center justify-center">

                <ActivityIndicator
                    size="large"
                    color="#4F8EF7"
                />

                <Text
                    style={{
                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            15,

                        color:
                            "#64748B",

                        marginTop:
                            12,
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

            <View className="flex-1 bg-slate-50 items-center justify-center px-6">

                <Ionicons
                    name="cloud-offline-outline"
                    size={48}
                    color="#B8A8F8"
                />

                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            18,

                        color:
                            "#2D3748",

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
                    className="bg-blue-500 px-6 py-3 rounded-xl mt-5"
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


    // ======================================================
    // UI
    // ======================================================

    return (

        <View className="flex-1 bg-slate-50">

            <ScrollView
                className="flex-1"
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

                {/* Presentación */}

                <View className="mb-5">

                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                26,

                            color:
                                "#2D3748",
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
                                "#475569",

                            marginTop:
                                8,
                        }}
                    >
                        Explora los instrumentos disponibles y selecciona la evaluación que corresponda a tus necesidades.
                    </Text>

                </View>


                {/* Buscador */}

                <SearchBar
                    value={busqueda}
                    onChangeText={
                        setBusqueda
                    }
                    placeholder="Buscar cuestionario..."
                    style={{
                        marginBottom:
                            22,
                    }}
                />


                {/* Filtros */}

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
                                        key={tipo}
                                        onPress={() =>
                                            setTipoSeleccionado(
                                                tipo
                                            )
                                        }
                                        className={`px-4 py-2 rounded-full ${
                                            seleccionado
                                                ? "bg-blue-500"
                                                : "bg-slate-200"
                                        }`}
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
                                                        : "#475569",
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


                {/* Lista */}

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
                                        className="bg-white rounded-3xl p-5 shadow-md"
                                    >

                                        <View className="flex-row justify-between items-start mb-3">

                                            <View
                                                className={`w-12 h-12 rounded-2xl items-center justify-center ${apariencia.fondo}`}
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


                                            <View className="bg-slate-100 px-3 py-1.5 rounded-full">

                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-SemiBold",

                                                        fontSize:
                                                            11,

                                                        color:
                                                            "#64748B",
                                                    }}
                                                >
                                                    {
                                                        cuestionario.codigo
                                                    }
                                                </Text>

                                            </View>

                                        </View>


                                        <Text
                                            style={{
                                                fontFamily:
                                                    "Nunito-Bold",

                                                fontSize:
                                                    20,

                                                color:
                                                    "#2D3748",
                                            }}
                                        >
                                            {
                                                cuestionario.nombre
                                            }
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
                                                    "#64748B",

                                                marginTop:
                                                    5,
                                            }}
                                        >
                                            {
                                                cuestionario.descripcion ??
                                                "Información del instrumento no disponible."
                                            }
                                        </Text>


                                        <View className="flex-row flex-wrap items-center mt-4 gap-3">

                                            <View className="flex-row items-center">

                                                <Ionicons
                                                    name="document-text-outline"
                                                    size={15}
                                                    color="#94A3B8"
                                                />

                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            "Nunito-Medium",

                                                        fontSize:
                                                            12,

                                                        color:
                                                            "#64748B",

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
                                                            color="#94A3B8"
                                                        />

                                                        <Text
                                                            numberOfLines={1}
                                                            style={{
                                                                fontFamily:
                                                                    "Nunito-Medium",

                                                                fontSize:
                                                                    12,

                                                                color:
                                                                    "#64748B",

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


                                        <View className="flex-row justify-between items-center mt-5">

                                            <View
                                                className={`flex-row items-center px-3 py-1.5 rounded-full ${
                                                    esProfesional
                                                        ? "bg-purple-100"
                                                        : "bg-emerald-100"
                                                }`}
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
                                                            ? "#8B5CF6"
                                                            : "#10B981"
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
                                                                ? "#7C3AED"
                                                                : "#059669",

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
                                                            "#4F8EF7",
                                                    }}
                                                >
                                                    Iniciar test
                                                </Text>

                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={18}
                                                    color="#4F8EF7"
                                                />

                                            </Pressable>

                                        </View>

                                    </Pressable>

                                );

                            }
                        )
                    }

                </View>


                {
                    cuestionariosFiltrados.length ===
                        0 && (

                        <View className="items-center py-12 px-6">

                            <Ionicons
                                name="search-outline"
                                size={42}
                                color="#B8A8F8"
                            />

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        18,

                                    color:
                                        "#2D3748",

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
                                        "#64748B",

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


                {/* Privacidad */}

                <View className="bg-blue-500 rounded-3xl p-5 mt-6">

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
                                "#DBEAFE",

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