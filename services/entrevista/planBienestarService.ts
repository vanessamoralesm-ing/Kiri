import { supabase } from "@/lib/supabase";

export type ActividadPlan = {
  codigo:string;
  titulo:string;
  descripcion:string;
  icono:string;
};

export type PlanBienestar = {
  id_plan?:string;
  id_entrevista:string;
  objetivo_principal:string;
  actividades_recomendadas:ActividadPlan[];
  estado:string;
};

type ResultadoParaPlan = {
  codigo?:string;
  porcentaje?:number;
  modulo?:{codigo?:string};
  modulo_entrevista?:{codigo?:string};
};

/* =========================================================
   CATÁLOGO DE ACTIVIDADES
========================================================= */

const ACTIVIDADES:Record<string,ActividadPlan[]> = {
  SOMATICO:[
    {
      codigo:"RESPIRACION_CONSCIENTE",
      titulo:"Respiración consciente",
      descripcion:"Dedica unos minutos a realizar respiraciones lentas y profundas.",
      icono:"body-outline",
    },
    {
      codigo:"PAUSA_CORPORAL",
      titulo:"Pausa corporal",
      descripcion:"Haz una pausa breve para identificar y liberar tensión física.",
      icono:"fitness-outline",
    },
    {
      codigo:"MOVIMIENTO_SUAVE",
      titulo:"Movimiento suave",
      descripcion:"Integra caminatas o movimientos suaves durante tu día.",
      icono:"walk-outline",
    },
  ],

  ANSIEDAD_INSOMNIO:[
    {
      codigo:"RESPIRACION_478",
      titulo:"Respiración relajante",
      descripcion:"Practica una respiración lenta antes de dormir o cuando notes tensión.",
      icono:"leaf-outline",
    },
    {
      codigo:"RUTINA_NOCTURNA",
      titulo:"Rutina para descansar",
      descripcion:"Crea una rutina sencilla que prepare tu mente y cuerpo para dormir.",
      icono:"moon-outline",
    },
    {
      codigo:"PAUSA_MENTAL",
      titulo:"Pausa mental",
      descripcion:"Tómate unos minutos para reducir estímulos y recuperar calma.",
      icono:"cloud-outline",
    },
  ],

  SUENO:[
    {
      codigo:"HORARIO_SUENO",
      titulo:"Horario de descanso",
      descripcion:"Intenta mantener horarios similares para dormir y despertar.",
      icono:"time-outline",
    },
    {
      codigo:"DESCONECTAR_PANTALLAS",
      titulo:"Desconexión antes de dormir",
      descripcion:"Reduce el uso de pantallas antes de acostarte.",
      icono:"phone-portrait-outline",
    },
  ],

  APOYO_SOCIAL:[
    {
      codigo:"CONECTAR_PERSONA",
      titulo:"Conecta con alguien",
      descripcion:"Busca un momento para conversar con una persona de confianza.",
      icono:"people-outline",
    },
    {
      codigo:"PEDIR_APOYO",
      titulo:"Practica pedir apoyo",
      descripcion:"Identifica una situación en la que puedas pedir acompañamiento.",
      icono:"chatbubbles-outline",
    },
  ],

  VIDA_DIARIA:[
    {
      codigo:"TAREA_PEQUENA",
      titulo:"Una tarea a la vez",
      descripcion:"Divide tus actividades en pasos pequeños y alcanzables.",
      icono:"checkmark-circle-outline",
    },
    {
      codigo:"PAUSA_ACTIVA",
      titulo:"Pausa activa",
      descripcion:"Incluye descansos breves entre tus responsabilidades.",
      icono:"pause-circle-outline",
    },
  ],

  ESTADO_EMOCIONAL:[
    {
      codigo:"REGISTRO_EMOCIONAL",
      titulo:"Registro emocional",
      descripcion:"Anota cómo te sentiste y qué situaciones influyeron en tu día.",
      icono:"book-outline",
    },
    {
      codigo:"AUTOCUIDADO",
      titulo:"Momento de autocuidado",
      descripcion:"Reserva un pequeño espacio del día para una actividad que disfrutes.",
      icono:"heart-outline",
    },
    {
      codigo:"PENSAMIENTO_EMOCION",
      titulo:"Observa tus pensamientos",
      descripcion:"Identifica pensamientos frecuentes y cómo influyen en tus emociones.",
      icono:"bulb-outline",
    },
  ],
};

/* =========================================================
   OBJETIVO DEL PLAN
========================================================= */

function obtenerObjetivo(prioridades:string[]) {
  if (!prioridades.length)
    return "Mantener y fortalecer tus hábitos actuales de bienestar.";

  if (prioridades.length > 1)
    return "Fortalecer las áreas de bienestar que actualmente necesitan mayor atención mediante pequeñas acciones cotidianas.";

  switch(prioridades[0]) {
    case "SOMATICO":
      return "Reducir la tensión física y fortalecer hábitos de cuidado corporal.";

    case "ANSIEDAD_INSOMNIO":
      return "Promover momentos de calma y mejorar los hábitos relacionados con el descanso.";

    case "SUENO":
      return "Fortalecer hábitos que favorezcan un descanso más regular y reparador.";

    case "APOYO_SOCIAL":
      return "Fortalecer tus redes de apoyo y conexión con otras personas.";

    case "VIDA_DIARIA":
      return "Organizar tus actividades cotidianas de una forma más equilibrada.";

    case "ESTADO_EMOCIONAL":
      return "Fortalecer el reconocimiento y manejo cotidiano de tus emociones.";

    default:
      return "Fortalecer hábitos que contribuyan a tu bienestar emocional.";
  }
}

/* =========================================================
   ACTIVIDADES DEL PLAN
========================================================= */

function obtenerActividades(prioridades:string[]) {
  const seleccionadas = prioridades.flatMap(
    codigo => ACTIVIDADES[codigo] ?? []
  );

  const unicas = new Map<string,ActividadPlan>();

  seleccionadas.forEach(actividad => {
    if (!unicas.has(actividad.codigo))
      unicas.set(actividad.codigo,actividad);
  });

  return Array.from(unicas.values()).slice(0,5);
}

/* =========================================================
   LEER PLAN EXISTENTE

   SOLO REALIZA SELECT.
   NO INSERTA.
   NO ACTUALIZA.
   NO REGENERA.
========================================================= */

export async function obtenerPlanBienestar(
  idEntrevista:string
):Promise<PlanBienestar|null> {

  if (!idEntrevista)
    throw new Error("No se recibió la entrevista.");

  const {data,error} = await supabase
    .from("plan_bienestar")
    .select(`
      id_plan,
      id_entrevista,
      objetivo_principal,
      actividades_recomendadas,
      estado
    `)
    .eq("id_entrevista",idEntrevista)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo plan:",error);
    throw new Error("No se pudo obtener el plan de bienestar.");
  }

  if (!data)
    return null;

  return {
    id_plan:data.id_plan,
    id_entrevista:data.id_entrevista,
    objetivo_principal:data.objetivo_principal,
    actividades_recomendadas:Array.isArray(data.actividades_recomendadas)
      ? data.actividades_recomendadas as ActividadPlan[]
      : [],
    estado:data.estado,
  };
}

/* =========================================================
   GENERAR PLAN

   ESTA FUNCIÓN:
   1. Comprueba si ya existe.
   2. Si existe, lo devuelve SIN modificarlo.
   3. Si no existe, genera uno nuevo.
   4. Solo realiza INSERT.
========================================================= */

export async function generarPlanBienestar(
  idEntrevista:string,
  resultados:ResultadoParaPlan[]
):Promise<PlanBienestar> {

  if (!idEntrevista)
    throw new Error("No se recibió la entrevista.");

  /* ---------------------------------------------------------
     1. COMPROBAR SI EL PLAN YA EXISTE
  --------------------------------------------------------- */

  const existente = await obtenerPlanBienestar(idEntrevista);

  if (existente) {
    console.log("PLAN EXISTENTE RECUPERADO:",existente.id_plan);
    return existente;
  }

  /* ---------------------------------------------------------
     2. OBTENER USUARIO
  --------------------------------------------------------- */

  const {
    data:{user},
    error:userError
  } = await supabase.auth.getUser();

  if (userError || !user)
    throw new Error("No se pudo identificar al usuario.");

  /* ---------------------------------------------------------
     3. DETERMINAR PRIORIDADES
  --------------------------------------------------------- */

  let prioridades:string[] = [];
  let objetivo:string;
  let actividades:ActividadPlan[];

  if (!resultados?.length) {

    objetivo =
      "Mantener y fortalecer tus hábitos actuales de bienestar.";

    actividades = [
      ...(ACTIVIDADES.ESTADO_EMOCIONAL ?? []),
      ...(ACTIVIDADES.SOMATICO ?? []),
    ].slice(0,3);

  } else {

    const mayor = Math.max(
      ...resultados.map(
        resultado => Number(resultado.porcentaje ?? 0)
      )
    );

    prioridades = resultados
      .filter(
        resultado =>
          Math.abs(
            Number(resultado.porcentaje ?? 0) - mayor
          ) < .01
      )
      .map(
        resultado =>
          resultado.codigo ??
          resultado.modulo?.codigo ??
          resultado.modulo_entrevista?.codigo
      )
      .filter(
        (codigo):codigo is string =>
          Boolean(codigo)
      );
    objetivo=obtenerObjetivo(prioridades);
    actividades=obtenerActividades(prioridades);

    if(!actividades.length){
      objetivo="Mantener y fortalecer tus hábitos actuales de bienestar.";
      actividades=[
        ...(ACTIVIDADES.ESTADO_EMOCIONAL??[]),
        ...(ACTIVIDADES.SOMATICO??[])
      ].slice(0,3);
    }
  }

  /* ---------------------------------------------------------
     4. GUARDAR NUEVO PLAN
  --------------------------------------------------------- */

  const ahora = new Date().toISOString();

  const {data,error} = await supabase
    .from("plan_bienestar")
    .insert({
      id_entrevista:idEntrevista,
      id_usuario:user.id,
      objetivo_principal:objetivo,
      actividades_recomendadas:actividades,
      estado:"activo",
      fecha_creacion:ahora,
      fecha_actualizacion:ahora,
    })
    .select(`
      id_plan,
      id_entrevista,
      objetivo_principal,
      actividades_recomendadas,
      estado
    `)
    .single();

  /*
     Protección adicional:
     si por alguna razón dos procesos intentaran crear el mismo
     plan al mismo tiempo, id_entrevista es UNIQUE.

     En ese caso volvemos a leer el plan ya creado.
  */

  if (error) {
    if (error.code === "23505") {
      const planCreado = await obtenerPlanBienestar(idEntrevista);

      if (planCreado)
        return planCreado;
    }

    console.error("Error guardando plan:",error);

    throw new Error(
      "No se pudo guardar el plan de bienestar."
    );
  }

  console.log("PLAN DE BIENESTAR GUARDADO:",data);

  return {
    id_plan:data.id_plan,
    id_entrevista:data.id_entrevista,
    objetivo_principal:data.objetivo_principal,
    actividades_recomendadas:Array.isArray(data.actividades_recomendadas)
      ? data.actividades_recomendadas as ActividadPlan[]
      : [],
    estado:data.estado,
  };
}