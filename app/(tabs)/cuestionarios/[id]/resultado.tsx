import type {
    BaremoTest,
    EjecucionTest,
    RangoBaremo,
    ResultadoSubescala,
    ResultadoTest,
    Test,
} from "@/types/cuestionarios";

import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";


// ==========================================================
// COMPONENTE
// ==========================================================

export default function ResultadoCuestionario() {

    const router =
        useRouter();


    // ======================================================
    // PARÁMETROS
    // ======================================================

    const {
        idResultado,
    } = useLocalSearchParams<{
        id: string;
        idResultado: string;
    }>();


    // ======================================================
    // ESTADOS
    // ======================================================

    const [
        cuestionario,
        setCuestionario,
    ] = useState<Test | null>(
        null
    );


    const [
        resultado,
        setResultado,
    ] = useState<ResultadoTest | null>(
        null
    );


    const [
        baremo,
        setBaremo,
    ] = useState<BaremoTest | null>(
        null
    );


    const [
        rangoAplicado,
        setRangoAplicado,
    ] = useState<RangoBaremo | null>(
        null
    );


    const [
        rangosGlobales,
        setRangosGlobales,
    ] = useState<RangoBaremo[]>(
        []
    );


    const [
        resultadosSubescalas,
        setResultadosSubescalas,
    ] = useState<
        ResultadoSubescala[]
    >([]);


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
    // CARGAR RESULTADO
    // ======================================================

    useEffect(() => {

        if (!idResultado) {

            setError(
                "No se recibió el identificador del resultado."
            );

            setCargando(false);

            return;

        }


        cargarResultado();

    }, [idResultado]);


    // ======================================================
    // CARGAR INFORMACIÓN COMPLETA
    // ======================================================

    const cargarResultado =
        async () => {

            try {

                setCargando(true);

                setError(null);


                // ==================================================
                // 1. RESULTADO PRINCIPAL
                // ==================================================

                const {
                    data:
                        resultadoData,

                    error:
                        resultadoError,

                } = await supabase

                    .from(
                        "resultado_test"
                    )

                    .select(`
                        id_resultado,
                        id_ejecucion,
                        puntaje_directo,
                        puntaje_total,
                        nivel_cualitativo,
                        interpretacion_texto,
                        es_valido,
                        observaciones,
                        fecha_generacion,
                        fecha_actualizacion,
                        id_baremo,
                        id_rango_baremo,
                        tipo_finalizacion
                    `)

                    .eq(
                        "id_resultado",
                        idResultado
                    )

                    .maybeSingle();


                if (
                    resultadoError
                ) {
                    throw resultadoError;
                }


                if (
                    !resultadoData
                ) {

                    throw new Error(
                        "No se encontró el resultado solicitado."
                    );

                }


                const resultadoPreparado =
                    resultadoData as ResultadoTest;


                setResultado(
                    resultadoPreparado
                );


                // ==================================================
                // 2. EJECUCIÓN
                // ==================================================

                const {
                    data:
                        ejecucionData,

                    error:
                        ejecucionError,

                } = await supabase

                    .from(
                        "ejecucion_test"
                    )

                    .select(`
                        id_ejecucion,
                        id_usuario,
                        id_test,
                        estado,
                        fecha_inicio,
                        fecha_fin,
                        fecha_actualizacion
                    `)

                    .eq(
                        "id_ejecucion",
                        resultadoPreparado.id_ejecucion
                    )

                    .maybeSingle();


                if (
                    ejecucionError
                ) {
                    throw ejecucionError;
                }


                if (
                    !ejecucionData
                ) {

                    throw new Error(
                        "No se encontró la ejecución asociada al resultado."
                    );

                }


                const ejecucionPreparada =
                    ejecucionData as EjecucionTest;


                // ==================================================
                // 3. TEST
                // ==================================================

                const {
                    data:
                        testData,

                    error:
                        testError,

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
                        fecha_creacion,
                        fecha_actualizacion
                    `)

                    .eq(
                        "id_test",
                        ejecucionPreparada.id_test
                    )

                    .maybeSingle();


                if (
                    testError
                ) {
                    throw testError;
                }


                if (
                    !testData
                ) {

                    throw new Error(
                        "No se encontró la información del cuestionario."
                    );

                }


                setCuestionario(
                    testData as Test
                );


                // ==================================================
                // 4. BAREMO UTILIZADO
                // ==================================================

                if (
                    resultadoPreparado.id_baremo
                ) {

                    const {
                        data:
                            baremoData,

                        error:
                            baremoError,

                    } = await supabase

                        .from(
                            "baremo_test"
                        )

                        .select(`
                            id_baremo,
                            id_test,
                            codigo,
                            nombre,
                            descripcion,
                            poblacion,
                            sexo_aplicable,
                            edad_minima,
                            edad_maxima,
                            tipo_valor,
                            version,
                            fuente,
                            estado,
                            fecha_creacion,
                            fecha_actualizacion
                        `)

                        .eq(
                            "id_baremo",
                            resultadoPreparado.id_baremo
                        )

                        .maybeSingle();


                    if (
                        baremoError
                    ) {
                        throw baremoError;
                    }


                    if (
                        baremoData
                    ) {

                        setBaremo(
                            baremoData as BaremoTest
                        );


                        // ==========================================
                        // RANGOS GLOBALES
                        // ==========================================

                        const {
                            data:
                                rangosData,

                            error:
                                rangosError,

                        } = await supabase

                            .from(
                                "rango_baremo"
                            )

                            .select(`
                                id_rango,
                                id_baremo,
                                id_subescala,
                                nivel,
                                valor_minimo,
                                valor_maximo,
                                interpretacion,
                                orden,
                                estado,
                                fecha_creacion,
                                fecha_actualizacion
                            `)

                            .eq(
                                "id_baremo",
                                resultadoPreparado.id_baremo
                            )

                            .is(
                                "id_subescala",
                                null
                            )

                            .eq(
                                "estado",
                                true
                            )

                            .order(
                                "orden",
                                {
                                    ascending:
                                        true,
                                }
                            );


                        if (
                            rangosError
                        ) {
                            throw rangosError;
                        }


                        setRangosGlobales(
                            (
                                rangosData ??
                                []
                            ) as RangoBaremo[]
                        );

                    }

                }


                // ==================================================
                // 5. RANGO APLICADO
                // ==================================================

                if (
                    resultadoPreparado.id_rango_baremo
                ) {

                    const {
                        data:
                            rangoData,

                        error:
                            rangoError,

                    } = await supabase

                        .from(
                            "rango_baremo"
                        )

                        .select(`
                            id_rango,
                            id_baremo,
                            id_subescala,
                            nivel,
                            valor_minimo,
                            valor_maximo,
                            interpretacion,
                            orden,
                            estado,
                            fecha_creacion,
                            fecha_actualizacion
                        `)

                        .eq(
                            "id_rango",
                            resultadoPreparado.id_rango_baremo
                        )

                        .maybeSingle();


                    if (
                        rangoError
                    ) {
                        throw rangoError;
                    }


                    if (
                        rangoData
                    ) {

                        setRangoAplicado(
                            rangoData as RangoBaremo
                        );

                    }

                }


                // ==================================================
                // 6. RESULTADOS DE SUBESCALAS
                // ==================================================

                const {
                    data:
                        subescalasData,

                    error:
                        subescalasError,

                } = await supabase

                    .from(
                        "resultado_subescala"
                    )

                    .select(`
                        id_resultado_subescala,
                        id_resultado,
                        id_subescala,
                        puntaje_directo,
                        puntaje_transformado,
                        nivel_cualitativo,
                        interpretacion_texto,

                        subescala (
                            codigo,
                            nombre,
                            descripcion,
                            orden
                        )
                    `)

                    .eq(
                        "id_resultado",
                        resultadoPreparado.id_resultado
                    );


                if (
                    subescalasError
                ) {
                    throw subescalasError;
                }


                const subescalasPreparadas =
                    (
                        subescalasData ??
                        []
                    ) as unknown as ResultadoSubescala[];


                subescalasPreparadas.sort(
                    (
                        a,
                        b
                    ) =>

                        (
                            a.subescala
                                ?.orden ??
                            0
                        ) -

                        (
                            b.subescala
                                ?.orden ??
                            0
                        )
                );


                setResultadosSubescalas(
                    subescalasPreparadas
                );


            } catch (
                error
            ) {

                console.error(
                    "Error cargando resultado:",
                    error
                );


                setError(

                    error instanceof Error

                        ? error.message

                        : "No fue posible cargar el resultado."

                );


            } finally {

                setCargando(
                    false
                );

            }

        };


    // ======================================================
    // PUNTAJES
    // ======================================================

    const puntajeDirecto =
        Number(
            resultado
                ?.puntaje_directo ??
            0
        );


    const puntajeTotal =
        Number(
            resultado
                ?.puntaje_total ??
            resultado
                ?.puntaje_directo ??
            0
        );


    // ======================================================
    // RANGO TEÓRICO / VISUAL
    // ======================================================

    const rangoVisual =
        useMemo(
            () => {

                if (
                    rangosGlobales.length ===
                    0
                ) {

                    return {

                        minimo:
                            null as number | null,

                        maximo:
                            null as number | null,

                        porcentaje:
                            null as number | null,

                        tieneRangoNegativo:
                            false,

                    };

                }


                // ==============================================
                // LÍMITES INFERIORES
                // ==============================================

                const limitesInferiores =
                    rangosGlobales

                        .map(
                            rango => {

                                if (
                                    rango.valor_minimo ===
                                    null
                                ) {
                                    return null;
                                }


                                const valor =
                                    Number(
                                        rango.valor_minimo
                                    );


                                return Number.isNaN(
                                    valor
                                )

                                    ? null

                                    : valor;

                            }
                        )

                        .filter(
                            (
                                valor
                            ): valor is number =>
                                valor !== null
                        );


                // ==============================================
                // LÍMITES SUPERIORES
                // ==============================================

                const limitesSuperiores =
                    rangosGlobales

                        .map(
                            rango => {

                                if (
                                    rango.valor_maximo ===
                                    null
                                ) {
                                    return null;
                                }


                                const valor =
                                    Number(
                                        rango.valor_maximo
                                    );


                                return Number.isNaN(
                                    valor
                                )

                                    ? null

                                    : valor;

                            }
                        )

                        .filter(
                            (
                                valor
                            ): valor is number =>
                                valor !== null
                        );


                if (
                    limitesInferiores.length ===
                        0 ||
                    limitesSuperiores.length ===
                        0
                ) {

                    return {

                        minimo:
                            null,

                        maximo:
                            null,

                        porcentaje:
                            null,

                        tieneRangoNegativo:
                            false,

                    };

                }


                const minimo =
                    Math.min(
                        ...limitesInferiores
                    );


                const maximo =
                    Math.max(
                        ...limitesSuperiores
                    );


                const tieneRangoNegativo =
                    minimo < 0;


                if (
                    maximo <=
                    minimo
                ) {

                    return {

                        minimo,

                        maximo,

                        porcentaje:
                            null,

                        tieneRangoNegativo,

                    };

                }


                // ==============================================
                // NORMALIZACIÓN
                // ==============================================

                const posicion =
                    (
                        puntajeTotal -
                        minimo
                    ) /
                    (
                        maximo -
                        minimo
                    );


                const porcentaje =
                    Math.round(

                        Math.max(
                            0,

                            Math.min(
                                1,
                                posicion
                            )
                        ) *
                        100
                    );


                return {

                    minimo,

                    maximo,

                    porcentaje,

                    tieneRangoNegativo,

                };

            },
            [
                rangosGlobales,
                puntajeTotal,
            ]
        );


    // ======================================================
    // FORMATEAR PUNTAJE
    // ======================================================

    const formatearPuntaje =
        (
            valor:
                number
        ) => {

            if (
                rangoVisual.tieneRangoNegativo &&
                valor > 0
            ) {

                return (
                    `+${valor}`
                );

            }


            return (
                valor.toString()
            );

        };


    // ======================================================
    // PRESENTACIÓN RESULTADO
    // ======================================================

    const presentacionResultado =
        useMemo(
            () => {

                if (
                    resultado
                        ?.tipo_finalizacion ===
                    "regla_instrumento"
                ) {

                    return {

                        icono:
                            "flag-outline" as const,

                        color:
                            "#F59E0B",

                        fondo:
                            "bg-amber-50",

                    };

                }


                if (
                    resultado &&
                    !resultado.es_valido
                ) {

                    return {

                        icono:
                            "warning-outline" as const,

                        color:
                            "#EF4444",

                        fondo:
                            "bg-red-50",

                    };

                }


                return {

                    icono:
                        "analytics-outline" as const,

                    color:
                        "#4F8EF7",

                    fondo:
                        "bg-blue-50",

                };

            },
            [
                resultado,
            ]
        );


    // ======================================================
    // TEXTO DE FINALIZACIÓN
    // ======================================================

    const textoTipoFinalizacion =

        resultado
            ?.tipo_finalizacion ===
        "regla_instrumento"

            ? "Aplicación finalizada según una regla establecida por el instrumento."

            : "Aplicación completada normalmente.";


    // ======================================================
    // VOLVER A CUESTIONARIOS
    // ======================================================

    const volverACuestionarios =
        () => {

            router.replace(
                "/cuestionarios" as any
            );

        };


    // ======================================================
    // CARGANDO
    // ======================================================

    if (
        cargando
    ) {

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

                    Cargando resultado...

                </Text>

            </View>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (
        error ||
        !resultado ||
        !cuestionario
    ) {

        return (

            <View className="flex-1 bg-slate-50 items-center justify-center px-6">

                <Ionicons
                    name="alert-circle-outline"
                    size={50}
                    color="#B8A8F8"
                />


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            20,

                        color:
                            "#2D3748",

                        marginTop:
                            12,

                        textAlign:
                            "center",
                    }}
                >

                    {
                        error ??
                        "No fue posible obtener el resultado."
                    }

                </Text>


                <Pressable

                    onPress={
                        volverACuestionarios
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

                        Volver a cuestionarios

                    </Text>

                </Pressable>

            </View>

        );

    }


    // ======================================================
    // INTERFAZ
    // ======================================================

    return (

        <View className="flex-1 bg-slate-50">

            <ScrollView

                className="flex-1"

                contentContainerStyle={{
                    paddingHorizontal:
                        20,

                    paddingTop:
                        18,

                    paddingBottom:
                        120,
                }}

                showsVerticalScrollIndicator={
                    false
                }

                bounces={
                    false
                }

                overScrollMode="never"

            >


                {/* ==================================================
                    VOLVER
                ================================================== */}

                <Pressable

                    onPress={
                        volverACuestionarios
                    }

                    className="w-10 h-10 items-center justify-center mb-2"

                >

                    <Ionicons
                        name="arrow-back-outline"
                        size={25}
                        color="#64748B"
                    />

                </Pressable>


                {/* ==================================================
                    CABECERA
                ================================================== */}

                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            28,

                        color:
                            "#2D3748",
                    }}
                >

                    Tus resultados

                </Text>


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            15,

                        lineHeight:
                            21,

                        color:
                            "#64748B",

                        marginTop:
                            8,
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
                            "#94A3B8",

                        marginTop:
                            5,

                        marginBottom:
                            24,
                    }}
                >

                    El resultado mostrado corresponde a la evaluación realizada y conserva la interpretación registrada al momento de finalizar el instrumento.

                </Text>


                {/* ==================================================
                    RESULTADO PRINCIPAL
                ================================================== */}

                <View className="bg-white rounded-3xl p-6 shadow-md mb-5 items-center">

                    <View className="w-32 h-32 rounded-full bg-blue-50 items-center justify-center">

                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    36,

                                color:
                                    "#4F8EF7",
                            }}
                        >

                            {
                                formatearPuntaje(
                                    puntajeTotal
                                )
                            }

                        </Text>


                        {
                            rangoVisual.minimo !==
                                null &&
                            rangoVisual.maximo !==
                                null && (

                                <Text
                                    style={{
                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            13,

                                        color:
                                            "#64748B",

                                        marginTop:
                                            2,
                                    }}
                                >

                                    {
                                        rangoVisual.tieneRangoNegativo

                                            ? `${formatearPuntaje(
                                                rangoVisual.minimo
                                            )} a ${formatearPuntaje(
                                                rangoVisual.maximo
                                            )}`

                                            : `de ${rangoVisual.maximo}`
                                    }

                                </Text>

                            )
                        }

                    </View>


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-SemiBold",

                            fontSize:
                                12,

                            color:
                                "#94A3B8",

                            marginTop:
                                15,

                            textTransform:
                                "uppercase",
                        }}
                    >

                        Puntuación total

                    </Text>


                    {
                        rangoVisual.porcentaje !==
                            null &&
                        rangoVisual.minimo !==
                            null &&
                        rangoVisual.maximo !==
                            null && (

                            <>

                                <View className="w-full h-2 bg-slate-200 rounded-full mt-5 overflow-hidden">

                                    <View

                                        className="h-full bg-blue-500 rounded-full"

                                        style={{
                                            width:
                                                `${rangoVisual.porcentaje}%`,
                                        }}

                                    />

                                </View>


                                <View className="w-full flex-row justify-between mt-2">

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Medium",

                                            fontSize:
                                                11,

                                            color:
                                                "#94A3B8",
                                        }}
                                    >

                                        {
                                            formatearPuntaje(
                                                rangoVisual.minimo
                                            )
                                        }

                                    </Text>


                                    {
                                        rangoVisual.tieneRangoNegativo && (

                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-Medium",

                                                    fontSize:
                                                        11,

                                                    color:
                                                        "#94A3B8",
                                                }}
                                            >

                                                0

                                            </Text>

                                        )
                                    }


                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Medium",

                                            fontSize:
                                                11,

                                            color:
                                                "#94A3B8",
                                        }}
                                    >

                                        {
                                            formatearPuntaje(
                                                rangoVisual.maximo
                                            )
                                        }

                                    </Text>

                                </View>


                                <Text
                                    style={{
                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            12,

                                        color:
                                            "#94A3B8",

                                        marginTop:
                                            7,

                                        textAlign:
                                            "center",
                                    }}
                                >

                                    Posición dentro del rango de la escala:{" "}

                                    {
                                        rangoVisual.porcentaje
                                    }
                                    %

                                </Text>

                            </>

                        )
                    }


                    {
                        resultado.puntaje_directo !==
                            null &&
                        puntajeDirecto !==
                            puntajeTotal && (

                            <View className="bg-slate-50 rounded-xl px-4 py-2 mt-4">

                                <Text
                                    style={{
                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            12,

                                        color:
                                            "#64748B",
                                    }}
                                >

                                    Puntaje directo:{" "}

                                    {
                                        formatearPuntaje(
                                            puntajeDirecto
                                        )
                                    }

                                </Text>

                            </View>

                        )
                    }

                </View>


                {/* ==================================================
                    INTERPRETACIÓN
                ================================================== */}

                <View
                    className={`${presentacionResultado.fondo} rounded-3xl p-5 mb-5`}
                >

                    <View className="flex-row items-start">

                        <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center">

                            <Ionicons

                                name={
                                    presentacionResultado.icono
                                }

                                size={
                                    27
                                }

                                color={
                                    presentacionResultado.color
                                }

                            />

                        </View>


                        <View className="flex-1 ml-3">

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        18,

                                    lineHeight:
                                        23,

                                    color:
                                        "#2D3748",
                                }}
                            >

                                {
                                    resultado.nivel_cualitativo ??
                                    rangoAplicado?.nivel ??
                                    "Resultado de la evaluación"
                                }

                            </Text>


                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Medium",

                                    fontSize:
                                        14,

                                    lineHeight:
                                        21,

                                    color:
                                        "#475569",

                                    marginTop:
                                        9,
                                }}
                            >

                                {
                                    resultado.interpretacion_texto ??
                                    rangoAplicado?.interpretacion ??
                                    "El instrumento no tiene una interpretación cualitativa configurada para este resultado."
                                }

                            </Text>

                        </View>

                    </View>

                </View>


                {/* ==================================================
                    ESTADO
                ================================================== */}

                <View className="bg-white rounded-3xl p-5 shadow-md mb-5">

                    <View className="flex-row items-start">

                        <View
                            className={`w-12 h-12 rounded-2xl items-center justify-center ${
                                resultado.tipo_finalizacion ===
                                "regla_instrumento"

                                    ? "bg-amber-50"

                                    : "bg-emerald-50"
                            }`}
                        >

                            <Ionicons

                                name={
                                    resultado.tipo_finalizacion ===
                                    "regla_instrumento"

                                        ? "flag-outline"

                                        : "checkmark-circle-outline"
                                }

                                size={
                                    24
                                }

                                color={
                                    resultado.tipo_finalizacion ===
                                    "regla_instrumento"

                                        ? "#F59E0B"

                                        : "#10B981"
                                }

                            />

                        </View>


                        <View className="flex-1 ml-3">

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        17,

                                    color:
                                        "#2D3748",
                                }}
                            >

                                Estado de la aplicación

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
                                        6,
                                }}
                            >

                                {
                                    textoTipoFinalizacion
                                }

                            </Text>


                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Medium",

                                    fontSize:
                                        13,

                                    color:
                                        resultado.es_valido
                                            ? "#059669"
                                            : "#DC2626",

                                    marginTop:
                                        7,
                                }}
                            >

                                {
                                    resultado.es_valido
                                        ? "Resultado válido"
                                        : "Resultado marcado como no válido"
                                }

                            </Text>

                        </View>

                    </View>

                </View>


                {/* ==================================================
                    SUBESCALAS
                ================================================== */}

                {
                    resultadosSubescalas.length >
                        0 && (

                        <View className="mb-6">

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        20,

                                    color:
                                        "#2D3748",

                                    marginBottom:
                                        14,
                                }}
                            >

                                Resultados por área

                            </Text>


                            <View className="gap-4">

                                {
                                    resultadosSubescalas.map(
                                        (
                                            subResultado
                                        ) => {

                                            const puntajeSubescala =
                                                Number(
                                                    subResultado
                                                        .puntaje_transformado ??
                                                    subResultado
                                                        .puntaje_directo ??
                                                    0
                                                );


                                            return (

                                                <View

                                                    key={
                                                        subResultado.id_resultado_subescala
                                                    }

                                                    className="bg-white rounded-3xl p-5 shadow-md"

                                                >

                                                    <View className="flex-row items-start justify-between">

                                                        <View className="flex-1">

                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        "Nunito-Bold",

                                                                    fontSize:
                                                                        18,

                                                                    color:
                                                                        "#2D3748",
                                                                }}
                                                            >

                                                                {
                                                                    subResultado.subescala
                                                                        ?.nombre ??
                                                                    "Área evaluada"
                                                                }

                                                            </Text>


                                                            {
                                                                subResultado
                                                                    .subescala
                                                                    ?.descripcion && (

                                                                    <Text
                                                                        style={{
                                                                            fontFamily:
                                                                                "Nunito-Medium",

                                                                            fontSize:
                                                                                13,

                                                                            lineHeight:
                                                                                18,

                                                                            color:
                                                                                "#94A3B8",

                                                                            marginTop:
                                                                                4,
                                                                        }}
                                                                    >

                                                                        {
                                                                            subResultado
                                                                                .subescala
                                                                                .descripcion
                                                                        }

                                                                    </Text>

                                                                )
                                                            }

                                                        </View>


                                                        <View className="bg-blue-50 rounded-xl px-3 py-2 ml-3">

                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        "Nunito-Bold",

                                                                    fontSize:
                                                                        16,

                                                                    color:
                                                                        "#4F8EF7",
                                                                }}
                                                            >

                                                                {
                                                                    puntajeSubescala
                                                                }

                                                            </Text>

                                                        </View>

                                                    </View>


                                                    {
                                                        subResultado
                                                            .nivel_cualitativo && (

                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        "Nunito-Bold",

                                                                    fontSize:
                                                                        14,

                                                                    color:
                                                                        "#475569",

                                                                    marginTop:
                                                                        12,
                                                                }}
                                                            >

                                                                {
                                                                    subResultado
                                                                        .nivel_cualitativo
                                                                }

                                                            </Text>

                                                        )
                                                    }


                                                    {
                                                        subResultado
                                                            .interpretacion_texto && (

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
                                                                        7,
                                                                }}
                                                            >

                                                                {
                                                                    subResultado
                                                                        .interpretacion_texto
                                                                }

                                                            </Text>

                                                        )
                                                    }

                                                </View>

                                            );

                                        }
                                    )
                                }

                            </View>

                        </View>

                    )
                }


                {/* ==================================================
                    BAREMO
                ================================================== */}

                {
                    baremo && (

                        <View className="bg-white rounded-3xl p-5 shadow-md mb-5">

                            <View className="flex-row items-start">

                                <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center">

                                    <Ionicons
                                        name="analytics-outline"
                                        size={24}
                                        color="#B8A8F8"
                                    />

                                </View>


                                <View className="flex-1 ml-3">

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Bold",

                                            fontSize:
                                                17,

                                            color:
                                                "#2D3748",
                                        }}
                                    >

                                        Baremo utilizado

                                    </Text>


                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-SemiBold",

                                            fontSize:
                                                14,

                                            color:
                                                "#475569",

                                            marginTop:
                                                7,
                                        }}
                                    >

                                        {
                                            baremo.nombre
                                        }

                                    </Text>


                                    {
                                        baremo.version && (

                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-Medium",

                                                    fontSize:
                                                        13,

                                                    color:
                                                        "#64748B",

                                                    marginTop:
                                                        4,
                                                }}
                                            >

                                                Versión:{" "}

                                                {
                                                    baremo.version
                                                }

                                            </Text>

                                        )
                                    }


                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Medium",

                                            fontSize:
                                                13,

                                            color:
                                                "#64748B",

                                            marginTop:
                                                4,
                                        }}
                                    >

                                        Valor interpretado:{" "}

                                        {
                                            baremo.tipo_valor
                                        }

                                    </Text>


                                    {
                                        rangoAplicado && (

                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-Medium",

                                                    fontSize:
                                                        13,

                                                    color:
                                                        "#64748B",

                                                    marginTop:
                                                        4,
                                                }}
                                            >

                                                Rango aplicado:{" "}

                                                {
                                                    rangoAplicado.valor_minimo ===
                                                    null

                                                        ? "Sin límite inferior"

                                                        : formatearPuntaje(
                                                            Number(
                                                                rangoAplicado.valor_minimo
                                                            )
                                                        )
                                                }

                                                {" – "}

                                                {
                                                    rangoAplicado.valor_maximo ===
                                                    null

                                                        ? "Sin límite superior"

                                                        : formatearPuntaje(
                                                            Number(
                                                                rangoAplicado.valor_maximo
                                                            )
                                                        )
                                                }

                                            </Text>

                                        )
                                    }

                                </View>

                            </View>

                        </View>

                    )
                }


                {/* ==================================================
                    INFORMACIÓN
                ================================================== */}

                <View className="bg-white rounded-3xl p-5 shadow-md mb-6">

                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                17,

                            color:
                                "#2D3748",

                            marginBottom:
                                14,
                        }}
                    >

                        Información de la evaluación

                    </Text>


                    <View className="flex-row items-center mb-3">

                        <Ionicons
                            name="document-text-outline"
                            size={18}
                            color="#64748B"
                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    14,

                                color:
                                    "#64748B",

                                marginLeft:
                                    8,
                            }}
                        >

                            Código:{" "}

                            {
                                cuestionario.codigo
                            }

                        </Text>

                    </View>


                    {
                        cuestionario.version && (

                            <View className="flex-row items-center mb-3">

                                <Ionicons
                                    name="layers-outline"
                                    size={18}
                                    color="#64748B"
                                />


                                <Text
                                    style={{
                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            14,

                                        color:
                                            "#64748B",

                                        marginLeft:
                                            8,
                                    }}
                                >

                                    Versión:{" "}

                                    {
                                        cuestionario.version
                                    }

                                </Text>

                            </View>

                        )
                    }


                    <View className="flex-row items-center mb-3">

                        <Ionicons

                            name={
                                cuestionario.tipo_aplicacion ===
                                "profesional"

                                    ? "medkit-outline"

                                    : "person-outline"
                            }

                            size={
                                18
                            }

                            color="#64748B"

                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    14,

                                color:
                                    "#64748B",

                                marginLeft:
                                    8,
                            }}
                        >

                            Aplicación:{" "}

                            {
                                cuestionario.tipo_aplicacion ===
                                "profesional"

                                    ? "Profesional"

                                    : "Autoadministrada"
                            }

                        </Text>

                    </View>


                    <View className="flex-row items-center">

                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="#64748B"
                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    14,

                                color:
                                    "#64748B",

                                marginLeft:
                                    8,
                            }}
                        >

                            Resultado generado:{" "}

                            {
                                new Date(
                                    resultado.fecha_generacion
                                ).toLocaleDateString()
                            }

                        </Text>

                    </View>

                </View>


                {/* ==================================================
                    OBSERVACIONES
                ================================================== */}

                {
                    resultado.observaciones && (

                        <View className="bg-amber-50 rounded-3xl p-5 mb-6">

                            <View className="flex-row items-start">

                                <Ionicons
                                    name="reader-outline"
                                    size={24}
                                    color="#F59E0B"
                                />


                                <View className="flex-1 ml-3">

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Bold",

                                            fontSize:
                                                16,

                                            color:
                                                "#2D3748",
                                        }}
                                    >

                                        Observaciones

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
                                                7,
                                        }}
                                    >

                                        {
                                            resultado.observaciones
                                        }

                                    </Text>

                                </View>

                            </View>

                        </View>

                    )
                }


                {/* ==================================================
                    REPORTE
                ================================================== */}

                <View className="bg-blue-500 rounded-3xl p-5 mb-6">

                    <View className="flex-row items-center mb-3">

                        <View className="w-11 h-11 bg-white/20 rounded-xl items-center justify-center">

                            <Ionicons
                                name="document-text-outline"
                                size={24}
                                color="#FFFFFF"
                            />

                        </View>


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    20,

                                color:
                                    "#FFFFFF",

                                marginLeft:
                                    12,
                            }}
                        >

                            Compartir reporte

                        </Text>

                    </View>


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
                        }}
                    >

                        Próximamente podrás generar un informe detallado con los datos de esta evaluación para conservarlo o compartirlo con un profesional autorizado.

                    </Text>


                    <Pressable

                        disabled

                        className="bg-white/70 rounded-xl py-3 mt-5 items-center"

                    >

                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-SemiBold",

                                fontSize:
                                    14,

                                color:
                                    "#64748B",
                            }}
                        >

                            Exportar a PDF

                        </Text>

                    </Pressable>

                </View>


                {/* ==================================================
                    AVISO
                ================================================== */}

                <View className="bg-blue-100 rounded-3xl p-5 flex-row items-start">

                    <Ionicons
                        name="information-circle-outline"
                        size={28}
                        color="#4F8EF7"
                    />


                    <View className="flex-1 ml-3">

                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    15,

                                color:
                                    "#2D3748",
                            }}
                        >

                            AVISO IMPORTANTE

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
                                    "#475569",

                                marginTop:
                                    7,
                            }}
                        >

                            Los resultados deben interpretarse según las características y criterios del instrumento aplicado. La puntuación obtenida no constituye por sí sola un diagnóstico médico o psicológico y no sustituye una valoración profesional cuando esta sea necesaria.

                        </Text>

                    </View>

                </View>


                {/* ==================================================
                    VOLVER
                ================================================== */}

                <Pressable

                    onPress={
                        volverACuestionarios
                    }

                    className="bg-blue-500 rounded-xl py-4 mt-6 flex-row items-center justify-center"

                >

                    <Ionicons
                        name="document-text-outline"
                        size={18}
                        color="#FFFFFF"
                    />


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-SemiBold",

                            fontSize:
                                15,

                            color:
                                "#FFFFFF",

                            marginLeft:
                                7,
                        }}
                    >

                        Volver a cuestionarios

                    </Text>

                </Pressable>

            </ScrollView>

        </View>

    );

}