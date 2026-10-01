import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useRouter } from "expo-router";

import React from "react";

import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "../../components/ui/Button";
import OptionCard from "../../components/ui/OptionCard";

export default function AccessTypeScreen() {
  const router = useRouter();

  const { width, esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

  const handleIndependetUser = () => {
    router.push("/(auth)/registro");
  };

  const handleEducationalInstitution = () => {
    router.push("/(auth)/institucion_codigo");
  };

  const handleAdminInstitucion = () => {
    router.push("/(auth)/registro_institucion");
  };

  const irLogin = () => {
    router.push("/(auth)/login");
  };

  // ======================================================
  // VALORES RESPONSIVE
  // ======================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.contenido
    : esTablet
      ? 900
      : 520;

  const tamanoLogo = esEscritorio ? 190 : esTablet ? 175 : 160;

  const tamanoTitulo = esEscritorio ? 40 : esTablet ? 37 : 35;

  const tamanoSubtitulo = esEscritorio ? 24 : esTablet ? 23 : 22;

  // ======================================================
  // CÁLCULO DEL ANCHO REAL DISPONIBLE
  // ======================================================

  const anchoContenedor = Math.min(width, maxWidthContenido);

  const anchoUtil = anchoContenedor - paddingHorizontal * 2;

  const gapCards = 16;

  const anchoCard = esEscritorio
    ? (anchoUtil - gapCards * 2) / 3
    : esTablet
      ? (anchoUtil - gapCards) / 2
      : anchoUtil;

  // ======================================================
  // UI
  // ======================================================

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.container,
          {
            maxWidth: maxWidthContenido,

            paddingHorizontal,
          },
        ]}
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <Image
          source={require("../../assets/images/logo_secundario.png")}
          style={[
            styles.logoTop,
            {
              width: tamanoLogo,
            },
          ]}
          resizeMode="contain"
        />

        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <Text
          style={[
            styles.title,
            {
              fontSize: tamanoTitulo,
            },
          ]}
        >
          ¿Cómo accederás?
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: tamanoSubtitulo,
            },
          ]}
        >
          Selecciona una opción para comenzar.
        </Text>

        {/* ==================================================
            OPCIONES
        ================================================== */}

        <View
          style={[
            styles.cardsContainer,
            {
              gap: gapCards,

              flexDirection: esTelefono ? "column" : "row",
            },
          ]}
        >
          {/* USUARIO INDEPENDIENTE */}

          <View
            style={{
              width: esTelefono ? "100%" : anchoCard,
            }}
          >
            <OptionCard
              title="Usuario Independiente"
              description="Cuida tu bienestar emocional con herramientas personalizadas."
              imageSource={require("../../assets/images/usuario.png")}
              onPress={handleIndependetUser}
            />
          </View>

          {/* INSTITUCIÓN EDUCATIVA */}

          <View
            style={{
              width: esTelefono ? "100%" : anchoCard,
            }}
          >
            <OptionCard
              title="Institución Educativa"
              description="Accede con el código de tu colegio o universidad."
              imageSource={require("../../assets/images/institucion_user.png")}
              onPress={handleEducationalInstitution}
            />
          </View>

          {/* SOY INSTITUCIÓN */}

          <View
            style={{
              width: esTelefono ? "100%" : anchoCard,
            }}
          >
            <OptionCard
              title="Soy Institución"
              description="Quiero crear un panel para mi comunidad."
              imageSource={require("../../assets/images/institucion.png")}
              onPress={handleAdminInstitucion}
            />
          </View>
        </View>

        {/* ==================================================
            LOGIN
        ================================================== */}

        <View
          style={[
            styles.loginContainer,
            {
              maxWidth: esTelefono ? undefined : MAX_WIDTHS.formularioAuth,
            },
          ]}
        >
          <Button
            title="¿Ya tienes una cuenta? Iniciar Sesión"
            variant="secondary"
            onPress={irLogin}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,

    backgroundColor: "#F8FAFC",
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

    paddingTop: 30,

    paddingBottom: 30,
  },

  logoTop: {
    height: 100,

    marginBottom: -11,
  },

  title: {
    fontFamily: "Nunito-Bold",

    fontWeight: "700",

    color: "#2C3E50",

    textAlign: "center",

    marginBottom: 8,
  },

  subtitle: {
    fontFamily: "Nunito-Medium",

    fontWeight: "400",

    color: "#64748B",

    textAlign: "center",

    marginBottom: 24,
  },

  cardsContainer: {
    width: "100%",

    flexWrap: "wrap",

    justifyContent: "center",

    alignItems: "stretch",
  },

  loginContainer: {
    width: "100%",

    alignSelf: "center",

    marginTop: 24,
  },
});
