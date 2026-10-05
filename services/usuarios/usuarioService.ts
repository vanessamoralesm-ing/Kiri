import { supabase } from "@/lib/supabase";

import type { Rol } from "@/types/auth";

import type {
  EditarUsuarioAdminInput,
  FiltrosUsuarioAdmin,
  InstitucionResumen,
  UsuarioAdmin,
} from "@/types/usuarios/usuario";

// ==========================================================
// TIPOS INTERNOS
// ==========================================================

type RelacionRol = {
  id_rol: string;
  nombre: string;
  descripcion: string | null;
};

type RelacionInstitucion = {
  id_institucion: string;
  nombre: string;
};

type UsuarioAdminRaw = {
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

  estado: UsuarioAdmin["estado"];

  debe_cambiar_password: boolean;

  rol:
    | RelacionRol
    | RelacionRol[]
    | null;

  institucion:
    | RelacionInstitucion
    | RelacionInstitucion[]
    | null;
};

// ==========================================================
// NORMALIZAR USUARIO
// ==========================================================

function normalizarUsuarioAdmin(
  usuario: UsuarioAdminRaw,
): UsuarioAdmin {
  const rol = Array.isArray(usuario.rol)
    ? usuario.rol[0] ?? null
    : usuario.rol ?? null;

  const institucion = Array.isArray(usuario.institucion)
    ? usuario.institucion[0] ?? null
    : usuario.institucion ?? null;

  return {
    id_usuario: usuario.id_usuario,
    id_rol: usuario.id_rol,
    id_institucion: usuario.id_institucion,

    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    nombre_preferido: usuario.nombre_preferido,

    correo: usuario.correo,
    telefono: usuario.telefono,

    fecha_nacimiento: usuario.fecha_nacimiento,
    genero: usuario.genero,

    foto_perfil: usuario.foto_perfil,
    fecha_registro: usuario.fecha_registro,

    estado: usuario.estado,

    debe_cambiar_password:
      usuario.debe_cambiar_password,

    rol,

    institucion,
  };
}

// ==========================================================
// OBTENER ROLES
// ==========================================================

export async function obtenerRoles(): Promise<Rol[]> {
  const { data, error } = await supabase
    .from("rol")
    .select(`
      id_rol,
      nombre,
      descripcion
    `)
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// ==========================================================
// OBTENER INSTITUCIONES
// ==========================================================

export async function obtenerInstituciones(): Promise<
  InstitucionResumen[]
> {
  const { data, error } = await supabase
    .from("institucion")
    .select(`
      id_institucion,
      nombre
    `)
    .eq("estado", "activo")
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// ==========================================================
// OBTENER USUARIOS
// ==========================================================

export async function obtenerUsuarios(
  filtros: FiltrosUsuarioAdmin = {},
): Promise<UsuarioAdmin[]> {
  let query = supabase
    .from("usuario")
    .select(`
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

      rol (
        id_rol,
        nombre,
        descripcion
      ),

      institucion (
        id_institucion,
        nombre
      )
    `)
    .order("fecha_registro", {
      ascending: false,
    });

  // ========================================================
  // FILTRO POR ROL
  // ========================================================

  if (filtros.idRol) {
    query = query.eq(
      "id_rol",
      filtros.idRol,
    );
  }

  // ========================================================
  // FILTRO POR ESTADO
  // ========================================================

  if (filtros.estado) {
    query = query.eq(
      "estado",
      filtros.estado,
    );
  }

  // ========================================================
  // FILTRO POR INSTITUCIÓN
  // ========================================================

  if (filtros.idInstitucion) {
    query = query.eq(
      "id_institucion",
      filtros.idInstitucion,
    );
  }

  // ========================================================
  // BÚSQUEDA
  // ========================================================

  const busqueda =
    filtros.busqueda?.trim();

  if (busqueda) {
    query = query.or(
      [
        `nombres.ilike.%${busqueda}%`,
        `apellidos.ilike.%${busqueda}%`,
        `correo.ilike.%${busqueda}%`,
        `nombre_preferido.ilike.%${busqueda}%`,
      ].join(","),
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((usuario) =>
    normalizarUsuarioAdmin(
      usuario as UsuarioAdminRaw,
    ),
  );
}

// ==========================================================
// OBTENER USUARIO POR ID
// ==========================================================

export async function obtenerUsuarioPorId(
  idUsuario: string,
): Promise<UsuarioAdmin | null> {
  const { data, error } = await supabase
    .from("usuario")
    .select(`
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

      rol (
        id_rol,
        nombre,
        descripcion
      ),

      institucion (
        id_institucion,
        nombre
      )
    `)
    .eq(
      "id_usuario",
      idUsuario,
    )
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizarUsuarioAdmin(
    data as UsuarioAdminRaw,
  );
}

// ==========================================================
// EDITAR USUARIO
// ==========================================================

export async function editarUsuario(
  idUsuario: string,
  datos: EditarUsuarioAdminInput,
): Promise<void> {
  const payload: Record<string, unknown> = {};

  if (datos.nombres !== undefined) {
    payload.nombres =
      datos.nombres.trim();
  }

  if (datos.apellidos !== undefined) {
    payload.apellidos =
      datos.apellidos.trim();
  }

  if (
    datos.nombrePreferido !== undefined
  ) {
    payload.nombre_preferido =
      datos.nombrePreferido?.trim() ||
      null;
  }

  if (datos.telefono !== undefined) {
    payload.telefono =
      datos.telefono?.trim() || null;
  }

  if (
    datos.fechaNacimiento !== undefined
  ) {
    payload.fecha_nacimiento =
      datos.fechaNacimiento || null;
  }

  if (datos.genero !== undefined) {
    payload.genero =
      datos.genero;
  }

  if (datos.idRol !== undefined) {
    payload.id_rol =
      datos.idRol;
  }

  if (
    datos.idInstitucion !== undefined
  ) {
    payload.id_institucion =
      datos.idInstitucion || null;
  }

  if (datos.estado !== undefined) {
    payload.estado =
      datos.estado;
  }

  if (
    datos.debeCambiarPassword !==
    undefined
  ) {
    payload.debe_cambiar_password =
      datos.debeCambiarPassword;
  }

  const { error } = await supabase
    .from("usuario")
    .update(payload)
    .eq(
      "id_usuario",
      idUsuario,
    );

  if (error) {
    throw new Error(error.message);
  }
}

// ==========================================================
// CAMBIAR ESTADO
// ==========================================================

export async function cambiarEstadoUsuario(
  idUsuario: string,
  estado: "activo" | "inactivo",
): Promise<void> {
  const { error } = await supabase
    .from("usuario")
    .update({
      estado,
    })
    .eq(
      "id_usuario",
      idUsuario,
    );

  if (error) {
    throw new Error(error.message);
  }
}

// ==========================================================
// DATOS DE ESTUDIANTE
// ==========================================================

export async function obtenerDatosEstudiante(
  idUsuario: string,
) {
  const { data, error } = await supabase
    .from("estudiante")
    .select(`
      id_usuario,
      codigo_estudiante
    `)
    .eq(
      "id_usuario",
      idUsuario,
    )
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ==========================================================
// DATOS DE DOCENTE
// ==========================================================

export async function obtenerDatosDocente(
  idUsuario: string,
) {
  const { data, error } = await supabase
    .from("docente")
    .select(`
      id_usuario,
      codigo_docente,
      profesion,
      especialidad
    `)
    .eq(
      "id_usuario",
      idUsuario,
    )
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ==========================================================
// DATOS DE PSICÓLOGO
// ==========================================================

export async function obtenerDatosPsicologo(
  idUsuario: string,
) {
  const { data, error } = await supabase
    .from("psicologo")
    .select(`
      id_usuario,
      codigo_psicologo,
      licencia_profesional,
      especialidad
    `)
    .eq(
      "id_usuario",
      idUsuario,
    )
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}