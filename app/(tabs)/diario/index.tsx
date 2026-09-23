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

import { useAuth } from "@/services/authProvider";
import { obtenerHistorialDiario } from "@/services/diario/autorregistro.service";

import { EntradaDiarioResumen } from "@/types/diario";

import { useThemeColor } from "@/hooks/use-theme-color";

export default function DiarioScreen() {
  const { user, profile } = useAuth();

  const { width } = useWindowDimensions();

  const [cargando, setCargando] = useState(true);

  const [entradas, setEntradas] = useState<EntradaDiarioResumen[]>([]);

  // ======================================================
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
  // ======================================================

  const esTablet = width >= 768;

  const esWebGrande = width >= 1100;

  // ======================================================
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

  // ======================================================
  // ACTUALIZAR AL TOMAR FOCO
  // ======================================================

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

  // ======================================================
  // UI
  // ======================================================

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
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* ==================================================
                    CONTENEDOR PRINCIPAL
                ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: esWebGrande ? 1080 : 960,

            alignSelf: "center",

            paddingHorizontal: esTablet ? 28 : 20,

            paddingTop: 24,

            paddingBottom: 20,
          }}
        >
          {/* ==================================================
                        BIENVENIDA
                    ================================================== */}

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

          {/* ==================================================
                        RESUMEN
                    ================================================== */}

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

          {/* ==================================================
                        ENCABEZADO ENTRADAS RECIENTES
                    ================================================== */}

          <View
            style={{
              marginTop: 32,

              marginBottom: 20,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "space-between",
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
                  fontFamily: "Nunito-Bold",

                  fontSize: 20,

                  color: textColor,
                }}
              >
                Entradas Recientes
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

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

            <Pressable
              onPress={verTodasLasEntradas}
              hitSlop={8}
              style={({ pressed }) => ({
                paddingHorizontal: 8,

                paddingVertical: 8,

                borderRadius: 12,

                flexDirection: "row",

                alignItems: "center",

                backgroundColor: pressed ? primarySoftColor : "transparent",
              })}
            >
              Tus últimos momentos registrados
            </Text>
          </View>

          {/* ==================================================
                        CARGANDO
                    ================================================== */}

          {cargando ? (
            // ==================================================
            // CARGANDO
            // ==================================================

            <View
              style={{
                paddingVertical: 32,

                alignItems: "center",
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
            // SIN REGISTROS
            // ==================================================

            <View
              style={{
                padding: 24,

                borderRadius: 22,

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
                  width: 58,

                  height: 58,

                  borderRadius: 29,

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

              <Text
                style={{
                  marginTop: 12,

                  textAlign: "center",

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 14,

                  color: textSecondaryColor,
                }}
              >
                Aún no has registrado ninguna entrada.
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  textAlign: "center",

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  color: textMutedColor,
                }}
              >
                Tu próximo registro aparecerá aquí.
              </Text>
            </View>
          ) : (
            // ==================================================
            // REGISTROS
            // ==================================================

            <View
              style={
                esTablet
                  ? {
                      flexDirection: "row",

                      flexWrap: "wrap",

                      gap: 16,
                    }
                  : undefined
              }
            >
              {entradas.map((item) => (
                <View
                  key={item.id_registro}
                  style={
                    esTablet
                      ? {
                          width: esWebGrande
                            ? ("calc(50% - 8px)" as never)
                            : "48.5%",
                        }
                      : {
                          width: "100%",

                          marginBottom: 18,
                        }
                  }
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
