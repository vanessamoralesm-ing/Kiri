import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useAuth } from "@/services/authProvider";
import { obtenerHistorialDiario } from "@/services/diario/autorregistro.service";

import { EntradaDiarioResumen } from "@/types/diario";

export default function DiarioScreen() {
  const { user, profile } = useAuth();

  const { width } = useWindowDimensions();

  const [cargando, setCargando] = useState(true);

  const [entradas, setEntradas] = useState<EntradaDiarioResumen[]>([]);

  const [anchoGrid, setAnchoGrid] = useState(0);

  // ========================================================
  // TEMA
  // ======================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ======================================================
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

  const numeroColumnas = esTelefono ? 1 : 2;

  const gapEntradas = esEscritorio ? 18 : 16;

  const anchoTarjeta =
    anchoGrid > 0
      ? Math.max(
        0,
        (anchoGrid - gapEntradas * (numeroColumnas - 1)) / numeroColumnas,
      )
      : undefined;

  // Espacio para la barra inferior del layout compartido.
  const paddingBottom = esEscritorio ? 64 : esTablet ? 100 : 116;

  // ========================================================
  // NOMBRE DEL USUARIO
  // ======================================================

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

  // ======================================================
  // CARGAR DATOS
  // ======================================================

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

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos]),
  );

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

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

  // ======================================================
  // FORMATEAR FECHA
  // ======================================================

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

    setAnchoGrid((anchoAnterior) =>
      Math.abs(nuevoAncho - anchoAnterior) > 1 ? nuevoAncho : anchoAnterior,
    );
  };

  // ========================================================
  // UI
  // ======================================================

  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: esEscritorio ? 28 : 20,
          paddingBottom,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthContenido,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          {/* ==============================================
              BIENVENIDA / NUEVO REGISTRO
          ============================================== */}

          <View
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <TarjetaBienvenidaDiario
              nombre={nombreUsuario}
              onNuevoRegistro={irANuevoRegistro}
            />
          </View>

          {/* ==============================================
              RESUMEN DEL DIARIO
          ============================================== */}

          <View
            style={{
              width: "100%",
              minWidth: 0,
              marginTop: esEscritorio ? 24 : 20,
            }}
          >
            <ResumenDiario
              diasRacha={entradas.length > 0 ? 1 : 0}
              totalEntradas={entradas.length}
            />
          </View>

          {/* ==============================================
              ENTRADAS RECIENTES
          ============================================== */}

          <View
            style={{
              width: "100%",
              marginTop: esEscritorio ? 38 : esTablet ? 34 : 30,
              marginBottom: esTelefono ? 18 : 20,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: esEscritorio ? 23 : esTelefono ? 19 : 21,
                    lineHeight: esEscritorio ? 30 : 26,
                    color: textColor,
                  }}
                >
                  Entradas recientes
                </Text>
              </View>

              <Pressable
                onPress={verTodasLasEntradas}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Ver todas las entradas"
                style={({ pressed }) => ({
                  flexShrink: 0,
                  borderRadius: 12,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    minHeight: 40,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: primarySoftColor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Nunito-SemiBold",
                      fontSize: esTelefono ? 12 : 13,
                      lineHeight: 18,
                      color: primaryColor,
                    }}
                  >
                    Ver todas
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={primaryColor}
                    style={{
                      marginLeft: 5,
                    }}
                  />
                </View>
              </Pressable>
            </View>

            <Text
              style={{
                marginTop: 6,
                fontFamily: "Nunito-Medium",
                fontSize: esTelefono ? 13 : 14,
                lineHeight: 20,
                color: textMutedColor,
              }}
            >
              Tus últimos momentos registrados
            </Text>
          </View>

          {/* ==============================================
              CONTENIDO
          ============================================== */}

          {cargando ? (
            // ==================================================
            // CARGANDO
            // ==================================================

            <View
              style={{
                width: "100%",
                minHeight: 160,
                padding: 28,
                borderRadius: 22,
                borderWidth: 1,
                borderColor,
                backgroundColor: surfaceColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color={primaryColor} />

              <Text
                style={{
                  marginTop: 14,
                  fontFamily: "Nunito-Medium",
                  fontSize: 14,
                  lineHeight: 20,
                  color: textMutedColor,
                  textAlign: "center",
                }}
              >
                Cargando tus entradas...
              </Text>
            </View>
          ) : entradas.length === 0 ? (
            // ==================================================
            // ESTADO VACÍO
            // ==================================================

            <View
              style={{
                width: "100%",
                maxWidth: esEscritorio ? 640 : undefined,
                alignSelf: "center",

                paddingHorizontal: esTelefono ? 20 : 30,
                paddingTop: esTelefono ? 24 : 32,
                paddingBottom: esTelefono ? 26 : 34,

                borderRadius: 24,
                borderWidth: 1,
                borderColor,
                backgroundColor: surfaceColor,

                alignItems: "center",
              }}
            >
              {/* ICONO */}

              <View
                style={{
                  width: esTelefono ? 64 : 72,
                  height: esTelefono ? 64 : 72,
                  borderRadius: 20,

                  backgroundColor: primarySoftColor,

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="book-outline"
                  size={esTelefono ? 30 : 34}
                  color={primaryColor}
                />
              </View>

              {/* MENSAJES */}

              <View
                style={{
                  width: "100%",
                  marginTop: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: "100%",

                    fontFamily: "Nunito-Bold",
                    fontSize: esTelefono ? 16 : 18,
                    lineHeight: esTelefono ? 23 : 25,

                    textAlign: "center",
                    color: textColor,
                  }}
                >
                  Aún no has registrado ninguna entrada.
                </Text>

                <Text
                  style={{
                    width: "100%",
                    marginTop: 8,

                    fontFamily: "Nunito-Medium",
                    fontSize: esTelefono ? 13 : 14,
                    lineHeight: 20,

                    textAlign: "center",
                    color: textSecondaryColor,
                  }}
                >
                  Tu próximo registro aparecerá aquí.
                </Text>
              </View>

              {/* ==========================================
                  BOTÓN CREAR PRIMER REGISTRO

                  El texto se centra respecto al ancho
                  TOTAL del botón. El icono no participa
                  en la distribución del texto.
              ========================================== */}

              <View
                style={{
                  width: "100%",
                  marginTop: esTelefono ? 28 : 32,
                  alignItems: "center",
                }}
              >
                <Pressable
                  onPress={irANuevoRegistro}
                  accessibilityRole="button"
                  accessibilityLabel="Crear primer registro"
                  style={({ pressed }) => ({
                    width: "100%",
                    maxWidth: 320,

                    borderRadius: 14,
                    overflow: "hidden",

                    opacity: pressed ? 0.82 : 1,
                  })}
                >
                  <View
                    style={{
                      width: "100%",
                      minHeight: 54,

                      paddingHorizontal: 16,
                      paddingVertical: 12,

                      borderRadius: 14,

                      backgroundColor: primaryColor,

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",

                      position: "relative",
                    }}
                  >
                    {/* TEXTO CENTRADO */}

                    <Text
                      numberOfLines={2}
                      style={{
                        width: "100%",

                        // Deja espacio para el icono
                        // sin desplazar el centro del texto.
                        paddingHorizontal: 24,

                        fontFamily: "Nunito-Bold",
                        fontSize: 14,
                        lineHeight: 20,

                        textAlign: "center",
                        color: textOnPrimaryColor,
                      }}
                    >
                      Crear primer registro
                    </Text>

                    {/* ICONO INDEPENDIENTE */}

                    <View
                      style={{
                        position: "absolute",

                        left: 16,
                        top: 0,
                        bottom: 0,

                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="add"
                        size={24}
                        color={textOnPrimaryColor}
                      />
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            // ==================================================
            // ENTRADAS RECIENTES
            // ==================================================

            <View
              onLayout={medirGrid}
              style={{
                width: "100%",
                minWidth: 0,

                flexDirection: numeroColumnas > 1 ? "row" : "column",

                flexWrap: numeroColumnas > 1 ? "wrap" : "nowrap",

                alignItems: "stretch",

                gap: gapEntradas,
              }}
            >
              {entradas.map((item) => (
                <View
                  key={item.id_registro}
                  style={{
                    width:
                      numeroColumnas === 1 ? "100%" : (anchoTarjeta ?? "100%"),
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
