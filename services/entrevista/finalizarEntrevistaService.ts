import { supabase } from "@/lib/supabase";

export async function finalizarEntrevista(idEntrevista:string) {
  if (!idEntrevista) throw new Error("No se recibió la entrevista.");

  const ahora = new Date().toISOString();

  const {data,error} = await supabase
    .from("entrevista_realizada")
    .update({
      estado:"completada",
      fecha_fin:ahora,
      fecha_actualizacion:ahora,
    })
    .eq("id_entrevista",idEntrevista)
    .select("id_entrevista,estado,fecha_fin")
    .single();

  if (error) {
    console.error("Error finalizando entrevista:",error);
    throw new Error("No se pudo finalizar la entrevista.");
  }

  console.log("ENTREVISTA FINALIZADA:",data);

  return data;
}