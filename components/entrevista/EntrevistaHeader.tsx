import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import LogoutModal from "@/components/ui/LogoutModal";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PROPS
// ==========================================================

type Props = {
  onBack: () => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EntrevistaHeader({ onBack }: Props) {
  const router = useRouter();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [menuAbierto, setMenuAbierto] = useState(false);

  const [mostrarLogout, setMostrarLogout] = useState(false);

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const dividerColor = useThemeColor({}, "divider");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const iconColor = useThemeColor({}, "icon");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const alturaHeader = esEscritorio ? 68 : esTablet ? 64 : 60;

  const tamañoBoton = esEscritorio ? 46 : 44;

  const tamañoIcono = esEscritorio ? 26 : 25;

  const anchoMenu = esEscritorio ? 250 : esTablet ? 240 : 230;

  // ========================================================
  // ACCIONES
  // ========================================================

  function irPerfil() {
    setMenuAbierto(false);

    router.push("/(tabs)/perfil");
  }

  function cerrarSesion() {
    setMenuAbierto(false);

    setMostrarLogout(true);
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        width: "100%",

        minHeight: alturaHeader,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        zIndex: 1000,

        overflow: "visible",
      }}
    >
      {/* =================================================
          VOLVER
      ================================================= */}

      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => ({
          width: tamañoBoton,

          height: tamañoBoton,

          borderRadius: 14,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: pressed ? surfaceSecondaryColor : "transparent",

          opacity: pressed ? 0.82 : 1,
        })}
      >
        <Ionicons name="arrow-back" size={tamañoIcono} color={iconColor} />
      </Pressable>

      {/* =================================================
          PERFIL
      ================================================= */}

      <View
        style={{
          position: "relative",

          zIndex: 2000,

          ...(Platform.OS === "android"
            ? {
                elevation: 20,
              }
            : {}),
        }}
      >
        <Pressable
          onPress={() => setMenuAbierto((actual) => !actual)}
          hitSlop={10}
          style={({ pressed }) => ({
            width: tamañoBoton,

            height: tamañoBoton,

            borderRadius: 14,

            alignItems: "center",

            justifyContent: "center",

            backgroundColor: menuAbierto
              ? primarySoftColor
              : pressed
                ? surfaceSecondaryColor
                : "transparent",

            opacity: pressed ? 0.82 : 1,
          })}
        >
          <Ionicons
            name="person-outline"
            size={tamañoIcono}
            color={menuAbierto ? primaryColor : iconColor}
          />
        </Pressable>

        {/* =================================================
            MENÚ DESPLEGABLE
        ================================================= */}

        {menuAbierto && (
          <View
            style={{
              position: "absolute",

              top: tamañoBoton + 6,

              right: 0,

              width: anchoMenu,

              borderWidth: 1,

              borderRadius: 18,

              borderColor,

              paddingVertical: 7,

              paddingHorizontal: 6,

              zIndex: 3000,

              backgroundColor: surfaceColor,

              ...(Platform.OS === "web"
                ? ({
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                  } as any)
                : {}),

              ...(Platform.OS === "ios"
                ? {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },

                    shadowOpacity: 0.14,

                    shadowRadius: 12,
                  }
                : {}),

              ...(Platform.OS === "android"
                ? {
                    elevation: 20,
                  }
                : {}),
            }}
          >
            {/* =============================================
                MI PERFIL
            ============================================= */}

            <Pressable
              onPress={irPerfil}
              style={({ pressed }) => ({
                width: "100%",

                borderRadius: 13,

                overflow: "hidden",

                backgroundColor: pressed ? primarySoftColor : "transparent",
              })}
            >
              <View
                style={{
                  width: "100%",

                  minHeight: 58,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 10,

                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 38,

                    height: 38,

                    borderRadius: 19,

                    flexShrink: 0,

                    alignItems: "center",

                    justifyContent: "center",

                    marginRight: 12,

                    backgroundColor: primarySoftColor,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={primaryColor}
                  />
                </View>

                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",

                    minWidth: 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,

                      lineHeight: 20,

                      fontFamily: "Nunito-Bold",

                      includeFontPadding: false,

                      color: textColor,
                    }}
                  >
                    Mi perfil
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,

                      fontSize: 12,

                      lineHeight: 16,

                      fontFamily: "Nunito-Medium",

                      includeFontPadding: false,

                      color: textSecondaryColor,
                    }}
                  >
                    Ver mi información
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* =============================================
                SEPARADOR
            ============================================= */}

            <View
              style={{
                height: 1,

                marginHorizontal: 10,

                marginVertical: 4,

                backgroundColor: dividerColor,
              }}
            />

            {/* =============================================
                CERRAR SESIÓN
            ============================================= */}

            <Pressable
              onPress={cerrarSesion}
              style={({ pressed }) => ({
                width: "100%",

                borderRadius: 13,

                overflow: "hidden",

                backgroundColor: pressed
                  ? surfaceSecondaryColor
                  : "transparent",
              })}
            >
              <View
                style={{
                  width: "100%",

                  minHeight: 58,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 10,

                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 38,

                    height: 38,

                    borderRadius: 19,

                    flexShrink: 0,

                    alignItems: "center",

                    justifyContent: "center",

                    marginRight: 12,

                    backgroundColor: surfaceSecondaryColor,
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={iconColor}
                  />
                </View>

                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",

                    minWidth: 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,

                      lineHeight: 20,

                      fontFamily: "Nunito-Bold",

                      includeFontPadding: false,

                      color: textColor,
                    }}
                  >
                    Cerrar sesión
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,

                      fontSize: 12,

                      lineHeight: 16,

                      fontFamily: "Nunito-Medium",

                      includeFontPadding: false,

                      color: textSecondaryColor,
                    }}
                  >
                    Salir de tu cuenta
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      </View>

      {/* =================================================
          MODAL
      ================================================= */}

      <LogoutModal
        visible={mostrarLogout}
        onClose={() => setMostrarLogout(false)}
      />
    </View>
  );
}
