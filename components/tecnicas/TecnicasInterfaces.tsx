import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
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

import type {
  PasoTecnica,
  RegistroTecnica,
  TecnicaComplementaria,
} from "@/types/tecnicas";

// ============================================================
// CONFIGURACIÓN
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

function useTecnicasColors() {
  const { isDarkMode } = useThemeMode();
  return isDarkMode ? Colors.dark : Colors.light;
}

function useTecnicasLayout() {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidth = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  return {
    esTelefono,
    esTablet,
    esEscritorio,
    paddingHorizontal,
    maxWidth,
  };
}

// ============================================================
// COMPONENTES COMPARTIDOS
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
      <View
        style={{
          paddingVertical: 40,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!error) return null;

  return (
    <View
      style={{
        padding: 24,
        alignItems: "center",
        gap: 14,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Medium",
          fontSize: 14,
          lineHeight: 21,
          textAlign: "center",
          color: colors.textSecondary,
        }}
      >
        {error}
      </Text>

      {!!reintentar && (
        <Pressable
          onPress={reintentar}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 18,
            borderRadius: 12,
            justifyContent: "center",
            backgroundColor: colors.primarySoft,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 14,
              color: colors.primary,
            }}
          >
            Intentar nuevamente
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function BotonPrimario({
  titulo,
  icono = "arrow-forward",
  onPress,
  disabled = false,
}: {
  titulo: string;
  icono?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colors = useTecnicasColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: "100%",
          minHeight: 56,
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor: colors.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: 16,
            textAlign: "center",
            color: colors.textOnPrimary,
          }}
        >
          {titulo}
        </Text>

        <Ionicons name={icono} size={21} color={colors.textOnPrimary} />
      </View>
    </Pressable>
  );
}

function BotonVolver({
  onPress,
  texto = "Volver",
}: {
  onPress: () => void;
  texto?: string;
}) {
  const colors = useTecnicasColors();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      style={({ pressed }) => ({
        alignSelf: "flex-start",
        borderRadius: 12,
        opacity: pressed ? 0.7 : 1,
        overflow: "hidden",
      })}
    >
      <View
        style={{
          minHeight: 44,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 9,
          borderRadius: 12,
          backgroundColor: colors.surfaceSecondary,
        }}
      >
        <Ionicons name="arrow-back" size={20} color={colors.primary} />

        <Text
          style={{
            fontFamily: "Nunito-SemiBold",
            fontSize: 14,
            color: colors.text,
          }}
        >
          {texto}
        </Text>
      </View>
    </Pressable>
  );
}

// ============================================================
// 1. PANTALLA PRINCIPAL DE TÉCNICAS
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
  const colors = useTecnicasColors();
  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio, paddingHorizontal, maxWidth } =
    useTecnicasLayout();

  const [busqueda, setBusqueda] = useState("");
  const [anchoGrid, setAnchoGrid] = useState(0);

  const tecnicasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return tecnicas;

    return tecnicas.filter((tecnica) =>
      [tecnica.nombre, tecnica.descripcion, tecnica.objetivo]
        .join(" ")
        .toLowerCase()
        .includes(texto),
    );
  }, [tecnicas, busqueda]);

  const columnasTecnicas = esEscritorio ? 2 : 1;
  const gapTecnicas = esEscritorio ? 18 : 14;

  const anchoTarjeta =
    columnasTecnicas > 1 && anchoGrid > 0
      ? (anchoGrid - gapTecnicas) / 2
      : undefined;

  function medirGrid(event: LayoutChangeEvent) {
    const ancho = event.nativeEvent.layout.width;

    if (Math.abs(ancho - anchoGrid) > 1) {
      setAnchoGrid(ancho);
    }
  }

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: esEscritorio ? 30 : 22,
          paddingBottom: esEscritorio ? 64 : Math.max(insets.bottom + 118, 145),
        }}
      >
        <Text style={[styles.tituloInicio, { color: colors.primary }]}>
          Técnicas Complementarias
        </Text>

        <Text style={[styles.descripcion, { color: colors.textSecondary }]}>
          Explora técnicas basadas en evidencia para ayudarte a comprender,
          regular y afrontar tus emociones de manera saludable.
        </Text>

        {/* ====================================================
            BUSCADOR
        ==================================================== */}

        <View
          style={{
            width: "100%",
            maxWidth,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          {/* ENCABEZADO */}

          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: esEscritorio ? 32 : esTablet ? 28 : 24,
              lineHeight: esEscritorio ? 40 : 33,
              color: colors.primary,
            }}
          >
            Técnicas Complementarias
          </Text>

          <Text
            style={{
              maxWidth: 720,
              marginTop: 8,
              fontFamily: "Nunito-Medium",
              fontSize: esEscritorio ? 15 : 13,
              lineHeight: esEscritorio ? 23 : 20,
              color: colors.textSecondary,
            }}
          >
            Explora técnicas basadas en evidencia para ayudarte a comprender,
            regular y afrontar tus emociones de manera saludable.
          </Text>

          {/* BUSCADOR */}

          <View
            style={{
              width: "100%",
              maxWidth: esEscritorio ? 760 : undefined,
              minHeight: 56,
              marginTop: 22,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderRadius: 16,
              backgroundColor: colors.inputBackground,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Ionicons name="search-outline" size={22} color={colors.icon} />

            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar técnica"
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.primary}
              style={{
                flex: 1,
                minWidth: 0,
                paddingVertical: 12,
                fontFamily: "Nunito-Medium",
                fontSize: 15,
                color: colors.text,
                ...(Platform.OS === "web"
                  ? ({ outlineStyle: "none" } as any)
                  : {}),
              }}
            />

            {!!busqueda && (
              <Pressable onPress={() => setBusqueda("")} hitSlop={8}>
                <Ionicons name="close-circle" size={22} color={colors.icon} />
              </Pressable>
            );
          })}
        </View>

          {/* NECESIDADES */}

          <View
            style={{
              marginTop: 28,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: esEscritorio ? 22 : 18,
                lineHeight: 26,
                color: colors.text,
              }}
            >
              ¿Qué necesitas en este momento?
            </Text>

            {!esTelefono && (
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: "Nunito-Medium",
                  fontSize: 13,
                  color: colors.textMuted,
                }}
              >
                <View style={[styles.icono, { backgroundColor: fondo }]}>
                  <Ionicons
                    name={esJacobson ? "body-outline" : "eye-outline"}
                    size={38}
                    color={color}
                  />
                </View>

          <View
            style={{
              width: "100%",
              flexDirection: esTelefono ? "column" : "row",
              alignItems: "stretch",
              gap: 12,
            }}
          >
            {NECESIDADES.map((item, index) => {
              // Asociación conservada del código original.
              const tecnica = tecnicas.length
                ? tecnicas[index % tecnicas.length]
                : undefined;

              const color = colors[item.color];
              const fondo = colors[item.fondo];

              return (
                <Pressable
                  key={item.nombre}
                  disabled={!tecnica || cargando}
                  onPress={() => {
                    if (tecnica) {
                      onAbrir(tecnica.id_tecnica);
                    }
                  }}
                  style={({ pressed }) => ({
                    flex: esTelefono ? undefined : 1,
                    width: esTelefono ? "100%" : undefined,
                    minWidth: 0,
                    borderRadius: 20,
                    overflow: "hidden",
                    opacity: !tecnica || cargando ? 0.6 : pressed ? 0.8 : 1,
                  })}
                >
                  <View
                    style={{
                      width: "100%",
                      minHeight: esTelefono ? 86 : esEscritorio ? 150 : 140,
                      padding: esEscritorio ? 18 : 14,
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: colors.border,
                      backgroundColor: fondo,
                      flexDirection: esTelefono ? "row" : "column",
                      alignItems: esTelefono ? "center" : "flex-start",
                      justifyContent: esTelefono
                        ? "flex-start"
                        : "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: esEscritorio ? 62 : 54,
                        height: esEscritorio ? 62 : 54,
                        borderRadius: 17,
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.surface,
                      }}
                    >
                      <Ionicons
                        name={item.icono}
                        size={esEscritorio ? 31 : 27}
                        color={color}
                      />
                    </View>

                    <View
                      style={{
                        flex: esTelefono ? 1 : undefined,
                        minWidth: 0,
                        marginLeft: esTelefono ? 14 : 0,
                        marginTop: esTelefono ? 0 : 12,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",
                          fontSize: esEscritorio ? 17 : 15,
                          lineHeight: 21,
                          color: colors.text,
                        }}
                      >
                        {item.nombre}
                      </Text>

                      {!esTelefono && (
                        <Text
                          style={{
                            marginTop: 4,
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
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          marginLeft: 8,
                          borderRadius: 16,
                          flexShrink: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: colors.surface,
                        }}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={color}
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* RECOMENDACIONES: ENCABEZADO */}

          <View
            style={{
              marginTop: 34,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: esEscritorio ? 22 : 18,
                  lineHeight: 26,
                  color: colors.text,
                }}
              >
                No encontramos técnicas relacionadas con &quot;{busqueda}&quot;.
              </Text>

              {!esTelefono && (
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: "Nunito-Medium",
                    fontSize: 13,
                    color: colors.textMuted,
                  }}
                >
                  Prácticas breves para apoyar tu bienestar emocional.
                </Text>
              )}
            </View>
          )}
      </ScrollView>
    </View>
  );
}

            <Pressable
              onPress={onHistorial}
              accessibilityRole="button"
              accessibilityLabel="Ver historial de técnicas"
              style={({ pressed }) => ({
                borderRadius: 12,
                opacity: pressed ? 0.75 : 1,
                overflow: "hidden",
              })}
            >
              <View
                style={{
                  minHeight: 42,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.primarySoft,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={21}
                  color={colors.primary}
                />

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
              </View>
            </Pressable>
          </View>

          <Estado cargando={cargando} error={error} reintentar={onReintentar} />

          {/* TARJETAS DE TÉCNICAS */}

          {!cargando && !error && tecnicasFiltradas.length > 0 && (
            <View
              onLayout={medirGrid}
              style={{
                width: "100%",
                flexDirection: columnasTecnicas === 2 ? "row" : "column",
                flexWrap: columnasTecnicas === 2 ? "wrap" : "nowrap",
                alignItems: "stretch",
                gap: gapTecnicas,
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
                      width: columnasTecnicas === 1 ? "100%" : anchoTarjeta,
                      minWidth: 0,
                    }}
                  >
                    <Pressable
                      onPress={() => onAbrir(tecnica.id_tecnica)}
                      style={({ pressed }) => ({
                        width: "100%",
                        borderRadius: 21,
                        overflow: "hidden",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <View
                        style={{
                          width: "100%",
                          minHeight: esEscritorio ? 150 : 120,
                          padding: esTelefono ? 14 : 18,
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 21,
                          backgroundColor: colors.surface,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: esTelefono ? 11 : 14,
                        }}
                      >
                        {/* ICONO */}

                        <View
                          style={{
                            width: esTelefono ? 56 : 70,
                            height: esTelefono ? 56 : 70,
                            borderRadius: 19,
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: fondo,
                          }}
                        >
                          <Ionicons
                            name={esJacobson ? "body-outline" : "eye-outline"}
                            size={esTelefono ? 27 : 32}
                            color={color}
                          />
                        </View>

                        {/* INFORMACIÓN */}

                        <View
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Text
                            numberOfLines={3}
                            style={{
                              fontFamily: "Nunito-Bold",
                              fontSize: esTelefono ? 15 : 17,
                              lineHeight: 22,
                              color: colors.text,
                            }}
                          >
                            {tecnica.nombre}
                          </Text>

                          <Text
                            numberOfLines={esEscritorio ? 3 : 2}
                            style={{
                              marginTop: 5,
                              fontFamily: "Nunito-Medium",
                              fontSize: 12,
                              lineHeight: 18,
                              color: colors.textSecondary,
                            }}
                          >
                            {tecnica.descripcion}
                          </Text>

                          <View
                            style={{
                              alignSelf: "flex-start",
                              marginTop: 9,
                              paddingHorizontal: 9,
                              paddingVertical: 5,
                              borderRadius: 9,
                              backgroundColor: fondo,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <Ionicons
                                name="time-outline"
                                size={15}
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
                        </View>

                        {/* FLECHA */}

                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            flexShrink: 0,
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
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          {/* SIN RESULTADOS */}

          {!cargando && !error && tecnicasFiltradas.length === 0 && (
            <View
              style={{
                minHeight: 220,
                padding: 24,
                borderWidth: 1,
                borderRadius: 22,
                borderColor: colors.border,
                backgroundColor: colors.surface,
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
                  marginTop: 6,
                  fontFamily: "Nunito-Medium",
                  fontSize: 13,
                  lineHeight: 19,
                  textAlign: "center",
                  color: colors.textSecondary,
                }}
              >
                {busqueda.trim()
                  ? `No encontramos técnicas relacionadas con "${busqueda}". Prueba utilizando otra palabra.`
                  : "Todavía no hay técnicas disponibles."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// 2. DETALLE DE TÉCNICA
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

  const { esTelefono, esTablet, esEscritorio, paddingHorizontal, maxWidth } =
    useTecnicasLayout();

  const tipo = tecnica ? obtenerTipoTecnica(tecnica.nombre) : null;

  const info = tipo ? INFO_TECNICAS[tipo] : null;

  const colorTecnica =
    tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

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
          paddingTop: esEscritorio ? 28 : 20,
          paddingBottom: esEscritorio ? 64 : 48,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: esEscritorio ? 900 : esTablet ? 760 : undefined,
              alignSelf: "center",
            }}
          >
            <BotonVolver onPress={onVolver} texto="Volver a técnicas" />

            <Estado
              cargando={cargando}
              error={error}
              reintentar={onReintentar}
            />

            {!!tecnica && (
              <>
                {/* CABECERA */}

                <View
                  style={{
                    marginTop: 24,
                    flexDirection: esEscritorio ? "row" : "column",
                    alignItems: esEscritorio ? "center" : "flex-start",
                    gap: esEscritorio ? 22 : 0,
                  }}
                >
                  <View
                    style={{
                      width: esEscritorio ? 108 : 92,
                      height: esEscritorio ? 108 : 92,
                      borderRadius: 28,
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
                        lineHeight: esEscritorio ? 40 : 35,
                        color: colors.text,
                      }}
                    >
                      {tecnica.nombre}
                    </Text>

                    {tecnica.duracion_estimada != null && (
                      <View
                        style={{
                          alignSelf: "flex-start",
                          marginTop: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          backgroundColor: fondoTecnica,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
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
                      </View>
                    )}
                  </View>
                </View>

                {/* DESCRIPCIÓN */}

                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 19,
                      color: colors.text,
                    }}
                  >
                    ¿Qué es?
                  </Text>

                  <Text
                    style={{
                      marginTop: 9,
                      fontFamily: "Nunito-Medium",
                      fontSize: esEscritorio ? 15 : 14,
                      lineHeight: 23,
                      color: colors.textSecondary,
                    }}
                  >
                    {tecnica.descripcion}
                  </Text>
                </View>

                {/* OBJETIVO Y BENEFICIOS */}

                <View
                  style={{
                    marginTop: 27,
                    flexDirection: esEscritorio ? "row" : "column",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                      minWidth: 0,
                      padding: 18,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 20,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 13,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: fondoTecnica,
                        }}
                      >
                        <Ionicons
                          name="sparkles-outline"
                          size={21}
                          color={colorTecnica}
                        />
                      </View>

            <TituloSeccion>¿Para qué puede ayudarte?</TituloSeccion>

            <Text
              style={[
                styles.infoTexto,
                { color: colors.textSecondary },
              ]}
            >
              {tecnica.objetivo}
            </Text>

                  {!!info?.beneficios?.length && (
                    <View
                      style={{
                        flex: esEscritorio ? 1 : undefined,
                        minWidth: 0,
                        padding: 18,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 20,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 42,
                            height: 42,
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

                      {info.beneficios.map((beneficio) => (
                        <View
                          key={beneficio}
                          style={{
                            marginTop: 12,
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 9,
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
                              minWidth: 0,
                              fontFamily: "Nunito-Medium",
                              fontSize: 14,
                              lineHeight: 21,
                              color: colors.textSecondary,
                            }}
                          >
                            {beneficio}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* DURACIÓN */}

                <View
                  style={{
                    marginTop: 18,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 19,
                    backgroundColor: colors.surface,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}

            <View
              style={[
                styles.info,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={colorTecnica}
              />

              <View style={styles.flex}>
                <Text style={[styles.infoTitulo, { color: colors.text }]}>
                  Duración aproximada
                </Text>

                    <Text
                      style={{
                        marginTop: 3,
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

                {/* ANTES DE COMENZAR */}

                {!!info && (
                  <View style={{ marginTop: 28 }}>
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 19,
                        color: colors.text,
                      }}
                    >
                      Antes de comenzar
                    </Text>

                    <View
                      style={{
                        marginTop: 12,
                        padding: esTelefono ? 16 : 20,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 20,
                        backgroundColor: colors.surface,
                      }}
                    >
                      {info.recomendaciones.map((item) => (
                        <View
                          key={item}
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 9,
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
                              minWidth: 0,
                              fontFamily: "Nunito-Medium",
                              fontSize: 14,
                              lineHeight: 21,
                              color: colors.textSecondary,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}

                      <View
                        style={{
                          marginTop: 17,
                          padding: 15,
                          borderRadius: 16,
                          backgroundColor: fondoTecnica,
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: 10,
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
                            minWidth: 0,
                            fontFamily: "Nunito-Medium",
                            fontSize: 13,
                            lineHeight: 20,
                            color: colors.text,
                          }}
                        >
                          {info.advertencia}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* COMENZAR */}

                <View style={{ marginTop: 28 }}>
                  {iniciando ? (
                    <View
                      style={{
                        minHeight: 56,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.primary,
                      }}
                    >
                      <ActivityIndicator color={colors.textOnPrimary} />
                    </View>
                  ) : (
                    <BotonPrimario
                      titulo="Comenzar práctica"
                      onPress={onComenzar}
                    />
                  )}
                </View>
              </>
            )}

            <Pressable
              onPress={onComenzar}
              disabled={iniciando}
              style={[
                styles.boton,
                styles.botonDetalle,
                {
                  backgroundColor: colors.primary,
                  opacity: iniciando ? 0.7 : 1,
                },
              ]}
            >
              {iniciando ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <>
                  <Text style={styles.botonTexto}>Comenzar práctica</Text>

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
      </ScrollView>
    </View>
  );
}

// ============================================================
// 3. EJERCICIO DE TÉCNICA
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

  const { esTablet, esEscritorio, paddingHorizontal, maxWidth } =
    useTecnicasLayout();

  const paso = pasos[indice];
  const tipo = obtenerTipoTecnica(tecnica?.nombre);

  const cantidad =
    tipo === "grounding" && paso
      ? CANTIDAD_GROUNDING[paso.orden] ?? 0
      : 0;

  const detalle = obtenerDetallePaso(tipo, paso?.orden);

  const [respuestas, setRespuestas] = useState<Record<string, string[]>>({});

  const [repeticion, setRepeticion] = useState(1);

  useEffect(() => {
    setRepeticion(1);
  }, [indice]);

  const valores = paso
    ? respuestas[paso.id_paso] ?? Array(cantidad).fill("")
    : [];

  const colorTecnica = tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

  const ultimo = indice === pasos.length - 1;

  const textoBoton =
    tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON
      ? "Segunda repetición"
      : ultimo
        ? "Finalizar práctica"
        : "Siguiente";

  function actualizarRespuesta(posicion: number, valor: string) {
    if (!paso) return;

    const nuevasRespuestas = [...valores];
    nuevasRespuestas[posicion] = valor;

    setRespuestas((anteriores) => ({
      ...anteriores,
      [paso.id_paso]: nuevasRespuestas,
    }));
  }

  function avanzar() {
    if (tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON) {
      setRepeticion((actual) => actual + 1);
      return;
    }

    onSiguiente();
  }

  const maxWidthEjercicio = esEscritorio ? 900 : esTablet ? 760 : undefined;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Estado
        cargando={cargando}
        error={error}
        reintentar={onReintentar}
      />

      {paso && (
        <View style={styles.ejercicio}>
          <View style={styles.cabecera}>
            <Pressable onPress={onCerrar} style={styles.volver}>
              <Ionicons
                name="close"
                size={27}
                color={colors.text}
              />
            </Pressable>

      {!cargando && !error && !!paso && (
        <View style={{ flex: 1 }}>
          {/* ENCABEZADO FIJO */}

          <View
            style={{
              width: "100%",
              maxWidth,
              alignSelf: "center",
              paddingHorizontal,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthEjercicio,
                alignSelf: "center",
              }}
            >
              Paso {indice + 1} de {pasos.length}
            </Text>
          </View>

          <View style={styles.barras}>
            {pasos.map((_, i) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Pressable
                  onPress={onCerrar}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar práctica"
                  style={({ pressed }) => ({
                    width: 46,
                    height: 46,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pressed
                      ? colors.surfaceSecondary
                      : colors.surface,
                  })}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    {tecnica?.nombre}
                  </Text>

                  <Text
                    style={{
                      marginTop: 3,
                      fontFamily: "Nunito-Medium",
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}
                  >
                    Paso {indice + 1} de {pasos.length}
                  </Text>
                </View>
              </View>

              {/* PROGRESO */}

              <View
                style={{
                  marginTop: 18,
                  flexDirection: "row",
                  gap: 5,
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

          {/* CONTENIDO DESPLAZABLE */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: 22,
              paddingBottom: 24,
            }}
          >
            <Text
              style={[
                styles.nombreTecnica,
                { color: colors.textSecondary },
              ]}
            >
              {tecnica?.nombre}
            </Text>

            <View
              style={{
                width: "100%",
                maxWidth,
                alignSelf: "center",
                paddingHorizontal,
              }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth: maxWidthEjercicio,
                  alignSelf: "center",
                  padding: esEscritorio ? 30 : esTablet ? 26 : 20,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 24,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                }}
              >
                {/* NÚMERO */}

                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: fondoTecnica,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 23,
                      color: colorTecnica,
                    }}
                  >
                    {indice + 1}
                  </Text>
                </View>

                {/* TÍTULO */}

                <Text
                  style={{
                    marginTop: 18,
                    maxWidth: 680,
                    fontFamily: "Nunito-Bold",
                    fontSize: esEscritorio ? 28 : esTablet ? 25 : 22,
                    lineHeight: esEscritorio ? 36 : 30,
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
                    lineHeight: 23,
                    textAlign: "center",
                    color: colors.textSecondary,
                  }}
                >
                  {paso.instruccion}
                </Text>

                {!!detalle && (
                  <View
                    style={{
                      width: "100%",
                      maxWidth: 680,
                      marginTop: 15,
                      padding: 15,
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

                {/* IMAGEN OPCIONAL */}

                {paso.tipo_recurso === "imagen" && !!paso.url_recurso && (
                  <Image
                    source={{
                      uri: paso.url_recurso,
                    }}
                    resizeMode="contain"
                    style={{
                      width: "100%",
                      maxWidth: 640,
                      height: esEscritorio ? 300 : esTablet ? 260 : 220,
                      marginTop: 20,
                    }}
                  />
                )}

                {/* GROUNDING */}

                {tipo === "grounding" && (
                  <View
                    style={{
                      width: "100%",
                      maxWidth: 680,
                      marginTop: 24,
                      gap: 12,
                    }}
                  >
                    {valores.map((valor, posicion) => (
                      <View
                        key={posicion}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            flexShrink: 0,
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
                            {posicion + 1}
                          </Text>
                        </View>

                        <TextInput
                          value={valor}
                          onChangeText={(texto) =>
                            actualizarRespuesta(posicion, texto)
                          }
                          placeholder="Escribe aquí"
                          placeholderTextColor={colors.placeholder}
                          selectionColor={colorTecnica}
                          style={{
                            flex: 1,
                            minWidth: 0,
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

                {/* JACOBSON */}

                {tipo === "jacobson" && (
                  <View
                    style={{
                      alignSelf: "center",
                      marginTop: 24,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 999,
                      backgroundColor: colors.accentSoft,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
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
          </ScrollView>

          {/* BOTÓN INFERIOR */}

          <View
            style={{
              width: "100%",
              maxWidth,
              alignSelf: "center",
              paddingHorizontal,
              paddingTop: 12,
              paddingBottom: esEscritorio ? 30 : 24,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: maxWidthEjercicio,
                alignSelf: "center",
              }}
            >
              {finalizando ? (
                <View
                  style={{
                    minHeight: 56,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary,
                  }}
                >
                  <ActivityIndicator color={colors.textOnPrimary} />
                </View>
              ) : (
                <BotonPrimario titulo={textoBoton} onPress={avanzar} />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================================
// 4. HISTORIAL DE TÉCNICAS
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
  const colors = useTecnicasColors();
  const insets = useSafeAreaInsets();

  const { esEscritorio, paddingHorizontal, maxWidth } = useTecnicasLayout();

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
          paddingTop: 22,
          paddingBottom: esEscritorio ? 64 : Math.max(insets.bottom + 120, 150),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth,
            alignSelf: "center",
            paddingHorizontal,
          }}
        >
          <BotonVolver onPress={onVolver} texto="Volver" />

          <Text
            style={{
              marginTop: 22,
              fontFamily: "Nunito-Bold",
              fontSize: esEscritorio ? 30 : 25,
              lineHeight: 34,
              color: colors.text,
            }}
          >
            Historial de técnicas
          </Text>

          <Text
            style={{
              marginTop: 7,
              marginBottom: 26,
              fontFamily: "Nunito-Medium",
              fontSize: 14,
              lineHeight: 21,
              color: colors.textSecondary,
            }}
          >
            Aquí encontrarás las prácticas que has realizado.
          </Text>

          <Estado cargando={cargando} error={error} reintentar={onReintentar} />

          {/* ESTADO VACÍO */}

          {!cargando && !error && registros.length === 0 && (
            <View
              style={{
                width: "100%",
                minHeight: 230,
                padding: 24,
                borderWidth: 1,
                borderRadius: 22,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
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
                  color: colors.text,
                  textAlign: "center",
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
                  lineHeight: 21,
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
              >
                Cuando completes una técnica, podrás consultar aquí tu
                historial.
              </Text>
            </View>
          )}

          {/* REGISTROS */}

          {!cargando && !error && registros.length > 0 && (
            <>
              <View
                style={{
                  marginBottom: 17,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Nunito-Bold",
                    fontSize: 19,
                    color: colors.text,
                  }}
                >
                  Mis prácticas
                </Text>

                <View
                  style={{
                    minWidth: 35,
                    height: 35,
                    paddingHorizontal: 10,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <Ionicons
                    name={registro.completada ? "checkmark" : "play"}
                    size={20}
                    color={colors.textOnPrimary}
                  />
                </View>

                <View style={styles.flex}>
                  <Text style={[styles.nombre, { color: colors.text }]}>
                    {registro.tecnica_complementaria?.nombre ??
                      "Técnica complementaria"}
                  </Text>

                  <Text
                    style={[
                      styles.fecha,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {new Date(registro.fecha_inicio).toLocaleDateString(
                      "es-GT",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Text>
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
                        width: esEscritorio ? "49%" : "100%",
                        minWidth: 0,
                        minHeight: 96,
                        padding: 15,
                        borderWidth: 1,
                        borderRadius: 19,
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 15,
                          flexShrink: 0,
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
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 15,
                            lineHeight: 21,
                            color: colors.text,
                          }}
                        >
                          {registro.tecnica_complementaria?.nombre ??
                            "Técnica complementaria"}
                        </Text>

                        <View
                          style={{
                            marginTop: 6,
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
                              minWidth: 0,
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

                        <Text
                          style={{
                            marginTop: 5,
                            fontFamily: "Nunito-SemiBold",
                            fontSize: 12,
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
            ))
          ))}
      </ScrollView>
    </View>
  );
}

// ============================================================
// 5. TÉCNICA COMPLETADA
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
  const insets = useSafeAreaInsets();

  const { esEscritorio, paddingHorizontal } = useTecnicasLayout();

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
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
          flexGrow: 1,
          paddingHorizontal,
          paddingTop: esEscritorio ? 70 : 40,
          paddingBottom: Math.max(insets.bottom + 28, 40),
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* CONFIRMACIÓN */}

          <View
            style={{
              width: 105,
              height: 105,
              borderRadius: 53,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.success,
            }}
          >
            <Ionicons name="checkmark" size={55} color={colors.textOnPrimary} />
          </View>

          <Text
            style={{
              marginTop: 27,
              fontFamily: "Nunito-Bold",
              fontSize: esEscritorio ? 32 : 28,
              lineHeight: 38,
              textAlign: "center",
              color: colors.text,
            }}
          >
            ¡Técnica completada!
          </Text>

          <Text
            style={{
              marginTop: 12,
              fontFamily: "Nunito-Medium",
              fontSize: 16,
              lineHeight: 24,
              textAlign: "center",
              color: colors.textSecondary,
            }}
          >
            Has terminado{"\n"}
            {nombre ?? "la técnica complementaria"}.
          </Text>

          {/* MENSAJE */}

          <View
            style={{
              width: "100%",
              marginTop: 28,
              padding: 20,
              borderWidth: 1,
              borderRadius: 18,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Medium",
                fontSize: 14,
                lineHeight: 22,
                textAlign: "center",
                color: colors.textSecondary,
              }}
            >
              {mensaje}
            </Text>
          </View>

          <View
            style={{
              flexGrow: 1,
              minHeight: 28,
            }}
          />

          {/* ACCIONES */}

          <View
            style={{
              width: "100%",
              marginTop: 28,
            }}
          >
            <BotonPrimario
              titulo="Volver a técnicas"
              icono="arrow-back"
              onPress={onVolver}
            />

            <Pressable
              onPress={onHistorial}
              style={({ pressed }) => ({
                alignSelf: "center",
                marginTop: 12,
                padding: 15,
                borderRadius: 12,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: 15,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Ver mi historial
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
