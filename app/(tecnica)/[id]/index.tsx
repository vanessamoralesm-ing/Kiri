import { DetalleTecnicaInterface } from "@/components/tecnicas/TecnicasInterfaces";
import {
  iniciarTecnica,
  obtenerTecnica,
  TecnicaComplementaria,
} from "@/services/tecnicas/tecnicasService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export default function DetalleTecnica() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const idTecnica = Array.isArray(id) ? id[0] : id;

  const [tecnica, setTecnica] = useState<TecnicaComplementaria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [iniciando, setIniciando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!idTecnica) return;

    try {
      setCargando(true);
      setError(null);

      const data = await obtenerTecnica(idTecnica);
      setTecnica(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos cargar la técnica.",
      );
    } finally {
      setCargando(false);
    }
  }, [idTecnica]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const comenzar = async () => {
    if (!idTecnica) return;

    try {
      setIniciando(true);

      const registro = await iniciarTecnica(idTecnica);

      router.push({
        pathname: "/(tecnica)/[id]/ejercicio" as any,
        params: { id: idTecnica, registro: registro.id_registro },
      });
    } catch (e) {
      Alert.alert(
        "No pudimos iniciar",
        e instanceof Error ? e.message : "Inténtalo nuevamente.",
      );
    } finally {
      setIniciando(false);
    }
  };

  return (
    <DetalleTecnicaInterface
      tecnica={tecnica}
      cargando={cargando}
      error={error}
      iniciando={iniciando}
      onVolver={() => router.back()}
      onReintentar={cargar}
      onComenzar={comenzar}
    />
  );
}
