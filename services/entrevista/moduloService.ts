import { supabase } from "@/lib/supabase";
import {
  EstadoModulo,
  ModuloEntrevista,
  ModuloEntrevistaRealizado,
  ModuloRealizadoConDatos,
  NuevoModuloRealizado,
} from "@/types/entrevista";

// OBTENER ENTREVISTA
async function obtenerDatosEntrevista(idEntrevista: string) {
  const { data, error } = await supabase
    .from("entrevista_realizada")
    .select("id_entrevista, id_usuario, id_plantilla, estado")
    .eq("id_entrevista", idEntrevista)
    .single();

  if (error) {
    console.error("Error obteniendo entrevista:", error);
    throw new Error("No se pudo obtener la entrevista.");
  }
  if (!data) throw new Error("La entrevista no existe.");
  return data;
}

// OBTENER ÚLTIMO ORDEN DE EJECUCIÓN
async function obtenerUltimoOrdenEjecucion(idEntrevista: string): Promise<number> {
  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .select("orden_ejecucion")
    .eq("id_entrevista", idEntrevista)
    .not("orden_ejecucion", "is", null)
    .order("orden_ejecucion", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error obteniendo último orden de ejecución:", error);
    throw new Error("No se pudo determinar el orden de los módulos.");
  }
  return Number(data?.[0]?.orden_ejecucion ?? 0);
}

// OBTENER SIGUIENTE ORDEN
async function obtenerSiguienteOrdenEjecucion(idEntrevista: string): Promise<number> {
  const ultimoOrden = await obtenerUltimoOrdenEjecucion(idEntrevista);
  return ultimoOrden + 1;
}

// OBTENER MÓDULO POR CÓDIGO
export async function obtenerModuloPorCodigo(
  idPlantilla: string,
  codigoModulo: string
): Promise<ModuloEntrevista> {
  const { data, error } = await supabase
    .from("modulo_entrevista")
    .select("*")
    .eq("id_plantilla", idPlantilla)
    .eq("codigo", codigoModulo)
    .eq("estado", "activo")
    .single();

  if (error) {
    console.error(`Error obteniendo módulo ${codigoModulo}:`, error);
    throw new Error(`No se pudo obtener el módulo ${codigoModulo}.`);
  }
  if (!data) throw new Error(`No existe el módulo ${codigoModulo}.`);
  return data as ModuloEntrevista;
}

// OBTENER MÓDULOS POR CÓDIGOS
export async function obtenerModulosPorCodigos(
  idPlantilla: string,
  codigos: string[]
): Promise<ModuloEntrevista[]> {
  if (codigos.length === 0) return [];

  const { data, error } = await supabase
    .from("modulo_entrevista")
    .select("*")
    .eq("id_plantilla", idPlantilla)
    .in("codigo", codigos)
    .eq("estado", "activo");

  if (error) {
    console.error("Error obteniendo módulos:", error);
    throw new Error("No se pudieron obtener los módulos.");
  }

  const modulos = (data ?? []) as ModuloEntrevista[];
  return codigos
    .map((codigo) => modulos.find((modulo) => modulo.codigo === codigo))
    .filter((modulo): modulo is ModuloEntrevista => Boolean(modulo));
}

// OBTENER REGISTRO DE UN MÓDULO REALIZADO
export async function obtenerModuloRealizado(
  idEntrevista: string,
  idModulo: string
): Promise<ModuloEntrevistaRealizado | null> {
  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .select("*")
    .eq("id_entrevista", idEntrevista)
    .eq("id_modulo", idModulo)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo módulo realizado:", error);
    throw new Error("No se pudo obtener el estado del módulo.");
  }
  return data as ModuloEntrevistaRealizado | null;
}

// ACTIVAR UN MÓDULO
export async function activarModulo(
  idEntrevista: string,
  codigoModulo: string,
  ordenEjecucion?: number
): Promise<ModuloEntrevistaRealizado> {
  const entrevista = await obtenerDatosEntrevista(idEntrevista);
  const modulo = await obtenerModuloPorCodigo(entrevista.id_plantilla, codigoModulo);
  const existente = await obtenerModuloRealizado(idEntrevista, modulo.id_modulo);
  if (existente) return existente;

  const ordenFinal = ordenEjecucion ?? (await obtenerSiguienteOrdenEjecucion(idEntrevista));
  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .insert({
      id_entrevista: idEntrevista,
      id_modulo: modulo.id_modulo,
      orden_ejecucion: ordenFinal,
      estado: "pendiente",
      fecha_activacion: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(`Error activando módulo ${codigoModulo}:`, error);
    throw new Error(`No se pudo activar el módulo ${codigoModulo}.`);
  }

  console.log(`Módulo ${codigoModulo} activado con orden ${ordenFinal}.`);
  return data as ModuloEntrevistaRealizado;
}

// ACTIVAR VARIOS MÓDULOS
export async function activarModulos(
  idEntrevista: string,
  codigosModulos: string[]
): Promise<ModuloEntrevistaRealizado[]> {
  if (codigosModulos.length === 0) return [];

  const entrevista = await obtenerDatosEntrevista(idEntrevista);
  const modulos = await obtenerModulosPorCodigos(entrevista.id_plantilla, codigosModulos);
  if (modulos.length === 0) return [];

  const idsModulos = modulos.map((m) => m.id_modulo);
  const { data: existentes, error: errorExistentes } = await supabase
    .from("modulo_entrevista_realizada")
    .select("*")
    .eq("id_entrevista", idEntrevista)
    .in("id_modulo", idsModulos);

  if (errorExistentes) {
    console.error("Error consultando módulos existentes:", errorExistentes);
    throw new Error("No se pudo comprobar el estado de los módulos.");
  }

  const mapaExistentes = new Map<string, ModuloEntrevistaRealizado>();
  ((existentes ?? []) as ModuloEntrevistaRealizado[]).forEach((reg) => {
    mapaExistentes.set(reg.id_modulo, reg);
  });

  const ultimoOrden = await obtenerUltimoOrdenEjecucion(idEntrevista);
  let siguienteOrden = ultimoOrden + 1;

  console.log("Último orden actual:", ultimoOrden);
  console.log("Primer orden adaptativo:", siguienteOrden);

  const nuevos: NuevoModuloRealizado[] = modulos.flatMap((modulo): NuevoModuloRealizado[] => {
    if (mapaExistentes.has(modulo.id_modulo)) {
      console.log(`El módulo ${modulo.codigo} ya estaba registrado.`);
      return [];
    }

    const nuevoRegistro: NuevoModuloRealizado = {
      id_entrevista: idEntrevista,
      id_modulo: modulo.id_modulo,
      orden_ejecucion: siguienteOrden,
      estado: "pendiente",
      fecha_activacion: new Date().toISOString(),
    };

    console.log(`Activando ${modulo.codigo} con orden ${siguienteOrden}.`);
    siguienteOrden += 1;
    return [nuevoRegistro];
  });

  if (nuevos.length > 0) {
    const { error: errorInsert } = await supabase
      .from("modulo_entrevista_realizada")
      .insert(nuevos);

    if (errorInsert) {
      console.error("Error activando módulos:", errorInsert);
      throw new Error("No se pudieron activar los módulos adaptativos.");
    }
  }

  const { data: registrosFinales, error: errorFinal } = await supabase
    .from("modulo_entrevista_realizada")
    .select("*")
    .eq("id_entrevista", idEntrevista)
    .in("id_modulo", idsModulos)
    .order("orden_ejecucion", { ascending: true });

  if (errorFinal) {
    console.error("Error obteniendo módulos activados:", errorFinal);
    throw new Error("Los módulos fueron procesados, pero no pudieron recuperarse.");
  }

  return (registrosFinales ?? []) as ModuloEntrevistaRealizado[];
}

// INICIAR MÓDULO
export async function iniciarModulo(
  idEntrevista: string,
  codigoModulo: string
): Promise<ModuloEntrevistaRealizado> {
  const entrevista = await obtenerDatosEntrevista(idEntrevista);
  const modulo = await obtenerModuloPorCodigo(entrevista.id_plantilla, codigoModulo);
  let registro = await obtenerModuloRealizado(idEntrevista, modulo.id_modulo);

  if (!registro) {
    registro = await activarModulo(idEntrevista, codigoModulo);
  }

  if (registro.estado === "completado" || registro.estado === "omitido") return registro;

  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .update({
      estado: "en_progreso",
      fecha_inicio: registro.fecha_inicio ?? new Date().toISOString(),
    })
    .eq("id_modulo_realizado", registro.id_modulo_realizado)
    .select()
    .single();

  if (error) {
    console.error(`Error iniciando módulo ${codigoModulo}:`, error);
    throw new Error(`No se pudo iniciar el módulo ${codigoModulo}.`);
  }

  return data as ModuloEntrevistaRealizado;
}

// COMPLETAR MÓDULO
export async function completarModulo(
  idEntrevista: string,
  codigoModulo: string
): Promise<ModuloEntrevistaRealizado> {
  const entrevista = await obtenerDatosEntrevista(idEntrevista);
  const modulo = await obtenerModuloPorCodigo(entrevista.id_plantilla, codigoModulo);
  const registro = await obtenerModuloRealizado(idEntrevista, modulo.id_modulo);

  if (!registro) throw new Error(`El módulo ${codigoModulo} todavía no ha sido iniciado.`);
  if (registro.estado === "completado") return registro;

  const ahora = new Date().toISOString();
  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .update({
      estado: "completado",
      fecha_inicio: registro.fecha_inicio ?? ahora,
      fecha_fin: ahora,
    })
    .eq("id_modulo_realizado", registro.id_modulo_realizado)
    .select()
    .single();

  if (error) {
    console.error(`Error completando módulo ${codigoModulo}:`, error);
    throw new Error(`No se pudo completar el módulo ${codigoModulo}.`);
  }

  return data as ModuloEntrevistaRealizado;
}

// OMITIR MÓDULO
export async function omitirModulo(
  idEntrevista: string,
  codigoModulo: string
): Promise<ModuloEntrevistaRealizado> {
  const entrevista = await obtenerDatosEntrevista(idEntrevista);
  const modulo = await obtenerModuloPorCodigo(entrevista.id_plantilla, codigoModulo);
  let registro = await obtenerModuloRealizado(idEntrevista, modulo.id_modulo);

  if (!registro) {
    registro = await activarModulo(idEntrevista, codigoModulo);
  }

  if (registro.estado === "omitido" || registro.estado === "completado") return registro;

  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .update({
      estado: "omitido",
      fecha_fin: new Date().toISOString(),
    })
    .eq("id_modulo_realizado", registro.id_modulo_realizado)
    .select()
    .single();

  if (error) {
    console.error(`Error omitiendo módulo ${codigoModulo}:`, error);
    throw new Error(`No se pudo omitir el módulo ${codigoModulo}.`);
  }

  return data as ModuloEntrevistaRealizado;
}

// OBTENER TODOS LOS MÓDULOS DE UNA ENTREVISTA
export async function obtenerModulosEntrevista(
  idEntrevista: string
): Promise<ModuloRealizadoConDatos[]> {
  const { data, error } = await supabase
    .from("modulo_entrevista_realizada")
    .select(`
      *,
      modulo:modulo_entrevista (
        id_modulo,
        id_plantilla,
        codigo,
        nombre,
        descripcion,
        orden,
        es_condicional,
        estado
      )
    `)
    .eq("id_entrevista", idEntrevista)
    .order("orden_ejecucion", { ascending: true });

  if (error) {
    console.error("Error obteniendo módulos de la entrevista:", error);
    throw new Error("No se pudieron recuperar los módulos de la entrevista.");
  }

  return (data ?? []) as unknown as ModuloRealizadoConDatos[];
}

// OBTENER SIGUIENTE MÓDULO
export async function obtenerSiguienteModulo(
  idEntrevista: string
): Promise<ModuloRealizadoConDatos | null> {
  const modulos = await obtenerModulosEntrevista(idEntrevista);
  const enProgreso = modulos.find((item) => item.estado === "en_progreso");
  if (enProgreso) return enProgreso;
  const pendiente = modulos.find((item) => item.estado === "pendiente");
  return pendiente ?? null;
}

// TODOS LOS MÓDULOS COMPLETADOS
export async function todosLosModulosCompletados(idEntrevista: string): Promise<boolean> {
  const modulos = await obtenerModulosEntrevista(idEntrevista);
  if (modulos.length === 0) return true;
  return modulos.every((item) => item.estado === "completado" || item.estado === "omitido");
}

// OBTENER CÓDIGOS COMPLETADOS
export async function obtenerCodigosModulosCompletados(idEntrevista: string): Promise<string[]> {
  const modulos = await obtenerModulosEntrevista(idEntrevista);
  return modulos
    .filter((item) => item.estado === "completado")
    .map((item) => item.modulo.codigo);
}