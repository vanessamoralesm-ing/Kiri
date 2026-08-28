import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  obtenerResumenBienestar,
  ResumenBienestar,
} from "@/services/entrevista/resumenBienestarService";

export function useResumenBienestar() {
  const [resumen,setResumen] = useState<ResumenBienestar|null>(null);
  const [cargando,setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargar() {
        try {
          setCargando(true);
          const data = await obtenerResumenBienestar();
          if (activo) setResumen(data);
        } catch (error) {
          console.error("Error cargando resumen de bienestar:",error);
          if (activo) setResumen(null);
        } finally {
          if (activo) setCargando(false);
        }
      }

      cargar();

      return () => {
        activo = false;
      };
    },[])
  );

  return {resumen,cargando};
}