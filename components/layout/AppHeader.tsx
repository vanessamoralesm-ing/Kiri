import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, Pressable, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import {
  obtenerPerfilCompleto,
  suscribirFotoPerfil,
} from "@/services/perfil/perfilService";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { dark: isDarkMode } = useTheme();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // TEMA
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  // ESTADO
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [versionFoto, setVersionFoto] = useState(0);
  const [imagenFallida, setImagenFallida] = useState(false);

  // RESPONSIVE
  const alturaHeader = esTelefono ? 68 : esTablet ? 76 : 72;

  const paddingHorizontal = esTelefono ? 16 : esTablet ? 24 : 28;

  const anchoLogo = esTelefono ? 108 : 125;
  const altoLogo = esTelefono ? 52 : 58;

  const tamanoAvatar = esTelefono ? 42 : 46;

  // ESCUCHAR ACTUALIZACIONES DE FOTOGRAFÍA
  useEffect(() => {
    return suscribirFotoPerfil(() => {
      setImagenFallida(false);
      setVersionFoto((actual) => actual + 1);
    });
  }, []);

  // RECUPERAR FOTOGRAFÍA
  useEffect(() => {
    let activo = true;

    async function cargarFotoPerfil() {
      try {
        const perfil = await obtenerPerfilCompleto();

        if (!activo) return;

        const foto = perfil?.foto_url?.trim() || null;

        setFotoPerfil(foto);
        setImagenFallida(false);
      } catch (error) {
        console.error("No se pudo recuperar la fotografía del perfil:", error);

        if (activo) {
          setFotoPerfil(null);
          setImagenFallida(false);
        }
      }
    }

    void cargarFotoPerfil();

    return () => {
      activo = false;
    };
  }, [pathname, versionFoto]);

  // ACTUALIZAR CACHÉ SOLO EN URL REMOTAS
  const uriFoto = fotoPerfil
    ? /^https?:\/\//i.test(fotoPerfil)
      ? `${fotoPerfil}${fotoPerfil.includes("?") ? "&" : "?"
      }kiri_avatar_v=${versionFoto}`
      : fotoPerfil
    : null;

  return (
    <View
      style={{
        width: "100%",
        height: alturaHeader,
        paddingHorizontal,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: esEscritorio ? "flex-end" : "space-between",

        backgroundColor: surfaceColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,

        ...(Platform.OS === "web"
          ? ({
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.03)",
          } as any)
          : {}),
      }}
    >
      {/* LOGO: TELÉFONO Y TABLETA */}
      {!esEscritorio && (
        <View
          style={{
            width: anchoLogo,
            height: altoLogo,
            flexShrink: 1,

            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              isDarkMode
                ? require("../../assets/images/splash-icon-ps.png")
                : require("../../assets/images/splash-icon.png")
            }
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      )}

      {/* AVATAR: SIEMPRE VISIBLE */}
      <Pressable
        onPress={() => router.push("/(tabs)/perfil")}
        accessibilityRole="button"
        accessibilityLabel="Abrir mi perfil"
        hitSlop={8}
        style={({ pressed }) => ({
          width: tamanoAvatar,
          height: tamanoAvatar,
          minWidth: tamanoAvatar,
          minHeight: tamanoAvatar,

          marginLeft: 12,
          flexShrink: 0,

          borderRadius: tamanoAvatar / 2,
          borderWidth: 1,
          borderColor,

          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",

          opacity: pressed ? 0.75 : 1,
          backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
        })}
      >
        {uriFoto && !imagenFallida ? (
          <Image
            key={uriFoto}
            source={{ uri: uriFoto }}
            resizeMode="cover"
            onError={(event) => {
              console.warn(
                "No se pudo cargar el avatar:",
                event.nativeEvent.error,
              );
              setImagenFallida(true);
            }}
            style={{
              width: tamanoAvatar - 2,
              height: tamanoAvatar - 2,
              borderRadius: (tamanoAvatar - 2) / 2,
            }}
          />
        ) : (
          <Ionicons
            name="person-outline"
            size={esTelefono ? 23 : 25}
            color={primaryColor}
          />
        )}
      </Pressable>
    </View>
  );
}