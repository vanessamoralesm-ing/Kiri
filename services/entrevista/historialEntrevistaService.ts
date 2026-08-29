import { supabase } from "@/lib/supabase";

export type EntrevistaHistorial = {
  id_entrevista: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: string;
  areas_prioritarias: string[];
  porcentaje: number | null;
  nivel: string | null;
  tiene_plan: boolean;
};

export async function obtenerHistorialEntrevistas(): Promise<EntrevistaHistorial[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("No se pudo identificar al usuario.");

  /*
  ================================================
  ENTREVISTAS COMPLETADAS DEL USUARIO
  ================================================
  */
  const { data: entrevistas, error: entrevistasError } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, fecha_inicio, fecha_fin, estado")
    .eq("id_usuario", user.id)
    .eq("estado", "completada")
    .order("fecha_fin", { ascending: false });

  if (entrevistasError) throw entrevistasError;
  if (!entrevistas?.length) return [];

  const ids = entrevistas.map(e => e.id_entrevista);

  /*
  ================================================
  RESULTADOS DE TODAS LAS ENTREVISTAS
  ================================================
  */
  const { data: resultados, error: resultadosError } = await supabase
    .from("resultado_entrevista")
    .select(`
      id_entrevista,
      porcentaje,
      nivel,
      modulo_entrevista!inner(codigo, nombre)
    `)
    .in("id_entrevista", ids);

  if (resultadosError) throw resultadosError;

  /*
  ================================================
  PLANES EXISTENTES
  ================================================
  */
  const { data: planes, error: planesError } = await supabase
    .from("plan_bienestar")
    .select("id_plan, id_entrevista")
    .in("id_entrevista", ids);

  if (planesError) throw planesError;

  const idsConPlan = new Set((planes ?? []).map(plan => plan.id_entrevista));

  /*
  ================================================
  ARMAR HISTORIAL
  ================================================
  */
  return entrevistas.map(entrevista => {
    const lista = ((resultados ?? []) as any[])
      .filter(resultado => resultado.id_entrevista === entrevista.id_entrevista)
      .sort((a, b) => Number(b.porcentaje ?? 0) - Number(a.porcentaje ?? 0));

    const mayor = lista.length ? Number(lista[0].porcentaje ?? 0) : null;

    const prioridades = mayor === null
      ? []
      : lista.filter(resultado => Math.abs(Number(resultado.porcentaje ?? 0) - mayor) < 0.01);

    const nombres = prioridades
      .map((resultado: any) => {
        const modulo = Array.isArray(resultado.modulo_entrevista)
          ? resultado.modulo_entrevista[0]
          : resultado.modulo_entrevista;
        return modulo?.nombre;
      })
      .filter(Boolean);

    return {
      id_entrevista: entrevista.id_entrevista,
      fecha_inicio: entrevista.fecha_inicio,
      fecha_fin: entrevista.fecha_fin,
      estado: entrevista.estado,
      areas_prioritarias: nombres,
      porcentaje: mayor,
      nivel: lista[0]?.nivel ?? null,
      tiene_plan: idsConPlan.has(entrevista.id_entrevista),
    };
  });
}