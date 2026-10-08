import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/services/authProvider";
import {
  actualizarPerfil,
  obtenerPerfilCompleto,
  type PerfilCompleto,
} from "@/services/perfil/perfilService";
import {
  actualizarContrasena,
  reenviarVerificacion,
} from "@/services/superadmin/configuracionService";
import {
  validateApellidos,
  validateNombrePreferido,
  validateNombres,
  validateTelefono,
} from "@/utils/validations";

const campos = {
  nombres: "",
  apellidos: "",
  nombre_preferido: "",
  telefono: "",
};
type Campos = typeof campos;
type Mensaje = { texto: string; error: boolean } | null;
const mensajeError = (e: unknown) =>
  e instanceof Error ? e.message : "No se pudo completar la operación.";

export function useConfiguracion() {
  const { user, profile, loading, isSuperAdmin, refreshProfile } = useAuth();
  const autorizado = !loading && isSuperAdmin && profile?.estado === "activo";
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [form, setForm] = useState<Campos>(campos);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<"perfil" | "password" | null>(
    null,
  );
  const [mensajePerfil, setMensajePerfil] = useState<Mensaje>(null);
  const [mensajePassword, setMensajePassword] = useState<Mensaje>(null);
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [nonce, setNonce] = useState("");
  const [requiereCodigo, setRequiereCodigo] = useState(false);
  const ocupado = useRef(false);
  const solicitud = useRef(0);

  const cargar = useCallback(() => {
    if (!autorizado || !user?.id) return;
    const ticket = ++solicitud.current;
    const vigente = () => ticket === solicitud.current;
    setCargando(true);
    setErrorCarga(null);
    obtenerPerfilCompleto()
      .then((data) => {
        if (!vigente()) return;
        setPerfil(data);
        setForm({
          nombres: data.nombres,
          apellidos: data.apellidos,
          nombre_preferido: data.nombre_preferido ?? "",
          telefono: data.telefono ?? "",
        });
      })
      .catch((e) => {
        if (vigente()) setErrorCarga(mensajeError(e));
      })
      .finally(() => {
        if (vigente()) setCargando(false);
      });
    return () => {
      if (vigente()) solicitud.current++;
    };
  }, [autorizado, user?.id]);
  useFocusEffect(cargar);

  function cambiarCampo(campo: keyof Campos, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setMensajePerfil(null);
  }
  async function ejecutar(
    tipo: "perfil" | "password",
    accion: () => Promise<void>,
  ) {
    if (!autorizado || cargando || ocupado.current) return;
    ocupado.current = true;
    setGuardando(tipo);
    const informar = tipo === "perfil" ? setMensajePerfil : setMensajePassword;
    informar(null);
    try {
      await accion();
    } catch (e) {
      informar({ texto: mensajeError(e), error: true });
    } finally {
      ocupado.current = false;
      setGuardando(null);
    }
  }
  const guardarPerfil = () =>
    ejecutar("perfil", async () => {
      if (!perfil) return;
      const error =
        validateNombres(form.nombres) ||
        validateApellidos(form.apellidos) ||
        validateNombrePreferido(form.nombre_preferido) ||
        (form.telefono.trim() && validateTelefono(form.telefono));
      if (error) throw new Error(error);
      const data = await actualizarPerfil({
        ...form,
        nombre_preferido: form.nombre_preferido || null,
        telefono: form.telefono || null,
        fecha_nacimiento: perfil.fecha_nacimiento,
        genero: perfil.genero,
      });
      setPerfil((actual) => actual && { ...actual, ...data });
      setForm({
        nombres: data.nombres,
        apellidos: data.apellidos,
        nombre_preferido: data.nombre_preferido ?? "",
        telefono: data.telefono ?? "",
      });
      try {
        await refreshProfile();
        setMensajePerfil({ texto: "Perfil actualizado.", error: false });
      } catch {
        setMensajePerfil({
          texto:
            "Perfil guardado. Recarga la página para actualizar el encabezado.",
          error: false,
        });
      }
    });
  const guardarPassword = () =>
    ejecutar("password", async () => {
      if (password.length < 8)
        throw new Error("La contraseña debe tener al menos 8 caracteres.");
      if (password !== confirmacion)
        throw new Error("Las contraseñas no coinciden.");
      if (requiereCodigo && !nonce.trim())
        throw new Error("Escribe el código de verificación.");
      const actualizado = await actualizarContrasena(password, nonce);
      if (!actualizado) {
        setRequiereCodigo(true);
        setMensajePassword({
          texto:
            "Enviamos un código a tu correo o teléfono confirmado. Escríbelo para guardar.",
          error: false,
        });
        return;
      }
      setPassword("");
      setConfirmacion("");
      setNonce("");
      setRequiereCodigo(false);
      setMensajePassword({ texto: "Contraseña actualizada.", error: false });
    });
  const reenviarCodigo = () =>
    ejecutar("password", async () => {
      await reenviarVerificacion();
      setNonce("");
      setMensajePassword({
        texto: "Enviamos un nuevo código de verificación.",
        error: false,
      });
    });
  return {
    autorizado,
    cargando: loading || (autorizado && cargando),
    perfil,
    form,
    cambiarCampo,
    errorCarga,
    reintentar: () => {
      cargar();
    },
    guardando,
    guardarPerfil,
    mensajePerfil,
    password,
    setPassword,
    confirmacion,
    setConfirmacion,
    nonce,
    setNonce,
    requiereCodigo,
    guardarPassword,
    reenviarCodigo,
    mensajePassword,
  };
}
