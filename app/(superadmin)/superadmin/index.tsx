import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import {
  obtenerEstadisticasDashboard,
  type SuperAdminDashboardStats,
} from "@/services/superadmin/dashboardService";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function SuperAdminDashboard() {
  const { profile } = useAuth();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADÍSTICAS
  // ========================================================

  const [estadisticas, setEstadisticas] = useState<SuperAdminDashboardStats>({
    solicitudesPendientes: 0,
    institucionesActivas: 0,
    usuariosRegistrados: 0,
    cuestionariosActivos: 0,
  });

  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(true);

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

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ========================================================
  // USUARIO
  // ========================================================

  const nombreUsuario =
    profile?.nombre_preferido?.trim() || profile?.nombres?.trim() || "Usuario";

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;

  const paddingBottom = esEscritorio ? 48 : 36;

  const gapPrincipal = esEscritorio ? 16 : 12;

  const paddingTarjeta = esEscritorio ? 20 : esTablet ? 18 : 16;

  const anchoAccion = esEscritorio ? "31.8%" : esTablet ? "48%" : "100%";

  const anchoKpi = esEscritorio ? "23.7%" : esTablet ? "48%" : "100%";

  // ========================================================
  // CARGAR ESTADÍSTICAS
  // ========================================================

  useEffect(() => {
    let componenteActivo = true;

    async function cargarEstadisticas() {
      try {
        setCargandoEstadisticas(true);

        const datos = await obtenerEstadisticasDashboard();

        if (!componenteActivo) {
          return;
        }

        setEstadisticas(datos);
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard:", error);
      } finally {
        if (componenteActivo) {
          setCargandoEstadisticas(false);
        }
      }
    }

    cargarEstadisticas();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
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
      {/* ==================================================
          CONTENEDOR GENERAL
      ================================================== */}

      <View
        style={{
          width: "100%",
          maxWidth: MAX_WIDTHS.dashboard,
          alignSelf: "center",
        }}
      >
        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <View
          style={{
            marginBottom: esEscritorio ? 28 : 22,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 30 : esTablet ? 27 : 24,

              lineHeight: esEscritorio ? 38 : esTablet ? 34 : 31,

              color: textColor,
            }}
          >
            Panel de Control General
          </Text>

          <Text
            style={{
              marginTop: 6,

              maxWidth: esEscritorio ? 720 : undefined,

              fontFamily: "Nunito-Medium",

              fontSize: esEscritorio ? 15 : 14,

              lineHeight: esEscritorio ? 22 : 20,

              color: textSecondaryColor,
            }}
          >
            Bienvenido, {nombreUsuario}. Aquí podrás administrar el ecosistema
            de Kiri.
          </Text>
        </View>

        {/* ==================================================
            ACCIONES RÁPIDAS
        ================================================== */}

        <View
          style={{
            width: "100%",

            padding: esEscritorio ? 22 : esTablet ? 20 : 16,

            borderRadius: esEscritorio ? 22 : 18,

            borderWidth: 1,
            borderColor,

            backgroundColor: surfaceColor,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 19 : 17,

              color: textColor,
            }}
          >
            Acciones rápidas
          </Text>

          <Text
            style={{
              marginTop: 4,

              fontFamily: "Nunito-Medium",

              fontSize: 13,

              lineHeight: 19,

              color: textMutedColor,
            }}
          >
            Accede rápidamente a las funciones principales de administración.
          </Text>

          <View
            style={{
              width: "100%",

              marginTop: esEscritorio ? 20 : 16,

              flexDirection: "row",

              flexWrap: "wrap",

              gap: 12,
            }}
          >
            {/* REVISAR SOLICITUDES */}

            <View
              style={{
                width: anchoAccion,

                flexGrow: esEscritorio || esTablet ? 1 : 0,

                minHeight: esEscritorio ? 56 : 54,

                paddingHorizontal: esEscritorio ? 18 : 16,

                paddingVertical: 13,

                borderRadius: 14,

                flexDirection: "row",

                alignItems: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,

                  flexShrink: 0,

                  borderRadius: 10,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Ionicons name="mail-outline" size={19} color={primaryColor} />
              </View>

              <Text
                style={{
                  flex: 1,

                  marginLeft: 10,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: primaryColor,
                }}
              >
                Revisar solicitudes
              </Text>
            </View>

            {/* AGREGAR INSTITUCIÓN */}

            <View
              style={{
                width: anchoAccion,

                flexGrow: esEscritorio || esTablet ? 1 : 0,

                minHeight: esEscritorio ? 56 : 54,

                paddingHorizontal: esEscritorio ? 18 : 16,

                paddingVertical: 13,

                borderRadius: 14,

                flexDirection: "row",

                alignItems: "center",

                backgroundColor: secondarySoftColor,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,

                  flexShrink: 0,

                  borderRadius: 10,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={19}
                  color={secondaryColor}
                />
              </View>

              <Text
                style={{
                  flex: 1,

                  marginLeft: 10,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: secondaryColor,
                }}
              >
                Agregar institución
              </Text>
            </View>

            {/* CREAR CUESTIONARIO */}

            <View
              style={{
                width: anchoAccion,

                flexGrow: esEscritorio || esTablet ? 1 : 0,

                minHeight: esEscritorio ? 56 : 54,

                paddingHorizontal: esEscritorio ? 18 : 16,

                paddingVertical: 13,

                borderRadius: 14,

                flexDirection: "row",

                alignItems: "center",

                backgroundColor: accentSoftColor,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,

                  flexShrink: 0,

                  borderRadius: 10,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={19}
                  color={accentColor}
                />
              </View>

              <Text
                style={{
                  flex: 1,

                  marginLeft: 10,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: accentColor,
                }}
              >
                Crear cuestionario
              </Text>
            </View>
          </View>
        </View>

        {/* ==================================================
            KPIS
        ================================================== */}

        <View
          style={{
            width: "100%",

            marginTop: esEscritorio ? 24 : 18,

            flexDirection: "row",

            flexWrap: "wrap",

            gap: gapPrincipal,
          }}
        >
          {/* ==================================================
              SOLICITUDES
          ================================================== */}

          <View
            style={{
              width: anchoKpi,

              flexGrow: esEscritorio || esTablet ? 1 : 0,

              minHeight: esEscritorio ? 154 : 142,

              padding: paddingTarjeta,

              borderRadius: 18,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 12,

                  color: textSecondaryColor,
                }}
              >
                SOLICITUDES
              </Text>

              <View
                style={{
                  width: 38,
                  height: 38,

                  borderRadius: 11,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Ionicons name="mail-outline" size={19} color={primaryColor} />
              </View>
            </View>

            <Text
              style={{
                marginTop: esEscritorio ? 20 : 16,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 31 : 28,

                color: textColor,
              }}
            >
              {cargandoEstadisticas ? "—" : estadisticas.solicitudesPendientes}
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Requieren validación
            </Text>
          </View>

          {/* ==================================================
              INSTITUCIONES
          ================================================== */}

          <View
            style={{
              width: anchoKpi,

              flexGrow: esEscritorio || esTablet ? 1 : 0,

              minHeight: esEscritorio ? 154 : 142,

              padding: paddingTarjeta,

              borderRadius: 18,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 12,

                  color: textSecondaryColor,
                }}
              >
                INST. ACTIVAS
              </Text>

              <View
                style={{
                  width: 38,
                  height: 38,

                  borderRadius: 11,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: secondarySoftColor,
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={19}
                  color={secondaryColor}
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: esEscritorio ? 20 : 16,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 31 : 28,

                color: textColor,
              }}
            >
              {cargandoEstadisticas ? "—" : estadisticas.institucionesActivas}
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Instituciones activas
            </Text>
          </View>

          {/* ==================================================
              USUARIOS
          ================================================== */}

          <View
            style={{
              width: anchoKpi,

              flexGrow: esEscritorio || esTablet ? 1 : 0,

              minHeight: esEscritorio ? 154 : 142,

              padding: paddingTarjeta,

              borderRadius: 18,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 12,

                  color: textSecondaryColor,
                }}
              >
                USUARIOS
              </Text>

              <View
                style={{
                  width: 38,
                  height: 38,

                  borderRadius: 11,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={19}
                  color={primaryColor}
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: esEscritorio ? 20 : 16,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 31 : 28,

                color: textColor,
              }}
            >
              {cargandoEstadisticas
                ? "—"
                : estadisticas.usuariosRegistrados.toLocaleString("es-NI")}
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Usuarios registrados
            </Text>
          </View>

          {/* ==================================================
              CUESTIONARIOS
          ================================================== */}

          <View
            style={{
              width: anchoKpi,

              flexGrow: esEscritorio || esTablet ? 1 : 0,

              minHeight: esEscritorio ? 154 : 142,

              padding: paddingTarjeta,

              borderRadius: 18,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 12,

                  color: textSecondaryColor,
                }}
              >
                CUESTIONARIOS
              </Text>

              <View
                style={{
                  width: 38,
                  height: 38,

                  borderRadius: 11,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: secondarySoftColor,
                }}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={19}
                  color={secondaryColor}
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: esEscritorio ? 20 : 16,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 31 : 28,

                color: textColor,
              }}
            >
              {cargandoEstadisticas ? "—" : estadisticas.cuestionariosActivos}
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: 12,

                color: textMutedColor,
              }}
            >
              Cuestionarios activos
            </Text>
          </View>
        </View>

        {/* ==================================================
            ÁREA DE GRÁFICOS
        ================================================== */}

        <View
          style={{
            width: "100%",

            marginTop: esEscritorio ? 24 : 18,

            minHeight: esEscritorio ? 330 : esTablet ? 300 : 260,

            padding: esEscritorio ? 24 : esTablet ? 20 : 16,

            borderRadius: esEscritorio ? 22 : 18,

            borderWidth: 1,

            borderColor,

            backgroundColor: surfaceColor,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 20 : 18,

              color: textColor,
            }}
          >
            Crecimiento y adopción de la comunidad
          </Text>

          <Text
            style={{
              marginTop: 5,

              maxWidth: esEscritorio ? 700 : undefined,

              fontFamily: "Nunito-Medium",

              fontSize: 13,

              lineHeight: 19,

              color: textSecondaryColor,
            }}
          >
            Esta sección será reemplazada posteriormente por los gráficos reales
            del dashboard.
          </Text>

          <View
            style={{
              flex: 1,

              minHeight: esEscritorio ? 230 : esTablet ? 210 : 180,

              marginTop: esEscritorio ? 22 : 18,

              borderRadius: 16,

              alignItems: "center",

              justifyContent: "center",

              paddingHorizontal: 20,

              backgroundColor: surfaceSecondaryColor,
            }}
          >
            <View
              style={{
                width: esEscritorio ? 64 : 56,

                height: esEscritorio ? 64 : 56,

                borderRadius: esEscritorio ? 20 : 17,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="analytics-outline"
                size={esEscritorio ? 32 : 28}
                color={primaryColor}
              />
            </View>

            <Text
              style={{
                marginTop: 12,

                fontFamily: "Nunito-SemiBold",

                fontSize: 14,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
              Área reservada para gráficas
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
