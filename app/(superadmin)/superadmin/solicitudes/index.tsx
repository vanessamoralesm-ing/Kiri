import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import SolicitudDetailPanel from "@/components/superadmin/solicitudes/SolicitudDetailPanel";
import SolicitudesTable from "@/components/superadmin/solicitudes/SolicitudesTable";
import SolicitudesToolbar from "@/components/superadmin/solicitudes/SolicitudesToolbar";
import SolicitudKpiCard from "@/components/superadmin/solicitudes/SolicitudKpiCard";
import { aprobarSolicitudInstitucional } from "@/services/superadmin/aprobarSolicitudService";
import { obtenerSolicitudesInstitucionales } from "@/services/superadmin/solicitudServices";
import type { FiltroEstado, FiltroTipo, SolicitudInstitucion } from "@/types/superadmin/solicitudes";

export default function SolicitudesSuperAdminScreen() {
  // DATOS Y ESTADOS
  const [solicitudes, setSolicitudes] = useState<SolicitudInstitucion[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudInstitucion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FILTROS Y PAGINACIÓN
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 5;

  // TEMA
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const secondaryColor = useThemeColor({}, "secondary");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // CARGAR SOLICITUDES
  async function cargarSolicitudes() {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerSolicitudesInstitucionales();
      setSolicitudes(datos);

      setSolicitudSeleccionada((actual) => {
        if (datos.length === 0) return null;
        if (actual) {
          const existe = datos.find((s) => s.id_solicitud === actual.id_solicitud);
          if (existe) return existe;
        }
        return datos[0];
      });
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      setError(err instanceof Error ? err.message : "No fue posible cargar las solicitudes.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // ESTADÍSTICAS
  const totalSolicitudes = solicitudes.length;
  const solicitudesPendientes = useMemo(
    () => solicitudes.filter((s) => s.estado === "pendiente").length,
    [solicitudes]
  );

  const solicitudesAprobadas = useMemo(() => {
    const ahora = new Date();
    return solicitudes.filter((s) => {
      if (s.estado !== "aprobada" || !s.fecha_resolucion) return false;
      const fecha = new Date(s.fecha_resolucion);
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
    }).length;
  }, [solicitudes]);

  const totalAprobadas = useMemo(
    () => solicitudes.filter((s) => s.estado === "aprobada").length,
    [solicitudes]
  );

  const tasaAprobacion = totalSolicitudes > 0 ? (totalAprobadas / totalSolicitudes) * 100 : 0;

  // FILTRADO
  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return solicitudes.filter((solicitud) => {
      const coincideEstado = filtroEstado === "todas" || solicitud.estado === filtroEstado;
      const coincideTipo = filtroTipo === "todos" || solicitud.tipo_institucion === filtroTipo;

      const nombreSolicitante = `${solicitud.nombre_solicitante ?? ""} ${solicitud.apellido_solicitante ?? ""}`
        .trim()
        .toLowerCase();

      const coincideBusqueda =
        !termino ||
        solicitud.nombre_institucion?.toLowerCase().includes(termino) ||
        nombreSolicitante.includes(termino) ||
        solicitud.codigo_institucional?.toLowerCase().includes(termino) ||
        solicitud.correo?.toLowerCase().includes(termino) ||
        solicitud.cedula_solicitante?.toLowerCase().includes(termino);

      return coincideEstado && coincideTipo && coincideBusqueda;
    });
  }, [solicitudes, filtroEstado, filtroTipo, busqueda]);

  // PAGINACIÓN
  const totalPaginas = Math.max(1, Math.ceil(solicitudesFiltradas.length / registrosPorPagina));

  const solicitudesPagina = useMemo(() => {
    const inicio = (pagina - 1) * registrosPorPagina;
    return solicitudesFiltradas.slice(inicio, inicio + registrosPorPagina);
  }, [solicitudesFiltradas, pagina]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  // HANDLERS
  function cambiarFiltroEstado(estado: FiltroEstado) {
    setFiltroEstado(estado);
    setPagina(1);
  }

  function cambiarFiltroTipo() {
    setPagina(1);
    setFiltroTipo((actual) => {
      if (actual === "todos") return "educacion_superior";
      if (actual === "educacion_superior") return "escolar";
      if (actual === "escolar") return "salud";
      return "todos";
    });
  }

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor);
    setPagina(1);
  }

  async function aprobarSolicitud() {
    if (!solicitudSeleccionada) return;

    try {
      console.log("Aprobando solicitud:", solicitudSeleccionada.id_solicitud);
      const resultado = await aprobarSolicitudInstitucional(solicitudSeleccionada.id_solicitud);
      console.log("RESULTADO APROBACIÓN:", resultado);

      if (resultado.warning) {
        Alert.alert("Solicitud aprobada", `${resultado.message}\n\n${resultado.warning}`);
        return;
      }

      Alert.alert("Solicitud aprobada", resultado.message || "La institución fue aprobada correctamente.");
    } catch (err) {
      console.error("ERROR APROBANDO:", err);
      const mensaje = err instanceof Error ? err.message : "Ocurrió un error inesperado al aprobar la solicitud.";
      Alert.alert("No se pudo aprobar", mensaje);
    }
  }

  function solicitarAntecedentes() {
    if (!solicitudSeleccionada) return;
    console.log("Solicitar antecedentes:", solicitudSeleccionada.id_solicitud);
  }

  function rechazarSolicitud() {
    if (!solicitudSeleccionada) return;
    console.log("Rechazar solicitud:", solicitudSeleccionada.id_solicitud);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* BREADCRUMB */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontFamily: "Nunito-Medium", fontSize: 12, color: textMutedColor }}>
          Kiri Superadmin
        </Text>
        <Ionicons name="chevron-forward" size={13} color={textMutedColor} />
        <Text style={{ fontFamily: "Nunito-Medium", fontSize: 12, color: textMutedColor }}>
          Convenios
        </Text>
        <Ionicons name="chevron-forward" size={13} color={textMutedColor} />
        <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 12, color: primaryColor }}>
          Solicitudes de Afiliación
        </Text>
      </View>

      {/* ENCABEZADO */}
      <View style={{ marginTop: 18, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 999,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: primarySoftColor,
            }}
          >
            <View style={{ width: 6, height: 6, marginRight: 7, borderRadius: 3, backgroundColor: primaryColor }} />
            <Text style={{ fontFamily: "Nunito-Bold", fontSize: 10, color: primaryColor }}>
              PORTAL DE AUDITORÍA Y RED
            </Text>
          </View>
          <Text style={{ marginTop: 11, fontFamily: "Nunito-Bold", fontSize: 29, color: textColor }}>
            Solicitudes de Instituciones
          </Text>
          <Text style={{ maxWidth: 720, marginTop: 5, fontFamily: "Nunito-Medium", fontSize: 14, lineHeight: 21, color: textSecondaryColor }}>
            Gestiona, audita y valida solicitudes de incorporación de colegios, universidades y centros clínicos a la red Kiri para acceso a salud mental preventiva.
          </Text>
        </View>

        {/* ACCIONES SUPERIORES */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => console.log("Descargar registro")}
            style={({ pressed }) => ({
              minHeight: 50,
              paddingHorizontal: 18,
              borderRadius: 14,
              borderWidth: 1,
              borderColor,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
              backgroundColor: surfaceColor,
            })}
          >
            <Ionicons name="download-outline" size={18} color={textSecondaryColor} />
            <Text style={{ marginLeft: 9, fontFamily: "Nunito-SemiBold", fontSize: 13, color: textColor }}>
              Descargar registro
            </Text>
          </Pressable>

          <Pressable
            onPress={() => console.log("Alta manual")}
            style={({ pressed }) => ({
              minHeight: 50,
              paddingHorizontal: 20,
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
              backgroundColor: primaryColor,
              boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.12)",
            })}
          >
            <Ionicons name="add-circle-outline" size={19} color={textOnPrimaryColor} />
            <Text style={{ marginLeft: 8, fontFamily: "Nunito-Bold", fontSize: 13, color: textOnPrimaryColor }}>
              Alta manual
            </Text>
          </Pressable>
        </View>
      </View>

      {/* KPI */}
      <View style={{ marginTop: 28, flexDirection: "row", gap: 16 }}>
        <SolicitudKpiCard
          titulo="SOLICITUDES POR VALIDAR"
          valor={solicitudesPendientes}
          sufijo="en espera"
          descripcion={
            solicitudesPendientes === 1
              ? "1 solicitud pendiente de revisión"
              : `${solicitudesPendientes} solicitudes pendientes de revisión`
          }
          icono="clipboard-outline"
          variante="primary"
        />
        <SolicitudKpiCard
          titulo="APROBADAS ESTE MES"
          valor={solicitudesAprobadas}
          sufijo="entidades"
          descripcion="Solicitudes aprobadas durante el mes actual"
          icono="checkmark-circle-outline"
          variante="secondary"
          descripcionDestacada
        />
        <SolicitudKpiCard
          titulo="TASA DE APROBACIÓN"
          valor={`${tasaAprobacion.toFixed(1)}%`}
          descripcion="Porcentaje de solicitudes aprobadas"
          icono="shield-checkmark-outline"
          variante="accent"
        />
      </View>

      {/* TOOLBAR */}
      <View style={{ marginTop: 24 }}>
        <SolicitudesToolbar
          filtroEstado={filtroEstado}
          filtroTipo={filtroTipo}
          busqueda={busqueda}
          totalSolicitudes={totalSolicitudes}
          solicitudesPendientes={solicitudesPendientes}
          solicitudesAprobadas={totalAprobadas}
          onCambiarEstado={cambiarFiltroEstado}
          onCambiarTipo={cambiarFiltroTipo}
          onBusquedaChange={cambiarBusqueda}
        />
      </View>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <View
          style={{
            minHeight: 380,
            marginTop: 18,
            borderWidth: 1,
            borderColor,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: surfaceColor,
          }}
        >
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={{ marginTop: 14, fontFamily: "Nunito-SemiBold", fontSize: 14, color: textSecondaryColor }}>
            Cargando solicitudes...
          </Text>
        </View>
      )}

      {/* ESTADO DE ERROR */}
      {!cargando && error && (
        <View
          style={{
            minHeight: 300,
            marginTop: 18,
            padding: 28,
            borderWidth: 1,
            borderColor,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: surfaceColor,
          }}
        >
          <Ionicons name="alert-circle-outline" size={42} color={secondaryColor} />
          <Text style={{ marginTop: 14, fontFamily: "Nunito-Bold", fontSize: 16, color: textColor }}>
            No pudimos cargar las solicitudes
          </Text>
          <Text style={{ maxWidth: 450, marginTop: 6, fontFamily: "Nunito-Medium", fontSize: 13, lineHeight: 20, textAlign: "center", color: textSecondaryColor }}>
            {error}
          </Text>
          <Pressable
            onPress={cargarSolicitudes}
            style={({ pressed }) => ({
              minHeight: 44,
              marginTop: 18,
              paddingHorizontal: 20,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
              backgroundColor: primaryColor,
            })}
          >
            <Ionicons name="refresh-outline" size={17} color={textOnPrimaryColor} />
            <Text style={{ marginLeft: 7, fontFamily: "Nunito-Bold", fontSize: 13, color: textOnPrimaryColor }}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      )}

      {/* TABLA + DETALLE */}
      {!cargando && !error && (
        <View style={{ marginTop: 18, flexDirection: "row", alignItems: "stretch", gap: 18 }}>
          <SolicitudesTable
            solicitudes={solicitudesPagina}
            solicitudSeleccionada={solicitudSeleccionada}
            pagina={pagina}
            totalPaginas={totalPaginas}
            totalFiltradas={solicitudesFiltradas.length}
            onSeleccionar={setSolicitudSeleccionada}
            onCambiarPagina={setPagina}
          />
          <SolicitudDetailPanel
            solicitud={solicitudSeleccionada}
            onAprobar={aprobarSolicitud}
            onSolicitarAntecedentes={solicitarAntecedentes}
            onRechazar={rechazarSolicitud}
          />
        </View>
      )}
    </ScrollView>
  );
}