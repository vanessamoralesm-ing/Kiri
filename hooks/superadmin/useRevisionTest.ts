import { useCallback, useEffect, useState } from "react";

import { useModal } from "@/contexts/ModalContext";
import {
  despublicarTestAdmin,
  obtenerTestCompletoAdmin,
  publicarTestAdmin,
  validarPublicacionTest,
  type TestCompletoAdmin,
  type ValidacionPublicacionTest,
} from "@/services/superadmin/cuestionarioAdmin.service";

export default function useRevisionTest(
  idTest: string,
  disabled = false,
  onPublicado?: () => void,
  onDespublicado?: () => void,
) {
  const { confirmar } = useModal();
  const [test, setTest] = useState<TestCompletoAdmin | null>(null);
  const [validacion, setValidacion] = useState<ValidacionPublicacionTest | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!idTest) return setCargando(false);
    try {
      setCargando(true);
      setError(null);
      const [t, v] = await Promise.all([
        obtenerTestCompletoAdmin(idTest),
        validarPublicacionTest(idTest),
      ]);
      setTest(t);
      setValidacion(v);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setCargando(false);
    }
  }, [idTest]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const cambiarPublicacion = async () => {
    if (!test || disabled || procesando) return;
    const publicado = test.estado;

    try {
      setProcesando(true);
      setError(null);
      setMensaje(null);

      if (
        publicado &&
        !(await confirmar({
          titulo: "Despublicar cuestionario",
          mensaje: "El cuestionario dejará de estar disponible para los usuarios.",
          textoConfirmar: "Despublicar",
          peligro: true,
        }))
      ) return;

      if (!publicado) {
        const v = await validarPublicacionTest(idTest);
        setValidacion(v);
        if (!v.valido)
          return setError("Debes corregir los problemas indicados antes de publicar.");
      }

      await (publicado ? despublicarTestAdmin(idTest) : publicarTestAdmin(idTest));
      await cargar();
      setMensaje(`El cuestionario se ${publicado ? "despublicó" : "publicó"} correctamente.`);
      (publicado ? onDespublicado : onPublicado)?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setProcesando(false);
    }
  };

  return { test, validacion, cargando, procesando, error, mensaje, cargar, cambiarPublicacion };
}