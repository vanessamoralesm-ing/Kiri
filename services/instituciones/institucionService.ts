import { supabase } from "@/lib/supabase";
import type {
  EstadoInstitucion,
  FiltrosInstitucion,
  Institucion,
  InstitucionPayload,
} from "@/types/instituciones/institucion";
const CAMPOS =
  "id_institucion,codigo_institucional,nombre,logo,correo,telefono,direccion,municipio,departamento,fecha_registro,estado,tipo_institucion";
export async function obtenerInstitucionesAdmin(
  filtros: FiltrosInstitucion = {},
): Promise<Institucion[]> {
  let query = supabase.from("institucion").select(CAMPOS).order("nombre");
  const estado = filtros.estado ?? "activo";
  if (estado) query = query.eq("estado", estado);
  if (filtros.tipo) query = query.eq("tipo_institucion", filtros.tipo);
  // Quote the PostgREST literal so punctuation cannot inject filter expressions.
  const termino = filtros.busqueda?.trim();
  if (termino) {
    const literal = JSON.stringify(
      `%${termino.replace(/[\\%_]/g, (c) => "\\" + c)}%`,
    );
    query = query.or(
      ["nombre", "codigo_institucional", "correo", "municipio", "departamento"]
        .map((c) => `${c}.ilike.${literal}`)
        .join(","),
    );
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function obtenerInstitucionPorId(
  id: string,
): Promise<Institucion> {
  const { data, error } = await supabase
    .from("institucion")
    .select(CAMPOS)
    .eq("id_institucion", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
async function ejecutar(nombre: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(nombre, { body });
  if (error) {
    let mensaje = error.message;
    try {
      mensaje = (await error.context?.clone().json())?.error ?? mensaje;
    } catch {}
    throw new Error(mensaje);
  }
  if (!data?.ok)
    throw new Error(data?.error ?? "No fue posible guardar la institución.");
  return data;
}
export const crearInstitucion = (payload: InstitucionPayload) =>
  ejecutar("admin-crear-institucion", { payload });
export const editarInstitucion = (id: string, payload: InstitucionPayload) =>
  ejecutar("admin-editar-institucion", { idInstitucion: id, payload });
export const cambiarEstadoInstitucion = (
  id: string,
  estado: EstadoInstitucion,
) =>
  ejecutar("admin-cambiar-estado-institucion", { idInstitucion: id, estado });
export const eliminarInstitucion = (id: string) =>
  ejecutar("admin-eliminar-institucion", { idInstitucion: id });
