import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  obtenerEstadisticasDashboard,
  type SuperAdminDashboardStats,
} from "@/services/superadmin/dashboardService";

export default function useSuperAdminDashboard() {
  const [estadisticas, setEstadisticas] = useState<SuperAdminDashboardStats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const solicitud = useRef(0);

  const recargar = useCallback(async () => {
    const id = ++solicitud.current;
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerEstadisticasDashboard();
      if (id === solicitud.current) setEstadisticas(datos);
    } catch (e) {
      if (id === solicitud.current)
        setError(e instanceof Error ? e.message : "No se pudieron cargar las estadísticas.");
    } finally {
      if (id === solicitud.current) setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recargar();
      return () => {
        solicitud.current++;
      };
    }, [recargar]),
  );

  return { estadisticas, cargando, error, recargar };
}