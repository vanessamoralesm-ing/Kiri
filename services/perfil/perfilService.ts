import { supabase } from "@/lib/supabase";

export type PerfilCompleto = {
  id_usuario: string;

  nombres: string;
  apellidos: string;
  nombre_preferido: string | null;

  correo: string;
  telefono: string | null;

  fecha_nacimiento: string | null;
  genero: string | null;

  foto_perfil: string | null;
  foto_url: string | null;

  id_rol: string;
  rol_nombre: string;

  id_institucion: string | null;
  institucion_nombre: string | null;
  institucion_logo: string | null;
};

export type DatosActualizarPerfil = {
  nombres: string;
  apellidos: string;
  nombre_preferido: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  genero: string | null;
};


// ============================================================
// USUARIO ACTUAL
// ============================================================

async function obtenerUsuarioAuth() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(
      "No se encontró una sesión activa.",
    );
  }

  return user;
}


// ============================================================
// OBTENER PERFIL COMPLETO
// ============================================================

export async function obtenerPerfilCompleto():
Promise<PerfilCompleto> {

  const user = await obtenerUsuarioAuth();

  const { data: usuario, error } =
    await supabase
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
        foto_perfil
      `)
      .eq("id_usuario", user.id)
      .single();

  if (error || !usuario) {
    console.error(
      "Error obteniendo perfil:",
      error,
    );

    throw new Error(
      "No se pudo obtener tu perfil.",
    );
  }


  // ==========================================================
  // ROL
  // ==========================================================

  const { data: rol } =
    await supabase
      .from("rol")
      .select("nombre")
      .eq("id_rol", usuario.id_rol)
      .maybeSingle();


  // ==========================================================
  // INSTITUCIÓN
  // ==========================================================

  let institucionNombre: string | null = null;

  let institucionLogo: string | null =
    null;


  if (usuario.id_institucion) {

    const { data: institucion } =
      await supabase
        .from("institucion")
        .select("nombre, logo")
        .eq(
          "id_institucion",
          usuario.id_institucion,
        )
        .maybeSingle();

    institucionNombre =
      institucion?.nombre ?? null;

    institucionLogo =
      institucion?.logo ?? null;
  }


  // ==========================================================
  // FOTO PRIVADA
  // ==========================================================

  let fotoUrl: string | null = null;

  if (usuario.foto_perfil) {

    const { data } =
      await supabase.storage
        .from("avatars")
        .createSignedUrl(
          usuario.foto_perfil,
          3600,
        );

    fotoUrl =
      data?.signedUrl ?? null;
  }


  return {
    id_usuario: usuario.id_usuario,

    nombres:
      usuario.nombres ?? "",

    apellidos:
      usuario.apellidos ?? "",

    nombre_preferido:
      usuario.nombre_preferido,

    correo:
      usuario.correo ?? user.email ?? "",

    telefono:
      usuario.telefono,

    fecha_nacimiento:
      usuario.fecha_nacimiento,

    genero:
      usuario.genero,

    foto_perfil:
      usuario.foto_perfil,

    foto_url:
      fotoUrl,

    id_rol:
      usuario.id_rol,

    rol_nombre:
      rol?.nombre ?? "Sin rol",

    id_institucion:
      usuario.id_institucion,

    institucion_nombre:
      institucionNombre,

    institucion_logo:
      institucionLogo,
  };
}


// ============================================================
// ACTUALIZAR PERFIL
// ============================================================

export async function actualizarPerfil(
  datos: DatosActualizarPerfil,
) {

  const user = await obtenerUsuarioAuth();

  if (
    !datos.nombres.trim() ||
    !datos.apellidos.trim()
  ) {
    throw new Error(
      "Los nombres y apellidos son obligatorios.",
    );
  }


  const { data, error } =
    await supabase
      .from("usuario")
      .update({
        nombres:
          datos.nombres.trim(),

        apellidos:
          datos.apellidos.trim(),

        nombre_preferido:
          datos.nombre_preferido?.trim() ||
          null,

        telefono:
          datos.telefono?.trim() ||
          null,

        fecha_nacimiento:
          datos.fecha_nacimiento ||
          null,

        genero:
          datos.genero ||
          null,
      })
      .eq("id_usuario", user.id)
      .select()
      .single();


  if (error) {
    console.error(
      "Error actualizando perfil:",
      error,
    );

    throw new Error(
      "No se pudieron guardar los cambios.",
    );
  }


  return data;
}


// ============================================================
// SUBIR FOTO
// ============================================================

export async function subirFotoPerfil(
  uri: string,
  mimeType = "image/jpeg",
) {

  const user = await obtenerUsuarioAuth();

  const response =
    await fetch(uri);

  const arrayBuffer =
    await response.arrayBuffer();

  const ruta =
    `${user.id}/avatar`;


  const { error: uploadError } =
    await supabase.storage
      .from("avatars")
      .upload(
        ruta,
        arrayBuffer,
        {
          contentType: mimeType,
          upsert: true,
        },
      );


  if (uploadError) {
    console.error(
      "Error subiendo foto:",
      uploadError,
    );

    throw new Error(
      "No se pudo actualizar la foto.",
    );
  }


  const { error: updateError } =
    await supabase
      .from("usuario")
      .update({
        foto_perfil: ruta,
      })
      .eq(
        "id_usuario",
        user.id,
      );


  if (updateError) {
    throw new Error(
      "La foto se subió, pero no se pudo actualizar el perfil.",
    );
  }


  return ruta;
}


// ============================================================
// VALIDAR ROL INDEPENDIENTE
// ============================================================

export async function esUsuarioIndependiente() {

  const user = await obtenerUsuarioAuth();

  const { data: usuario, error } =
    await supabase
      .from("usuario")
      .select("id_rol")
      .eq(
        "id_usuario",
        user.id,
      )
      .single();


  if (error || !usuario) {
    throw new Error(
      "No se pudo verificar tu cuenta.",
    );
  }


  const { data: rol, error: errorRol } =
    await supabase
      .from("rol")
      .select("nombre")
      .eq(
        "id_rol",
        usuario.id_rol,
      )
      .single();


  if (errorRol || !rol) {
    throw new Error(
      "No se pudo verificar tu rol.",
    );
  }


  return (
    rol.nombre
      .trim()
      .toLowerCase() ===
    "independiente"
  );
}


// ============================================================
// CAMBIAR CONTRASEÑA
// SOLO INDEPENDIENTE
// ============================================================

export async function cambiarPassword(
  nuevaPassword: string,
) {

  const independiente =
    await esUsuarioIndependiente();


  if (!independiente) {
    throw new Error(
      "Tu contraseña es administrada por tu cuenta institucional.",
    );
  }


  if (nuevaPassword.length < 8) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres.",
    );
  }


  const { error } =
    await supabase.auth.updateUser({
      password:
        nuevaPassword,
    });


  if (error) {
    console.error(
      "Error cambiando contraseña:",
      error,
    );

    throw new Error(
      "No se pudo cambiar la contraseña.",
    );
  }
}