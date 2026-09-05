import { supabase } from "@/lib/supabase";
import {
  DetalleRegistroDiario,
  EntradaDiarioResumen,
  GuardarDiarioEmocionalParams,
  EmocionAutorregistro,
} from "@/types/diario";

// Obtener emociones activas desde Supabase
export async function obtenerEmocionesAutorregistro(): Promise<
  EmocionAutorregistro[]
> {
  const { data, error } = await supabase
    .from("emocion_autorregistro")
    .select("id_emocion, nombre, descripcion, estado")
    .eq("estado", "activa")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al obtener emociones: ${error.message}`);
  }

  return data ?? [];
}

// Guardar Diario Emocional
export async function guardarDiarioEmocionalService(
  params: GuardarDiarioEmocionalParams
): Promise<string> {
  const { idUsuario, idEmocion, motivo, reaccion, ideaUtil } = params;

  if (!idUsuario) {
    throw new Error("No se encontró el usuario.");
  }

  if (!idEmocion) {
    throw new Error("Debes seleccionar una emoción.");
  }

  // 1. Obtener la plantilla
  const { data: plantilla, error: errPlantilla } = await supabase
    .from("plantilla_autorregistro")
    .select("id_plantilla")
    .eq("nombre", "Diario Emocional")
    .eq("tipo", "emocional")
    .eq("estado", "activa")
    .single();

  if (errPlantilla || !plantilla) {
    throw new Error(
      `No se encontró la plantilla Diario Emocional: ${
        errPlantilla?.message ?? "plantilla no encontrada"
      }`
    );
  }

  // 2. Obtener las secciones de la plantilla
  const { data: secciones, error: errSecciones } = await supabase
    .from("seccion_autorregistro")
    .select("id_seccion, orden")
    .eq("id_plantilla", plantilla.id_plantilla)
    .order("orden", { ascending: true });

  if (errSecciones || !secciones || secciones.length === 0) {
    throw new Error(
      `No se encontraron las secciones: ${
        errSecciones?.message ?? "sin secciones"
      }`
    );
  }

  // 3. Verificar que la emoción exista en la BD
  const { data: emocion, error: errEmocion } = await supabase
    .from("emocion_autorregistro")
    .select("id_emocion")
    .eq("id_emocion", idEmocion)
    .eq("estado", "activa")
    .single();

  if (errEmocion || !emocion) {
    throw new Error(
      `No se encontró la emoción seleccionada: ${
        errEmocion?.message ?? "emoción no encontrada"
      }`
    );
  }

  let idRegistro: string | null = null;

  try {
    // 4. Crear registro inicialmente en progreso
    const { data: registro, error: errRegistro } = await supabase
      .from("registro_autorregistro")
      .insert({
        id_usuario: idUsuario,
        id_plantilla: plantilla.id_plantilla,
        estado: "en_progreso",
      })
      .select("id_registro")
      .single();

    if (errRegistro || !registro) {
      throw new Error(
        `Error al crear el registro: ${
          errRegistro?.message ?? "registro no creado"
        }`
      );
    }

    idRegistro = registro.id_registro;

    if (!idRegistro) {
      throw new Error("No se pudo obtener el ID del registro creado.");
    }

    // 5. Guardar la emoción
    const { error: errRegistroEmocion } = await supabase
      .from("registro_emocion_autorregistro")
      .insert({
        id_registro: idRegistro,
        id_emocion: emocion.id_emocion,
      });

    if (errRegistroEmocion) {
      throw new Error(
        `Error al guardar la emoción: ${errRegistroEmocion.message}`
      );
    }

    // 6. Relacionar respuestas con secciones
    const respuestasPorOrden: Record<number, string> = {
      1: motivo,
      2: reaccion,
      3: ideaUtil,
    };

    const respuestas = secciones
      .map((seccion) => {
        const respuesta = respuestasPorOrden[seccion.orden];

        if (respuesta === undefined) {
          return null;
        }

        return {
          id_registro: idRegistro,
          id_seccion: seccion.id_seccion,
          respuesta_texto: respuesta.trim(),
        };
      })
      .filter((respuesta) => respuesta !== null);

    // 7. Guardar respuestas
    if (respuestas.length > 0) {
      const { error: errRespuestas } = await supabase
        .from("respuesta_autorregistro")
        .insert(respuestas);

      if (errRespuestas) {
        throw new Error(
          `Error al guardar las respuestas: ${errRespuestas.message}`
        );
      }
    }

    // 8. Marcar registro como completado
    const { error: errCompletar } = await supabase
      .from("registro_autorregistro")
      .update({
        estado: "completado",
        fecha_fin: new Date().toISOString(),
      })
      .eq("id_registro", idRegistro);

    if (errCompletar) {
      throw new Error(
        `Error al completar el registro: ${errCompletar.message}`
      );
    }

    return idRegistro;
  } catch (error) {
    // Si algo falla, eliminamos el registro creado.
    // ON DELETE CASCADE limpia sus relaciones.
    if (idRegistro) {
      await supabase
        .from("registro_autorregistro")
        .delete()
        .eq("id_registro", idRegistro);
    }

    throw error;
  }
}

// Obtener historial
export async function obtenerHistorialDiario(
  limit: number = 20
): Promise<EntradaDiarioResumen[]> {
  const { data: userResponse } = await supabase.auth.getUser();
  const userId = userResponse.user?.id;

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("registro_autorregistro")
    .select(`
      id_registro,
      fecha_inicio,
      plantilla_autorregistro (
        nombre
      ),
      registro_emocion_autorregistro (
        emocion_autorregistro (
          nombre
        )
      ),
      respuesta_autorregistro (
        respuesta_texto,
        seccion_autorregistro (
          orden
        )
      )
    `)
    .eq("id_usuario", userId)
    .order("fecha_inicio", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Error al obtener historial:", error);
    return [];
  }

  return data.map((item: any) => {
    const emociones =
      item.registro_emocion_autorregistro
        ?.map(
          (registroEmocion: any) =>
            registroEmocion.emocion_autorregistro?.nombre
        )
        .filter(Boolean) ?? [];

    const respuestaMotivo =
      item.respuesta_autorregistro?.find(
        (respuesta: any) =>
          respuesta.seccion_autorregistro?.orden === 1
      )?.respuesta_texto ?? "Sin descripción";

    return {
      id_registro: item.id_registro,
      fecha_inicio: item.fecha_inicio,
      plantilla_nombre:
        item.plantilla_autorregistro?.nombre ?? "Diario Emocional",
      emociones,
      respuesta_corta: respuestaMotivo,
    };
  });
}

// Obtener detalle
export async function obtenerDetalleRegistro(
  idRegistro: string
): Promise<DetalleRegistroDiario | null> {
  const { data, error } = await supabase
    .from("registro_autorregistro")
    .select(`
      id_registro,
      fecha_inicio,
      plantilla_autorregistro (
        nombre
      ),
      registro_emocion_autorregistro (
        id_emocion,
        emocion_autorregistro (
          nombre
        )
      ),
      respuesta_autorregistro (
        respuesta_texto,
        seccion_autorregistro (
          orden
        )
      )
    `)
    .eq("id_registro", idRegistro)
    .single();

  if (error || !data) {
    console.error("Error al obtener detalle:", error);
    return null;
  }

  const registroEmocion =
    (data as any).registro_emocion_autorregistro?.[0];

  const idEmocion =
    registroEmocion?.id_emocion ?? "";

  const emocionNombre =
    registroEmocion?.emocion_autorregistro?.nombre ?? "";

  const respuestas =
    (data as any).respuesta_autorregistro ?? [];

  let motivo = "";
  let reaccion = "";
  let ideaUtil = "";

  respuestas.forEach((respuesta: any) => {
    const orden =
      respuesta.seccion_autorregistro?.orden;

    if (orden === 1) {
      motivo = respuesta.respuesta_texto ?? "";
    }

    if (orden === 2) {
      reaccion = respuesta.respuesta_texto ?? "";
    }

    if (orden === 3) {
      ideaUtil = respuesta.respuesta_texto ?? "";
    }
  });

  return {
    id_registro: data.id_registro,
    fecha_inicio: data.fecha_inicio,
    plantilla_nombre:
      (data as any).plantilla_autorregistro?.nombre ??
      "Diario Emocional",
    idEmocion,
    emocionNombre,
    motivo,
    reaccion,
    ideaUtil,
  };
}

// Actualizar Diario Emocional
export async function actualizarDiarioEmocionalService(params: {
  idRegistro: string;
  idEmocion: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}): Promise<boolean> {
  const {
    idRegistro,
    idEmocion,
    motivo,
    reaccion,
    ideaUtil,
  } = params;

  if (!idRegistro) {
    throw new Error("No se encontró el registro.");
  }

  if (!idEmocion) {
    throw new Error("El registro no tiene una emoción seleccionada.");
  }

  // 1. Verificar registro y obtener su plantilla
  const { data: registro, error: errRegistro } = await supabase
    .from("registro_autorregistro")
    .select("id_plantilla")
    .eq("id_registro", idRegistro)
    .single();

  if (errRegistro || !registro) {
    throw new Error("Registro no encontrado.");
  }

  // 2. Obtener emoción actualmente relacionada
  const {
    data: emocionesActuales,
    error: errEmocionActual,
  } = await supabase
    .from("registro_emocion_autorregistro")
    .select("id_emocion")
    .eq("id_registro", idRegistro);

  if (errEmocionActual) {
    throw new Error(
      `Error al obtener la emoción actual: ${errEmocionActual.message}`
    );
  }

  const idsEmocionesActuales =
    emocionesActuales?.map(
      (item) => item.id_emocion
    ) ?? [];

  const emocionSinCambios =
    idsEmocionesActuales.length === 1 &&
    idsEmocionesActuales[0] === idEmocion;

  // 3. Solo actualizar la emoción si realmente cambió
  if (!emocionSinCambios) {
    const { data: nuevaEmocion, error: errNuevaEmocion } =
      await supabase
        .from("emocion_autorregistro")
        .select("id_emocion")
        .eq("id_emocion", idEmocion)
        .eq("estado", "activa")
        .single();

    if (errNuevaEmocion || !nuevaEmocion) {
      throw new Error(
        "La nueva emoción seleccionada no existe o no está activa."
      );
    }

    const { error: errEliminarEmocion } = await supabase
      .from("registro_emocion_autorregistro")
      .delete()
      .eq("id_registro", idRegistro);

    if (errEliminarEmocion) {
      throw new Error(
        `Error al reemplazar la emoción: ${errEliminarEmocion.message}`
      );
    }

    const { error: errInsertarEmocion } = await supabase
      .from("registro_emocion_autorregistro")
      .insert({
        id_registro: idRegistro,
        id_emocion: nuevaEmocion.id_emocion,
      });

    if (errInsertarEmocion) {
      throw new Error(
        `Error al guardar la nueva emoción: ${errInsertarEmocion.message}`
      );
    }
  }

  // 4. Obtener secciones de la plantilla
  const { data: secciones, error: errSecciones } = await supabase
    .from("seccion_autorregistro")
    .select("id_seccion, orden")
    .eq("id_plantilla", registro.id_plantilla)
    .order("orden", { ascending: true });

  if (errSecciones || !secciones || secciones.length === 0) {
    throw new Error("No se encontraron las secciones.");
  }

  // 5. Actualizar respuestas
  const respuestasPorOrden: Record<number, string> = {
    1: motivo,
    2: reaccion,
    3: ideaUtil,
  };

  for (const seccion of secciones) {
    const respuesta =
      respuestasPorOrden[seccion.orden];

    if (respuesta === undefined) {
      continue;
    }

    const { error: errRespuesta } = await supabase
      .from("respuesta_autorregistro")
      .upsert(
        {
          id_registro: idRegistro,
          id_seccion: seccion.id_seccion,
          respuesta_texto: respuesta.trim(),
        },
        {
          onConflict: "id_registro,id_seccion",
        }
      );

    if (errRespuesta) {
      throw new Error(
        `Error al actualizar una respuesta: ${errRespuesta.message}`
      );
    }
  }

  return true;
}

// Eliminar registro
export async function eliminarRegistroDiario(
  idRegistro: string
): Promise<boolean> {
  const { error } = await supabase
    .from("registro_autorregistro")
    .delete()
    .eq("id_registro", idRegistro);

  if (error) {
    console.error(
      "Error al eliminar registro:",
      error
    );

    return false;
  }

  return true;
}