import { TecnicaCompletadaInterface } from "@/components/tecnicas/TecnicasInterfaces";
import { obtenerTecnica } from "@/services/tecnicas/tecnicasService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function TecnicaCompletada() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idTecnica = Array.isArray(id) ? id[0] : id;
  const [nombre, setNombre] = useState<string>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!idTecnica) {
      setCargando(false);
      return;
    }

    obtenerTecnica(idTecnica)
      .then((tecnica) => setNombre(tecnica.nombre))
      .catch(() => null)
      .finally(() => setCargando(false));
  }, [idTecnica]);

  return (
    <TecnicaCompletadaInterface
      nombre={nombre}
      cargando={cargando}
      onVolver={() => router.replace("/(tabs)/tecnicas")}
      onHistorial={() => router.replace("/(tabs)/tecnicas/historial" as any)}
    />
  );
}
