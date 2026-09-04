import { HistorialTecnicasInterface } from "@/components/tecnicas/TecnicasInterfaces";
import {
    obtenerHistorialTecnicas,
    RegistroTecnica,
} from "@/services/tecnicas/tecnicasService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

export default function HistorialTecnicas() {
  const router = useRouter();

  const [registros, setRegistros] = useState<RegistroTecnica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerHistorialTecnicas();
      setRegistros(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos cargar tu historial.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  return (
    <HistorialTecnicasInterface
      registros={registros}
      cargando={cargando}
      error={error}
      onVolver={() => router.back()}
      onReintentar={cargar}
    />
  );
}
