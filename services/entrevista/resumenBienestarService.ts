import { supabase } from "@/lib/supabase";

export type ResumenBienestar = {
  id_entrevista:string;
  fecha_fin:string|null;
  area_prioritaria:string|null;
  codigo_prioritario:string|null;
  porcentaje:number|null;
  nivel:string|null;
  objetivo:string|null;
  actividades:number;
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

  if (entrevistaError) {
    console.error("Error obteniendo última entrevista:",entrevistaError);
    throw entrevistaError;
  }

  if (!entrevista) return null;

  const {data:resultados,error:resultadoError} = await supabase
    .from("resultado_entrevista")
    .select(`
      porcentaje,
      nivel,
      modulo_entrevista!inner(
        codigo,
        nombre
      )
    `)
    .eq("id_entrevista",entrevista.id_entrevista)
    .order("porcentaje",{ascending:false})
    .limit(1);

  if (resultadoError) {
    console.error("Error obteniendo resultado:",resultadoError);
    throw resultadoError;
  }

  const resultado:any = resultados?.[0];
  const modulo = Array.isArray(resultado?.modulo_entrevista)
    ? resultado.modulo_entrevista[0]
    : resultado?.modulo_entrevista;

  const {data:plan,error:planError} = await supabase
    .from("plan_bienestar")
    .select("objetivo_principal,actividades_recomendadas")
    .eq("id_entrevista",entrevista.id_entrevista)
    .maybeSingle();

  if (planError) {
    console.error("Error obteniendo plan:",planError);
    throw planError;
  }

  return {
    id_entrevista:entrevista.id_entrevista,
    fecha_fin:entrevista.fecha_fin,
    area_prioritaria:modulo?.nombre ?? null,
    codigo_prioritario:modulo?.codigo ?? null,
    porcentaje:resultado ? Number(resultado.porcentaje ?? 0) : null,
    nivel:resultado?.nivel ?? null,
    objetivo:plan?.objetivo_principal ?? null,
    actividades:Array.isArray(plan?.actividades_recomendadas)
      ? plan.actividades_recomendadas.length
      : 0,
  };
}