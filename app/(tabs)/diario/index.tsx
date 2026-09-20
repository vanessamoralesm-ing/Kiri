import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import { obtenerHistorialDiario } from "@/services/diario/autorregistro.service";

import { EntradaDiarioResumen } from "@/types/diario";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function DiarioScreen() {
  const { user, profile } = useAuth();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [cargando, setCargando] = useState(true);

  const [entradas, setEntradas] = useState<EntradaDiarioResumen[]>([]);

  /*
   * Guardamos el ancho REAL del grid.
   *
   * Esto evita calcular el ancho de las tarjetas usando
   * todo el ancho de la ventana, ya que en desktop también
   * existe una sidebar.
   */
  const [anchoGrid, setAnchoGrid] = useState(0);

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  /*
   * Teléfono   → 1 columna
   * Tablet     → 2 columnas
   * Escritorio → 2 columnas
   *
   * Como solo mostramos cinco entradas recientes,
   * dos columnas mantienen las tarjetas legibles.
   */
  const numeroColumnas = esTelefono ? 1 : 2;

  const gapEntradas = esEscritorio ? 18 : 16;

  const anchoTarjeta =
    anchoGrid > 0
      ? (anchoGrid - gapEntradas * (numeroColumnas - 1)) / numeroColumnas
      : undefined;

  const paddingBottom = esEscritorio ? 64 : 150;

  // ========================================================
  // NOMBRE DEL USUARIO
  // ========================================================

  const nombreUsuario = useMemo(() => {
    const nombrePreferidoPerfil =
      typeof profile?.nombre_preferido === "string"
        ? profile.nombre_preferido.trim()
        : "";

    const nombresPerfil =
      typeof profile?.nombres === "string" ? profile.nombres.trim() : "";

    const nombrePreferidoAuth =
      typeof user?.user_metadata?.nombre_preferido === "string"
        ? user.user_metadata.nombre_preferido.trim()
        : "";

    const nombresAuth =
      typeof user?.user_metadata?.nombres === "string"
        ? user.user_metadata.nombres.trim()
        : "";

    return (
      nombrePreferidoPerfil ||
      nombresPerfil ||
      nombrePreferidoAuth ||
      nombresAuth ||
      "Usuario"
    );
  }, [
    profile?.nombre_preferido,
    profile?.nombres,
    user?.user_metadata?.nombre_preferido,
    user?.user_metadata?.nombres,
  ]);

  // ========================================================
  // CARGAR DATOS
  // ========================================================

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);

      const datos = await obtenerHistorialDiario(5);

      setEntradas(datos);
    } catch (error) {
      console.error("Error al cargar las entradas del diario:", error);

      setEntradas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  // ========================================================
  // ACTUALIZAR AL TOMAR FOCO
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos]),
  );

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const irANuevoRegistro = () => {
    router.push({
      pathname: "/diario/nuevo" as never,

      params: {
        origen: "diario",
      },
    });
  };

  const verTodasLasEntradas = () => {
    router.push("/diario/historial" as never);
  };

  const abrirEntrada = (id: string) => {
    router.push(`/diario/${id}` as never);
  };

  // ========================================================
  // FORMATEAR FECHA
  // ========================================================

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);

    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",

      month: "short",

      hour: "2-digit",

      minute: "2-digit",
    });
  };

  // ========================================================
  // MEDIR GRID
  // ========================================================

  const medirGrid = (event: LayoutChangeEvent) => {
    const nuevoAncho = event.nativeEvent.layout.width;

    /*
     * Evitamos renders innecesarios por diferencias
     * mínimas de dimensiones.
     */
    if (Math.abs(nuevoAncho - anchoGrid) > 1) {
      setAnchoGrid(nuevoAncho);
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        flex: 1,

        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: esEscritorio ? 28 : 20,

          paddingBottom,
        }}
      >
        {/* ==================================================
            CONTENEDOR PRINCIPAL
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* ==================================================
              BIENVENIDA
          ================================================== */}

          <TarjetaBienvenidaDiario
            nombre={nombreUsuario}
            onNuevoRegistro={irANuevoRegistro}
          />

          {/* ==================================================
              RESUMEN
          ================================================== */}

          <ResumenDiario
            diasRacha={entradas.length > 0 ? 1 : 0}
            totalEntradas={entradas.length}
          />

          {/* ==================================================
              ENTRADAS RECIENTES
          ================================================== */}

          <View
            style={{
              marginTop: esEscritorio ? 36 : 30,

              marginBottom: 18,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,

                paddingRight: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 21 : 20,

                  color: textColor,
                }}
              >
                Entradas recientes
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

                  color: textMutedColor,
                }}
              >
                Tus últimos momentos registrados
              </Text>
            </View>

            <Pressable
              onPress={verTodasLasEntradas}
              hitSlop={8}
              style={({ pressed }) => ({
                minHeight: 40,

                paddingHorizontal: 10,

                paddingVertical: 8,

                borderRadius: 12,

                flexDirection: "row",

                alignItems: "center",

                backgroundColor: pressed ? primarySoftColor : "transparent",
              })}
            >
              <Text
                style={{
                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: primaryColor,
                }}
              >
                Ver todas
              </Text>

              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </Pressable>
          </View>

          {/* ==================================================
              CARGANDO
          ================================================== */}

          {cargando ? (
            <View
              style={{
                width: "100%",

                minHeight: 180,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color={primaryColor} />

              <Text
                style={{
                  marginTop: 12,

                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  color: textMutedColor,
                }}
              >
                Cargando tus entradas...
              </Text>
            </View>
          ) : entradas.length === 0 ? (
            // ==========================================
            // SIN REGISTROS
            // ==========================================

            <View
              style={{
                width: "100%",

                minHeight: esEscritorio ? 220 : undefined,

                padding: esEscritorio ? 32 : 24,

                borderRadius: 22,

                borderWidth: 1,

                borderColor,

                backgroundColor: surfaceColor,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 60,

                  height: 60,

                  borderRadius: 30,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Ionicons name="book-outline" size={28} color={primaryColor} />
              </View>

              <Text
                style={{
                  marginTop: 14,

                  textAlign: "center",

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 15,

                  color: textSecondaryColor,
                }}
              >
                Aún no has registrado ninguna entrada.
              </Text>

              <Text
                style={{
                  marginTop: 5,

                  textAlign: "center",

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

                  color: textMutedColor,
                }}
              >
                Tu próximo registro aparecerá aquí.
              </Text>

              <Pressable
                onPress={irANuevoRegistro}
                style={({ pressed }) => ({
                  marginTop: 20,

                  paddingHorizontal: 18,

                  minHeight: 42,

                  borderRadius: 12,

                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "center",

                  gap: 7,

                  backgroundColor: primaryColor,

                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Ionicons name="add" size={19} color="#FFFFFF" />

                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",

                    fontSize: 13,

                    color: "#FFFFFF",
                  }}
                >
                  Crear primer registro
                </Text>
              </Pressable>
            </View>
          ) : (
            // ==========================================
            // REGISTROS
            // ==========================================

            <View
              onLayout={medirGrid}
              style={{
                width: "100%",

                flexDirection: numeroColumnas > 1 ? "row" : "column",

                flexWrap: numeroColumnas > 1 ? "wrap" : "nowrap",

                gap: gapEntradas,

                alignItems: "stretch",
              }}
            >
              {entradas.map((item) => (
                <View
                  key={item.id_registro}
                  style={{
                    width: numeroColumnas === 1 ? "100%" : anchoTarjeta,

                    minWidth: 0,
                  }}
                >
                  <TarjetaEntradaDiario
                    fecha={formatearFecha(item.fecha_inicio)}
                    titulo={item.plantilla_nombre}
                    contenido={item.respuesta_corta}
                    emociones={item.emociones}
                    onPress={() => abrirEntrada(item.id_registro)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
