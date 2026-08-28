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

type ResultadoBase = {
  codigo:string;
  nombre:string;
  porcentaje:number;
  nivel:string;
};

const ACTIVIDADES:Record<string,ActividadPlan[]> = {
  SOMATICO:[
    {codigo:"RESPIRACION",titulo:"Respiración consciente",descripcion:"Dedica unos minutos a respirar lentamente y observar cómo responde tu cuerpo.",icono:"leaf-outline"},
    {codigo:"PAUSA_CORPORAL",titulo:"Pausa corporal",descripcion:"Haz una pausa breve para identificar tensión y relajar hombros, cuello y mandíbula.",icono:"body-outline"},
    {codigo:"MOVIMIENTO",titulo:"Movimiento suave",descripcion:"Integra una caminata o actividad física ligera dentro de tu rutina.",icono:"walk-outline"},
  ],

  ANSIEDAD_INSOMNIO:[
    {codigo:"RESPIRACION",titulo:"Respiración consciente",descripcion:"Utiliza una respiración lenta para disminuir la activación antes de continuar con tus actividades.",icono:"leaf-outline"},
    {codigo:"REGISTRO_PENSAMIENTOS",titulo:"Registro de pensamientos",descripcion:"Anota lo que te preocupa y diferencia aquello que puedes atender de lo que está fuera de tu control.",icono:"create-outline"},
    {codigo:"PAUSA_MENTAL",titulo:"Pausa mental",descripcion:"Reserva unos minutos sin estímulos para recuperar calma y organizar tus pensamientos.",icono:"cloud-outline"},
  ],

  SUENO:[
    {codigo:"RUTINA_SUENO",titulo:"Rutina de sueño",descripcion:"Intenta mantener horarios similares para dormir y despertar durante la semana.",icono:"moon-outline"},
    {codigo:"DESCANSO_PANTALLAS",titulo:"Preparar el descanso",descripcion:"Reduce pantallas y actividades estimulantes antes de acostarte.",icono:"phone-portrait-outline"},
    {codigo:"RELAJACION",titulo:"Relajación antes de dormir",descripcion:"Realiza respiración o relajación muscular durante algunos minutos antes de acostarte.",icono:"bed-outline"},
  ],

  APOYO_SOCIAL:[
    {codigo:"CONTACTO_CONFIANZA",titulo:"Conectar con alguien",descripcion:"Busca un momento para conversar con una persona de confianza sobre cómo te has sentido.",icono:"people-outline"},
    {codigo:"ESPACIO_SOCIAL",titulo:"Crear un espacio de conexión",descripcion:"Planifica una actividad sencilla con alguien con quien te sientas cómodo.",icono:"chatbubbles-outline"},
    {codigo:"PEDIR_APOYO",titulo:"Practicar pedir apoyo",descripcion:"Identifica una situación concreta en la que otra persona podría ayudarte esta semana.",icono:"hand-left-outline"},
  ],

  VIDA_DIARIA:[
    {codigo:"TAREA_PEQUENA",titulo:"Una tarea a la vez",descripcion:"Divide tus responsabilidades en pasos pequeños y comienza por uno que puedas completar hoy.",icono:"checkmark-circle-outline"},
    {codigo:"RUTINA",titulo:"Organizar tu día",descripcion:"Define tres actividades importantes y deja espacios breves para descansar.",icono:"calendar-outline"},
    {codigo:"PAUSAS",titulo:"Pausas intencionales",descripcion:"Incluye descansos cortos entre actividades para evitar acumular tensión.",icono:"time-outline"},
  ],

  ESTADO_EMOCIONAL:[
    {codigo:"DIARIO_EMOCIONAL",titulo:"Diario emocional",descripcion:"Registra qué ocurrió, qué pensaste, qué emoción apareció y cómo respondiste.",icono:"book-outline"},
    {codigo:"ACTIVIDAD_SIGNIFICATIVA",titulo:"Actividad significativa",descripcion:"Realiza una actividad pequeña que normalmente disfrutas o consideras importante.",icono:"heart-outline"},
    {codigo:"AUTOCUIDADO",titulo:"Momento de autocuidado",descripcion:"Reserva un espacio breve para una actividad tranquila que favorezca tu bienestar.",icono:"sparkles-outline"},
  ],
};

function obtenerObjetivo(prioridades:ResultadoBase[]) {
  const codigos = prioridades.map((p) => p.codigo);

  if (codigos.includes("SOMATICO") && codigos.includes("ANSIEDAD_INSOMNIO"))
    return "Reducir la tensión física y emocional mediante estrategias sencillas de regulación y autocuidado.";

  if (codigos.includes("ANSIEDAD_INSOMNIO") && codigos.includes("SUENO"))
    return "Favorecer un estado de mayor calma y fortalecer hábitos que faciliten un descanso adecuado.";

  if (codigos.includes("ESTADO_EMOCIONAL") && codigos.includes("APOYO_SOCIAL"))
    return "Fortalecer el bienestar emocional y aumentar los espacios de conexión y apoyo.";

  if (prioridades.length > 1)
    return "Fortalecer las áreas que actualmente requieren mayor atención mediante acciones pequeñas y sostenibles.";

  switch (prioridades[0]?.codigo) {
    case "SOMATICO":
      return "Favorecer el bienestar físico y reducir la tensión corporal durante las actividades diarias.";

    case "ANSIEDAD_INSOMNIO":
      return "Desarrollar estrategias sencillas para manejar la tensión y recuperar momentos de calma.";

    case "SUENO":
      return "Fortalecer hábitos que favorezcan un descanso más estable y reparador.";

    case "APOYO_SOCIAL":
      return "Fortalecer los vínculos y aumentar los espacios de apoyo y comunicación.";

    case "VIDA_DIARIA":
      return "Recuperar organización y equilibrio en las actividades cotidianas mediante pasos pequeños.";

    case "ESTADO_EMOCIONAL":
      return "Fortalecer el reconocimiento y manejo cotidiano de las emociones.";

    default:
      return "Mantener y fortalecer hábitos que favorezcan tu bienestar diario.";
  }
}

function obtenerActividades(prioridades:ResultadoBase[]) {
  const mapa = new Map<string,ActividadPlan>();

  prioridades.forEach((prioridad) => {
    (ACTIVIDADES[prioridad.codigo] ?? []).forEach((actividad) => {
      if (!mapa.has(actividad.codigo)) {
        mapa.set(actividad.codigo,actividad);
      }
    });
  });

  return Array.from(mapa.values()).slice(0,5);
}

export async function generarPlanBienestar(
  idEntrevista:string,
  resultados:ResultadoBase[]
):Promise<PlanBienestar> {

  if (!idEntrevista) {
    throw new Error("No se recibió la entrevista.");
  }

  const {data:{user},error:userError} = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error obteniendo usuario:",userError);
    throw new Error("No se pudo identificar al usuario.");
  }

  let objetivo = "";
  let actividades:ActividadPlan[] = [];

  if (!resultados.length) {
    objetivo = "Mantener los hábitos y recursos personales que actualmente favorecen tu bienestar.";

    actividades = [
      {codigo:"DIARIO_EMOCIONAL",titulo:"Registrar cómo te sientes",descripcion:"Dedica unos minutos a reconocer y registrar tus emociones durante la semana.",icono:"book-outline"},
      {codigo:"RUTINA",titulo:"Mantener una rutina equilibrada",descripcion:"Conserva espacios para descanso, responsabilidades y actividades que disfrutas.",icono:"calendar-outline"},
      {codigo:"CONEXION",titulo:"Cuidar tus vínculos",descripcion:"Mantén contacto con personas que forman parte de tu red de apoyo.",icono:"people-outline"},
    ];
  } else {
    const mayor = Math.max(...resultados.map((r) => r.porcentaje));

    const prioridades = resultados.filter(
      (r) => Math.abs(r.porcentaje - mayor) < 0.01
    );

    objetivo = obtenerObjetivo(prioridades);
    actividades = obtenerActividades(prioridades);
  }

  const ahora = new Date().toISOString();

  // Revisar si ya existe un plan para esta entrevista
  const {data:planExistente,error:errorConsulta} = await supabase
    .from("plan_bienestar")
    .select("id_plan")
    .eq("id_entrevista",idEntrevista)
    .maybeSingle();

  if (errorConsulta) {
    console.error("Error consultando plan existente:",errorConsulta);
    throw new Error("No se pudo consultar el plan de bienestar.");
  }

  let data:any;
  let error:any;

  // Si existe, lo actualizamos
  if (planExistente) {
    const respuesta = await supabase
      .from("plan_bienestar")
      .update({
        objetivo_principal:objetivo,
        actividades_recomendadas:actividades,
        estado:"activo",
        fecha_actualizacion:ahora,
      })
      .eq("id_entrevista",idEntrevista)
      .select()
      .single();

    data = respuesta.data;
    error = respuesta.error;
  }

  // Si no existe, lo creamos
  else {
    const respuesta = await supabase
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
      .select()
      .single();

    data = respuesta.data;
    error = respuesta.error;
  }

  if (error) {
    console.error("Error guardando plan:",error);
    throw new Error("No se pudo guardar tu plan de bienestar.");
  }

  console.log("PLAN DE BIENESTAR GUARDADO:",data);

  return {
    id_plan:data.id_plan,
    id_entrevista:idEntrevista,
    objetivo_principal:objetivo,
    actividades_recomendadas:actividades,
    estado:data.estado ?? "activo",
  };
}