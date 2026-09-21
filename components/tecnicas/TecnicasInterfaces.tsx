import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CANTIDAD_GROUNDING,
  INFO_TECNICAS,
  obtenerDetallePaso,
  obtenerTipoTecnica,
  REPETICIONES_JACOBSON,
} from "@/constants/tecnicas";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import type {
  PasoTecnica,
  RegistroTecnica,
  TecnicaComplementaria,
} from "@/types/tecnicas";

// ============================================================
// CONFIGURACIÓN VISUAL
// ============================================================

const NECESIDADES = [
  {
    nombre: "Respirar",
    icono: "leaf-outline" as const,
    color: "secondary" as const,
    fondo: "secondarySoft" as const,
  },
  {
    nombre: "Relajarme",
    icono: "body-outline" as const,
    color: "accent" as const,
    fondo: "accentSoft" as const,
  },
  {
    nombre: "Calmar la ansiedad",
    icono: "heart-outline" as const,
    color: "primary" as const,
    fondo: "primarySoft" as const,
  },
];

// ============================================================
// HOOK DE COLORES
// ============================================================

function useTecnicasColors() {
  const { isDarkMode } = useThemeMode();

  return isDarkMode ? Colors.dark : Colors.light;
}

// ============================================================
// ESTADO DE CARGA / ERROR
// ============================================================

function Estado({
  cargando,
  error,
  reintentar,
}: {
  cargando: boolean;
  error?: string | null;
  reintentar?: () => void;
}) {
  const colors = useTecnicasColors();

  if (cargando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!error) return null;

  return (
    <View style={styles.estado}>
      <Text style={[styles.error, { color: colors.textSecondary }]}>
        {error}
      </Text>

      {reintentar && (
        <Pressable onPress={reintentar}>
          <Text style={[styles.reintentar, { color: colors.primary }]}>
            Intentar nuevamente
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ============================================================
// TÍTULO DE SECCIÓN
// ============================================================

function TituloSeccion({ children }: { children: React.ReactNode }) {
  const colors = useTecnicasColors();

  return (
    <Text style={[styles.subtituloDetalle, { color: colors.text }]}>
      {children}
    </Text>
  );
}

// ============================================================
// PANTALLA PRINCIPAL
// ============================================================

export function TecnicasInicioInterface({
  tecnicas,
  cargando,
  error,
  onReintentar,
  onAbrir,
  onHistorial,
}: {
  tecnicas: TecnicaComplementaria[];
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  onAbrir: (id: string) => void;
  onHistorial: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useTecnicasColors();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const [busqueda, setBusqueda] = useState("");
  const [anchoGridTecnicas, setAnchoGridTecnicas] = useState(0);

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

  const maxWidthCabecera = esEscritorio ? 820 : undefined;
  const maxWidthBuscador = esEscritorio ? 760 : undefined;

  const numeroColumnasTecnicas = esEscritorio ? 2 : 1;
  const gapTecnicas = esEscritorio ? 18 : 14;

  const anchoTarjetaTecnica =
    anchoGridTecnicas > 0 && numeroColumnasTecnicas > 1
      ? (anchoGridTecnicas - gapTecnicas * (numeroColumnasTecnicas - 1)) /
      numeroColumnasTecnicas
      : undefined;

  const paddingTop = esEscritorio ? 30 : esTablet ? 26 : 22;

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 118, 145);

  // ========================================================
  // FILTRADO
  // ========================================================

  const tecnicasFiltradas = useMemo(() => {
    const valor = busqueda.trim().toLowerCase();

    if (!valor) return tecnicas;

    return tecnicas.filter((tecnica) =>
      `${tecnica.nombre} ${tecnica.descripcion} ${tecnica.objetivo}`
        .toLowerCase()
        .includes(valor),
    );
  }, [tecnicas, busqueda]);

  // ========================================================
  // MEDIR GRID
  // ========================================================

  function medirGridTecnicas(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    if (Math.abs(nuevoAncho - anchoGridTecnicas) > 1) {
      setAnchoGridTecnicas(nuevoAncho);
    }
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop,
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
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthCabecera,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: esEscritorio ? 32 : esTablet ? 28 : 24,
                lineHeight: esEscritorio ? 40 : 32,
                color: colors.primary,
              }}
            >
              Técnicas Complementarias
            </Text>

            <Text
              style={{
                marginTop: 8,
                maxWidth: esEscritorio ? 720 : undefined,
                fontFamily: "Nunito-Medium",
                fontSize: esEscritorio ? 15 : 13,
                lineHeight: esEscritorio ? 22 : 19,
                color: colors.textSecondary,
              }}
            >
              Explora técnicas basadas en evidencia para ayudarte a comprender,
              regular y afrontar tus emociones de manera saludable.
            </Text>
          </View>

          {/* ==================================================
              BUSCADOR
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthBuscador,
              minHeight: 56,
              marginTop: esEscritorio ? 26 : 20,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 11,
              borderWidth: 1,
              borderRadius: 17,
              borderColor: colors.inputBorder,
              backgroundColor: colors.inputBackground,
              ...Platform.select({
                web: {
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                },
                ios: {
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 5,
                },
                android: {
                  elevation: 2,
                },
              }),
            }}
          >
            <Ionicons name="search-outline" size={23} color={colors.icon} />

            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar técnica"
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.primary}
              style={{
                flex: 1,
                paddingVertical: 15,
                fontFamily: "Nunito-Medium",
                fontSize: 15,
                color: colors.text,
                outlineStyle: "none" as any,
              }}
            />

            {!!busqueda && (
              <Pressable hitSlop={8} onPress={() => setBusqueda("")}>
                <Ionicons name="close-circle" size={22} color={colors.icon} />
              </Pressable>
            )}
          </View>

          {/* ==================================================
              NECESIDADES
          ================================================== */}

          <View
            style={{
              marginTop: esEscritorio ? 32 : 26,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: esEscritorio ? 22 : 18,
                color: colors.text,
              }}
            >
              ¿Qué necesitas en este momento?
            </Text>

            {!esTelefono && (
              <Text
                style={{
                  marginTop: 3,
                  fontFamily: "Nunito-Medium",
                  fontSize: 13,
                  color: colors.textMuted,
                }}
              >
                Elige una opción para encontrar una práctica que pueda ayudarte.
              </Text>
            )}
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: esTelefono ? "wrap" : "nowrap",
              gap: esEscritorio ? 16 : 10,
            }}
          >
            {NECESIDADES.map((item, index) => {
              const tecnica = tecnicas.length
                ? tecnicas[index % tecnicas.length]
                : undefined;

              return (
                <Pressable
                  key={item.nombre}
                  onPress={() => tecnica && onAbrir(tecnica.id_tecnica)}
                  style={({ pressed }) => ({
                    flex: esTelefono ? undefined : 1,
                    width: esTelefono ? "100%" : undefined,
                    minHeight: esEscritorio ? 150 : esTablet ? 140 : 108,
                    padding: esEscritorio ? 18 : 14,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: pressed ? colors[item.color] : colors.border,
                    flexDirection: esTelefono ? "row" : "column",
                    alignItems: esTelefono ? "center" : "flex-start",
                    justifyContent: esTelefono ? "flex-start" : "space-between",
                    backgroundColor: colors[item.fondo],
                    opacity: pressed ? 0.82 : 1,
                    ...Platform.select({
                      web: {
                        cursor: "pointer",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.035)",
                      },
                      ios: {
                        shadowColor: "#000000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.04,
                        shadowRadius: 5,
                      },
                      android: {
                        elevation: 1,
                      },
                    }),
                  })}
                >
                  <View
                    style={{
                      width: esEscritorio ? 62 : 54,
                      height: esEscritorio ? 62 : 54,
                      flexShrink: 0,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.surface,
                    }}
                  >
                    <Ionicons
                      name={item.icono}
                      size={esEscritorio ? 31 : 27}
                      color={colors[item.color]}
                    />
                  </View>

                  <View
                    style={{
                      flex: esTelefono ? 1 : undefined,
                      marginLeft: esTelefono ? 14 : 0,
                      marginTop: esTelefono ? 0 : 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: esEscritorio ? 16 : 14,
                        lineHeight: 20,
                        color: colors.text,
                      }}
                    >
                      {item.nombre}
                    </Text>

                    {esEscritorio && (
                      <Text
                        style={{
                          marginTop: 3,
                          fontFamily: "Nunito-Medium",
                          fontSize: 12,
                          color: colors.textSecondary,
                        }}
                      >
                        Comenzar práctica
                      </Text>
                    )}
                  </View>

                  {esTelefono && (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors[item.color]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ==================================================
              TÉCNICAS RECOMENDADAS
          ================================================== */}

          <View
            style={{
              marginTop: esEscritorio ? 36 : 30,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                minWidth: 0,
                paddingRight: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: esEscritorio ? 22 : 18,
                  color: colors.text,
                }}
              >
                Técnicas recomendadas para ti
              </Text>

              {!esTelefono && (
                <Text
                  style={{
                    marginTop: 3,
                    fontFamily: "Nunito-Medium",
                    fontSize: 13,
                    color: colors.textMuted,
                  }}
                >
                  Prácticas breves para apoyar tu bienestar emocional.
                </Text>
              )}
            </View>

            <Pressable
              onPress={onHistorial}
              hitSlop={8}
              style={({ pressed }) => ({
                minHeight: 40,
                paddingHorizontal: esEscritorio ? 12 : 8,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: pressed ? colors.primarySoft : "transparent",
              })}
            >
              <Ionicons name="time-outline" size={22} color={colors.primary} />

              {!esTelefono && (
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 13,
                    color: colors.primary,
                  }}
                >
                  Historial
                </Text>
              )}
            </Pressable>
          </View>

          {/* ==================================================
              CARGA / ERROR
          ================================================== */}

          <Estado cargando={cargando} error={error} reintentar={onReintentar} />

          {/* ==================================================
              GRID DE TÉCNICAS
          ================================================== */}

          {!cargando && !error && tecnicasFiltradas.length > 0 && (
            <View
              onLayout={medirGridTecnicas}
              style={{
                width: "100%",
                flexDirection: numeroColumnasTecnicas > 1 ? "row" : "column",
                flexWrap: numeroColumnasTecnicas > 1 ? "wrap" : "nowrap",
                gap: gapTecnicas,
                alignItems: "stretch",
              }}
            >
              {tecnicasFiltradas.map((tecnica) => {
                const tipo = obtenerTipoTecnica(tecnica.nombre);
                const esJacobson = tipo === "jacobson";

                const color = esJacobson ? colors.accent : colors.primary;
                const fondo = esJacobson
                  ? colors.accentSoft
                  : colors.primarySoft;

                return (
                  <View
                    key={tecnica.id_tecnica}
                    style={{
                      width:
                        numeroColumnasTecnicas === 1
                          ? "100%"
                          : anchoTarjetaTecnica,
                      minWidth: 0,
                    }}
                  >
                    <Pressable
                      onPress={() => onAbrir(tecnica.id_tecnica)}
                      style={({ pressed }) => ({
                        width: "100%",
                        minHeight: esEscritorio ? 150 : 118,
                        padding: esEscritorio ? 18 : 16,
                        borderWidth: 1,
                        borderRadius: 21,
                        borderColor: pressed ? color : colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 14,
                        backgroundColor: colors.surface,
                        opacity: pressed ? 0.85 : 1,
                        ...Platform.select({
                          web: {
                            cursor: "pointer",
                            boxShadow: pressed
                              ? "0px 4px 12px rgba(0,0,0,0.08)"
                              : "0px 2px 8px rgba(0,0,0,0.035)",
                          },
                          ios: {
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.04,
                            shadowRadius: 5,
                          },
                          android: {
                            elevation: 1,
                          },
                        }),
                      })}
                    >
                      <View
                        style={{
                          width: esEscritorio ? 72 : 64,
                          height: esEscritorio ? 72 : 64,
                          flexShrink: 0,
                          borderRadius: 21,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: fondo,
                        }}
                      >
                        <Ionicons
                          name={esJacobson ? "body-outline" : "eye-outline"}
                          size={esEscritorio ? 34 : 30}
                          color={color}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: esEscritorio ? 17 : 16,
                            lineHeight: 22,
                            color: colors.text,
                          }}
                        >
                          {tecnica.nombre}
                        </Text>

                        <Text
                          numberOfLines={esEscritorio ? 3 : 2}
                          style={{
                            marginTop: 4,
                            fontFamily: "Nunito-Medium",
                            fontSize: 13,
                            lineHeight: 18,
                            color: colors.textSecondary,
                          }}
                        >
                          {tecnica.descripcion}
                        </Text>

                        <View
                          style={{
                            marginTop: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={color}
                          />

                          <Text
                            style={{
                              fontFamily: "Nunito-SemiBold",
                              fontSize: 12,
                              color,
                            }}
                          >
                            {tecnica.duracion_estimada ?? "—"} min
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: 32,
                          height: 32,
                          flexShrink: 0,
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: fondo,
                        }}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={color}
                        />
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          {/* ==================================================
              SIN RESULTADOS
          ================================================== */}

          {!cargando && !error && tecnicasFiltradas.length === 0 && (
            <View
              style={{
                width: "100%",
                minHeight: 220,
                borderWidth: 1,
                borderRadius: 22,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primarySoft,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={28}
                  color={colors.primary}
                />
              </View>

              <Text
                style={{
                  marginTop: 14,
                  fontFamily: "Nunito-Bold",
                  fontSize: 16,
                  textAlign: "center",
                  color: colors.text,
                }}
              >
                No encontramos técnicas
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  maxWidth: 420,
                  fontFamily: "Nunito-Medium",
                  fontSize: 13,
                  lineHeight: 19,
                  textAlign: "center",
                  color: colors.textSecondary,
                }}
              >
                No encontramos técnicas relacionadas con &quot;{busqueda}&quot;.
                Prueba utilizando otra palabra.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// DETALLE DE TÉCNICA
// ============================================================

export function DetalleTecnicaInterface({
  tecnica,
  cargando,
  error,
  iniciando,
  onVolver,
  onReintentar,
  onComenzar,
}: {
  tecnica: TecnicaComplementaria | null;
  cargando: boolean;
  error: string | null;
  iniciando: boolean;
  onVolver: () => void;
  onReintentar: () => void;
  onComenzar: () => void;
}) {
  const colors = useTecnicasColors();
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const tipo = tecnica ? obtenerTipoTecnica(tecnica.nombre) : null;
  const info = tipo ? INFO_TECNICAS[tipo] : null;

  const colorTecnica = tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

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

  const maxWidthDetalle = esEscritorio ? 900 : esTablet ? 760 : undefined;
  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;
  const paddingBottom = esEscritorio ? 64 : 48;

  return (
    <View style={[styles.pantalla, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthContenido,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: maxWidthDetalle,
              alignSelf: "center",
            }}
          >
            <Pressable
              onPress={onVolver}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 46,
                height: 46,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed
                  ? colors.surfaceSecondary
                  : colors.surface,
                ...Platform.select({
                  web: {
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                  },
                  ios: {
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                  },
                  android: {
                    elevation: 2,
                  },
                }),
              })}
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>

            <Estado
              cargando={cargando}
              error={error}
              reintentar={onReintentar}
            />

            {tecnica && (
              <>
                <View
                  style={{
                    marginTop: esEscritorio ? 24 : 20,
                    flexDirection: esEscritorio ? "row" : "column",
                    alignItems: esEscritorio ? "center" : "flex-start",
                    gap: esEscritorio ? 22 : 0,
                  }}
                >
                  <View
                    style={{
                      width: esEscritorio ? 108 : 92,
                      height: esEscritorio ? 108 : 92,
                      borderRadius: esEscritorio ? 32 : 28,
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: fondoTecnica,
                    }}
                  >
                    <Ionicons
                      name={
                        tipo === "jacobson" ? "body-outline" : "eye-outline"
                      }
                      size={esEscritorio ? 50 : 44}
                      color={colorTecnica}
                    />
                  </View>

                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                      minWidth: 0,
                      marginTop: esEscritorio ? 0 : 18,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: esEscritorio ? 32 : esTablet ? 29 : 27,
                        lineHeight: esEscritorio ? 40 : 34,
                        color: colors.text,
                      }}
                    >
                      {tecnica.nombre}
                    </Text>

                    {tecnica.duracion_estimada !== null &&
                      tecnica.duracion_estimada !== undefined && (
                        <View
                          style={{
                            alignSelf: "flex-start",
                            marginTop: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: 999,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: fondoTecnica,
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={colorTecnica}
                          />
                          <Text
                            style={{
                              fontFamily: "Nunito-SemiBold",
                              fontSize: 12,
                              color: colorTecnica,
                            }}
                          >
                            {tecnica.duracion_estimada} min
                          </Text>
                        </View>
                      )}
                  </View>
                </View>

                <View style={{ marginTop: esEscritorio ? 34 : 28 }}>
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: esEscritorio ? 21 : 18,
                      color: colors.text,
                    }}
                  >
                    ¿Qué es?
                  </Text>

                  <Text
                    style={{
                      marginTop: 8,
                      fontFamily: "Nunito-Medium",
                      fontSize: esEscritorio ? 15 : 14,
                      lineHeight: esEscritorio ? 24 : 22,
                      color: colors.textSecondary,
                    }}
                  >
                    {tecnica.descripcion}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: esEscritorio ? 32 : 26,
                    flexDirection: esEscritorio ? "row" : "column",
                    gap: esEscritorio ? 18 : 0,
                  }}
                >
                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                      padding: esEscritorio ? 20 : 18,
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 9,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 13,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: fondoTecnica,
                        }}
                      >
                        <Ionicons
                          name="sparkles-outline"
                          size={20}
                          color={colorTecnica}
                        />
                      </View>

                      <Text
                        style={{
                          flex: 1,
                          fontFamily: "Nunito-Bold",
                          fontSize: 17,
                          color: colors.text,
                        }}
                      >
                        ¿Para qué puede ayudarte?
                      </Text>
                    </View>

                    <Text
                      style={{
                        marginTop: 14,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                        lineHeight: 22,
                        color: colors.textSecondary,
                      }}
                    >
                      {tecnica.objetivo}
                    </Text>
                  </View>

                  {info?.beneficios && info.beneficios.length > 0 && (
                    <View
                      style={{
                        flex: esEscritorio ? 1 : undefined,
                        marginTop: esEscritorio ? 0 : 16,
                        padding: esEscritorio ? 20 : 18,
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 13,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: fondoTecnica,
                          }}
                        >
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={21}
                            color={colorTecnica}
                          />
                        </View>

                        <Text
                          style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 17,
                            color: colors.text,
                          }}
                        >
                          Beneficios
                        </Text>
                      </View>

                      <View style={{ marginTop: 8 }}>
                        {info.beneficios.map((item) => (
                          <View
                            key={item}
                            style={{
                              marginTop: 9,
                              flexDirection: "row",
                              alignItems: "flex-start",
                              gap: 8,
                            }}
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={19}
                              color={colorTecnica}
                            />

                            <Text
                              style={{
                                flex: 1,
                                fontFamily: "Nunito-Medium",
                                fontSize: 14,
                                lineHeight: 20,
                                color: colors.textSecondary,
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    marginTop: 18,
                    padding: 18,
                    borderWidth: 1,
                    borderRadius: 18,
                    borderColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: colors.surface,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: fondoTecnica,
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={23}
                      color={colorTecnica}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 15,
                        color: colors.text,
                      }}
                    >
                      Duración aproximada
                    </Text>

                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      {info?.duracion ??
                        `${tecnica.duracion_estimada ?? "—"} minutos`}
                    </Text>
                  </View>
                </View>

                {info && (
                  <View style={{ marginTop: esEscritorio ? 32 : 26 }}>
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: esEscritorio ? 21 : 18,
                        color: colors.text,
                      }}
                    >
                      Antes de comenzar
                    </Text>

                    <View
                      style={{
                        marginTop: 12,
                        padding: esEscritorio ? 20 : 18,
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      }}
                    >
                      {info.recomendaciones.map((item) => (
                        <View
                          key={item}
                          style={{
                            marginTop: 9,
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name="checkmark"
                            size={19}
                            color={colorTecnica}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontFamily: "Nunito-Medium",
                              fontSize: 14,
                              lineHeight: 20,
                              color: colors.textSecondary,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View
                      style={{
                        marginTop: 14,
                        padding: 16,
                        borderRadius: 17,
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                        backgroundColor: fondoTecnica,
                      }}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={23}
                        color={colorTecnica}
                      />

                      <Text
                        style={{
                          flex: 1,
                          fontFamily: "Nunito-Medium",
                          fontSize: 13,
                          lineHeight: 19,
                          color: colors.text,
                        }}
                      >
                        {info.advertencia}
                      </Text>
                    </View>
                  </View>
                )}

                <Pressable
                  onPress={onComenzar}
                  disabled={iniciando}
                  style={({ pressed }) => ({
                    width: "100%",
                    minHeight: 56,
                    marginTop: esEscritorio ? 32 : 28,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    backgroundColor: colors.primary,
                    opacity: iniciando ? 0.65 : pressed ? 0.82 : 1,
                  })}
                >
                  {iniciando ? (
                    <ActivityIndicator color={colors.textOnPrimary} />
                  ) : (
                    <>
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",
                          fontSize: 16,
                          color: colors.textOnPrimary,
                        }}
                      >
                        Comenzar práctica
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={21}
                        color={colors.textOnPrimary}
                      />
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// EJERCICIO
// ============================================================

export function EjercicioTecnicaInterface({
  tecnica,
  pasos,
  indice,
  cargando,
  error,
  finalizando,
  onCerrar,
  onReintentar,
  onSiguiente,
}: {
  tecnica: TecnicaComplementaria | null;
  pasos: PasoTecnica[];
  indice: number;
  cargando: boolean;
  error: string | null;
  finalizando: boolean;
  onCerrar: () => void;
  onReintentar: () => void;
  onSiguiente: () => void;
}) {
  const colors = useTecnicasColors();
  const { esTablet, esEscritorio } = useResponsiveLayout();

  const paso = pasos[indice];
  const tipo = obtenerTipoTecnica(tecnica?.nombre);

  const cantidad =
    tipo === "grounding" && paso ? (CANTIDAD_GROUNDING[paso.orden] ?? 0) : 0;

  const detalle = obtenerDetallePaso(tipo, paso?.orden);

  const [respuestas, setRespuestas] = useState<Record<string, string[]>>({});
  const [repeticion, setRepeticion] = useState(1);

  useEffect(() => {
    setRepeticion(1);
  }, [indice]);

  const valores = paso
    ? (respuestas[paso.id_paso] ?? Array(cantidad).fill(""))
    : [];

  const actualizarRespuesta = (posicion: number, valor: string) => {
    if (!paso) return;

    const nuevas = [...valores];
    nuevas[posicion] = valor;

    setRespuestas((prev) => ({
      ...prev,
      [paso.id_paso]: nuevas,
    }));
  };

  const avanzar = () => {
    if (tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON) {
      setRepeticion((actual) => actual + 1);
      return;
    }

    onSiguiente();
  };

  const ultimo = indice === pasos.length - 1;

  const textoBoton =
    tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON
      ? "Segunda repetición"
      : ultimo
        ? "Finalizar práctica"
        : "Siguiente";

  const colorTecnica = tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

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

  const maxWidthEjercicio = esEscritorio ? 900 : esTablet ? 760 : undefined;
  const paddingTop = esEscritorio ? 26 : esTablet ? 22 : 18;
  const paddingBottom = esEscritorio ? 30 : 24;

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Estado cargando={cargando} error={error} reintentar={onReintentar} />

      {!cargando && !error && paso && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,
              alignSelf: "center",
              paddingHorizontal,
              paddingTop,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthEjercicio,
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Pressable
                  onPress={onCerrar}
                  hitSlop={8}
                  style={({ pressed }) => ({
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pressed
                      ? colors.surfaceSecondary
                      : colors.surface,
                    ...Platform.select({
                      web: {
                        cursor: "pointer",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                      },
                      ios: {
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 5,
                      },
                      android: {
                        elevation: 1,
                      },
                    }),
                  })}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    minWidth: 0,
                    marginLeft: 14,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: esEscritorio ? 18 : 16,
                      color: colors.text,
                    }}
                  >
                    {tecnica?.nombre}
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,
                      fontFamily: "Nunito-Medium",
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}
                  >
                    Paso {indice + 1} de {pasos.length}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 18,
                }}
              >
                {pasos.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      height: 5,
                      borderRadius: 999,
                      backgroundColor:
                        i <= indice ? colorTecnica : colors.border,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthContenido,
                alignSelf: "center",
                paddingHorizontal,
              }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth: maxWidthEjercicio,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    marginTop: esEscritorio ? 28 : 22,
                    padding: esEscritorio ? 30 : esTablet ? 26 : 20,
                    borderWidth: 1,
                    borderRadius: 24,
                    borderColor: colors.border,
                    alignItems: "center",
                    backgroundColor: colors.surface,
                    ...Platform.select({
                      web: {
                        boxShadow: "0px 3px 10px rgba(0,0,0,0.04)",
                      },
                      ios: {
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.05,
                        shadowRadius: 7,
                      },
                      android: {
                        elevation: 2,
                      },
                    }),
                  }}
                >
                  <View
                    style={{
                      width: esEscritorio ? 64 : 56,
                      height: esEscritorio ? 64 : 56,
                      borderRadius: esEscritorio ? 32 : 28,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: fondoTecnica,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: esEscritorio ? 25 : 22,
                        color: colorTecnica,
                      }}
                    >
                      {indice + 1}
                    </Text>
                  </View>

                  <Text
                    style={{
                      marginTop: 18,
                      maxWidth: 680,
                      fontFamily: "Nunito-Bold",
                      fontSize: esEscritorio ? 28 : esTablet ? 25 : 22,
                      lineHeight: esEscritorio ? 35 : 30,
                      textAlign: "center",
                      color: colors.text,
                    }}
                  >
                    {paso.titulo}
                  </Text>

                  <Text
                    style={{
                      marginTop: 13,
                      maxWidth: 680,
                      fontFamily: "Nunito-Medium",
                      fontSize: esEscritorio ? 16 : 15,
                      lineHeight: esEscritorio ? 25 : 23,
                      textAlign: "center",
                      color: colors.textSecondary,
                    }}
                  >
                    {paso.instruccion}
                  </Text>

                  {detalle && (
                    <View
                      style={{
                        marginTop: 14,
                        maxWidth: 680,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 15,
                        backgroundColor: fondoTecnica,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Medium",
                          fontSize: 13,
                          lineHeight: 20,
                          textAlign: "center",
                          color: colors.textSecondary,
                        }}
                      >
                        {detalle}
                      </Text>
                    </View>
                  )}

                  {paso.tipo_recurso === "imagen" && paso.url_recurso && (
                    <Image
                      source={{ uri: paso.url_recurso }}
                      resizeMode="contain"
                      style={{
                        width: "100%",
                        maxWidth: 640,
                        height: esEscritorio ? 300 : esTablet ? 260 : 220,
                        marginTop: 20,
                      }}
                    />
                  )}

                  {tipo === "grounding" && (
                    <View
                      style={{
                        width: "100%",
                        maxWidth: esEscritorio ? 680 : undefined,
                        marginTop: 24,
                        gap: 12,
                      }}
                    >
                      {valores.map((valor, index) => (
                        <View
                          key={index}
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              flexShrink: 0,
                              borderRadius: 15,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: fondoTecnica,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 13,
                                color: colorTecnica,
                              }}
                            >
                              {index + 1}
                            </Text>
                          </View>

                          <TextInput
                            value={valor}
                            onChangeText={(texto) =>
                              actualizarRespuesta(index, texto)
                            }
                            placeholder="Escribe aquí"
                            placeholderTextColor={colors.placeholder}
                            selectionColor={colorTecnica}
                            style={{
                              flex: 1,
                              minHeight: 48,
                              paddingHorizontal: 14,
                              borderWidth: 1,
                              borderRadius: 13,
                              borderColor: colors.inputBorder,
                              fontFamily: "Nunito-Medium",
                              fontSize: 14,
                              color: colors.text,
                              backgroundColor: colors.inputBackground,
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {tipo === "jacobson" && (
                    <View
                      style={{
                        marginTop: 24,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 999,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        backgroundColor: colors.accentSoft,
                      }}
                    >
                      <Ionicons
                        name="repeat-outline"
                        size={20}
                        color={colors.accent}
                      />

                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",
                          fontSize: 13,
                          color: colors.accent,
                        }}
                      >
                        Repetición {repeticion} de {REPETICIONES_JACOBSON}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,
              alignSelf: "center",
              paddingHorizontal,
              paddingBottom,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthEjercicio,
                alignSelf: "center",
              }}
            >
              <Pressable
                disabled={finalizando}
                onPress={avanzar}
                style={({ pressed }) => ({
                  width: "100%",
                  minHeight: 56,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: colors.primary,
                  opacity: finalizando ? 0.65 : pressed ? 0.82 : 1,
                })}
              >
                {finalizando ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 16,
                        color: colors.textOnPrimary,
                      }}
                    >
                      {textoBoton}
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={21}
                      color={colors.textOnPrimary}
                    />
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================================
// HISTORIAL
// ============================================================

export function HistorialTecnicasInterface({
  registros,
  cargando,
  error,
  onVolver,
  onReintentar,
}: {
  registros: RegistroTecnica[];
  cargando: boolean;
  error: string | null;
  onVolver: () => void;
  onReintentar: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useTecnicasColors();
  const { esTablet, esEscritorio } = useResponsiveLayout();

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

  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;
  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 120, 150);

  return (
    <View style={[styles.pantalla, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthContenido,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          <Pressable
            onPress={onVolver}
            hitSlop={8}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              minHeight: 44,
              paddingHorizontal: 12,
              borderRadius: 13,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: pressed
                ? colors.surfaceSecondary
                : "transparent",
            })}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
            <Text
              style={{
                fontFamily: "Nunito-SemiBold",
                fontSize: 14,
                color: colors.text,
              }}
            >
              Volver
            </Text>
          </Pressable>

          <View
            style={{
              width: "100%",
              maxWidth: esEscritorio ? 780 : undefined,
              marginTop: esEscritorio ? 22 : 18,
              marginBottom: esEscritorio ? 28 : 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: esEscritorio ? 30 : esTablet ? 27 : 25,
                lineHeight: esEscritorio ? 38 : 32,
                color: colors.text,
              }}
            >
              Historial de técnicas
            </Text>

            <Text
              style={{
                marginTop: 7,
                fontFamily: "Nunito-Medium",
                fontSize: esEscritorio ? 15 : 13,
                lineHeight: esEscritorio ? 22 : 19,
                color: colors.textSecondary,
              }}
            >
              Aquí encontrarás las prácticas que has realizado.
            </Text>
          </View>

          <Estado cargando={cargando} error={error} reintentar={onReintentar} />

          {!cargando && !error && registros.length === 0 && (
            <View
              style={{
                width: "100%",
                minHeight: esEscritorio ? 280 : 230,
                padding: 24,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface,
              }}
            >
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primarySoft,
                }}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={31}
                  color={colors.primary}
                />
              </View>

              <Text
                style={{
                  marginTop: 16,
                  fontFamily: "Nunito-Bold",
                  fontSize: 18,
                  textAlign: "center",
                  color: colors.text,
                }}
              >
                Aún no tienes prácticas
              </Text>

              <Text
                style={{
                  marginTop: 7,
                  maxWidth: 420,
                  fontFamily: "Nunito-Medium",
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: "center",
                  color: colors.textSecondary,
                }}
              >
                Cuando completes una técnica, podrás consultar aquí tu
                historial.
              </Text>
            </View>
          )}

          {!cargando && !error && registros.length > 0 && (
            <>
              <View
                style={{
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: esEscritorio ? 20 : 18,
                    color: colors.text,
                  }}
                >
                  Mis prácticas
                </Text>

                <View
                  style={{
                    minWidth: 34,
                    height: 34,
                    paddingHorizontal: 10,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 13,
                      color: colors.primary,
                    }}
                  >
                    {registros.length}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: esEscritorio ? "row" : "column",
                  flexWrap: esEscritorio ? "wrap" : "nowrap",
                  gap: 14,
                }}
              >
                {registros.map((registro) => {
                  const completada = registro.completada;

                  return (
                    <View
                      key={registro.id_registro}
                      style={{
                        width: esEscritorio ? "49.3%" : "100%",
                        minHeight: 96,
                        padding: esEscritorio ? 18 : 16,
                        borderWidth: 1,
                        borderRadius: 19,
                        borderColor: colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.surface,
                        ...Platform.select({
                          web: {
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.035)",
                          },
                          ios: {
                            shadowColor: "#000000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 5,
                          },
                          android: {
                            elevation: 1,
                          },
                        }),
                      }}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          flexShrink: 0,
                          borderRadius: 15,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: completada
                            ? colors.success
                            : colors.primary,
                        }}
                      >
                        <Ionicons
                          name={completada ? "checkmark" : "play"}
                          size={21}
                          color={colors.textOnPrimary}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          minWidth: 0,
                          marginLeft: 13,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: esEscritorio ? 16 : 15,
                            lineHeight: 21,
                            color: colors.text,
                          }}
                        >
                          {registro.tecnica_complementaria?.nombre ??
                            "Técnica complementaria"}
                        </Text>

                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={colors.textMuted}
                          />

                          <Text
                            numberOfLines={1}
                            style={{
                              flex: 1,
                              fontFamily: "Nunito-Medium",
                              fontSize: 12,
                              color: colors.textSecondary,
                            }}
                          >
                            {new Date(registro.fecha_inicio).toLocaleDateString(
                              "es-NI",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginLeft: 10,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 999,
                          backgroundColor: completada
                            ? colors.secondarySoft
                            : colors.primarySoft,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 11,
                            color: completada ? colors.success : colors.primary,
                          }}
                        >
                          {completada ? "Completada" : "En progreso"}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// TÉCNICA COMPLETADA
// ============================================================

export function TecnicaCompletadaInterface({
  nombre,
  cargando,
  onVolver,
  onHistorial,
}: {
  nombre?: string;
  cargando: boolean;
  onVolver: () => void;
  onHistorial: () => void;
}) {
  const colors = useTecnicasColors();

  const tipo = obtenerTipoTecnica(nombre);

  const mensaje =
    tipo === "grounding"
      ? "Tómate unos segundos para observar nuevamente tu entorno antes de continuar con tus actividades."
      : tipo === "jacobson"
        ? "Permanece unos momentos en una posición cómoda y observa cómo se siente tu cuerpo después del ejercicio."
        : "Regálate unos instantes para notar cómo te sientes ahora.";

  if (cargando) {
    return (
      <View
        style={[
          styles.pantalla,
          styles.centro,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pantalla,
        styles.completada,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.check,
          {
            backgroundColor: colors.success,
          },
        ]}
      >
        <Ionicons name="checkmark" size={55} color={colors.textOnPrimary} />
      </View>

      <Text style={[styles.tituloCompletada, { color: colors.text }]}>
        ¡Técnica completada!
      </Text>

      <Text
        style={[
          styles.descripcionCompletada,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Has terminado{"\n"}
        {nombre ?? "la técnica complementaria"}.
      </Text>

      <View
        style={[
          styles.mensaje,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.mensajeTexto,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {mensaje}
        </Text>
      </View>

      <View style={styles.flex} />

      <Pressable
        onPress={onVolver}
        style={[
          styles.boton,
          {
            width: "100%",
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.botonTexto}>Volver a técnicas</Text>
      </Pressable>

      <Pressable style={styles.enlace} onPress={onHistorial}>
        <Text style={[styles.enlaceTexto, { color: colors.primary }]}>
          Ver mi historial
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  scroll: {
    padding: 18,
  },

  tituloInicio: {
    fontFamily: "Nunito-Bold",
    fontSize: 24,
    marginTop: 8,
  },

  descripcion: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },

  // ==========================================================
  // BUSCADOR
  // ==========================================================

  buscador: {
    height: 54,
    borderWidth: 1,
    borderRadius: 17,
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  inputBusqueda: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 15,
  },

  sinResultados: {
    alignItems: "center",
    paddingVertical: 35,
    gap: 10,
  },

  sinResultadosTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  // ==========================================================
  // TÍTULOS
  // ==========================================================

  filaTitulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 14,
  },

  seccionTitulo: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    maxWidth: "85%",
  },

  // ==========================================================
  // NECESIDADES
  // ==========================================================

  necesidades: {
    flexDirection: "row",
    gap: 10,
  },

  necesidad: {
    flex: 1,
    minHeight: 125,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
  },

  iconoNecesidad: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  necesidadTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    lineHeight: 18,
  },

  historialIcono: {
    padding: 3,
  },

  // ==========================================================
  // TARJETAS
  // ==========================================================

  tarjeta: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  icono: {
    width: 68,
    height: 68,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  nombre: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    lineHeight: 21,
  },

  resumen: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  filaDuracion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },

  duracion: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
  },

  // ==========================================================
  // ESTADOS
  // ==========================================================

  estado: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },

  error: {
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  reintentar: {
    fontFamily: "Nunito-Bold",
  },

  // ==========================================================
  // DETALLE
  // ==========================================================

  detalleScroll: {
    padding: 20,
    paddingBottom: 40,
  },

  volver: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },

  iconoGrande: {
    width: 96,
    height: 96,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  tituloDetalle: {
    fontFamily: "Nunito-Bold",
    fontSize: 27,
    lineHeight: 33,
    marginTop: 22,
  },

  subtituloDetalle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 7,
  },

  descripcionDetalle: {
    fontFamily: "Nunito-Medium",
    fontSize: 15,
    lineHeight: 23,
  },

  info: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
    marginTop: 25,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  objetivo: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
  },

  infoTitulo: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },

  infoTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 3,
  },

  itemLista: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 9,
  },

  itemTexto: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 20,
  },

  advertencia: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 15,
    borderRadius: 16,
    marginTop: 15,
  },

  advertenciaTexto: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 19,
  },

  botonDetalle: {
    marginTop: 25,
  },

  // ==========================================================
  // BOTONES
  // ==========================================================

  boton: {
    minHeight: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  botonTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  // ==========================================================
  // EJERCICIO
  // ==========================================================

  ejercicio: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },

  ejercicioScroll: {
    paddingBottom: 20,
  },

  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progreso: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
  },

  barras: {
    flexDirection: "row",
    gap: 4,
    marginTop: 18,
  },

  barra: {
    height: 5,
    borderRadius: 4,
    flex: 1,
  },

  nombreTecnica: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    textAlign: "center",
    marginTop: 25,
  },

  pasoCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginTop: 15,
    alignItems: "center",
  },

  numero: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  numeroTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 23,
  },

  tituloPaso: {
    fontFamily: "Nunito-Bold",
    fontSize: 23,
    textAlign: "center",
    marginTop: 18,
  },

  instruccion: {
    fontFamily: "Nunito-Medium",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 13,
  },

  detallePaso: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
  },

  imagenPaso: {
    width: "100%",
    height: 220,
    marginTop: 18,
  },

  // ==========================================================
  // GROUNDING
  // ==========================================================

  inputsGrounding: {
    width: "100%",
    marginTop: 18,
    gap: 10,
  },

  inputFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  numeroInput: {
    width: 22,
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },

  inputGrounding: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
  },

  // ==========================================================
  // JACOBSON
  // ==========================================================

  repeticion: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 20,
  },

  repeticionTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },

  // ==========================================================
  // HISTORIAL
  // ==========================================================

  volverConTexto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 8,
  },

  volverTexto: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
  },

  tituloHistorial: {
    fontFamily: "Nunito-Bold",
    fontSize: 25,
    marginTop: 20,
  },

  vacio: {
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  iconoHistorial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  fecha: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
    marginTop: 3,
  },

  estadoTexto: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 11,
    maxWidth: 73,
    textAlign: "right",
  },

  // ==========================================================
  // COMPLETADA
  // ==========================================================

  centro: {
    alignItems: "center",
    justifyContent: "center",
  },

  completada: {
    alignItems: "center",
    padding: 25,
    paddingTop: 100,
  },

  check: {
    width: 105,
    height: 105,
    borderRadius: 53,
    alignItems: "center",
    justifyContent: "center",
  },

  tituloCompletada: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: 27,
  },

  descripcionCompletada: {
    fontFamily: "Nunito-Medium",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
  },

  mensaje: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
  },

  mensajeTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  enlace: {
    padding: 18,
  },

  enlaceTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },
});
