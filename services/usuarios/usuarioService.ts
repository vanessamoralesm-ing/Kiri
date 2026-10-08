import { supabase } from "@/lib/supabase";

import type {
  EstadoUsuario,
  Rol,
} from "@/types/auth";

import type {
  CrearUsuarioAdminPayload,
  DatosDocenteAdmin,
  DatosEstudianteAdmin,
  DatosPsicologoAdmin,
  EditarUsuarioAdminInput,
  EditarUsuarioAdminPayload,
  FiltrosUsuarioAdmin,
  InstitucionResumen,
  UsuarioAdmin,
} from "@/types/usuarios/usuario";

interface RelacionRol {
  id_rol: string;
  nombre: string;
  descripcion: string | null;
}

interface RelacionInstitucion {
  id_institucion: string;
  nombre: string;
}

interface UsuarioAdminRaw {
  id_usuario: string;
  id_rol: string;
  id_institucion: string | null;
  nombres: string;
  apellidos: string;
  nombre_preferido: string | null;
  correo: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  genero: UsuarioAdmin["genero"];
  foto_perfil: string | null;
  fecha_registro: string;
  estado: EstadoUsuario;
  debe_cambiar_password: boolean;

  rol:
    | RelacionRol
    | RelacionRol[]
    | null;

  institucion:
    | RelacionInstitucion
    | RelacionInstitucion[]
    | null;
}

function primeraRelacion<T>(
  value: T | T[] | null,
): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function normalizarUsuario(
  usuario: UsuarioAdminRaw,
): UsuarioAdmin {
  return {
    ...usuario,
    rol:
      primeraRelacion(
        usuario.rol,
      ),
    institucion:
      primeraRelacion(
        usuario.institucion,
      ),
  };
}

async function obtenerErrorFuncion(
  error: unknown,
  fallback: string,
) {
  let mensaje =
    error instanceof Error
      ? error.message
      : fallback;

  try {
    const context = (
      error as {
        context?: Response;
      }
    )?.context;

    if (context) {
      const body =
        await context
          .clone()
          .json();

      mensaje =
        body?.error ??
        mensaje;
    }
  } catch {}

  return mensaje;
}

// ==========================================================
// CATÁLOGOS
// ==========================================================

export async function obtenerRoles(): Promise<Rol[]> {
  const { data, error } =
    await supabase
      .from("rol")
      .select(
        "id_rol,nombre,descripcion",
      )
      .order("nombre");

  if (error) throw error;

  return data ?? [];
}

export async function obtenerInstituciones(): Promise<
  InstitucionResumen[]
> {
  const { data, error } =
    await supabase
      .from("institucion")
      .select(
        "id_institucion,nombre",
      )
      .eq("estado", "activo")
      .order("nombre");

  if (error) throw error;

  return data ?? [];
}

// ==========================================================
// USUARIOS
// ==========================================================

const SELECT_USUARIO = `
  id_usuario,
  id_rol,
  id_institucion,
  nombres,
  apellidos,
  nombre_preferido,
  correo,
  telefono,
  fecha_nacimiento,
  genero,
  foto_perfil,
  fecha_registro,
  estado,
  debe_cambiar_password,
  rol:id_rol (
    id_rol,
    nombre,
    descripcion
  ),
  institucion:id_institucion (
    id_institucion,
    nombre
  )
`;

export async function obtenerUsuarios(
  filtros: FiltrosUsuarioAdmin = {},
): Promise<UsuarioAdmin[]> {
  let query =
    supabase
      .from("usuario")
      .select(SELECT_USUARIO)
      .order(
        "fecha_registro",
        { ascending: false },
      );

  if (filtros.idRol) {
    query = query.eq(
      "id_rol",
      filtros.idRol,
    );
  }

  if (filtros.estado) {
    query = query.eq(
      "estado",
      filtros.estado,
    );
  }

  if (filtros.idInstitucion) {
    query = query.eq(
      "id_institucion",
      filtros.idInstitucion,
    );
  }

  const busqueda =
    filtros.busqueda?.trim();

  if (busqueda) {
    query = query.or(
      `nombres.ilike.%${busqueda}%,apellidos.ilike.%${busqueda}%,correo.ilike.%${busqueda}%`,
    );
  }

  const { data, error } =
    await query;

  if (error) throw error;

  return (
    (data ?? []) as unknown as UsuarioAdminRaw[]
  ).map(normalizarUsuario);
}

export async function obtenerUsuarioPorId(
  idUsuario: string,
): Promise<UsuarioAdmin> {
  const { data, error } =
    await supabase
      .from("usuario")
      .select(SELECT_USUARIO)
      .eq(
        "id_usuario",
        idUsuario,
      )
      .single();

  if (error) throw error;

  return normalizarUsuario(
    data as unknown as UsuarioAdminRaw,
  );
}

// ==========================================================
// EDICIÓN SIMPLE
// ==========================================================

export async function editarUsuario(
  idUsuario: string,
  input: EditarUsuarioAdminInput,
) {
  const cambios: Record<
    string,
    unknown
  > = {};

  if (
    input.nombres !==
    undefined
  ) {
    cambios.nombres =
      input.nombres;
  }

  if (
    input.apellidos !==
    undefined
  ) {
    cambios.apellidos =
      input.apellidos;
  }

  if (
    input.nombrePreferido !==
    undefined
  ) {
    cambios.nombre_preferido =
      input.nombrePreferido;
  }

  if (
    input.telefono !==
    undefined
  ) {
    cambios.telefono =
      input.telefono;
  }

  if (
    input.fechaNacimiento !==
    undefined
  ) {
    cambios.fecha_nacimiento =
      input.fechaNacimiento;
  }

  if (
    input.genero !== undefined
  ) {
    cambios.genero =
      input.genero;
  }

  if (
    input.idRol !== undefined
  ) {
    cambios.id_rol =
      input.idRol;
  }

  if (
    input.idInstitucion !==
    undefined
  ) {
    cambios.id_institucion =
      input.idInstitucion;
  }

  if (
    input.estado !== undefined
  ) {
    cambios.estado =
      input.estado;
  }

  if (
    input.debeCambiarPassword !==
    undefined
  ) {
    cambios.debe_cambiar_password =
      input.debeCambiarPassword;
  }

  const { data, error } =
    await supabase
      .from("usuario")
      .update(cambios)
      .eq(
        "id_usuario",
        idUsuario,
      )
      .select()
      .single();

  if (error) throw error;

  return data;
}

// ==========================================================
// DATOS ESPECÍFICOS
// ==========================================================

export async function obtenerDatosEstudiante(
  idUsuario: string,
): Promise<DatosEstudianteAdmin | null> {
  const { data, error } =
    await supabase
      .from("estudiante")
      .select(
        "codigo_estudiante",
      )
      .eq(
        "id_usuario",
        idUsuario,
      )
      .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    codigoEstudiante:
      data.codigo_estudiante,
  };
}

export async function obtenerDatosDocente(
  idUsuario: string,
): Promise<DatosDocenteAdmin | null> {
  const { data, error } =
    await supabase
      .from("docente")
      .select(
        "codigo_docente,profesion,especialidad",
      )
      .eq(
        "id_usuario",
        idUsuario,
      )
      .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    codigoDocente:
      data.codigo_docente,
    profesion:
      data.profesion,
    especialidad:
      data.especialidad,
  };
}

export async function obtenerDatosPsicologo(
  idUsuario: string,
): Promise<DatosPsicologoAdmin | null> {
  const { data, error } =
    await supabase
      .from("psicologo")
      .select(
        "codigo_psicologo,licencia_profesional,especialidad",
      )
      .eq(
        "id_usuario",
        idUsuario,
      )
      .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    codigoPsicologo:
      data.codigo_psicologo,

    licenciaProfesional:
      data.licencia_profesional,

    especialidad:
      data.especialidad,
  };
}

// ==========================================================
// CREAR
// ==========================================================

export async function crearUsuarioAdmin(
  payload: CrearUsuarioAdminPayload,
) {
  const { data, error } =
    await supabase.functions.invoke(
      "admin-crear-usuario",
      {
        body: payload,
      },
    );

  if (error) {
    throw new Error(
      await obtenerErrorFuncion(
        error,
        "No fue posible crear el usuario.",
      ),
    );
  }

  if (!data?.ok) {
    throw new Error(
      data?.error ??
        "No fue posible crear el usuario.",
    );
  }

  return data;
}

// ==========================================================
// EDITAR ADMIN
// ==========================================================

export async function editarUsuarioAdmin(
  payload: EditarUsuarioAdminPayload,
) {
  const { data, error } =
    await supabase.functions.invoke(
      "admin-editar-usuario",
      {
        body: payload,
      },
    );

  if (error) {
    throw new Error(
      await obtenerErrorFuncion(
        error,
        "No fue posible editar el usuario.",
      ),
    );
  }

  if (!data?.ok) {
    throw new Error(
      data?.error ??
        "No fue posible editar el usuario.",
    );
  }

  return data;
}

// ==========================================================
// ESTADO
// ==========================================================

export async function cambiarEstadoUsuario(
  idUsuario: string,
  estado: EstadoUsuario,
) {
  const { data, error } =
    await supabase.functions.invoke(
      "admin-cambiar-estado-usuario",
      {
        body: {
          idUsuario,
          estado,
        },
      },
    );

  if (error) {
    throw new Error(
      await obtenerErrorFuncion(
        error,
        "No fue posible cambiar el estado del usuario.",
      ),
    );
  }

  if (!data?.ok) {
    throw new Error(
      data?.error ??
        "No fue posible cambiar el estado del usuario.",
    );
  }

  return data;
}

// ==========================================================
// ELIMINAR
// ==========================================================

export async function eliminarUsuarioAdmin(
  idUsuario: string,
) {
  const { data, error } =
    await supabase.functions.invoke(
      "admin-eliminar-usuario",
      {
        body: {
          idUsuario,
        },
      },
    );

  if (error) {
    throw new Error(
      await obtenerErrorFuncion(
        error,
        "No fue posible eliminar el usuario.",
      ),
    );
  }

  if (!data?.ok) {
    throw new Error(
      data?.error ??
        "No fue posible eliminar el usuario.",
    );
  }

  return data;
}