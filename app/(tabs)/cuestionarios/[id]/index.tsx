import OpcionRespuesta from "@/components/cuestionarios/OpcionRespuesta";
import ProgresoCuestionario from "@/components/cuestionarios/ProgresoCuestionario";
import { supabase } from "@/lib/supabase";

import { Ionicons } from "@expo/vector-icons";

import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";


const PREGUNTAS_POR_PAGINA = 4;


// ==========================================================
// TIPOS
// ==========================================================

interface Test {
    id_test: string;
    codigo: string;
    nombre: string;

    descripcion:
        string | null;

    instrucciones:
        string | null;

    poblacion_objetivo:
        string | null;

    tipo_aplicacion:
        | "autoadministrado"
        | "profesional";

    tiene_subescalas:
        boolean;

    version:
        string | null;

    estado:
        boolean;
}


interface Usuario {
    id_usuario: string;

    fecha_nacimiento:
        string | null;

    genero:
        string | null;

    estado:
        string;
}


interface Subescala {
    id_subescala: string;
    id_test: string;
    codigo: string;
    nombre: string;

    descripcion:
        string | null;

    orden:
        number;

    incluye_total:
        boolean;
}


interface OpcionTestDB {
    id_opcion: string;
    id_pregunta: string;
    codigo: string;
    etiqueta: string;

    valor_puntaje:
        number |
        string |
        null;

    orden:
        number;

    estado:
        boolean;
}


interface OpcionRespuestaTest {
    id: string;
    codigo: string;
    texto: string;

    valor:
        number | null;

    orden:
        number;
}


interface PreguntaTest {
    id_pregunta: string;
    id_test: string;

    id_subescala:
        string | null;

    codigo:
        string;

    enunciado:
        string;

    descripcion_apoyo:
        string | null;

    tipo_pregunta:
        | "opcion_unica"
        | "opcion_multiple"
        | "texto"
        | "numero"
        | "escala";

    orden:
        number;

    obligatoria:
        boolean;

    puntua:
        boolean;

    es_observacional:
        boolean;

    permite_comentario:
        boolean;

    estado:
        boolean;

    opciones:
        OpcionRespuestaTest[];
}


interface RespuestaSeleccionada {
    idOpcion: string;

    valor:
        number | null;
}


interface EjecucionTest {
    id_ejecucion: string;
    id_usuario: string;
    id_test: string;

    estado:
        | "en_progreso"
        | "completado"
        | "abandonado";
}


interface Baremo {
    id_baremo: string;
    id_test: string;
    codigo: string;
    nombre: string;

    poblacion:
        string | null;

    sexo_aplicable:
        string | null;

    edad_minima:
        number | null;

    edad_maxima:
        number | null;

    tipo_valor:
        | "puntaje_directo"
        | "puntaje_total"
        | "percentil"
        | "puntaje_t"
        | "eneatipo";

    version:
        string | null;

    fuente:
        string | null;
}


interface RangoBaremo {
    id_rango: string;
    id_baremo: string;

    id_subescala:
        string | null;

    nivel:
        string;

    valor_minimo:
        number |
        string |
        null;

    valor_maximo:
        number |
        string |
        null;

    interpretacion:
        string | null;

    orden:
        number;
}


interface ResultadoGuardado {
    id_resultado: string;
    id_ejecucion: string;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function CuestionarioDetalle() {

    const router =
        useRouter();


    // ======================================================
    // SCROLL
    // ======================================================

    const scrollViewRef =
        useRef<ScrollView>(null);


    const { id } =
        useLocalSearchParams<{
            id: string;
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
        usuario,
        setUsuario,
    ] = useState<Usuario | null>(
        null
    );


    const [
        preguntas,
        setPreguntas,
    ] = useState<PreguntaTest[]>(
        []
    );


    const [
        subescalas,
        setSubescalas,
    ] = useState<Subescala[]>(
        []
    );


    const [
        respuestas,
        setRespuestas,
    ] = useState<
        Record<
            string,
            RespuestaSeleccionada
        >
    >({});


    const [
        idEjecucion,
        setIdEjecucion,
    ] = useState<string | null>(
        null
    );


    const [
        paginaActual,
        setPaginaActual,
    ] = useState(0);


    const [
        cargando,
        setCargando,
    ] = useState(true);


    const [
        finalizando,
        setFinalizando,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );


    // ======================================================
    // CARGA INICIAL
    // ======================================================

    useEffect(() => {

        if (!id) {
            return;
        }

        cargarCuestionario();

    }, [id]);


    // ======================================================
    // VOLVER ARRIBA AL CAMBIAR DE PÁGINA
    // ======================================================

    useEffect(() => {

        requestAnimationFrame(
            () => {

                scrollViewRef.current
                    ?.scrollTo({
                        y: 0,
                        animated: true,
                    });

            }
        );

    }, [paginaActual]);


    // ======================================================
    // CALCULAR EDAD
    // ======================================================

    const calcularEdad =
        (
            fechaNacimiento:
                string | null
        ): number | null => {

            if (!fechaNacimiento) {
                return null;
            }


            const nacimiento =
                new Date(
                    `${fechaNacimiento}T00:00:00`
                );


            if (
                Number.isNaN(
                    nacimiento.getTime()
                )
            ) {
                return null;
            }


            const hoy =
                new Date();


            let edad =
                hoy.getFullYear() -
                nacimiento.getFullYear();


            const diferenciaMes =
                hoy.getMonth() -
                nacimiento.getMonth();


            if (
                diferenciaMes < 0 ||
                (
                    diferenciaMes === 0 &&
                    hoy.getDate() <
                    nacimiento.getDate()
                )
            ) {
                edad--;
            }


            return edad;

        };


    // ======================================================
    // USUARIO ACTUAL
    // ======================================================

    const obtenerUsuarioActual =
        async (): Promise<Usuario> => {

            const {
                data: {
                    user,
                },

                error:
                    authError,

            } =
                await supabase
                    .auth
                    .getUser();


            if (authError) {
                throw authError;
            }


            if (!user) {

                throw new Error(
                    "Debes iniciar sesión para responder este cuestionario."
                );

            }


            const {
                data,

                error:
                    usuarioError,

            } = await supabase

                .from("usuario")

                .select(`
                    id_usuario,
                    fecha_nacimiento,
                    genero,
                    estado
                `)

                .eq(
                    "id_usuario",
                    user.id
                )

                .maybeSingle();


            if (usuarioError) {
                throw usuarioError;
            }


            if (!data) {

                throw new Error(
                    "No fue posible encontrar tu perfil de usuario."
                );

            }


            if (
                data.estado !==
                "activo"
            ) {

                throw new Error(
                    "La cuenta no se encuentra activa."
                );

            }


            return (
                data as Usuario
            );

        };


    // ======================================================
    // EJECUCIÓN
    // ======================================================

    const obtenerOCrearEjecucion =
        async (
            idUsuario:
                string,

            idTest:
                string
        ): Promise<EjecucionTest> => {

            const {
                data:
                    existente,

                error:
                    errorExistente,

            } = await supabase

                .from(
                    "ejecucion_test"
                )

                .select(`
                    id_ejecucion,
                    id_usuario,
                    id_test,
                    estado
                `)

                .eq(
                    "id_usuario",
                    idUsuario
                )

                .eq(
                    "id_test",
                    idTest
                )

                .eq(
                    "estado",
                    "en_progreso"
                )

                .maybeSingle();


            if (errorExistente) {
                throw errorExistente;
            }


            if (existente) {

                return (
                    existente as EjecucionTest
                );

            }


            const {
                data:
                    nueva,

                error:
                    errorNueva,

            } = await supabase

                .from(
                    "ejecucion_test"
                )

                .insert({
                    id_usuario:
                        idUsuario,

                    id_test:
                        idTest,

                    estado:
                        "en_progreso",
                })

                .select(`
                    id_ejecucion,
                    id_usuario,
                    id_test,
                    estado
                `)

                .single();


            if (errorNueva) {
                throw errorNueva;
            }


            return (
                nueva as EjecucionTest
            );

        };


    // ======================================================
    // CARGAR CUESTIONARIO
    // ======================================================

    const cargarCuestionario =
        async () => {

            try {

                setCargando(true);
                setError(null);


                // ==================================================
                // TEST
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
                        estado
                    `)

                    .eq(
                        "codigo",
                        id
                    )

                    .eq(
                        "estado",
                        true
                    )

                    .maybeSingle();


                if (testError) {
                    throw testError;
                }


                if (!testData) {

                    throw new Error(
                        "El cuestionario solicitado no se encuentra disponible."
                    );

                }


                const test =
                    testData as Test;


                setCuestionario(
                    test
                );


                // ==================================================
                // USUARIO
                // ==================================================

                const usuarioActual =
                    await obtenerUsuarioActual();


                setUsuario(
                    usuarioActual
                );


                // ==================================================
                // EJECUCIÓN
                // ==================================================

                const ejecucion =
                    await obtenerOCrearEjecucion(
                        usuarioActual.id_usuario,
                        test.id_test
                    );


                setIdEjecucion(
                    ejecucion.id_ejecucion
                );


                // ==================================================
                // SUBESCALAS
                // ==================================================

                const {
                    data:
                        subescalasData,

                    error:
                        subescalasError,

                } = await supabase

                    .from("subescala")

                    .select(`
                        id_subescala,
                        id_test,
                        codigo,
                        nombre,
                        descripcion,
                        orden,
                        incluye_total
                    `)

                    .eq(
                        "id_test",
                        test.id_test
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


                if (subescalasError) {
                    throw subescalasError;
                }


                const subescalasPreparadas =
                    (
                        subescalasData ??
                        []
                    ) as Subescala[];


                setSubescalas(
                    subescalasPreparadas
                );


                // ==================================================
                // PREGUNTAS + OPCIONES
                // ==================================================

                const {
                    data:
                        preguntasData,

                    error:
                        preguntasError,

                } = await supabase

                    .from(
                        "pregunta_test"
                    )

                    .select(`
                        id_pregunta,
                        id_test,
                        id_subescala,
                        codigo,
                        enunciado,
                        descripcion_apoyo,
                        tipo_pregunta,
                        orden,
                        obligatoria,
                        puntua,
                        es_observacional,
                        permite_comentario,
                        estado,

                        opcion_test (
                            id_opcion,
                            id_pregunta,
                            codigo,
                            etiqueta,
                            valor_puntaje,
                            orden,
                            estado
                        )
                    `)

                    .eq(
                        "id_test",
                        test.id_test
                    )

                    .eq(
                        "estado",
                        true
                    )

                    .eq(
                        "opcion_test.estado",
                        true
                    )

                    .order(
                        "orden",
                        {
                            ascending:
                                true,
                        }
                    );


                if (preguntasError) {
                    throw preguntasError;
                }


                const preguntasPreparadas =
                    (
                        preguntasData ??
                        []
                    ).map(
                        (
                            pregunta
                        ) => {

                            const opciones =
                                (
                                    (
                                        pregunta
                                            .opcion_test ??
                                        []
                                    ) as OpcionTestDB[]
                                )

                                    .filter(
                                        opcion =>
                                            opcion.estado
                                    )

                                    .sort(
                                        (
                                            a,
                                            b
                                        ) =>
                                            a.orden -
                                            b.orden
                                    )

                                    .map(
                                        (
                                            opcion
                                        ): OpcionRespuestaTest => ({

                                            id:
                                                opcion.id_opcion,

                                            codigo:
                                                opcion.codigo,

                                            texto:
                                                opcion.etiqueta,

                                            valor:
                                                opcion.valor_puntaje ===
                                                null

                                                    ? null

                                                    : Number(
                                                        opcion.valor_puntaje
                                                    ),

                                            orden:
                                                opcion.orden,

                                        })
                                    );


                            return {

                                id_pregunta:
                                    pregunta.id_pregunta,

                                id_test:
                                    pregunta.id_test,

                                id_subescala:
                                    pregunta.id_subescala,

                                codigo:
                                    pregunta.codigo,

                                enunciado:
                                    pregunta.enunciado,

                                descripcion_apoyo:
                                    pregunta.descripcion_apoyo,

                                tipo_pregunta:
                                    pregunta.tipo_pregunta,

                                orden:
                                    pregunta.orden,

                                obligatoria:
                                    pregunta.obligatoria,

                                puntua:
                                    pregunta.puntua,

                                es_observacional:
                                    pregunta.es_observacional,

                                permite_comentario:
                                    pregunta.permite_comentario,

                                estado:
                                    pregunta.estado,

                                opciones,

                            };

                        }
                    ) as PreguntaTest[];


                setPreguntas(
                    preguntasPreparadas
                );


                // ==================================================
                // RESPUESTAS EXISTENTES
                // ==================================================

                const {
                    data:
                        respuestasData,

                    error:
                        respuestasError,

                } = await supabase

                    .from(
                        "respuesta_test"
                    )

                    .select(`
                        id_pregunta,
                        id_opcion,
                        valor_numerico
                    `)

                    .eq(
                        "id_ejecucion",
                        ejecucion.id_ejecucion
                    );


                if (respuestasError) {
                    throw respuestasError;
                }


                const recuperadas:
                    Record<
                        string,
                        RespuestaSeleccionada
                    > = {};


                for (
                    const respuesta of
                    respuestasData ??
                    []
                ) {

                    if (
                        !respuesta.id_opcion
                    ) {
                        continue;
                    }


                    const pregunta =
                        preguntasPreparadas.find(
                            item =>
                                item.id_pregunta ===
                                respuesta.id_pregunta
                        );


                    const opcion =
                        pregunta
                            ?.opciones
                            .find(
                                item =>
                                    item.id ===
                                    respuesta.id_opcion
                            );


                    if (
                        pregunta &&
                        opcion
                    ) {

                        recuperadas[
                            pregunta.id_pregunta
                        ] = {

                            idOpcion:
                                opcion.id,

                            valor:
                                opcion.valor,

                        };

                    }

                }


                setRespuestas(
                    recuperadas
                );


                setPaginaActual(0);


            } catch (error) {

                console.error(
                    "Error cargando cuestionario:",
                    error
                );


                setError(
                    error instanceof Error

                        ? error.message

                        : "No fue posible cargar el cuestionario."
                );


            } finally {

                setCargando(false);

            }

        };


    // ======================================================
    // GUARDAR RESPUESTA
    // ======================================================

    const seleccionarRespuesta =
        async (
            pregunta:
                PreguntaTest,

            opcion:
                OpcionRespuestaTest
        ) => {

            if (!idEjecucion) {
                return;
            }


            const respuestaAnterior =
                respuestas[
                    pregunta.id_pregunta
                ];


            // Actualización optimista

            setRespuestas(
                anteriores => ({

                    ...anteriores,

                    [pregunta.id_pregunta]: {

                        idOpcion:
                            opcion.id,

                        valor:
                            opcion.valor,

                    },

                })
            );


            try {

                const {
                    error:
                        guardarError,

                } = await supabase

                    .from(
                        "respuesta_test"
                    )

                    .upsert(
                        {
                            id_ejecucion:
                                idEjecucion,

                            id_pregunta:
                                pregunta.id_pregunta,

                            id_opcion:
                                opcion.id,

                            texto_respuesta:
                                null,

                            valor_numerico:
                                null,
                        },
                        {
                            onConflict:
                                "id_ejecucion,id_pregunta",
                        }
                    );


                if (guardarError) {
                    throw guardarError;
                }


            } catch (error) {

                console.error(
                    "Error guardando respuesta:",
                    error
                );


                // Restaurar estado anterior

                setRespuestas(
                    anteriores => {

                        const copia = {
                            ...anteriores,
                        };


                        if (respuestaAnterior) {

                            copia[
                                pregunta.id_pregunta
                            ] =
                                respuestaAnterior;

                        } else {

                            delete copia[
                                pregunta.id_pregunta
                            ];

                        }


                        return copia;

                    }
                );


                Alert.alert(
                    "No se pudo guardar",
                    "La respuesta no pudo guardarse. Inténtalo nuevamente."
                );

            }

        };


    // ======================================================
    // SUBESCALA DE UNA PREGUNTA
    // ======================================================

    const obtenerSubescalaPregunta =
        (
            pregunta:
                PreguntaTest
        ) => {

            if (
                !pregunta.id_subescala
            ) {
                return null;
            }


            return (
                subescalas.find(
                    subescala =>
                        subescala.id_subescala ===
                        pregunta.id_subescala
                ) ??
                null
            );

        };


    // ======================================================
    // ¿LA PREGUNTA ENTRA AL TOTAL?
    // ======================================================

    const incluirPreguntaEnTotal =
        (
            pregunta:
                PreguntaTest
        ) => {

            if (
                !pregunta.puntua
            ) {
                return false;
            }


            const subescala =
                obtenerSubescalaPregunta(
                    pregunta
                );


            // Preguntas sin subescala
            if (!subescala) {
                return true;
            }


            return (
                subescala.incluye_total
            );

        };


    // ======================================================
    // PUNTAJE DIRECTO GLOBAL
    // ======================================================

    const calcularPuntajeDirecto =
        () => {

            return preguntas.reduce(
                (
                    total,
                    pregunta
                ) => {

                    if (
                        !incluirPreguntaEnTotal(
                            pregunta
                        )
                    ) {
                        return total;
                    }


                    return (
                        total +
                        (
                            respuestas[
                                pregunta.id_pregunta
                            ]?.valor ??
                            0
                        )
                    );

                },
                0
            );

        };


    // ======================================================
    // PUNTAJE POR SUBESCALA
    // ======================================================

    const calcularPuntajeSubescala =
        (
            idSubescala:
                string
        ) => {

            return preguntas

                .filter(
                    pregunta =>
                        pregunta.id_subescala ===
                            idSubescala &&
                        pregunta.puntua
                )

                .reduce(
                    (
                        total,
                        pregunta
                    ) => {

                        return (
                            total +
                            (
                                respuestas[
                                    pregunta.id_pregunta
                                ]?.valor ??
                                0
                            )
                        );

                    },
                    0
                );

        };


    // ======================================================
    // TRANSFORMACIÓN DEL PUNTAJE TOTAL
    // ======================================================

    const transformarPuntajeTotal =
        (
            codigoTest:
                string,

            puntajeDirecto:
                number
        ) => {

            /*
             * COOPERSMITH
             *
             * Las áreas puntuables suman un máximo
             * directo de 50.
             *
             * La puntuación global se multiplica
             * por 2 para expresarse sobre 100.
             */

            if (
                codigoTest ===
                    "COOPERSMITH_NINOS" ||
                codigoTest ===
                    "COOPERSMITH_ADULTOS"
            ) {

                return (
                    puntajeDirecto *
                    2
                );

            }


            /*
             * Para el resto de instrumentos,
             * por defecto:
             *
             * puntaje_total =
             * puntaje_directo
             */

            return puntajeDirecto;

        };


    // ======================================================
    // EVALUAR VALIDEZ
    // ======================================================

    const evaluarValidezInstrumento =
        (
            test:
                Test
        ) => {

            let esValido =
                true;


            let observaciones:
                string | null =
                null;


            /*
             * ==================================================
             * COOPERSMITH FORMA ESCOLAR
             * ==================================================
             *
             * Escala L:
             *
             * > 5 = falta de consistencia.
             */

            if (
                test.codigo ===
                "COOPERSMITH_NINOS"
            ) {

                const escalaMentiras =
                    subescalas.find(
                        subescala =>
                            subescala.codigo ===
                            "L"
                    );


                if (escalaMentiras) {

                    const puntajeMentiras =
                        calcularPuntajeSubescala(
                            escalaMentiras.id_subescala
                        );


                    if (
                        puntajeMentiras >
                        5
                    ) {

                        esValido =
                            false;


                        observaciones =
                            `La Escala de Mentiras obtuvo ${puntajeMentiras} puntos. ` +
                            "De acuerdo con la regla del instrumento, una puntuación superior a 5 indica falta de consistencia en las respuestas.";

                    }

                }

            }


            /*
             * IMPORTANTE:
             *
             * La pauta adulta compartida identifica
             * una escala M asociada a los ítems de
             * consistencia, pero la documentación
             * proporcionada no especifica expresamente
             * el punto de invalidación.
             *
             * Por ello no aplicamos automáticamente
             * > 5 en adultos.
             */


            return {
                esValido,
                observaciones,
            };

        };


    // ======================================================
    // SELECCIONAR BAREMO
    // ======================================================

    const seleccionarBaremo =
        async (): Promise<Baremo | null> => {

            if (
                !cuestionario ||
                !usuario
            ) {
                return null;
            }


            const {
                data,

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
                    poblacion,
                    sexo_aplicable,
                    edad_minima,
                    edad_maxima,
                    tipo_valor,
                    version,
                    fuente
                `)

                .eq(
                    "id_test",
                    cuestionario.id_test
                )

                .eq(
                    "estado",
                    true
                );


            if (baremoError) {
                throw baremoError;
            }


            const baremos =
                (
                    data ??
                    []
                ) as Baremo[];


            if (
                baremos.length ===
                0
            ) {
                return null;
            }


            const edad =
                calcularEdad(
                    usuario.fecha_nacimiento
                );


            const genero =
                usuario.genero
                    ?.trim()
                    .toLowerCase();


            const candidatos =
                baremos.filter(
                    baremo => {

                        // Edad mínima

                        const cumpleEdadMinima =
                            baremo.edad_minima ===
                                null ||
                            edad === null ||
                            edad >=
                                baremo.edad_minima;


                        // Edad máxima

                        const cumpleEdadMaxima =
                            baremo.edad_maxima ===
                                null ||
                            edad === null ||
                            edad <=
                                baremo.edad_maxima;


                        // Sexo

                        const sexoBaremo =
                            baremo
                                .sexo_aplicable
                                ?.trim()
                                .toLowerCase();


                        const cumpleSexo =
                            !sexoBaremo ||
                            sexoBaremo ===
                                "todos" ||
                            !genero ||
                            sexoBaremo ===
                                genero;


                        return (
                            cumpleEdadMinima &&
                            cumpleEdadMaxima &&
                            cumpleSexo
                        );

                    }
                );


            if (
                candidatos.length ===
                0
            ) {
                return null;
            }


            /*
             * Elegimos el baremo más específico.
             *
             * Sexo específico = +2
             * Edad mínima = +1
             * Edad máxima = +1
             */

            candidatos.sort(
                (
                    a,
                    b
                ) => {

                    const obtenerEspecificidad =
                        (
                            baremo:
                                Baremo
                        ) => {

                            let puntos =
                                0;


                            if (
                                baremo.sexo_aplicable &&
                                baremo.sexo_aplicable
                                    .toLowerCase() !==
                                "todos"
                            ) {

                                puntos +=
                                    2;

                            }


                            if (
                                baremo.edad_minima !==
                                null
                            ) {

                                puntos++;

                            }


                            if (
                                baremo.edad_maxima !==
                                null
                            ) {

                                puntos++;

                            }


                            return puntos;

                        };


                    return (
                        obtenerEspecificidad(
                            b
                        ) -
                        obtenerEspecificidad(
                            a
                        )
                    );

                }
            );


            return (
                candidatos[0]
            );

        };


    // ======================================================
    // CARGAR RANGOS
    // ======================================================

    const cargarRangos =
        async (
            idBaremo:
                string
        ): Promise<RangoBaremo[]> => {

            const {
                data,

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
                    orden
                `)

                .eq(
                    "id_baremo",
                    idBaremo
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


            if (rangoError) {
                throw rangoError;
            }


            return (
                data ??
                []
            ) as RangoBaremo[];

        };


    // ======================================================
    // BUSCAR RANGO
    // ======================================================

    const buscarRango =
        (
            rangos:
                RangoBaremo[],

            valor:
                number,

            idSubescala:
                string | null
        ) => {

            return (
                rangos.find(
                    rango => {

                        const mismoAmbito =
                            idSubescala ===
                            null

                                ? rango.id_subescala ===
                                    null

                                : rango.id_subescala ===
                                    idSubescala;


                        if (!mismoAmbito) {
                            return false;
                        }


                        const minimo =
                            rango.valor_minimo ===
                            null

                                ? null

                                : Number(
                                    rango.valor_minimo
                                );


                        const maximo =
                            rango.valor_maximo ===
                            null

                                ? null

                                : Number(
                                    rango.valor_maximo
                                );


                        const cumpleMinimo =
                            minimo === null ||
                            valor >= minimo;


                        const cumpleMaximo =
                            maximo === null ||
                            valor <= maximo;


                        return (
                            cumpleMinimo &&
                            cumpleMaximo
                        );

                    }
                ) ??
                null
            );

        };


    // ======================================================
    // VALOR QUE DEBE USAR EL BAREMO
    // ======================================================

    const obtenerValorBaremo =
        (
            baremo:
                Baremo,

            puntajeDirecto:
                number,

            puntajeTotal:
                number
        ): number | null => {

            switch (
                baremo.tipo_valor
            ) {

                case "puntaje_directo":

                    return puntajeDirecto;


                case "puntaje_total":

                    return puntajeTotal;


                /*
                 * Estos tres requieren una verdadera
                 * conversión normativa.
                 *
                 * NO se debe utilizar directamente
                 * puntaje_total como si fuera percentil,
                 * T o eneatipo.
                 */

                case "percentil":
                case "puntaje_t":
                case "eneatipo":

                    return null;


                default:

                    return null;

            }

        };


    // ======================================================
    // GUARDAR RESULTADO
    // ======================================================

    const guardarResultado =
        async ({
            puntajeDirecto,
            puntajeTotal,
            nivel,
            interpretacion,
            esValido,
            observaciones,
            idBaremo,
            idRangoBaremo,
        }: {
            puntajeDirecto:
                number;

            puntajeTotal:
                number;

            nivel:
                string | null;

            interpretacion:
                string | null;

            esValido:
                boolean;

            observaciones:
                string | null;

            idBaremo:
                string | null;

            idRangoBaremo:
                string | null;
        }): Promise<ResultadoGuardado> => {

            if (!idEjecucion) {

                throw new Error(
                    "No existe una ejecución activa."
                );

            }


            const {
                data,

                error:
                    resultadoError,

            } = await supabase

                .from(
                    "resultado_test"
                )

                .upsert(
                    {
                        id_ejecucion:
                            idEjecucion,

                        puntaje_directo:
                            puntajeDirecto,

                        puntaje_total:
                            puntajeTotal,

                        nivel_cualitativo:
                            nivel,

                        interpretacion_texto:
                            interpretacion,

                        es_valido:
                            esValido,

                        observaciones:
                            observaciones,

                        id_baremo:
                            idBaremo,

                        id_rango_baremo:
                            idRangoBaremo,

                        tipo_finalizacion:
                            "completa",
                    },
                    {
                        onConflict:
                            "id_ejecucion",
                    }
                )

                .select(`
                    id_resultado,
                    id_ejecucion
                `)

                .single();


            if (resultadoError) {
                throw resultadoError;
            }


            return (
                data as ResultadoGuardado
            );

        };


    // ======================================================
    // FINALIZAR
    // ======================================================

    const finalizarCuestionario =
        async () => {

            if (
                !cuestionario ||
                !idEjecucion ||
                finalizando
            ) {
                return;
            }


            try {

                setFinalizando(true);


                // ==================================================
                // 1. PUNTAJES
                // ==================================================

                const puntajeDirecto =
                    calcularPuntajeDirecto();


                const puntajeTotal =
                    transformarPuntajeTotal(
                        cuestionario.codigo,
                        puntajeDirecto
                    );


                // ==================================================
                // 2. VALIDEZ
                // ==================================================

                const {
                    esValido,
                    observaciones,
                } =
                    evaluarValidezInstrumento(
                        cuestionario
                    );


                // ==================================================
                // 3. BAREMO
                // ==================================================

                const baremo =
                    await seleccionarBaremo();


                let rangos:
                    RangoBaremo[] =
                    [];


                let rangoGlobal:
                    RangoBaremo | null =
                    null;


                if (baremo) {

                    rangos =
                        await cargarRangos(
                            baremo.id_baremo
                        );


                    const valorBaremo =
                        obtenerValorBaremo(
                            baremo,
                            puntajeDirecto,
                            puntajeTotal
                        );


                    if (
                        valorBaremo !==
                        null
                    ) {

                        rangoGlobal =
                            buscarRango(
                                rangos,
                                valorBaremo,
                                null
                            );

                    }

                }


                // ==================================================
                // 4. RESULTADO PRINCIPAL
                // ==================================================

                const resultado =
                    await guardarResultado({

                        puntajeDirecto,

                        puntajeTotal,

                        nivel:
                            rangoGlobal?.nivel ??
                            null,

                        interpretacion:
                            rangoGlobal?.interpretacion ??
                            null,

                        esValido,

                        observaciones,

                        idBaremo:
                            baremo?.id_baremo ??
                            null,

                        idRangoBaremo:
                            rangoGlobal?.id_rango ??
                            null,

                    });


                // ==================================================
                // 5. RESULTADOS DE SUBESCALAS
                // ==================================================

                if (
                    cuestionario.tiene_subescalas &&
                    subescalas.length >
                        0
                ) {

                    for (
                        const subescala of
                        subescalas
                    ) {

                        const preguntasSubescala =
                            preguntas.filter(
                                pregunta =>
                                    pregunta.id_subescala ===
                                        subescala.id_subescala &&
                                    pregunta.puntua
                            );


                        if (
                            preguntasSubescala.length ===
                            0
                        ) {
                            continue;
                        }


                        const puntajeSubescala =
                            calcularPuntajeSubescala(
                                subescala.id_subescala
                            );


                        /*
                         * La puntuación de las subescalas
                         * de Coopersmith se mantiene directa.
                         *
                         * Ejemplos escolares:
                         *
                         * General 0–26
                         * Social  0–8
                         * Hogar   0–8
                         * Escuela 0–8
                         * Mentiras 0–8
                         */

                        const rangoSubescala =
                            baremo

                                ? buscarRango(
                                    rangos,
                                    puntajeSubescala,
                                    subescala.id_subescala
                                )

                                : null;


                        const {
                            error:
                                subResultadoError,

                        } = await supabase

                            .from(
                                "resultado_subescala"
                            )

                            .upsert(
                                {
                                    id_resultado:
                                        resultado.id_resultado,

                                    id_subescala:
                                        subescala.id_subescala,

                                    puntaje_directo:
                                        puntajeSubescala,

                                    puntaje_transformado:
                                        null,

                                    nivel_cualitativo:
                                        rangoSubescala
                                            ?.nivel ??
                                        null,

                                    interpretacion_texto:
                                        rangoSubescala
                                            ?.interpretacion ??
                                        null,
                                },
                                {
                                    onConflict:
                                        "id_resultado,id_subescala",
                                }
                            );


                        if (
                            subResultadoError
                        ) {
                            throw subResultadoError;
                        }

                    }

                }


                // ==================================================
                // 6. COMPLETAR EJECUCIÓN
                // ==================================================

                const {
                    error:
                        completarError,

                } = await supabase

                    .from(
                        "ejecucion_test"
                    )

                    .update({
                        estado:
                            "completado",

                        fecha_fin:
                            new Date()
                                .toISOString(),
                    })

                    .eq(
                        "id_ejecucion",
                        idEjecucion
                    );


                if (completarError) {
                    throw completarError;
                }


                // ==================================================
                // 7. IR A RESULTADO
                // ==================================================

                router.replace({

                    pathname:
                        "/cuestionarios/[id]/resultado",

                    params: {

                        id:
                            cuestionario.codigo,

                        idResultado:
                            resultado.id_resultado,

                    },

                } as any);


            } catch (error) {

                console.error(
                    "Error finalizando cuestionario:",
                    error
                );


                Alert.alert(
                    "No se pudo finalizar",
                    "No fue posible guardar correctamente el resultado. Inténtalo nuevamente."
                );


            } finally {

                setFinalizando(false);

            }

        };


    // ======================================================
    // PAGINACIÓN
    // ======================================================

    const totalPaginas =
        Math.ceil(
            preguntas.length /
            PREGUNTAS_POR_PAGINA
        );


    const indiceInicial =
        paginaActual *
        PREGUNTAS_POR_PAGINA;


    const preguntasPagina =
        preguntas.slice(
            indiceInicial,
            indiceInicial +
                PREGUNTAS_POR_PAGINA
        );


    const todasRespondidasEnPagina =
        preguntasPagina.every(
            pregunta =>
                !pregunta.obligatoria ||
                respuestas[
                    pregunta.id_pregunta
                ] !== undefined
        );


    const todasRespondidas =
        preguntas.every(
            pregunta =>
                !pregunta.obligatoria ||
                respuestas[
                    pregunta.id_pregunta
                ] !== undefined
        );


    // ======================================================
    // AVANZAR
    // ======================================================

    const avanzar =
        () => {

            if (
                !todasRespondidasEnPagina
            ) {
                return;
            }


            if (
                paginaActual <
                totalPaginas - 1
            ) {

                setPaginaActual(
                    pagina =>
                        pagina + 1
                );


                return;

            }


            if (todasRespondidas) {

                finalizarCuestionario();

            }

        };


    // ======================================================
    // RETROCEDER
    // ======================================================

    const retroceder =
        () => {

            if (
                paginaActual >
                0
            ) {

                setPaginaActual(
                    pagina =>
                        pagina - 1
                );


                return;

            }


            router.back();

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
                    Cargando cuestionario...
                </Text>

            </View>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (
        error ||
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
                            19,

                        lineHeight:
                            25,

                        color:
                            "#2D3748",

                        textAlign:
                            "center",

                        marginTop:
                            12,
                    }}
                >

                    {
                        error ??
                        "Cuestionario no encontrado."
                    }

                </Text>


                <Pressable

                    onPress={() =>
                        router.back()
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
                        Volver
                    </Text>

                </Pressable>

            </View>

        );

    }


    // ======================================================
    // SIN PREGUNTAS
    // ======================================================

    if (
        preguntas.length ===
        0
    ) {

        return (

            <View className="flex-1 bg-slate-50 items-center justify-center px-6">

                <Ionicons
                    name="document-text-outline"
                    size={50}
                    color="#B8A8F8"
                />


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            19,

                        color:
                            "#2D3748",

                        textAlign:
                            "center",

                        marginTop:
                            12,
                    }}
                >
                    Este cuestionario aún no contiene preguntas.
                </Text>


                <Pressable
                    onPress={() =>
                        router.back()
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
                        Volver
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

                ref={
                    scrollViewRef
                }

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

                bounces={false}

                overScrollMode="never"

                keyboardShouldPersistTaps="handled"

            >


                {/* ==================================================
                    ENCABEZADO
                ================================================== */}

                <View className="flex-row items-center mb-5">

                    <Pressable

                        onPress={
                            retroceder
                        }

                        disabled={
                            finalizando
                        }

                        className="w-10 h-10 items-center justify-center"

                    >

                        <Ionicons
                            name="arrow-back-outline"
                            size={24}
                            color="#64748B"
                        />

                    </Pressable>


                    <Text
                        numberOfLines={1}
                        style={{
                            flex:
                                1,

                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                18,

                            color:
                                "#2D3748",

                            marginLeft:
                                8,
                        }}
                    >

                        {
                            cuestionario.nombre
                        }

                    </Text>

                </View>


                {/* ==================================================
                    PROGRESO
                ================================================== */}

                <ProgresoCuestionario

                    paginaActual={
                        paginaActual +
                        1
                    }

                    totalPaginas={
                        totalPaginas
                    }

                    respondidas={
                        Object.keys(
                            respuestas
                        ).length
                    }

                    totalPreguntas={
                        preguntas.length
                    }

                />


                {/* ==================================================
                    INSTRUCCIONES
                ================================================== */}

                {
                    paginaActual ===
                        0 &&
                    cuestionario
                        .instrucciones && (

                        <View className="bg-blue-50 rounded-2xl p-4 mb-7">

                            <View className="flex-row items-start">

                                <Ionicons
                                    name="information-circle-outline"
                                    size={22}
                                    color="#4F8EF7"
                                />


                                <Text
                                    style={{
                                        flex:
                                            1,

                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            13,

                                        lineHeight:
                                            19,

                                        color:
                                            "#475569",

                                        marginLeft:
                                            8,
                                    }}
                                >

                                    {
                                        cuestionario
                                            .instrucciones
                                    }

                                </Text>

                            </View>

                        </View>

                    )
                }


                {/* ==================================================
                    PREGUNTAS
                ================================================== */}

                {
                    preguntasPagina.map(
                        (
                            pregunta,
                            index
                        ) => {

                            const numeroPregunta =
                                indiceInicial +
                                index +
                                1;


                            return (

                                <View
                                    key={
                                        pregunta.id_pregunta
                                    }
                                    className="mb-9"
                                >

                                    {/* Pregunta */}

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Bold",

                                            fontSize:
                                                21,

                                            lineHeight:
                                                28,

                                            color:
                                                "#2D3748",
                                        }}
                                    >

                                        {
                                            numeroPregunta
                                        }
                                        .{" "}

                                        {
                                            pregunta.enunciado
                                        }

                                    </Text>


                                    {/* Descripción */}

                                    {
                                        pregunta.descripcion_apoyo && (

                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-Medium",

                                                    fontSize:
                                                        13,

                                                    lineHeight:
                                                        18,

                                                    color:
                                                        "#64748B",

                                                    marginTop:
                                                        10,

                                                    marginBottom:
                                                        10,

                                                    textAlign:
                                                        "center",
                                                }}
                                            >

                                                {
                                                    pregunta
                                                        .descripcion_apoyo
                                                }

                                            </Text>

                                        )
                                    }


                                    {/* Opciones */}

                                    <View className="mt-5">

                                        {
                                            pregunta.opciones.length >
                                                0

                                                ? (

                                                    pregunta.opciones.map(
                                                        opcion => (

                                                            <OpcionRespuesta

                                                                key={
                                                                    opcion.id
                                                                }

                                                                texto={
                                                                    opcion.texto
                                                                }

                                                                seleccionada={
                                                                    respuestas[
                                                                        pregunta.id_pregunta
                                                                    ]
                                                                        ?.idOpcion ===
                                                                    opcion.id
                                                                }

                                                                onPress={() =>
                                                                    seleccionarRespuesta(
                                                                        pregunta,
                                                                        opcion
                                                                    )
                                                                }

                                                            />

                                                        )
                                                    )

                                                )

                                                : (

                                                    <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4">

                                                        <View className="flex-row items-start">

                                                            <Ionicons
                                                                name="information-circle-outline"
                                                                size={20}
                                                                color="#F59E0B"
                                                            />


                                                            <Text
                                                                style={{
                                                                    flex:
                                                                        1,

                                                                    fontFamily:
                                                                        "Nunito-Medium",

                                                                    fontSize:
                                                                        13,

                                                                    lineHeight:
                                                                        18,

                                                                    color:
                                                                        "#92400E",

                                                                    marginLeft:
                                                                        8,
                                                                }}
                                                            >

                                                                Esta pregunta no tiene opciones de respuesta disponibles.

                                                            </Text>

                                                        </View>

                                                    </View>

                                                )
                                        }

                                    </View>

                                </View>

                            );

                        }
                    )
                }


                {/* ==================================================
                    NAVEGACIÓN
                ================================================== */}

                <View className="flex-row gap-4 mt-3">


                    {/* Anterior */}

                    <Pressable

                        onPress={
                            retroceder
                        }

                        disabled={
                            finalizando
                        }

                        className="flex-1 bg-slate-300 rounded-xl py-4 flex-row items-center justify-center"

                    >

                        <Ionicons
                            name="arrow-back-outline"
                            size={16}
                            color="#64748B"
                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-SemiBold",

                                fontSize:
                                    14,

                                color:
                                    "#64748B",

                                marginLeft:
                                    5,
                            }}
                        >
                            Anterior
                        </Text>

                    </Pressable>


                    {/* Siguiente / Finalizar */}

                    <Pressable

                        disabled={
                            !todasRespondidasEnPagina ||
                            finalizando
                        }

                        onPress={
                            avanzar
                        }

                        className={`flex-[1.5] rounded-xl py-4 flex-row items-center justify-center ${
                            todasRespondidasEnPagina &&
                            !finalizando

                                ? "bg-blue-500"

                                : "bg-blue-200"
                        }`}

                    >

                        {
                            finalizando

                                ? (

                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />

                                )

                                : (

                                    <>

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

                                            {
                                                paginaActual ===
                                                totalPaginas -
                                                    1

                                                    ? "Finalizar"

                                                    : "Siguiente"
                                            }

                                        </Text>


                                        <Ionicons

                                            name={
                                                paginaActual ===
                                                totalPaginas -
                                                    1

                                                    ? "checkmark-outline"

                                                    : "arrow-forward-outline"
                                            }

                                            size={16}

                                            color="#FFFFFF"

                                            style={{
                                                marginLeft:
                                                    5,
                                            }}

                                        />

                                    </>

                                )
                        }

                    </Pressable>

                </View>

            </ScrollView>

        </View>

    );

}