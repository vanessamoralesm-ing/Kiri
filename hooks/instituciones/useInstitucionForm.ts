import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useModal } from "@/contexts/ModalContext";
import {
  crearInstitucion,
  editarInstitucion,
  obtenerInstitucionPorId,
} from "@/services/instituciones/institucionService";
import type {
  Institucion,
  InstitucionPayload,
} from "@/types/instituciones/institucion";
const inicial: InstitucionPayload = {
  nombre: "",
  codigo_institucional: "",
  correo: "",
  telefono: "",
  direccion: "",
  municipio: "",
  departamento: "",
  tipo_institucion: "educacion_superior",
  estado: "activo",
  logo: null,
};
export function useInstitucionForm({
  modo,
  idInstitucion,
}: {
  modo: "crear" | "editar";
  idInstitucion?: string;
}) {
  const { confirmar, avisar } = useModal();
  const [values, setValues] = useState(inicial);
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [cargando, setCargando] = useState(modo === "editar");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ocupado = useRef(false);
  useEffect(() => {
    let vigente = true;
    if (modo === "crear") return;
    const timer = setTimeout(() => {
      setCargando(true);
      setInstitucion(null);
      setError(null);
      if (!idInstitucion) {
        setError("Institución inválida.");
        setCargando(false);
        return;
      }
      obtenerInstitucionPorId(idInstitucion)
        .then((data) => {
          if (!vigente) return;
          setInstitucion(data);
          const {
            id_institucion: _id,
            fecha_registro: _fecha,
            ...campos
          } = data;
          setValues(campos);
        })
        .catch((e) => {
          if (vigente)
            setError(
              e instanceof Error
                ? e.message
                : "No fue posible cargar la institución.",
            );
        })
        .finally(() => {
          if (vigente) setCargando(false);
        });
    }, 0);
    return () => {
      vigente = false;
      clearTimeout(timer);
    };
  }, [modo, idInstitucion]);
  const volver = () => router.replace("/superadmin/instituciones" as never);
  function cambiarCampo<K extends keyof InstitucionPayload>(
    campo: K,
    value: InstitucionPayload[K],
  ) {
    setValues((prev) => ({ ...prev, [campo]: value }));
    setError(null);
  }
  async function guardar() {
    if (ocupado.current || cargando || (modo === "editar" && !institucion))
      return;
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    ) as InstitucionPayload;
    if (!payload.nombre || !payload.codigo_institucional) {
      setError("Ingresa el nombre y el código institucional.");
      return;
    }
    if (payload.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.correo)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (payload.logo && !/^https?:\/\//i.test(payload.logo)) {
      setError("El logo debe ser una URL HTTP o HTTPS.");
      return;
    }
    payload.correo = payload.correo?.toLowerCase() || null;
    for (const campo of [
      "telefono",
      "direccion",
      "municipio",
      "departamento",
      "logo",
    ] as const)
      payload[campo] = payload[campo] || null;
    ocupado.current = true;
    setGuardando(true);
    setError(null);
    try {
      if (modo === "editar" && !(await confirmar({
        titulo: "Editar institución",
        mensaje: `¿Guardar los cambios de ${payload.nombre}?`,
        textoConfirmar: "Guardar cambios",
      }))) return;
      if (modo === "crear") await crearInstitucion(payload);
      else await editarInstitucion(idInstitucion!, payload);
      if (modo === "editar")
        await avisar("Institución actualizada", "Los cambios se guardaron correctamente.");
      volver();
    } catch (e) {
      const mensaje = e instanceof Error
        ? e.message
        : "No fue posible guardar la institución.";
      setError(mensaje);
      if (modo === "editar")
        await avisar("No se pudo guardar la institución", mensaje, true);
    } finally {
      ocupado.current = false;
      setGuardando(false);
    }
  }
  return {
    values,
    institucion,
    cargando,
    guardando,
    error,
    cambiarCampo,
    volver,
    guardar,
    disabled: modo === "editar" && !institucion,
  };
}
