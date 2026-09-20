import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  // RESPONSIVE
  // ======================================================

  const paddingHorizontal = esEscritorio ? 60 : esTablet ? 36 : 22;
  const paddingVertical = esEscritorio ? 40 : esTablet ? 28 : 20;

  const maxWidthContenido = esEscritorio ? 1240 : esTablet ? 980 : 540;

  const anchoTarjeta = esEscritorio ? "92%" : esTablet ? "94%" : "100%";

  const tamanoLogo = esEscritorio ? 180 : esTablet ? 160 : 145;

  const anchoMascota = esEscritorio
    ? 360
    : esTablet
      ? 300
      : Math.min(width * 0.66, 250);

  const altoMascota = esEscritorio ? 360 : esTablet ? 300 : 250;

  const tamanoTitulo = esEscritorio ? 40 : esTablet ? 36 : 30;
  const tamanoSubtitulo = esEscritorio ? 22 : esTablet ? 20 : 18;
  const tamanoDescripcion = esEscritorio ? 17 : esTablet ? 16 : 15;

  const anchoPanelVisual = esTelefono ? "100%" : esEscritorio ? "46%" : "48%";
  const anchoPanelContenido = esTelefono
    ? "100%"
    : esEscritorio
      ? "46%"
      : "48%";

  // ======================================================
  // UI
  // ======================================================

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_kiri.png.jpeg")}
      style={styles.imagenFondo}
      resizeMode="cover"
    >
      {/* Capa suave para bajar el peso visual del fondo */}
      <View style={styles.overlay} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal,
            paddingVertical,
          },
        ]}
      >
        <View
          style={[
            styles.wrapper,
            {
              maxWidth: maxWidthContenido,
              width: anchoTarjeta,
            },
          ]}
        >
          <View
            style={[
              styles.mainCard,
              {
                flexDirection: esTelefono ? "column" : "row",
                paddingHorizontal: esEscritorio ? 52 : esTablet ? 36 : 22,
                paddingVertical: esEscritorio ? 42 : esTablet ? 30 : 24,
                gap: esEscritorio ? 34 : esTablet ? 24 : 20,
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
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Image
                source={require("../../assets/images/logo_secundario.png")}
                resizeMode="contain"
                style={{
                  width: tamanoLogo,
                  height: esEscritorio ? 90 : 82,
                  marginBottom: esTelefono ? 10 : 16,
                }}
              />

              <View
                style={[
                  styles.mascotCircle,
                  {
                    width: esEscritorio ? 380 : esTablet ? 320 : 260,
                    height: esEscritorio ? 380 : esTablet ? 320 : 260,
                    borderRadius: esEscritorio ? 190 : esTablet ? 160 : 130,
                  },
                ]}
              >
                <Image
                  source={require("../../assets/images/mascota.png")}
                  resizeMode="contain"
                  style={{
                    width: anchoMascota,
                    height: altoMascota,
                  }}
                />
              </View>
            </View>

            {/* ==================================================
                PANEL CONTENIDO
            ================================================== */}
            <View
              style={[
                styles.contentPanel,
                {
                  width: anchoPanelContenido,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
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

              <View style={styles.divider} />

              <Text
                style={[
                  styles.subtitle,
                  {
                    fontSize: tamanoSubtitulo,
                    lineHeight: tamanoSubtitulo + 6,
                    maxWidth: 460,
                  },
                ]}
              >
                Cuidar de tu salud mental es un acto de fortaleza
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    fontSize: tamanoDescripcion,
                    lineHeight: tamanoDescripcion + 8,
                    maxWidth: esEscritorio ? 500 : 460,
                  },
                ]}
              >
                En Kiri encontrarás herramientas para conocerte mejor,
                comprender tus emociones y desarrollar hábitos que favorezcan tu
                bienestar.
              </Text>

              <Text
                style={[
                  styles.footerText,
                  {
                    fontSize: esEscritorio ? 16 : 15,
                  },
                ]}
              >
                Nunca estarás <Text style={styles.greenText}>solo</Text> en este
                proceso.
              </Text>

              <View style={styles.buttonContainer}>
                <Button
                  title="Comenzar"
                  variant="primary"
                  onPress={irModoAcceso}
                />
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="¿Ya tienes una cuenta? Iniciar Sesión"
                  variant="secondary"
                  onPress={irLogin}
                />
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
  imagenFondo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.58)",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  wrapper: {
    alignSelf: "center",
    width: "100%",
  },

  mainCard: {
    width: "100%",
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(184, 168, 248, 0.18)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  visualPanel: {
    minHeight: 420,
  },

  mascotCircle: {
    backgroundColor: "rgba(184, 168, 248, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  contentPanel: {
    minHeight: 420,
  },

  title: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
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
    marginTop: 12,
    marginBottom: 16,
  },

  subtitle: {
    fontFamily: "Nunito-SemiBold",
    fontWeight: "600",
    color: "#4F8EF7",
    textAlign: "center",
    marginBottom: 14,
  },

  description: {
    fontFamily: "Nunito-Medium",
    fontWeight: "400",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 12,
  },

  footerText: {
    fontFamily: "Nunito-Medium",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 22,
  },

  greenText: {
    color: "#7BBF9A",
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
  },

  buttonContainer: {
    width: "100%",
    maxWidth: 460,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 460,
    marginVertical: 14,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(45, 55, 72, 0.22)",
  },

  dividerText: {
    marginHorizontal: 15,
    fontSize: 15,
    fontFamily: "Nunito-Medium",
    color: "#64748B",
  },
});
