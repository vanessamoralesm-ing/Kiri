import React from "react";

import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import Button from "../../components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  const { width, esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

  const irModoAcceso = () => {
    router.push("/(auth)/modo_acceso");
  };

  const irLogin = () => {
    router.push("/(auth)/login");
  };

  // ======================================================
  // VALORES RESPONSIVE
  // ======================================================

  const paddingHorizontal = esEscritorio ? 48 : esTablet ? 32 : 24;

  const maxWidthContenido = esEscritorio ? 1180 : esTablet ? 960 : 520;

  const tamanoLogo = esEscritorio ? 180 : esTablet ? 160 : 150;

  const anchoMascota = esEscritorio
    ? 390
    : esTablet
      ? 320
      : Math.min(width * 0.75, 280);

  const altoMascota = esEscritorio ? 430 : esTablet ? 350 : 300;

  const tamanoTitulo = esEscritorio ? 46 : esTablet ? 40 : 36;

  const tamanoSubtitulo = esEscritorio ? 27 : esTablet ? 24 : 22;

  const tamanoDescripcion = esEscritorio ? 19 : esTablet ? 18 : 17;

  // ======================================================
  // UI
  // ======================================================

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_kiri.png.jpeg")}
      style={styles.imagenFondo}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            {
              maxWidth: maxWidthContenido,
              paddingHorizontal,

              flexDirection: esTelefono ? "column" : "row",

              gap: esTelefono ? 20 : 48,
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
                width: esTelefono ? "100%" : "48%",

                paddingTop: esTelefono ? 24 : 20,
              },
            ]}
          >
            {/* LOGO */}

            <Image
              source={require("../../assets/images/logo_secundario.png")}
              style={{
                width: tamanoLogo,
                height: 100,
                marginBottom: esTelefono ? 0 : 10,
              }}
              resizeMode="contain"
            />

            {/* MASCOTA */}

            <View
              style={[
                styles.imageContainer,
                {
                  width: anchoMascota,
                  height: altoMascota,
                },
              ]}
            >
              <Image
                source={require("../../assets/images/mascota.png")}
                style={styles.mascotImage}
                resizeMode="contain"
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
                width: esTelefono ? "100%" : "48%",

                paddingVertical: esTelefono ? 0 : 32,
              },
            ]}
          >
            {/* TÍTULO */}

            <Text
              style={[
                styles.title,
                {
                  fontSize: tamanoTitulo,
                  lineHeight: tamanoTitulo + 6,
                },
              ]}
            >
              Bienvenido a <Text style={styles.titleBlue}>Kiri</Text>
            </Text>

            {/* LÍNEA DECORATIVA */}

            <View style={styles.divider} />

            {/* SUBTÍTULO */}

            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: tamanoSubtitulo,
                  lineHeight: tamanoSubtitulo + 6,
                },
              ]}
            >
              Cuidar de tu salud mental es un acto de fortaleza
            </Text>

            {/* DESCRIPCIÓN */}

            <Text
              style={[
                styles.description,
                {
                  fontSize: tamanoDescripcion,
                  lineHeight: tamanoDescripcion + 8,
                },
              ]}
            >
              En Kiri encontrarás herramientas para conocerte mejor, comprender
              tus emociones y desarrollar hábitos que favorezcan tu bienestar.
            </Text>

            {/* TEXTO DE ACOMPAÑAMIENTO */}

            <Text style={styles.footerText}>
              Nunca estarás <Text style={styles.greenText}>solo</Text> en este
              proceso.
            </Text>

            {/* ==================================================
                BOTÓN PRINCIPAL
            ================================================== */}

            <View style={styles.buttonContainer}>
              <Button
                title="Comenzar"
                variant="primary"
                onPress={irModoAcceso}
              />
            </View>

            {/* ==================================================
                SEPARADOR
            ================================================== */}

            <View style={styles.dividerContainer}>
              <View style={styles.line} />

              <Text style={styles.dividerText}>o</Text>

              <View style={styles.line} />
            </View>

            {/* ==================================================
                LOGIN
            ================================================== */}

            <Button
              title="¿Ya tienes una cuenta? Iniciar Sesión"
              variant="secondary"
              onPress={irLogin}
            />
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
  imagenFondo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,

    width: "100%",

    alignSelf: "center",

    alignItems: "center",

    justifyContent: "center",

    paddingTop: 24,

    paddingBottom: 30,
  },

  // ======================================================
  // PANEL VISUAL
  // ======================================================

  visualPanel: {
    alignItems: "center",

    justifyContent: "center",
  },

  imageContainer: {
    justifyContent: "center",

    alignItems: "center",
  },

  mascotImage: {
    width: "100%",

    height: "100%",
  },

  // ======================================================
  // PANEL DE CONTENIDO
  // ======================================================

  contentPanel: {
    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    fontWeight: "700",

    fontFamily: "Nunito-Bold",

    color: "#2D3748",

    textAlign: "center",
  },

  titleBlue: {
    color: "#4F8EF7",
  },

  divider: {
    width: 40,

    height: 4,

    backgroundColor: "#B8A8F8",

    borderRadius: 5,

    marginVertical: 11,
  },

  subtitle: {
    color: "#4F8EF7",

    fontWeight: "600",

    fontFamily: "Nunito-SemiBold",

    textAlign: "center",

    marginBottom: 12,
  },

  description: {
    fontWeight: "400",

    fontFamily: "Nunito-Medium",

    color: "#2D3748",

    textAlign: "center",

    marginBottom: 10,
  },

  footerText: {
    fontSize: 18,

    fontFamily: "Nunito-Medium",

    color: "#2D3748",

    textAlign: "center",

    marginBottom: 22,
  },

  greenText: {
    color: "#7BBF9A",

    fontWeight: "700",

    fontFamily: "Nunito-Medium",
  },

  // ======================================================
  // BOTONES
  // ======================================================

  buttonContainer: {
    width: "100%",
  },

  // ======================================================
  // SEPARADOR
  // ======================================================

  dividerContainer: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",

    marginVertical: 12,
  },

  line: {
    flex: 1,

    height: 1,

    backgroundColor: "#2D3748",
  },

  dividerText: {
    marginHorizontal: 15,

    fontSize: 16,

    fontFamily: "Nunito-Medium",

    color: "#2D3748",
  },
});
