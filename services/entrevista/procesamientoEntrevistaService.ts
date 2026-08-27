import { supabase } from "@/lib/supabase";

export type NivelResultado = "BAJO" | "MODERADO" | "ALTO";

export type ResultadoDimension = {
  id_modulo:string;
  codigo:string;
  nombre:string;
  puntaje:number;
  puntajeMaximo:number;
  porcentaje:number;
  nivel:NivelResultado;
};

const MODULOS_PUNTUABLES = [
  "SOMATICO",
  "ANSIEDAD_INSOMNIO",
  "SUENO",
  "APOYO_SOCIAL",
  "VIDA_DIARIA",
  "ESTADO_EMOCIONAL",
];

function redondear(valor:number) {
  return Math.round(valor * 100) / 100;
}

function determinarNivel(porcentaje:number):NivelResultado {
  if (porcentaje <= 33.33) return "BAJO";
  if (porcentaje <= 66.66) return "MODERADO";
  return "ALTO";
}

export async function procesarResultadosEntrevista(
  idEntrevista:string
):Promise<ResultadoDimension[]> {

  if (!idEntrevista) {
    throw new Error("No se recibió el id de la entrevista.");
  }

  // 1. OBTENER RESPUESTAS + PREGUNTA + MODULO + OPCION SELECCIONADA
  const { data,error } = await supabase
    .from("respuesta_entrevista")
    .select(`
      id_respuesta,
      id_pregunta,
      pregunta_entrevista!inner(
        id_pregunta,
        codigo,
        id_modulo,
        modulo_entrevista!inner(
          id_modulo,
          codigo,
          nombre
        )
      ),
      respuesta_opcion_entrevista(
        id_opcion,
        opcion_entrevista(
          id_opcion,
          valor_puntaje
        )
      )
    `)
    .eq("id_entrevista",idEntrevista);

  if (error) {
    console.error("Error obteniendo respuestas:",error);
    throw new Error("No se pudieron procesar las respuestas.");
  }

  const respuestas = (data ?? []) as any[];

  // 2. SOLO MODULOS QUE GENERAN RESULTADOS
  const respuestasPuntuables = respuestas.filter((r) => {
    const modulo = r.pregunta_entrevista?.modulo_entrevista;
    return modulo && MODULOS_PUNTUABLES.includes(modulo.codigo);
  });

  if (!respuestasPuntuables.length) {
    console.log("No hay módulos puntuables en esta entrevista.");
    return [];
  }

  // 3. IDS DE PREGUNTAS CONTESTADAS
  const idsPreguntas = [
    ...new Set(
      respuestasPuntuables
        .map((r) => r.id_pregunta)
        .filter(Boolean)
    ),
  ];

  if (!idsPreguntas.length) return [];

  // 4. OBTENER TODAS LAS OPCIONES PARA CALCULAR MAXIMO POR PREGUNTA
  const { data:opcionesData,error:opcionesError } = await supabase
    .from("opcion_entrevista")
    .select("id_opcion,id_pregunta,valor_puntaje")
    .in("id_pregunta",idsPreguntas);

  if (opcionesError) {
    console.error("Error obteniendo puntajes:",opcionesError);
    throw new Error("No se pudieron calcular los puntajes.");
  }

  const opciones = (opcionesData ?? []) as {
    id_opcion:string;
    id_pregunta:string;
    valor_puntaje:number | null;
  }[];

  // 5. CALCULAR MAXIMO POSIBLE DE CADA PREGUNTA
  const maximoPregunta = new Map<string,number>();

  opciones.forEach((opcion) => {
    const valor = Number(opcion.valor_puntaje ?? 0);
    const actual = maximoPregunta.get(opcion.id_pregunta) ?? 0;

    if (valor > actual) {
      maximoPregunta.set(opcion.id_pregunta,valor);
    }
  });

  // 6. AGRUPAR RESULTADOS POR MODULO
  const mapaModulos = new Map<string,{
    id_modulo:string;
    codigo:string;
    nombre:string;
    puntaje:number;
    puntajeMaximo:number;
    porcentajesPreguntas:number[];
  }>();

  respuestasPuntuables.forEach((respuesta) => {
    const pregunta = respuesta.pregunta_entrevista;
    const modulo = pregunta.modulo_entrevista;
    const opcionesSeleccionadas = respuesta.respuesta_opcion_entrevista ?? [];

    if (!mapaModulos.has(modulo.id_modulo)) {
      mapaModulos.set(modulo.id_modulo,{
        id_modulo:modulo.id_modulo,
        codigo:modulo.codigo,
        nombre:modulo.nombre,
        puntaje:0,
        puntajeMaximo:0,
        porcentajesPreguntas:[],
      });
    }

    const resultado = mapaModulos.get(modulo.id_modulo)!;

    const puntajePregunta = opcionesSeleccionadas.reduce(
      (total:number,item:any) =>
        total + Number(item.opcion_entrevista?.valor_puntaje ?? 0),
      0
    );

    const maximo = maximoPregunta.get(pregunta.id_pregunta) ?? 0;

    resultado.puntaje += puntajePregunta;
    resultado.puntajeMaximo += maximo;

    if (maximo > 0) {
      resultado.porcentajesPreguntas.push(
        (puntajePregunta / maximo) * 100
      );
    }
  });

  // 7. CALCULAR PORCENTAJE Y NIVEL
  const resultados:ResultadoDimension[] = Array
    .from(mapaModulos.values())
    .map((modulo) => {

      let porcentaje = 0;

      // SUENO tiene preguntas con escalas distintas.
      // Se normaliza cada pregunta antes de promediar.
      if (
        modulo.codigo === "SUENO" &&
        modulo.porcentajesPreguntas.length
      ) {
        porcentaje =
          modulo.porcentajesPreguntas.reduce(
            (total,valor) => total + valor,
            0
          ) / modulo.porcentajesPreguntas.length;
      } else if (modulo.puntajeMaximo > 0) {
        porcentaje =
          (modulo.puntaje / modulo.puntajeMaximo) * 100;
      }

      const porcentajeFinal = redondear(porcentaje);

      return {
        id_modulo:modulo.id_modulo,
        codigo:modulo.codigo,
        nombre:modulo.nombre,
        puntaje:redondear(modulo.puntaje),
        puntajeMaximo:redondear(modulo.puntajeMaximo),
        porcentaje:porcentajeFinal,
        nivel:determinarNivel(porcentajeFinal),
      };
    });

  // 8. GUARDAR RESULTADOS EN SUPABASE
  if (resultados.length) {
    const registros = resultados.map((resultado) => ({
      id_entrevista:idEntrevista,
      id_modulo:resultado.id_modulo,
      puntaje:resultado.puntaje,
      porcentaje:resultado.porcentaje,
      nivel:resultado.nivel,
      fecha_calculo:new Date().toISOString(),
    }));

    const { error:guardarError } = await supabase
      .from("resultado_entrevista")
      .upsert(registros,{
        onConflict:"id_entrevista,id_modulo",
      });

    if (guardarError) {
      console.error("Error guardando resultados:",guardarError);
      throw new Error("No se pudieron guardar los resultados.");
    }
  }

  // 9. ORDENAR DE MAYOR A MENOR
  resultados.sort((a,b) => b.porcentaje - a.porcentaje);

  console.table(
    resultados.map((resultado) => ({
      dimension:resultado.nombre,
      puntaje:`${resultado.puntaje}/${resultado.puntajeMaximo}`,
      porcentaje:`${resultado.porcentaje}%`,
      nivel:resultado.nivel,
    }))
  );

  return resultados;
}