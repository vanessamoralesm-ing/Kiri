import { useRouter } from "expo-router";
import React from "react";

import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function WelcomeScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width, height, esTelefono, esTablet, esEscritorio } =
    useResponsiveLayout();

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function irModoAcceso() {
    router.push("/(auth)/modo_acceso");
  }

  function irLogin() {
    router.push("/(auth)/login");
  }

  // ========================================================
  // RESPONSIVE GENERAL
  // ========================================================

  const telefonoPequeno = esTelefono && height < 760;

  const telefonoMuyPequeno = esTelefono && height < 680;

  const paddingHorizontal = esEscritorio ? 60 : esTablet ? 36 : 20;

  const paddingTop = esEscritorio
    ? 40
    : esTablet
      ? 28
      : Math.max(insets.top + 8, 16);

  const paddingBottom = esEscritorio
    ? 40
    : esTablet
      ? 28
      : Math.max(insets.bottom + 28, 36);

  const maxWidthContenido = esEscritorio ? 1240 : esTablet ? 980 : 560;

  // ========================================================
  // LOGO
  // ========================================================

  const tamanoLogo = esEscritorio
    ? 180
    : esTablet
      ? 150
      : telefonoMuyPequeno
        ? 74
        : telefonoPequeno
          ? 82
          : 90;

  const altoLogo = esEscritorio
    ? 90
    : esTablet
      ? 78
      : telefonoMuyPequeno
        ? 36
        : telefonoPequeno
          ? 40
          : 44;

  // ========================================================
  // MASCOTA
  // ========================================================

  const tamanoCirculo = esEscritorio
    ? 380
    : esTablet
      ? 310
      : telefonoMuyPequeno
        ? Math.min(width * 0.42, 160)
        : telefonoPequeno
          ? Math.min(width * 0.46, 178)
          : Math.min(width * 0.5, 205);

  const tamanoMascota = esEscritorio
    ? 360
    : esTablet
      ? 290
      : telefonoMuyPequeno
        ? Math.min(width * 0.4, 152)
        : telefonoPequeno
          ? Math.min(width * 0.44, 170)
          : Math.min(width * 0.48, 195);

  // ========================================================
  // TIPOGRAFÍA
  // ========================================================

  const tamanoTitulo = esEscritorio
    ? 40
    : esTablet
      ? 36
      : telefonoMuyPequeno
        ? 23
        : telefonoPequeno
          ? 25
          : 28;

  const tamanoSubtitulo = esEscritorio
    ? 22
    : esTablet
      ? 20
      : telefonoMuyPequeno
        ? 15
        : telefonoPequeno
          ? 16
          : 17;

  const tamanoDescripcion = esEscritorio
    ? 17
    : esTablet
      ? 16
      : telefonoMuyPequeno
        ? 12
        : telefonoPequeno
          ? 13
          : 14;

  // ========================================================
  // DISTRIBUCIÓN
  // ========================================================

  const anchoPanelVisual = esTelefono ? "100%" : esEscritorio ? "46%" : "48%";

  const anchoPanelContenido = esTelefono
    ? "100%"
    : esEscritorio
      ? "46%"
      : "48%";

  const paddingCardHorizontal = esEscritorio ? 52 : esTablet ? 36 : 0;

  const paddingCardVertical = esEscritorio ? 42 : esTablet ? 30 : 0;

  const gapCard = esEscritorio
    ? 34
    : esTablet
      ? 24
      : telefonoMuyPequeno
        ? 5
        : telefonoPequeno
          ? 7
          : 10;

  // ========================================================
  // UI
  // ========================================================

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_kiri.png.jpeg")}
      style={styles.imagenFondo}
      resizeMode="cover"
    >
      {/* ==================================================
          CAPA SUAVE
      ================================================== */}

      <View style={styles.overlay} />

      {/* ==================================================
          SCROLL
      ================================================== */}

      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal,
            paddingTop,
            paddingBottom,

            justifyContent: esTelefono ? "flex-start" : "center",
          },
        ]}
      >
        {/* ==================================================
            CONTENEDOR GENERAL
        ================================================== */}

        <View
          style={[
            styles.wrapper,
            {
              maxWidth: maxWidthContenido,

              width: esTelefono ? "100%" : esTablet ? "94%" : "92%",
            },
          ]}
        >
          {/* ==================================================
              TARJETA
          ================================================== */}

          <View
            style={[
              styles.mainCard,
              {
                flexDirection: esTelefono ? "column" : "row",

                paddingHorizontal: paddingCardHorizontal,

                paddingVertical: paddingCardVertical,

                gap: gapCard,

                borderRadius: esTelefono ? 0 : 34,

                backgroundColor: esTelefono
                  ? "transparent"
                  : "rgba(255,255,255,0.78)",

                borderWidth: esTelefono ? 0 : 1,

                borderColor: esTelefono
                  ? "transparent"
                  : "rgba(184,168,248,0.18)",

                ...(Platform.OS === "web" && !esTelefono
                  ? ({
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                  } as any)
                  : {}),

                ...(Platform.OS === "ios" && !esTelefono
                  ? {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },

                    shadowOpacity: 0.08,

                    shadowRadius: 20,
                  }
                  : {}),

                ...(Platform.OS === "android" && !esTelefono
                  ? {
                    elevation: 6,
                  }
                  : {}),
              },
            ]}
          >
            {/* ==================================================
                PANEL VISUAL
            ================================================== */}

            <View
              style={[
                styles.visualPanel,
                {
                  width: anchoPanelVisual,

                  minHeight: esTelefono ? undefined : 420,

                  alignItems: "center",

                  justifyContent: "center",
                },
              ]}
            >
              {/* LOGO */}

              <Image
                source={require("../../assets/images/logo_secundario.png")}
                resizeMode="contain"
                style={{
                  width: tamanoLogo,

                  height: altoLogo,

                  marginBottom: esTelefono ? (telefonoMuyPequeno ? 2 : 5) : 16,
                }}
              />

              {/* MASCOTA */}

              <View
                style={[
                  styles.mascotCircle,
                  {
                    width: tamanoCirculo,

                    height: tamanoCirculo,

                    borderRadius: tamanoCirculo / 2,
                  },
                ]}
              >
                <Image
                  source={require("../../assets/images/mascota.png")}
                  resizeMode="contain"
                  style={{
                    width: tamanoMascota,

                    height: tamanoMascota,
                  }}
                />
              </View>
            </View>

            {/* ==================================================
                PANEL DE CONTENIDO
            ================================================== */}

            <View
              style={[
                styles.contentPanel,
                {
                  width: anchoPanelContenido,

                  minHeight: esTelefono ? undefined : 420,

                  alignItems: "center",

                  justifyContent: esTelefono ? "flex-start" : "center",

                  paddingTop: esTelefono
                    ? telefonoMuyPequeno
                      ? 4
                      : telefonoPequeno
                        ? 6
                        : 10
                    : 0,
                },
              ]}
            >
              {/* =================================================
                  TÍTULO
              ================================================= */}

              <Text
                style={[
                  styles.title,
                  {
                    fontSize: tamanoTitulo,

                    lineHeight: tamanoTitulo + 5,
                  },
                ]}
              >
                Bienvenido a <Text style={styles.titleBlue}>Kiri</Text>
              </Text>

              {/* =================================================
                  DIVISOR
              ================================================= */}

              <View
                style={[
                  styles.divider,
                  {
                    marginTop: telefonoMuyPequeno
                      ? 6
                      : telefonoPequeno
                        ? 8
                        : 10,

                    marginBottom: telefonoMuyPequeno
                      ? 8
                      : telefonoPequeno
                        ? 10
                        : 14,
                  },
                ]}
              />

              {/* =================================================
                  SUBTÍTULO
              ================================================= */}

              <Text
                style={[
                  styles.subtitle,
                  {
                    fontSize: tamanoSubtitulo,

                    lineHeight: tamanoSubtitulo + 6,

                    maxWidth: 460,

                    marginBottom: telefonoMuyPequeno
                      ? 7
                      : telefonoPequeno
                        ? 9
                        : 12,
                  },
                ]}
              >
                Cuidar de tu salud mental es un acto de fortaleza
              </Text>

              {/* =================================================
                  DESCRIPCIÓN
              ================================================= */}

              <Text
                style={[
                  styles.description,
                  {
                    fontSize: tamanoDescripcion,

                    lineHeight: tamanoDescripcion + 7,

                    maxWidth: esEscritorio ? 500 : 460,

                    marginBottom: telefonoMuyPequeno
                      ? 5
                      : telefonoPequeno
                        ? 7
                        : 10,
                  },
                ]}
              >
                En Kiri encontrarás herramientas para conocerte mejor,
                comprender tus emociones y desarrollar hábitos que favorezcan tu
                bienestar.
              </Text>

              {/* =================================================
                  MENSAJE FINAL
              ================================================= */}

              <Text
                style={[
                  styles.footerText,
                  {
                    fontSize: esEscritorio
                      ? 16
                      : telefonoMuyPequeno
                        ? 12
                        : telefonoPequeno
                          ? 13
                          : 14,

                    lineHeight: esTelefono ? 20 : 22,

                    marginBottom: telefonoMuyPequeno
                      ? 8
                      : telefonoPequeno
                        ? 10
                        : 14,
                  },
                ]}
              >
                Nunca estarás <Text style={styles.greenText}>solo</Text> en este
                proceso.
              </Text>

              {/* =================================================
                  ACCIONES
              ================================================= */}

              <View
                style={{
                  width: "100%",

                  maxWidth: 460,

                  alignSelf: "center",

                  marginTop: telefonoMuyPequeno ? 2 : telefonoPequeno ? 4 : 8,
                }}
              >
                {/* ===============================================
                    BOTÓN COMENZAR
                =============================================== */}

                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={irModoAcceso}
                  style={{
                    width: "100%",

                    minHeight: telefonoMuyPequeno
                      ? 48
                      : telefonoPequeno
                        ? 52
                        : 56,

                    paddingHorizontal: 20,

                    paddingVertical: telefonoMuyPequeno ? 10 : 12,

                    borderRadius: 18,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: "#4F8EF7",

                    ...(Platform.OS === "ios"
                      ? {
                        shadowColor: "#4F8EF7",

                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },

                        shadowOpacity: 0.18,

                        shadowRadius: 6,
                      }
                      : {}),

                    ...(Platform.OS === "android"
                      ? {
                        elevation: 3,
                      }
                      : {}),
                  }}
                >
                  <Text
                    style={[
                      styles.textoBotonPrincipal,
                      {
                        fontSize: telefonoMuyPequeno ? 15 : 17,
                      },
                    ]}
                  >
                    Comenzar
                  </Text>
                </TouchableOpacity>

                {/* ===============================================
                    SEPARADOR
                =============================================== */}

                <View
                  style={[
                    styles.dividerContainer,
                    {
                      marginVertical: telefonoMuyPequeno
                        ? 10
                        : telefonoPequeno
                          ? 12
                          : 16,
                    },
                  ]}
                >
                  <View style={styles.line} />

                  <Text style={styles.dividerText}>o</Text>

                  <View style={styles.line} />
                </View>

                {/* ===============================================
                    LOGIN
                =============================================== */}

                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={irLogin}
                  style={{
                    width: "100%",

                    minHeight: telefonoMuyPequeno
                      ? 46
                      : telefonoPequeno
                        ? 50
                        : 54,

                    paddingHorizontal: 12,

                    paddingVertical: telefonoMuyPequeno ? 8 : 10,

                    borderRadius: 18,

                    borderWidth: 2,

                    borderColor: "#4F8EF7",

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: "rgba(255,255,255,0.92)",
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textoBotonSecundario,
                      {
                        fontSize: telefonoMuyPequeno
                          ? 12
                          : telefonoPequeno
                            ? 13
                            : 14,

                        lineHeight: 20,
                      },
                    ]}
                  >
                    ¿Ya tienes una cuenta?{" "}
                    <Text style={styles.textoLoginDestacado}>
                      Iniciar sesión
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  // ======================================================
  // FONDO
  // ======================================================

  imagenFondo: {
    flex: 1,

    width: "100%",

    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(255,255,255,0.58)",
  },

  // ======================================================
  // SCROLL
  // ======================================================

  scrollContainer: {
    flexGrow: 1,

    alignItems: "center",
  },

  wrapper: {
    alignSelf: "center",

    width: "100%",
  },

  // ======================================================
  // CONTENEDOR PRINCIPAL
  // ======================================================

  mainCard: {
    width: "100%",

    alignItems: "center",

    justifyContent: "center",
  },

  // ======================================================
  // VISUAL
  // ======================================================

  visualPanel: {
    alignItems: "center",

    justifyContent: "center",
  },

  mascotCircle: {
    backgroundColor: "rgba(184,168,248,0.15)",

    alignItems: "center",

    justifyContent: "center",
  },

  // ======================================================
  // CONTENIDO
  // ======================================================

  contentPanel: {
    alignItems: "center",
  },

  title: {
    fontFamily: "Nunito-Bold",

    color: "#2D3748",

    textAlign: "center",
  },

  titleBlue: {
    color: "#4F8EF7",
  },

  divider: {
    width: 52,

    height: 4,

    backgroundColor: "#B8A8F8",

    borderRadius: 999,
  },

  subtitle: {
    fontFamily: "Nunito-SemiBold",

    color: "#4F8EF7",

    textAlign: "center",
  },

  description: {
    fontFamily: "Nunito-Medium",

    color: "#2D3748",

    textAlign: "center",
  },

  footerText: {
    fontFamily: "Nunito-Medium",

    color: "#2D3748",

    textAlign: "center",
  },

  greenText: {
    color: "#7BBF9A",

    fontFamily: "Nunito-Bold",
  },

  // ======================================================
  // BOTÓN PRINCIPAL
  // ======================================================

  textoBotonPrincipal: {
    fontFamily: "Nunito-Bold",

    color: "#FFFFFF",

    textAlign: "center",

    includeFontPadding: false,
  },

  // ======================================================
  // SEPARADOR
  // ======================================================

  dividerContainer: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",
  },

  line: {
    flex: 1,

    height: 1,

    backgroundColor: "rgba(45,55,72,0.22)",
  },

  dividerText: {
    marginHorizontal: 15,

    fontSize: 14,

    fontFamily: "Nunito-Medium",

    color: "#64748B",
  },

  // ======================================================
  // LOGIN
  // ======================================================

  textoBotonSecundario: {
    width: "100%",

    fontFamily: "Nunito-SemiBold",

    color: "#475569",

    textAlign: "center",

    includeFontPadding: false,
  },

  textoLoginDestacado: {
    fontFamily: "Nunito-Bold",

    color: "#4F8EF7",
  },
});
