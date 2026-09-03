import { TecnicasInicioInterface } from "@/components/tecnicas/TecnicasInterfaces";
import {
    obtenerTecnicasActivas,
    TecnicaComplementaria,
} from "@/services/tecnicas/tecnicasService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

export default function TecnicasScreen() {
  const router = useRouter();

  const [tecnicas, setTecnicas] = useState<TecnicaComplementaria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerTecnicasActivas();
      setTecnicas(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos cargar las técnicas.",
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
    <TecnicasInicioInterface
      tecnicas={tecnicas}
      cargando={cargando}
      error={error}
      onReintentar={cargar}
      onAbrir={(id) =>
        router.push({
          pathname: "/(tecnica)/[id]" as any,
          params: { id },
        })
      }
      onHistorial={() => router.push("/(tabs)/tecnicas/historial" as any)}
    />
  );
}
