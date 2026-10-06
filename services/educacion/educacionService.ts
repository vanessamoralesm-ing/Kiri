import { supabase } from "@/lib/supabase";

import {
  Categoria,
  RecursoPsicoeducativo,
  VisualizacionRecurso,
} from "@/types/educacion";


// ==========================================================
// OBTENER CATEGORÍAS ACTIVAS
// ==========================================================

export async function obtenerCategoriasEducacion(): Promise<
  Categoria[]
> {
  const { data, error } = await supabase
    .from("categoria")
    .select(`
      id_categoria,
      nombre,
      descripcion,
      estado
    `)
    .eq("estado", "activo")
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error al obtener categorías de educación:",
      error
    );

    return [];
  }

  return data ?? [];
}


// ==========================================================
// OBTENER CATEGORÍA POR NOMBRE
// ==========================================================

export async function obtenerCategoriaPorNombre(
  nombre: string
): Promise<Categoria | null> {
  if (!nombre) {
    return null;
  }

  const { data, error } = await supabase
    .from("categoria")
    .select(`
      id_categoria,
      nombre,
      descripcion,
      estado
    `)
    .ilike("nombre", nombre)
    .eq("estado", "activo")
    .maybeSingle();

  if (error) {
    console.error(
      "Error al obtener categoría por nombre:",
      error
    );

    return null;
  }

  return data ?? null;
}


// ==========================================================
// OBTENER RECURSOS DE UNA CATEGORÍA
// ==========================================================

export async function obtenerRecursosPorCategoria(
  idCategoria: string
): Promise<RecursoPsicoeducativo[]> {
  if (!idCategoria) {
    return [];
  }

  const { data, error } = await supabase
    .from("recurso_categoria")
    .select(`
      recurso_psicoeducativo (
        id_recurso,
        titulo,
        descripcion,
        tipo_recurso,
        contenido,
        url_recurso,
        imagen_portada,
        autor_fuente,
        fecha_publicacion,
        estado
      )
    `)
    .eq("id_categoria", idCategoria);

  if (error) {
    console.error(
      "Error al obtener recursos de la categoría:",
      error
    );

    return [];
  }

  const recursos =
    data
      ?.map((item: any) => {
        return item.recurso_psicoeducativo;
      })
      .filter(
        (
          recurso
        ): recurso is RecursoPsicoeducativo => {
          return (
            recurso !== null &&
            recurso !== undefined &&
            recurso.estado === "activo"
          );
        }
      ) ?? [];

  return recursos;
}


// ==========================================================
// OBTENER DETALLE DE UN RECURSO
// ==========================================================

export async function obtenerDetalleRecurso(
  idRecurso: string
): Promise<RecursoPsicoeducativo | null> {
  if (!idRecurso) {
    return null;
  }

  const { data, error } = await supabase
    .from("recurso_psicoeducativo")
    .select(`
      id_recurso,
      titulo,
      descripcion,
      tipo_recurso,
      contenido,
      url_recurso,
      imagen_portada,
      autor_fuente,
      fecha_publicacion,
      estado
    `)
    .eq("id_recurso", idRecurso)
    .eq("estado", "activo")
    .maybeSingle();

  if (error) {
    console.error(
      "Error al obtener detalle del recurso:",
      error
    );

    return null;
  }

  return data ?? null;
}


// ==========================================================
// REGISTRAR VISUALIZACIÓN DE UN RECURSO
// ==========================================================

export async function registrarVisualizacionRecurso(
  idRecurso: string
): Promise<VisualizacionRecurso | null> {
  if (!idRecurso) {
    return null;
  }

  const {
    data: userResponse,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "Error al obtener el usuario:",
      userError
    );

    return null;
  }

  const idUsuario = userResponse.user?.id;

  if (!idUsuario) {
    console.error(
      "No se encontró un usuario autenticado."
    );

    return null;
  }

  const { data, error } = await supabase
    .from("visualizacion_recurso")
    .insert({
      id_usuario: idUsuario,
      id_recurso: idRecurso,
      fecha: new Date().toISOString(),
    })
    .select(`
      id_visualizacion,
      id_usuario,
      id_recurso,
      fecha
    `)
    .single();

  if (error || !data) {
    console.error(
      "Error al registrar visualización del recurso:",
      error
    );

    return null;
  }

  return data;
}


// ==========================================================
// OBTENER VISUALIZACIONES DEL USUARIO
// ==========================================================

export async function obtenerVisualizacionesUsuario(): Promise<
  VisualizacionRecurso[]
> {
  const {
    data: userResponse,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "Error al obtener el usuario:",
      userError
    );

    return [];
  }

  const idUsuario = userResponse.user?.id;

  if (!idUsuario) {
    return [];
  }

  const { data, error } = await supabase
    .from("visualizacion_recurso")
    .select(`
      id_visualizacion,
      id_usuario,
      id_recurso,
      fecha
    `)
    .eq("id_usuario", idUsuario)
    .order("fecha", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Error al obtener visualizaciones del usuario:",
      error
    );

    return [];
  }

  return data ?? [];
}