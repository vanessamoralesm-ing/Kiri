import { EjercicioTecnicaInterface } from "@/components/tecnicas/TecnicasInterfaces";
import {
  completarTecnica,
  obtenerPasosTecnica,
  obtenerTecnica,
} from "@/services/tecnicas/tecnicasService";
import type { PasoTecnica, TecnicaComplementaria } from "@/types/tecnicas";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export default function EjercicioTecnica() {
  const router = useRouter();
  const { id, registro } = useLocalSearchParams<{
    id: string;
    registro: string;
  }>();

  const idTecnica = Array.isArray(id) ? id[0] : id;
  const idRegistro = Array.isArray(registro) ? registro[0] : registro;

  const [tecnica, setTecnica] = useState<TecnicaComplementaria | null>(null);
  const [pasos, setPasos] = useState<PasoTecnica[]>([]);
  const [indice, setIndice] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!idTecnica) {
      setError("No recibimos la técnica seleccionada.");
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const [tecnica, pasos] = await Promise.all([
        obtenerTecnica(idTecnica),
        obtenerPasosTecnica(idTecnica),
      ]);

      if (!pasos.length)
        throw new Error("Esta técnica todavía no tiene pasos disponibles.");

      setTecnica(tecnica);
      setPasos(pasos);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos preparar el ejercicio."
      );
    } finally {
      setCargando(false);
    }
  }, [idTecnica]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const siguiente = async () => {
    if (indice < pasos.length - 1) {
      setIndice((actual) => actual + 1);
      return;
    }

    if (!idRegistro) {
      Alert.alert(
        "No pudimos guardar",
        "Falta el registro de esta práctica."
      );
      return;
    }

    try {
      setFinalizando(true);
      await completarTecnica(idRegistro);

      router.replace({
        pathname: "/(tecnica)/[id]/completada" as any,
        params: { id: idTecnica },
      });
    } catch (e) {
      Alert.alert(
        "No pudimos finalizar",
        e instanceof Error
          ? e.message
          : "Inténtalo nuevamente."
      );
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <EjercicioTecnicaInterface
      tecnica={tecnica}
      pasos={pasos}
      indice={indice}
      cargando={cargando}
      error={error}
      finalizando={finalizando}
      onCerrar={() => router.back()}
      onReintentar={cargar}
      onSiguiente={siguiente}
    />
  );
}