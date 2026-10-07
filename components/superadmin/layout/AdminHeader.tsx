import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import Logo from "@/components/ui/Logo_izq";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";
import { cn } from "@/utils/cn";

export default function AdminHeader() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);

  const nombreUsuario = useMemo(() => {
    const metadata = user?.user_metadata;

    return (
      profile?.nombre_preferido?.trim() ||
      profile?.nombres?.trim() ||
      metadata?.nombre_preferido?.trim?.() ||
      metadata?.nombres?.trim?.() ||
      metadata?.nombre?.trim?.() ||
      "Usuario"
    );
  }, [profile, user?.user_metadata]);

  const nombreCompleto = useMemo(() => {
    const metadata = user?.user_metadata;

    const nombres =
      profile?.nombres?.trim() ||
      metadata?.nombres?.trim?.() ||
      "";

    const apellidos =
      profile?.apellidos?.trim() ||
      metadata?.apellidos?.trim?.() ||
      "";

    return `${nombres} ${apellidos}`.trim() || nombreUsuario;
  }, [profile, user?.user_metadata, nombreUsuario]);

  const fotoPerfil =
    profile?.foto_perfil ??
    user?.user_metadata?.foto_perfil ??
    null;

  const avatarSize = esEscritorio ? 40 : 34;

  const abrirConfiguracion = () => {
    setMenuPerfilAbierto(false);
    router.push("/superadmin/configuracion" as never);
  };

  return (
    <View
      className={cn(
        "z-50 flex-row items-center justify-between border-b border-border bg-surface",
        esEscritorio
          ? "min-h-20 px-7"
          : esTablet
            ? "min-h-16 px-5"
            : "min-h-16 px-3",
      )}
    >
      {/* IZQUIERDA */}
      {esEscritorio ? (
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className="font-nunito-bold text-2xl text-text"
          >
            Hola, {nombreUsuario} (Superadministrador)
          </Text>

          <Text className="mt-1 font-nunito-medium text-sm text-text-secondary">
            Bienvenido a Kiri
          </Text>
        </View>
      ) : (
        <View className="min-w-0 flex-1 flex-row items-center">
          <Logo
            ancho={esTelefono ? 68 : 78}
            alto={esTelefono ? 30 : 34}
          />

          <View className="ml-2 min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className={cn(
                "font-nunito-bold text-text",
                esTelefono ? "text-sm" : "text-base",
              )}
            >
              Hola, {nombreUsuario}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-0.5 font-nunito-medium text-[10px] text-text-muted"
            >
              Superadministrador
            </Text>
          </View>
        </View>
      )}

      {/* ACCIONES */}
      <View
        className={cn(
          "ml-2 flex-row items-center",
          esEscritorio ? "gap-3" : "gap-1",
        )}
      >
        {/* TEMA */}
        <Pressable
          onPress={toggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel={
            isDarkMode
              ? "Cambiar a modo claro"
              : "Cambiar a modo oscuro"
          }
          className={cn(
            "min-h-10 flex-row items-center justify-center rounded-xl border border-border bg-surface active:bg-surface-secondary",
            esEscritorio ? "px-3" : "min-w-10 px-1",
          )}
        >
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
            <Ionicons
              name={isDarkMode ? "moon-outline" : "sunny-outline"}
              size={18}
              className="text-primary"
            />
          </View>

          {esEscritorio && (
            <>
              <Text className="ml-2 font-nunito-semibold text-xs text-text-secondary">
                {isDarkMode ? "Oscuro" : "Claro"}
              </Text>

              <Ionicons
                name="swap-horizontal-outline"
                size={14}
                className="ml-2 text-text-muted"
              />
            </>
          )}
        </Pressable>

        {/* ESTADO SISTEMA */}
        {esEscritorio && (
          <View className="min-h-9 flex-row items-center rounded-full bg-secondary-soft px-4">
            <View className="mr-2 h-2 w-2 rounded-full bg-secondary" />

            <Text className="font-nunito-semibold text-xs text-secondary">
              Sistema Operativo 100%
            </Text>
          </View>
        )}

        {/* NOTIFICACIONES */}
        {!esTelefono && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver notificaciones"
            className="relative h-10 w-10 items-center justify-center rounded-xl active:bg-surface-secondary"
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              className="text-text-secondary"
            />

            <View className="absolute right-2 top-2 h-2 w-2 rounded-full border border-surface bg-danger" />
          </Pressable>
        )}

        {/* PERFIL */}
        <View className="relative z-50">
          <Pressable
            onPress={() =>
              setMenuPerfilAbierto((actual) => !actual)
            }
            className={cn(
              "flex-row items-center justify-center rounded-xl active:bg-surface-secondary",
              menuPerfilAbierto && "bg-primary-soft",
              esEscritorio
                ? "min-h-14 min-w-56 px-2"
                : "min-h-11 min-w-11 px-1",
            )}
          >
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                }}
                className="border border-border"
              />
            ) : (
              <View
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                }}
                className="items-center justify-center border border-border bg-surface-secondary"
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  className="text-primary"
                />
              </View>
            )}

            {esEscritorio && (
              <>
                <View className="ml-3 min-w-0 flex-1">
                  <Text
                    numberOfLines={1}
                    className="font-nunito-bold text-sm text-text"
                  >
                    {nombreCompleto}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-0.5 font-nunito-medium text-xs text-text-muted"
                  >
                    Superadministrador
                  </Text>
                </View>

                <Ionicons
                  name={
                    menuPerfilAbierto
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={16}
                  className="text-text-muted"
                />
              </>
            )}
          </Pressable>

          {/* DROPDOWN */}
          {menuPerfilAbierto && (
            <View
              className="absolute right-0 rounded-xl border border-border bg-surface p-1.5"
              style={{
                top: esEscritorio ? 62 : 48,
                width: esTelefono ? 175 : 210,
              }}
            >
              <Pressable
                onPress={abrirConfiguracion}
                className="min-h-10 flex-row items-center rounded-lg px-3 active:bg-surface-secondary"
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  className="text-text-secondary"
                />

                <Text className="ml-2 font-nunito-medium text-xs text-text-secondary">
                  Mi perfil
                </Text>
              </Pressable>

              <Pressable
                onPress={abrirConfiguracion}
                className="min-h-10 flex-row items-center rounded-lg px-3 active:bg-surface-secondary"
              >
                <Ionicons
                  name="settings-outline"
                  size={18}
                  className="text-text-secondary"
                />

                <Text className="ml-2 font-nunito-medium text-xs text-text-secondary">
                  Preferencias
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}