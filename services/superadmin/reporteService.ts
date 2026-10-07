import { supabase } from "@/lib/supabase";
import type {
  InstitucionReporte,
  PeriodoReporte,
  ReporteGlobal,
  ResumenReporte,
  RolReporte,
  UsoGlobalReporte,
  UsoReporte,
} from "@/types/superadmin/reportes";

interface InstitucionDato {
  id_institucion: string;
  nombre: string;
  codigo_institucional: string | null;
  estado: string;
  fecha_registro: string;
}
interface UsuarioDato {
  id_usuario: string;
  id_institucion: string | null;
  id_rol: string;
  estado: string;
}
interface SolicitudDato {
  id_solicitud: string;
  estado: string | null;
}

const resumen = (): ResumenReporte => ({ total: 0, activos: 0, inactivos: 0 });
function contar(destino: ResumenReporte, estado: string) {
  destino.total++;
  if (estado === "activo") destino.activos++;
  if (estado === "inactivo") destino.inactivos++;
}
async function leerPaginas<T>(
  consultar: (inicio: number) => PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>,
): Promise<T[]> {
  const filas: T[] = [];
  for (let inicio = 0; ; inicio += 500) {
    const { data, error } = await consultar(inicio);
    if (error) throw new Error(error.message);
    filas.push(...(data ?? []));
    if (!data || data.length < 500) return filas;
  }
}

export async function obtenerUsoGlobal({ desde, hasta, institucionId }: {
  desde: string | null;
  hasta: string;
  institucionId: string;
}): Promise<UsoGlobalReporte> {
  const fuentes = {
    tests: ["ejecucion_test", "id_ejecucion", "id_test", "test", "estado", "completado"],
    tecnicas: ["registro_tecnica", "id_registro", "id_tecnica", "tecnica_complementaria", "completada", true],
    diarios: ["registro_autorregistro", "id_registro", "id_plantilla", "plantilla_autorregistro", "estado", "completado"],
  } as const;
  type UsoDato = { recurso_id: string; catalogo: { nombre: string } | null };
  const rankings = await Promise.all(Object.entries(fuentes).map(async ([clave, fuente]) => {
    const [tabla, id, recurso, catalogo, estado, completado] = fuente;
    try {
      const datos = await leerPaginas<UsoDato>((inicio) => {
        let query = supabase.from(tabla)
          .select(`id:${id},recurso_id:${recurso},catalogo:${catalogo}(nombre)${institucionId ? ",usuario!inner(id_institucion)" : ""}`)
          .eq(estado, completado).order(id);
        if (desde) query = query.gte("fecha_fin", desde).lt("fecha_fin", hasta);
        if (institucionId) query = query.eq("usuario.id_institucion", institucionId);
        return query.range(inicio, inicio + 499).overrideTypes<UsoDato[], { merge: false }>();
      });
      const grupos = new Map<string, UsoReporte>();
      for (const dato of datos) {
        const grupo = grupos.get(dato.recurso_id) ?? {
          id: dato.recurso_id, nombre: dato.catalogo?.nombre ?? "Recurso no disponible", total: 0,
        };
        grupo.total++;
        grupos.set(grupo.id, grupo);
      }
      const items = [...grupos.values()].sort((a, b) =>
        b.total - a.total || a.nombre.localeCompare(b.nombre, "es"));
      return [clave, { items, error: null }];
    } catch (error) {
      return [clave, {
        items: [],
        error: `No se pudo cargar este ranking: ${error instanceof Error ? error.message : "Error desconocido."}`,
      }];
    }
  }));
  return Object.fromEntries(rankings) as UsoGlobalReporte;
}

export async function obtenerReporteGlobal({ periodo, institucionId }: {
  periodo: PeriodoReporte;
  institucionId: string;
}): Promise<ReporteGlobal> {
  const hasta = new Date().toISOString();
  const desde = periodo === "todo" ? null : new Date(
    Date.parse(hasta) - Number(periodo) * 86400000,
  ).toISOString();
  const [instituciones, usuarios, roles, solicitudes, uso] = await Promise.all([
    leerPaginas<InstitucionDato>((inicio) => supabase.from("institucion")
      .select("id_institucion,nombre,codigo_institucional,estado,fecha_registro")
      .order("id_institucion").range(inicio, inicio + 499)),
    leerPaginas<UsuarioDato>((inicio) => {
      let query = supabase.from("usuario")
        .select("id_usuario,id_institucion,id_rol,estado").order("id_usuario");
      if (desde) query = query.gte("fecha_registro", desde).lt("fecha_registro", hasta);
      if (institucionId) query = query.eq("id_institucion", institucionId);
      return query.range(inicio, inicio + 499);
    }),
    leerPaginas<{ id_rol: string; nombre: string }>((inicio) => supabase.from("rol")
      .select("id_rol,nombre").order("id_rol").range(inicio, inicio + 499)),
    leerPaginas<SolicitudDato>((inicio) => {
      let query = supabase.from("solicitud_institucion")
        .select("id_solicitud,estado").order("id_solicitud");
      if (desde) query = query.gte("fecha_solicitud", desde).lt("fecha_solicitud", hasta);
      if (institucionId) query = query.eq("id_institucion", institucionId);
      return query.range(inicio, inicio + 499);
    }),
    obtenerUsoGlobal({ desde, hasta, institucionId }),
  ]);
  if (institucionId && !instituciones.some((i) => i.id_institucion === institucionId))
    throw new Error("La institución seleccionada ya no está disponible.");

  const porInstitucion = new Map<string, InstitucionReporte>();
  const porRol = new Map<string, RolReporte>(roles.map((r) => [
    r.id_rol, { id: r.id_rol, nombre: r.nombre, ...resumen() },
  ]));
  const resultado: ReporteGlobal = {
    generadoEn: hasta, desde, hasta,
    catalogo: instituciones.map((i) => ({
      id: i.id_institucion, nombre: i.nombre, codigo: i.codigo_institucional ?? "",
    })).sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    instituciones: resumen(), usuarios: resumen(),
    solicitudes: {
      total: solicitudes.length,
      pendientes: solicitudes.filter((s) => s.estado === "pendiente").length,
      aprobadas: solicitudes.filter((s) => s.estado === "aprobada").length,
      rechazadas: solicitudes.filter((s) => s.estado === "rechazada").length,
    },
    porInstitucion: [], porRol: [], uso,
  };
  const limiteInicial = desde ? Date.parse(desde) : -Infinity;
  for (const i of instituciones) {
    if (institucionId && i.id_institucion !== institucionId) continue;
    porInstitucion.set(i.id_institucion, {
      id: i.id_institucion, nombre: i.nombre, codigo: i.codigo_institucional ?? "",
      estado: i.estado, ...resumen(),
    });
    const registro = Date.parse(i.fecha_registro);
    if (!desde || (registro >= limiteInicial && registro < Date.parse(hasta)))
      contar(resultado.instituciones, i.estado);
  }
  for (const u of usuarios) {
    const idInstitucion = u.id_institucion ?? "sin-institucion";
    if (!porInstitucion.has(idInstitucion)) porInstitucion.set(idInstitucion, {
      id: idInstitucion,
      nombre: u.id_institucion ? "Institución no disponible" : "Sin institución",
      codigo: "", estado: null, ...resumen(),
    });
    if (!porRol.has(u.id_rol)) porRol.set(u.id_rol, {
      id: u.id_rol, nombre: "Rol no disponible", ...resumen(),
    });
    contar(resultado.usuarios, u.estado);
    contar(porInstitucion.get(idInstitucion)!, u.estado);
    contar(porRol.get(u.id_rol)!, u.estado);
  }
  const ordenar = (a: RolReporte, b: RolReporte) =>
    b.total - a.total || a.nombre.localeCompare(b.nombre, "es");
  resultado.porInstitucion = [...porInstitucion.values()].sort(ordenar);
  resultado.porRol = [...porRol.values()].sort(ordenar);
  return resultado;
}
