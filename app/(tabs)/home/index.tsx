import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EncabezadoHome } from "@/components/ui/EncabezadoHome";
import { TarjetaModulo } from "@/components/ui/TarjetaModulo";
import { TarjetaRecomendacion } from "@/components/ui/TarjetaRecomendacion";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResumenBienestar } from "@/hooks/useResumenBienestar";

// COLORES VISUALES DE RECOMENDACIONES
const COLORES_RECOMENDACION = [
  {
    fondoClaro: "bg-purple-100",
    fondoOscuro: "bg-purple-950",
    icono: "#8B5CF6",
  },
  {
    fondoClaro: "bg-emerald-100",
    fondoOscuro: "bg-emerald-950",
    icono: "#10B981",
  },
  { fondoClaro: "bg-blue-100", fondoOscuro: "bg-blue-950", icono: "#4F8EF7" },
  { fondoClaro: "bg-amber-100", fondoOscuro: "bg-amber-950", icono: "#F59E0B" },
];

// HOME
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dark: isDarkMode } = useTheme();
  const { resumen } = useResumenBienestar();

  // COLORES DEL TEMA
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");

  // UI
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          // Espacio adicional para que la barra inferior
          // no cubra las últimas tarjetas en Android.
          paddingBottom: Math.max(insets.bottom + 150, 175),
        }}
      >
        {/* ENCABEZADO */}
        <EncabezadoHome />

        {/* RACHA EMOCIONAL */}
        <View
          className="rounded-3xl p-5 mb-4"
          style={{
            backgroundColor: "#4F8EF7",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-SemiBold",
              fontSize: 13,
              color: "#EAF2FF",
            }}
          >
            Racha emocional
          </Text>

          <View className="flex-row justify-between items-center mt-2">
            {/* Racha */}
            <View className="flex-row items-baseline">
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: 35,
                  color: "#FFFFFF",
                }}
              >
                5
              </Text>

              <View
                style={{
                  flex: esEscritorio ? 1 : undefined,

                  flexDirection: esTelefono ? "column" : "row",

                  alignItems: esTelefono ? "flex-start" : "center",

                  justifyContent: "space-between",

                  gap: esTelefono ? 14 : 10,

                  marginTop: 8,
                }}
              >
                {/* ==========================================
                    DÍAS DE RACHA
                ========================================== */}

                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "baseline",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 39 : 35,

                      color: textOnPrimaryColor,
                    }}
                  >
                    {cargandoProgreso ? "—" : rachaActual}
                  </Text>

                  <Text
                    style={{
                      marginLeft: 5,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,

                      color: textOnPrimaryColor,
                    }}
                  >
                    {rachaActual === 1 ? "día" : "días"}
                  </Text>
                </View>

                {/* ==========================================
                    ÚLTIMOS SIETE DÍAS
                ========================================== */}

                <View
                  style={{
                    flexDirection: "row",

                    flexWrap: "wrap",

                    gap: 5,
                  }}
                >
                  {diasSemana.map((dia) => (
                    <View
                      key={dia.fecha}
                      style={{
                        width: 29,

                        height: 29,

                        borderRadius: 15,

                        borderWidth: dia.esHoy ? 1.5 : 0,

                        borderColor: "rgba(255,255,255,0.95)",

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: dia.completado
                          ? secondaryColor
                          : "rgba(255,255,255,0.22)",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 11,

                          color: textOnPrimaryColor,
                        }}
                      >
                        {dia.etiqueta}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* ==========================================
                    LLAMA
                ========================================== */}

                <Ionicons
                  name={actividadHoy ? "flame" : "flame-outline"}
                  size={28}
                  color={textOnPrimaryColor}
                />
              </View>

              {/* ==========================================
                  MENSAJE
              ========================================== */}

              <Text
                style={{
                  marginLeft: 4,
                  fontFamily: "Nunito-Medium",
                  fontSize: 12,
                  color: "#FFFFFF",
                }}
              >
                días
              </Text>
            </View>

            {/* Días */}
            <View className="flex-row gap-1">
              {["L", "M", "M", "J", "V", "S", "D"].map((dia, index) => (
                <View
                  key={index}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      index < 5 ? "#7BBF9A" : "rgba(255,255,255,0.22)",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 13,
                      color: "#FFFFFF",
                    }}
                  >
                    {dia}
                  </Text>
                </View>
              ))}
            </View>

            <Ionicons name="flame" size={26} color="#FFFFFF" />
          </View>

          <Text
            style={{
              marginTop: 8,
              textAlign: "right",
              fontFamily: "Nunito-Medium",
              fontSize: 12,
              color: "#EAF2FF",
            }}
          >
            ¡Sigue así!
          </Text>
        </View>

        {/* MI PROGRESO */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => console.log("Ir a Mi Progreso")}
          className="rounded-3xl p-4 flex-row items-center justify-between mb-5"
          style={{
            backgroundColor: "#7BBF9A",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center">
            <View
              style={{
                width: "100%",

                flexDirection: "row",

                flexWrap: "wrap",

                columnGap: gapModulos,

                rowGap: esTelefono ? 12 : 16,

                alignItems: "flex-start",
              }}
            >
              <Ionicons
                name="trophy-outline"
                size={21}
                color="#FFFFFF"
              />
            </View>

                    minHeight: esEscritorio ? 175 : esTablet ? 180 : undefined,
                    flexGrow: 0,
                    flexShrink: 0,
                  }}
                >
                  <TarjetaModulo
                    titulo={modulo.titulo}
                    descripcion={modulo.descripcion}
                    nombreIcono={modulo.icono}
                    colorAcento={modulo.color}
                    fondoIconoClaro={modulo.fondoIconoClaro}
                    fondoIconoOscuro={modulo.fondoIconoOscuro}
                    onPress={() => abrirModulo(modulo.id)}
                  />
                </View>
              ))}
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* MÓDULOS DE INGRESO RÁPIDO */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <TarjetaModulo
            titulo="Nuevo Registro en Diario"
            nombreIcono="book-outline"
            onPress={() =>
              router.push({
                pathname: "/diario/nuevo" as never,
                params: {
                  origen: "home",
                },
              })
            }
          />
          <TarjetaModulo
            titulo="Cuestionarios"
            nombreIcono="document-text-outline"
            onPress={() => router.push("/(tabs)/cuestionarios")}
          />
          <TarjetaModulo
            titulo="Ir a Foro Comunitario"
            nombreIcono="megaphone-outline"
            onPress={() => router.push("/(tabs)/foro")}
          />
          <TarjetaModulo
            titulo="Entrevista de Bienestar"
            nombreIcono="heart-outline"
            onPress={() => router.push("/(tabs)/entrevistas")}
          />
          <TarjetaModulo
            titulo="Técnicas Complementarias"
            nombreIcono="clipboard-outline"
            onPress={() => router.push("/(tabs)/tecnicas")}
          />
        </View>

        {/* PLAN RECOMENDADO */}
        <View className="mb-12 px-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 18,
                color: textColor,
              }}
            >
              Plan recomendado
            </Text>

            {resumen?.id_entrevista && resumen.actividades.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/entrevistas/[id]/plan",
                    params: { id: resumen.id_entrevista },
                  })
                }
              >
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 12,
                    color: primaryColor,
                  }}
                >
                  Ver más
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* RECOMENDACIONES */}
          {resumen?.actividades?.length ? (
            resumen.actividades.slice(0, 4).map((actividad, index) => {
              const color =
                COLORES_RECOMENDACION[index % COLORES_RECOMENDACION.length];
              const fondoRecomendacion = isDarkMode
                ? color.fondoOscuro
                : color.fondoClaro;

              return (
                <TarjetaRecomendacion
                  key={actividad.codigo}
                  titulo={actividad.titulo}
                  descripcion={actividad.descripcion}
                  nombreIcono={
                    actividad.icono as keyof typeof Ionicons.glyphMap
                  }
                  colorFondo={fondoRecomendacion}
                  colorIcono={color.icono}
                  colorTextoFlecha={color.icono}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/entrevistas/[id]/plan",
                      params: { id: resumen.id_entrevista },
                    })
                  }
                />
              );
            })
          ) : (
            <TarjetaRecomendacion
              titulo="Realiza tu entrevista de bienestar"
              descripcion="Completa tu evaluación para recibir un plan personalizado."
              nombreIcono="heart-outline"
              colorFondo={
                isDarkMode
                  ? "bg-blue-950"
                  : "bg-blue-100"
              }
              colorIcono="#4F8EF7"
              colorTextoFlecha="#4F8EF7"
              onPress={() =>
                router.push("/(tabs)/entrevistas")
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
