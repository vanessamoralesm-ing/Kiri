import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

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
        }}
        showsVerticalScrollIndicator={false}
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
                flex: 1,

                paddingRight: 12,
              }}
            >
              <Text
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
                paddingHorizontal: 8,

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
                paddingVertical: 32,

                alignItems: "center",
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
            // ==================================================
            // SIN REGISTROS
            // ==================================================

            <View
              style={{
                padding: 24,

                borderRadius: 22,

                borderWidth: 1,

                borderColor,

                backgroundColor: surfaceColor,

                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 58,

                  height: 58,

                  borderRadius: 29,

                  alignItems: "center",

                  justifyContent: "center",

                  backgroundColor: primarySoftColor,
                }}
              >
                <Ionicons name="book-outline" size={28} color={primaryColor} />
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
