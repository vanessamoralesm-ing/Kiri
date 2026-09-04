import { supabase } from "@/lib/supabase";

export interface GuardarDiarioEmocionalParams {
  idUsuario: string;
  emocionNombre: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}

export interface EntradaDiarioResumen {
  id_registro: string;
  fecha_inicio: string;
  plantilla_nombre: string;
  emociones: string[];
  respuesta_corta: string;
}

export interface DetalleRegistroDiario {
  id_registro: string;
  fecha_inicio: string;
  plantilla_nombre: string;
  emocionNombre: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}

// -------------------------------------------------------------
// 1. CREAR REGISTRO
// -------------------------------------------------------------
export async function guardarDiarioEmocionalService(params: GuardarDiarioEmocionalParams) {
  const { idUsuario, emocionNombre, motivo, reaccion, ideaUtil } = params;

  // 1. Obtener la plantilla activa "Diario Emocional"
  const { data: plantilla, error: errPlantilla } = await supabase
    .from("plantilla_autorregistro")
    .select("id_plantilla")
    .eq("tipo", "emocional")
    .eq("nombre", "Diario Emocional")
    .eq("estado", "activa")
    .single();

  if (errPlantilla || !plantilla) {
    throw new Error(`Error al obtener plantilla: ${errPlantilla?.message}`);
  }

  // 2. Obtener las 3 secciones ordenadas
  const { data: secciones, error: errSecciones } = await supabase
    .from("seccion_autorregistro")
    .select("id_seccion, orden")
    .eq("id_plantilla", plantilla.id_plantilla)
    .order("orden", { ascending: true });

  if (errSecciones || !secciones || secciones.length === 0) {
    throw new Error(`Error al obtener secciones: ${errSecciones?.message}`);
  }

  // 3. Crear el registro cabecera
  const fechaFin = new Date().toISOString();
  const { data: registro, error: errRegistro } = await supabase
    .from("registro_autorregistro")
    .insert({
      id_usuario: idUsuario,
      id_plantilla: plantilla.id_plantilla,
      fecha_inicio: fechaFin,
      fecha_fin: fechaFin,
      estado: "completado",
    })
    .select("id_registro")
    .single();

  if (errRegistro || !registro) {
    throw new Error(`Error al crear el registro: ${errRegistro.message}`);
  }

  const idRegistro = registro.id_registro;

  // 4. Guardar la emoción seleccionada en la tabla relacional N:M
  if (emocionNombre) {
    const { data: emocionBD } = await supabase
      .from("emocion_autorregistro")
      .select("id_emocion")
      .ilike("nombre", emocionNombre)
      .single();

    if (emocionBD) {
      await supabase.from("registro_emocion_autorregistro").insert({
        id_registro: idRegistro,
        id_emocion: emocionBD.id_emocion,
      });
    }
  }

  // 5. Mapear las 3 respuestas a sus respectivas secciones por orden
  const mapaRespuestas: Record<number, string> = {
    1: motivo,
    2: reaccion,
    3: ideaUtil,
  };

  const respuestasAInsertar = secciones
    .map((sec) => {
      const texto = mapaRespuestas[sec.orden];
      if (!texto || texto.trim() === "") return null;

      return {
        id_registro: idRegistro,
        id_seccion: sec.id_seccion,
        respuesta_texto: texto,
      };
    })
    .filter((item): item is { id_registro: string; id_seccion: string; respuesta_texto: string } => item !== null);

  if (respuestasAInsertar.length > 0) {
    const { error: errRespuestas } = await supabase
      .from("respuesta_autorregistro")
      .insert(respuestasAInsertar);

    if (errRespuestas) {
      throw new Error(`Error al guardar respuestas: ${errRespuestas.message}`);
    }
  }

  return idRegistro;
}

// -------------------------------------------------------------
// 2. OBTENER HISTORIAL (LISTA DE REGISTROS)
// -------------------------------------------------------------
export async function obtenerHistorialDiario(limit: number = 20): Promise<EntradaDiarioResumen[]> {
  const { data: userResponse } = await supabase.auth.getUser();
  const userId = userResponse.user?.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("registro_autorregistro")
    .select(`
      id_registro,
      fecha_inicio,
      plantilla_autorregistro ( nombre ),
      registro_emocion_autorregistro (
        emocion_autorregistro ( nombre )
      ),
      respuesta_autorregistro ( respuesta_texto )
    `)
    .eq("id_usuario", userId)
    .order("fecha_inicio", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Error al obtener historial:", error);
    return [];
  }

  return data.map((item: any) => {
    const emociones = item.registro_emocion_autorregistro
      ? item.registro_emocion_autorregistro
          .map((e: any) => e.emocion_autorregistro?.nombre)
          .filter(Boolean)
      : [];

    const respuestaCorta = item.respuesta_autorregistro?.[0]?.respuesta_texto || "Sin descripción";

    return {
      id_registro: item.id_registro,
      fecha_inicio: item.fecha_inicio,
      plantilla_nombre: item.plantilla_autorregistro?.nombre || "Diario Emocional",
      emociones,
      respuesta_corta: respuestaCorta,
    };
  });
}

// -------------------------------------------------------------
// 3. OBTENER DETALLE UN REGISTRO (PARA EDITAR O VER)
// -------------------------------------------------------------
export async function obtenerDetalleRegistro(idRegistro: string): Promise<DetalleRegistroDiario | null> {
  const { data, error } = await supabase
    .from("registro_autorregistro")
    .select(`
      id_registro,
      fecha_inicio,
      plantilla_autorregistro ( nombre ),
      registro_emocion_autorregistro (
        emocion_autorregistro ( nombre )
      ),
      respuesta_autorregistro (
        respuesta_texto,
        seccion_autorregistro ( orden )
      )
    `)
    .eq("id_registro", idRegistro)
    .single();

  if (error || !data) {
    console.error("Error al obtener detalle:", error);
    return null;
  }

  const emocionNombre =
    (data as any).registro_emocion_autorregistro?.[0]?.emocion_autorregistro?.nombre || "";

  const respuestas = (data as any).respuesta_autorregistro || [];
  let motivo = "";
  let reaccion = "";
  let ideaUtil = "";

  respuestas.forEach((resp: any) => {
    const orden = resp.seccion_autorregistro?.orden;
    if (orden === 1) motivo = resp.respuesta_texto || "";
    if (orden === 2) reaccion = resp.respuesta_texto || "";
    if (orden === 3) ideaUtil = resp.respuesta_texto || "";
  });

  return {
    id_registro: data.id_registro,
    fecha_inicio: data.fecha_inicio,
    plantilla_nombre: (data as any).plantilla_autorregistro?.nombre || "Diario Emocional",
    emocionNombre,
    motivo,
    reaccion,
    ideaUtil,
  };
}

// -------------------------------------------------------------
// 4. ACTUALIZAR REGISTRO EXISTENTE
// -------------------------------------------------------------
export async function actualizarDiarioEmocionalService(params: {
  idRegistro: string;
  emocionNombre: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}) {
  const { idRegistro, emocionNombre, motivo, reaccion, ideaUtil } = params;

  // Actualizar emoción
  if (emocionNombre) {
    await supabase.from("registro_emocion_autorregistro").delete().eq("id_registro", idRegistro);

    const { data: emocionBD } = await supabase
      .from("emocion_autorregistro")
      .select("id_emocion")
      .ilike("nombre", emocionNombre)
      .single();

    if (emocionBD) {
      await supabase.from("registro_emocion_autorregistro").insert({
        id_registro: idRegistro,
        id_emocion: emocionBD.id_emocion,
      });
    }
  }

  // Obtener secciones para mapear los textos
  const { data: registro } = await supabase
    .from("registro_autorregistro")
    .select("id_plantilla")
    .eq("id_registro", idRegistro)
    .single();

  if (!registro) throw new Error("Registro no encontrado.");

  const { data: secciones } = await supabase
    .from("seccion_autorregistro")
    .select("id_seccion, orden")
    .eq("id_plantilla", registro.id_plantilla);

  if (!secciones) throw new Error("Secciones no encontradas.");

  const mapaRespuestas: Record<number, string> = { 1: motivo, 2: reaccion, 3: ideaUtil };

  for (const sec of secciones) {
    const texto = mapaRespuestas[sec.orden] || "";

    await supabase
      .from("respuesta_autorregistro")
      .upsert(
        {
          id_registro: idRegistro,
          id_seccion: sec.id_seccion,
          respuesta_texto: texto,
        },
        { onConflict: "id_registro,id_seccion" }
      );
  }

  return true;
}

// -------------------------------------------------------------
// 5. ELIMINAR REGISTRO
// -------------------------------------------------------------
export async function eliminarRegistroDiario(idRegistro: string): Promise<boolean> {
  const { error } = await supabase
    .from("registro_autorregistro")
    .delete()
    .eq("id_registro", idRegistro);

  if (error) {
    console.error("Error al eliminar registro:", error);
    return false;
  }

  return true;
}