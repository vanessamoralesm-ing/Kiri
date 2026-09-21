import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import SolicitudDetailPanel from "@/components/superadmin/solicitudes/SolicitudDetailPanel";
import SolicitudKpiCard from "@/components/superadmin/solicitudes/SolicitudKpiCard";
import SolicitudesTable from "@/components/superadmin/solicitudes/SolicitudesTable";
import SolicitudesToolbar from "@/components/superadmin/solicitudes/SolicitudesToolbar";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { aprobarSolicitudInstitucional } from "@/services/superadmin/aprobarSolicitudService";
import { obtenerSolicitudesInstitucionales } from "@/services/superadmin/solicitudServices";

import type {
  FiltroEstado,
  FiltroTipo,
  SolicitudInstitucion,
} from "@/types/superadmin/solicitudes";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function SolicitudesSuperAdminScreen() {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const scrollRef = useRef<ScrollView>(null);

  // ========================================================
  // DATOS Y ESTADOS
  // ========================================================

  const [solicitudes, setSolicitudes] = useState<SolicitudInstitucion[]>([]);

  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudInstitucion | null>(null);

  const [mostrarDetalleMovil, setMostrarDetalleMovil] = useState(false);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // FILTROS Y PAGINACIÓN
  // ========================================================

  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");

  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");

  const [busqueda, setBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);

  const registrosPorPagina = 5;

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 18;

  const paddingBottom = esEscritorio ? 48 : 110;

  const anchoKpi = esEscritorio ? "32%" : esTablet ? "48%" : "100%";

  // ========================================================
  // CARGAR SOLICITUDES
  // ========================================================

  async function cargarSolicitudes() {
    try {
      setCargando(true);
      setError(null);

      const datos = await obtenerSolicitudesInstitucionales();

      setSolicitudes(datos);

      setSolicitudSeleccionada((actual) => {
        if (datos.length === 0) {
          return null;
        }

        if (actual) {
          const existe = datos.find(
            (solicitud) => solicitud.id_solicitud === actual.id_solicitud,
          );

          if (existe) {
            return existe;
          }
        }

        return datos[0];
      });
    } catch (err) {
      console.error("Error cargando solicitudes:", err);

      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar las solicitudes.",
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // ========================================================
  // SCROLL AUTOMÁTICO AL ABRIR DETALLE
  // ========================================================

  useEffect(() => {
    if (esEscritorio || !mostrarDetalleMovil) {
      return;
    }

    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }, 80);

    return () => {
      clearTimeout(timeout);
    };
  }, [mostrarDetalleMovil, esEscritorio, solicitudSeleccionada?.id_solicitud]);

  // ========================================================
  // ESTADÍSTICAS
  // ========================================================

  const totalSolicitudes = solicitudes.length;

  const solicitudesPendientes = useMemo(
    () =>
      solicitudes.filter((solicitud) => solicitud.estado === "pendiente")
        .length,
    [solicitudes],
  );

  const solicitudesAprobadas = useMemo(() => {
    const ahora = new Date();

    return solicitudes.filter((solicitud) => {
      if (solicitud.estado !== "aprobada" || !solicitud.fecha_resolucion) {
        return false;
      }

      const fecha = new Date(solicitud.fecha_resolucion);

      return (
        fecha.getFullYear() === ahora.getFullYear() &&
        fecha.getMonth() === ahora.getMonth()
      );
    }).length;
  }, [solicitudes]);

  const totalAprobadas = useMemo(
    () =>
      solicitudes.filter((solicitud) => solicitud.estado === "aprobada").length,
    [solicitudes],
  );

  const tasaAprobacion =
    totalSolicitudes > 0 ? (totalAprobadas / totalSolicitudes) * 100 : 0;

  // ========================================================
  // FILTRADO
  // ========================================================

  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return solicitudes.filter((solicitud) => {
      const coincideEstado =
        filtroEstado === "todas" || solicitud.estado === filtroEstado;

      const coincideTipo =
        filtroTipo === "todos" || solicitud.tipo_institucion === filtroTipo;

      const nombreSolicitante =
        `${solicitud.nombre_solicitante ?? ""} ${solicitud.apellido_solicitante ?? ""}`
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

  // ========================================================
  // PAGINACIÓN
  // ========================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(solicitudesFiltradas.length / registrosPorPagina),
  );

  const solicitudesPagina = useMemo(() => {
    const inicio = (pagina - 1) * registrosPorPagina;

    return solicitudesFiltradas.slice(inicio, inicio + registrosPorPagina);
  }, [solicitudesFiltradas, pagina]);

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  // ========================================================
  // HANDLERS
  // ========================================================

  function seleccionarSolicitud(solicitud: SolicitudInstitucion) {
    setSolicitudSeleccionada(solicitud);

    if (!esEscritorio) {
      setMostrarDetalleMovil(true);
    }
  }

  function volverAListaSolicitudes() {
    setMostrarDetalleMovil(false);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });
  }

  function cambiarFiltroEstado(estado: FiltroEstado) {
    setFiltroEstado(estado);

    setPagina(1);

    setMostrarDetalleMovil(false);
  }

  function cambiarFiltroTipo() {
    setPagina(1);

    setMostrarDetalleMovil(false);

    setFiltroTipo((actual) => {
      if (actual === "todos") {
        return "educacion_superior";
      }

      if (actual === "educacion_superior") {
        return "escolar";
      }

      if (actual === "escolar") {
        return "salud";
      }

      return "todos";
    });
  }

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor);

    setPagina(1);

    setMostrarDetalleMovil(false);
  }

  function cambiarPagina(nuevaPagina: number) {
    setPagina(nuevaPagina);

    if (!esEscritorio) {
      setMostrarDetalleMovil(false);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      });
    }
  }

  async function aprobarSolicitud() {
    if (!solicitudSeleccionada) {
      return;
    }

    try {
      console.log("Aprobando solicitud:", solicitudSeleccionada.id_solicitud);

      const resultado = await aprobarSolicitudInstitucional(
        solicitudSeleccionada.id_solicitud,
      );

      console.log("RESULTADO APROBACIÓN:", resultado);

      if (resultado.warning) {
        Alert.alert(
          "Solicitud aprobada",
          `${resultado.message}\n\n${resultado.warning}`,
        );

        await cargarSolicitudes();

        return;
      }

      Alert.alert(
        "Solicitud aprobada",
        resultado.message || "La institución fue aprobada correctamente.",
      );

      await cargarSolicitudes();
    } catch (err) {
      console.error("ERROR APROBANDO:", err);

      const mensaje =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al aprobar la solicitud.";

      Alert.alert("No se pudo aprobar", mensaje);
    }
  }

  function solicitarAntecedentes() {
    if (!solicitudSeleccionada) {
      return;
    }

    console.log("Solicitar antecedentes:", solicitudSeleccionada.id_solicitud);
  }

  function rechazarSolicitud() {
    if (!solicitudSeleccionada) {
      return;
    }

    console.log("Rechazar solicitud:", solicitudSeleccionada.id_solicitud);
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      ref={scrollRef}
      style={{
        flex: 1,
        backgroundColor,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal,
        paddingTop,
        paddingBottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: "100%",

          maxWidth: MAX_WIDTHS.dashboard,

          alignSelf: "center",
        }}
      >
        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        {(esEscritorio || !mostrarDetalleMovil) && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",

              alignItems: "center",

              gap: 8,

              paddingRight: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Kiri Superadmin
            </Text>

            <Ionicons name="chevron-forward" size={13} color={textMutedColor} />

            <Text
              style={{
                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Convenios
            </Text>

            <Ionicons name="chevron-forward" size={13} color={textMutedColor} />

            <Text
              style={{
                fontFamily: "Nunito-SemiBold",

                fontSize: 12,

                color: primaryColor,
              }}
            >
              Solicitudes de Afiliación
            </Text>
          </ScrollView>
        )}

        {/* ==================================================
            CABECERA + KPI + FILTROS
        ================================================== */}

        {(esEscritorio || !mostrarDetalleMovil) && (
          <>
            <View
              style={{
                marginTop: esEscritorio ? 20 : 16,

                flexDirection: esEscritorio ? "row" : "column",

                alignItems: esEscritorio ? "flex-end" : "stretch",

                justifyContent: "space-between",

                gap: esEscritorio ? 24 : 18,
              }}
            >
              <View
                style={{
                  flex: esEscritorio ? 1 : undefined,

                  minWidth: 0,
                }}
              >
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
                  <View
                    style={{
                      width: 6,
                      height: 6,

                      marginRight: 7,

                      borderRadius: 3,

                      backgroundColor: primaryColor,
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: 10,

                      color: primaryColor,
                    }}
                  >
                    PORTAL DE AUDITORÍA Y RED
                  </Text>
                </View>

                <Text
                  style={{
                    marginTop: 11,

                    fontFamily: "Nunito-Bold",

                    fontSize: esEscritorio ? 30 : esTablet ? 27 : 24,

                    lineHeight: esEscritorio ? 38 : 31,

                    color: textColor,
                  }}
                >
                  Solicitudes de Instituciones
                </Text>

                <Text
                  style={{
                    maxWidth: 720,

                    marginTop: 6,

                    fontFamily: "Nunito-Medium",

                    fontSize: esEscritorio ? 14 : 13,

                    lineHeight: esEscritorio ? 21 : 20,

                    color: textSecondaryColor,
                  }}
                >
                  Gestiona, audita y valida solicitudes de incorporación de
                  colegios, universidades y centros clínicos a la red Kiri para
                  acceso a salud mental preventiva.
                </Text>
              </View>

              {/* ==============================================
                  ACCIONES SUPERIORES
              ============================================== */}

              <View
                style={{
                  width: esEscritorio ? "auto" : "100%",

                  flexDirection: esEscritorio ? "row" : "column",

                  alignItems: esEscritorio ? "center" : "stretch",

                  gap: 10,

                  marginTop: esEscritorio ? 0 : 6,
                }}
              >
                {/* DESCARGAR */}

                <Pressable
                  onPress={() => {
                    console.log("Descargar registro");
                  }}
                  style={({ pressed }) => ({
                    width: esEscritorio ? undefined : "100%",

                    borderRadius: 14,

                    overflow: "hidden",

                    opacity: pressed ? 0.78 : 1,
                  })}
                >
                  <View
                    style={{
                      width: esEscritorio ? undefined : "100%",

                      minWidth: esEscritorio ? 190 : undefined,

                      minHeight: 52,

                      paddingHorizontal: 18,

                      paddingVertical: 10,

                      borderRadius: 14,

                      borderWidth: 1,

                      borderColor,

                      flexDirection: "row",

                      alignItems: "center",

                      justifyContent: esEscritorio ? "center" : "flex-start",

                      backgroundColor: surfaceColor,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,

                        borderRadius: 9,

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,

                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Ionicons
                        name="download-outline"
                        size={18}
                        color={primaryColor}
                      />
                    </View>

                    <Text
                      style={{
                        marginLeft: 10,

                        fontFamily: "Nunito-SemiBold",

                        fontSize: 13,

                        color: textColor,
                      }}
                    >
                      Descargar registro
                    </Text>
                  </View>
                </Pressable>

                {/* ALTA MANUAL */}

                <Pressable
                  onPress={() => {
                    console.log("Alta manual");
                  }}
                  style={({ pressed }) => ({
                    width: esEscritorio ? undefined : "100%",

                    borderRadius: 14,

                    overflow: "hidden",

                    opacity: pressed ? 0.82 : 1,
                  })}
                >
                  <View
                    style={{
                      width: esEscritorio ? undefined : "100%",

                      minWidth: esEscritorio ? 160 : undefined,

                      minHeight: 52,

                      paddingHorizontal: 18,

                      paddingVertical: 10,

                      borderRadius: 14,

                      flexDirection: "row",

                      alignItems: "center",

                      justifyContent: esEscritorio ? "center" : "flex-start",

                      backgroundColor: primaryColor,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,

                        borderRadius: 9,

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,

                        backgroundColor: "rgba(255,255,255,0.16)",
                      }}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={textOnPrimaryColor}
                      />
                    </View>

                    <Text
                      style={{
                        marginLeft: 10,

                        fontFamily: "Nunito-Bold",

                        fontSize: 13,

                        color: textOnPrimaryColor,
                      }}
                    >
                      Alta manual
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* KPI */}

            <View
              style={{
                marginTop: esEscritorio ? 28 : 22,

                flexDirection: "row",

                flexWrap: "wrap",

                gap: esEscritorio ? 16 : 12,
              }}
            >
              <View
                style={{
                  width: anchoKpi,

                  flexGrow: esEscritorio || esTablet ? 1 : 0,
                }}
              >
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
              </View>

              <View
                style={{
                  width: anchoKpi,

                  flexGrow: esEscritorio || esTablet ? 1 : 0,
                }}
              >
                <SolicitudKpiCard
                  titulo="APROBADAS ESTE MES"
                  valor={solicitudesAprobadas}
                  sufijo="entidades"
                  descripcion="Solicitudes aprobadas durante el mes actual"
                  icono="checkmark-circle-outline"
                  variante="secondary"
                  descripcionDestacada
                />
              </View>

              <View
                style={{
                  width: anchoKpi,

                  flexGrow: esEscritorio || esTablet ? 1 : 0,
                }}
              >
                <SolicitudKpiCard
                  titulo="TASA DE APROBACIÓN"
                  valor={`${tasaAprobacion.toFixed(1)}%`}
                  descripcion="Porcentaje de solicitudes aprobadas"
                  icono="shield-checkmark-outline"
                  variante="accent"
                />
              </View>
            </View>

            {/* TOOLBAR */}

            <View
              style={{
                marginTop: esEscritorio ? 24 : 18,
              }}
            >
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
          </>
        )}

        {/* ==================================================
            CARGANDO
        ================================================== */}

        {cargando && (
          <View
            style={{
              minHeight: esEscritorio ? 380 : 280,

              marginTop: 18,

              borderWidth: 1,

              borderColor,

              borderRadius: 18,

              alignItems: "center",

              justifyContent: "center",

              paddingHorizontal: 20,

              backgroundColor: surfaceColor,
            }}
          >
            <ActivityIndicator size="large" color={primaryColor} />

            <Text
              style={{
                marginTop: 14,

                fontFamily: "Nunito-SemiBold",

                fontSize: 14,

                color: textSecondaryColor,
              }}
            >
              Cargando solicitudes...
            </Text>
          </View>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {!cargando && error && (
          <View
            style={{
              minHeight: esEscritorio ? 300 : 250,

              marginTop: 18,

              padding: esEscritorio ? 28 : 20,

              borderWidth: 1,

              borderColor,

              borderRadius: 18,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: surfaceColor,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={secondaryColor}
            />

            <Text
              style={{
                marginTop: 14,

                fontFamily: "Nunito-Bold",

                fontSize: 16,

                textAlign: "center",

                color: textColor,
              }}
            >
              No pudimos cargar las solicitudes
            </Text>

            <Text
              style={{
                maxWidth: 450,

                marginTop: 6,

                fontFamily: "Nunito-Medium",

                fontSize: 13,

                lineHeight: 20,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
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
              <Ionicons
                name="refresh-outline"
                size={17}
                color={textOnPrimaryColor}
              />

              <Text
                style={{
                  marginLeft: 7,

                  fontFamily: "Nunito-Bold",

                  fontSize: 13,

                  color: textOnPrimaryColor,
                }}
              >
                Reintentar
              </Text>
            </Pressable>
          </View>
        )}

        {/* ==================================================
            SOLICITUDES + DETALLE
        ================================================== */}

        {!cargando && !error && (
          <>
            {/* ==============================================
                  ESCRITORIO
              ============================================== */}

            {esEscritorio ? (
              <View
                style={{
                  marginTop: 18,

                  flexDirection: "row",

                  alignItems: "stretch",

                  gap: 18,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <SolicitudesTable
                    solicitudes={solicitudesPagina}
                    solicitudSeleccionada={solicitudSeleccionada}
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    totalFiltradas={solicitudesFiltradas.length}
                    onSeleccionar={seleccionarSolicitud}
                    onCambiarPagina={cambiarPagina}
                  />
                </View>

                <View
                  style={{
                    width: 380,

                    flexShrink: 0,
                  }}
                >
                  <SolicitudDetailPanel
                    solicitud={solicitudSeleccionada}
                    onAprobar={aprobarSolicitud}
                    onSolicitarAntecedentes={solicitarAntecedentes}
                    onRechazar={rechazarSolicitud}
                  />
                </View>
              </View>
            ) : (
              /* ==============================================
                    MÓVIL / TABLET
                ============================================== */

              <View
                style={{
                  width: "100%",

                  marginTop: mostrarDetalleMovil ? 0 : 18,
                }}
              >
                {!mostrarDetalleMovil ? (
                  <SolicitudesTable
                    solicitudes={solicitudesPagina}
                    solicitudSeleccionada={solicitudSeleccionada}
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    totalFiltradas={solicitudesFiltradas.length}
                    onSeleccionar={seleccionarSolicitud}
                    onCambiarPagina={cambiarPagina}
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                    }}
                  >
                    {/* ==========================================
                          VOLVER
                      ========================================== */}

                    <View
                      style={{
                        width: "100%",

                        marginBottom: 16,

                        flexDirection: "row",

                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        onPress={() => setMostrarDetalleMovil(false)}
                        hitSlop={8}
                        style={({ pressed }) => ({
                          alignSelf: "flex-start",

                          marginBottom: 16,

                          opacity: pressed ? 0.65 : 1,
                        })}
                      >
                        <View
                          style={{
                            minHeight: 40,

                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 36,
                              height: 36,

                              borderRadius: 11,

                              alignItems: "center",
                              justifyContent: "center",

                              backgroundColor: primarySoftColor,
                            }}
                          >
                            <Ionicons
                              name="arrow-back"
                              size={20}
                              color={primaryColor}
                            />
                          </View>

                          <Text
                            style={{
                              marginLeft: 10,

                              fontFamily: "Nunito-SemiBold",
                              fontSize: 14,
                              lineHeight: 19,

                              color: textColor,
                            }}
                          >
                            Volver a solicitudes
                          </Text>
                        </View>
                      </Pressable>
                    </View>

                    {/* ==========================================
                          DETALLE
                      ========================================== */}

                    <SolicitudDetailPanel
                      solicitud={solicitudSeleccionada}
                      onAprobar={aprobarSolicitud}
                      onSolicitarAntecedentes={solicitarAntecedentes}
                      onRechazar={rechazarSolicitud}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
