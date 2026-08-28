import { supabase } from "@/lib/supabase";

export type ActividadResumen = {
  codigo:string;
  titulo:string;
  descripcion:string;
  icono:string;
};

export type ResumenBienestar = {
  id_entrevista:string;
  fecha_fin:string|null;
  area_prioritaria:string|null;
  porcentaje:number|null;
  nivel:string|null;
  objetivo:string|null;
  actividades:ActividadResumen[];
};

export async function obtenerResumenBienestar():Promise<ResumenBienestar|null> {
  const {data:{user},error:userError} = await supabase.auth.getUser();
  if (userError || !user) return null;

  const {data:entrevista,error:entrevistaError} = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista,fecha_fin")
    .eq("id_usuario",user.id)
    .eq("estado","completada")
    .order("fecha_fin",{ascending:false})
    .limit(1)
    .maybeSingle();

  if (entrevistaError) throw entrevistaError;
  if (!entrevista) return null;

  const {data:resultados,error:resultadosError} = await supabase
    .from("resultado_entrevista")
    .select(`
      porcentaje,
      nivel,
      modulo_entrevista!inner(codigo,nombre)
    `)
    .eq("id_entrevista",entrevista.id_entrevista)
    .order("porcentaje",{ascending:false});

  if (resultadosError) throw resultadosError;

  const lista = (resultados ?? []) as any[];
  const mayor = lista.length ? Number(lista[0].porcentaje ?? 0) : null;

  const prioridades = mayor === null
    ? []
    : lista.filter((r) => Math.abs(Number(r.porcentaje ?? 0) - mayor) < .01);

  const nombres = prioridades.map((r:any) => {
    const modulo = Array.isArray(r.modulo_entrevista)
      ? r.modulo_entrevista[0]
      : r.modulo_entrevista;

    return modulo?.nombre;
  }).filter(Boolean);

  const {data:plan,error:planError} = await supabase
    .from("plan_bienestar")
    .select("objetivo_principal,actividades_recomendadas")
    .eq("id_entrevista",entrevista.id_entrevista)
    .maybeSingle();

  if (planError) throw planError;

  return {
    id_entrevista:entrevista.id_entrevista,
    fecha_fin:entrevista.fecha_fin,
    area_prioritaria:nombres.length ? nombres.join(" y ") : null,
    porcentaje:mayor,
    nivel:lista[0]?.nivel ?? null,
    objetivo:plan?.objetivo_principal ?? null,
    actividades:Array.isArray(plan?.actividades_recomendadas)
      ? plan.actividades_recomendadas
      : [],
  };
}