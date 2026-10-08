import { supabase } from "@/lib/supabase";

export async function actualizarContrasena(password: string, nonce = "") {
  if (password.length < 8)
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  const { error } = await supabase.auth.updateUser({
    password,
    ...(nonce.trim() && { nonce: nonce.trim() }),
  });
  if (!error) return true;
  if (error.code === "reauthentication_needed") {
    await reenviarVerificacion();
    return false;
  }
  const mensajes: Record<string, string> = {
    reauthentication_not_valid:
      "El código es inválido o venció. Solicita uno nuevo.",
    same_password: "Elige una contraseña diferente a la actual.",
    weak_password:
      "La contraseña no cumple los requisitos de seguridad de tu cuenta.",
    over_request_rate_limit: "Espera un momento antes de volver a intentarlo.",
  };
  throw new Error(
    mensajes[error.code ?? ""] ??
      "No se pudo actualizar la contraseña. Inténtalo otra vez.",
  );
}

export async function reenviarVerificacion() {
  const { error } = await supabase.auth.reauthenticate();
  if (error)
    throw new Error(
      "No se pudo enviar el código de verificación. Inténtalo otra vez.",
    );
}
