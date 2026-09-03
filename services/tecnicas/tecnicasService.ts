import { supabase } from "@/lib/supabase";
import type {
  PasoTecnica,
  RegistroTecnica,
  TecnicaComplementaria,
} from "@/types/tecnicas";

export type {
  PasoTecnica,
  RegistroTecnica,
  TecnicaComplementaria,
} from "@/types/tecnicas";

const SELECT_TECNICA =
  "id_tecnica, nombre, descripcion, objetivo, duracion_estimada, estado, fecha_registro, fecha_actualizacion";

const SELECT_PASO =
  "id_paso, id_tecnica, titulo, instruccion, orden, duracion_segundos, tipo_recurso, url_recurso, miniatura_url, estado, fecha_registro, fecha_actualizacion";

const SELECT_REGISTRO =
  "id_registro, id_usuario, id_tecnica, fecha_inicio, fecha_fin, completada";

async function obtenerUsuarioId(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user)
    throw new Error("Debes iniciar sesión para usar las técnicas.");

  return session.user.id;
}

// ============================================================
// TÉCNICAS
// ============================================================

export async function obtenerTecnicasActivas(): Promise<TecnicaComplementaria[]> {
  const { data, error } = await supabase
    .from("tecnica_complementaria")
    .select(SELECT_TECNICA)
    .eq("estado", "activa")
    .order("nombre");

  if (error)
    throw new Error("No pudimos cargar las técnicas complementarias.");

  return (data ?? []) as TecnicaComplementaria[];
}

export async function obtenerTecnica(
  idTecnica: string
): Promise<TecnicaComplementaria> {
  const { data, error } = await supabase
    .from("tecnica_complementaria")
    .select(SELECT_TECNICA)
    .eq("id_tecnica", idTecnica)
    .eq("estado", "activa")
    .single();

  if (error || !data)
    throw new Error("No encontramos esta técnica.");

  return data as TecnicaComplementaria;
}

// ============================================================
// PASOS
// ============================================================

export async function obtenerPasosTecnica(
  idTecnica: string
): Promise<PasoTecnica[]> {
  const { data, error } = await supabase
    .from("paso_tecnica")
    .select(SELECT_PASO)
    .eq("id_tecnica", idTecnica)
    .eq("estado", "activo")
    .order("orden");

  if (error)
    throw new Error("No pudimos cargar los pasos de esta técnica.");

  return (data ?? []) as PasoTecnica[];
}

// ============================================================
// INICIAR
// ============================================================

export async function iniciarTecnica(
  idTecnica: string
): Promise<RegistroTecnica> {
  const idUsuario = await obtenerUsuarioId();

  const { data: existente, error } = await supabase
    .from("registro_tecnica")
    .select(SELECT_REGISTRO)
    .eq("id_usuario", idUsuario)
    .eq("id_tecnica", idTecnica)
    .eq("completada", false)
    .is("fecha_fin", null)
    .maybeSingle();

  if (error)
    throw new Error("No pudimos verificar tu progreso.");

  if (existente)
    return existente as RegistroTecnica;

  const { data, error: insertError } = await supabase
    .from("registro_tecnica")
    .insert({
      id_usuario: idUsuario,
      id_tecnica: idTecnica,
    })
    .select(SELECT_REGISTRO)
    .single();

  if (insertError || !data)
    throw new Error("No pudimos iniciar la técnica.");

  return data as RegistroTecnica;
}

// ============================================================
// COMPLETAR
// ============================================================

export async function completarTecnica(
  idRegistro: string
): Promise<void> {
  const idUsuario = await obtenerUsuarioId();

  const { error } = await supabase
    .from("registro_tecnica")
    .update({
      completada: true,
      fecha_fin: new Date().toISOString(),
    })
    .eq("id_registro", idRegistro)
    .eq("id_usuario", idUsuario)
    .eq("completada", false);

  if (error)
    throw new Error("No pudimos guardar la técnica completada.");
}

// ============================================================
// HISTORIAL
// ============================================================

export async function obtenerHistorialTecnicas(): Promise<RegistroTecnica[]> {
  const idUsuario = await obtenerUsuarioId();

  const { data, error } = await supabase
    .from("registro_tecnica")
    .select(`
      ${SELECT_REGISTRO},
      tecnica_complementaria (
        nombre,
        duracion_estimada
      )
    `)
    .eq("id_usuario", idUsuario)
    .eq("completada", true)
    .order("fecha_fin", { ascending: false });

  if (error)
    throw new Error("No pudimos cargar tu historial de técnicas.");

  return (data ?? []) as unknown as RegistroTecnica[];
}