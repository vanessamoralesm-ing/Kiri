import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useAuth } from "@/services/authProvider";
import { cn } from "@/utils/cn";

interface NavigationItem {
  label: string;
  labelMovil: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const MAIN_ITEMS: NavigationItem[] = [
  {
    label: "Inicio",
    labelMovil: "Inicio",
    route: "/superadmin",
    icon: "grid-outline",
    iconActive: "grid",
  },
  {
    label: "Solicitudes",
    labelMovil: "Solic.",
    route: "/superadmin/solicitudes",
    icon: "mail-outline",
    iconActive: "mail",
  },
  {
    label: "Instituciones",
    labelMovil: "Instit.",
    route: "/superadmin/instituciones",
    icon: "business-outline",
    iconActive: "business",
  },
];

const MORE_ITEMS: NavigationItem[] = [
  {
    label: "Catálogo oficial",
    labelMovil: "Catálogo",
    route: "/superadmin/catalogo-oficial",
    icon: "library-outline",
    iconActive: "library",
  },
  {
    label: "Gestión de usuarios",
    labelMovil: "Usuarios",
    route: "/superadmin/usuarios",
    icon: "people-outline",
    iconActive: "people",
  },
  {
    label: "Gestión de contenido",
    labelMovil: "Contenido",
    route: "/superadmin/contenido",
    icon: "documents-outline",
    iconActive: "documents",
  },
  {
    label: "Cuestionarios",
    labelMovil: "Cuestionarios",
    route: "/superadmin/cuestionarios",
    icon: "clipboard-outline",
    iconActive: "clipboard",
  },
  {
    label: "Reportes globales",
    labelMovil: "Reportes",
    route: "/superadmin/reportes",
    icon: "analytics-outline",
    iconActive: "analytics",
  },
  {
    label: "Configuración",
    labelMovil: "Configuración",
    route: "/superadmin/configuracion",
    icon: "settings-outline",
    iconActive: "settings",
  },
];

export default function AdminBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { isDarkMode } = useThemeMode();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const colores = isDarkMode ? Colors.dark : Colors.light;
  const esMovil = width < 600;
  const pequeno = width < 380;

  const paddingBottom = Math.max(insets.bottom, 8);
  const alturaBarra = 64 + paddingBottom;

  const panelWidth = Math.min(
    esMovil ? width - 24 : 680,
    width - 24,
  );

  const panelHeight = Math.min(
    esMovil ? 570 : 520,
    height - insets.top - alturaBarra - 28,
  );

  const rutaActual = useMemo(
    () =>
      pathname === "/superadmin/" ? "/superadmin" : pathname,
    [pathname],
  );

  const estaActiva = (route: string) =>
    route === "/superadmin"
      ? rutaActual === route
      : rutaActual === route || rutaActual.startsWith(`${route}/`);

  const secundariaActiva = MORE_ITEMS.some((x) =>
    estaActiva(x.route),
  );

  const navegar = (route: string) => {
    setMenuAbierto(false);
    if (!estaActiva(route)) router.push(route as never);
  };

  const cerrarSesion = async () => {
    if (cerrandoSesion) return;

    try {
      setCerrandoSesion(true);
      await signOut();
      setMenuAbierto(false);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      setCerrandoSesion(false);
    }
  };

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const activa = estaActiva(item.route);

    return (
      <Pressable
        onPress={() => navegar(item.route)}
        className="h-16 flex-1 items-center justify-center active:opacity-70"
      >
        <View
          className={cn(
            "h-9 w-11 items-center justify-center rounded-xl",
            activa && "bg-primary-soft",
          )}
        >
          <Ionicons
            name={activa ? item.iconActive : item.icon}
            size={23}
            className={activa ? "text-primary" : "text-text-secondary"}
          />
        </View>

        <Text
          numberOfLines={1}
          className={cn(
            "mt-1 w-full text-center font-nunito-medium text-text-secondary",
            pequeno ? "text-[9px]" : "text-[10px]",
            activa && "font-nunito-bold text-primary",
          )}
        >
          {esMovil ? item.labelMovil : item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="relative z-50 w-full">
      {/* OVERLAY */}
      {menuAbierto && (
        <Pressable
          onPress={() => setMenuAbierto(false)}
          className="absolute left-0 bg-overlay"
          style={{
            bottom: alturaBarra,
            width,
            height: Math.max(0, height - alturaBarra - insets.top),
          }}
        />
      )}

      {/* PANEL MÁS */}
      {menuAbierto && (
        <View
          className="absolute self-center overflow-hidden rounded-3xl border border-border bg-surface"
          style={{
            width: panelWidth,
            maxHeight: panelHeight,
            bottom: alturaBarra + 10,
          }}
        >
          <View className="min-h-20 flex-row items-center border-b border-border px-5 py-3">
            <View className="min-w-0 flex-1">
              <Text className="font-nunito-bold text-lg text-text">
                Más opciones
              </Text>
              <Text className="mt-1 font-nunito-medium text-xs text-text-muted">
                Administración de Kiri
              </Text>
            </View>

            <Pressable
              hitSlop={10}
              onPress={() => setMenuAbierto(false)}
              className="h-10 w-10 items-center justify-center rounded-xl active:bg-surface-secondary"
            >
              <Ionicons
                name="close"
                size={25}
                className="text-text-secondary"
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="p-3"
          >
            {/* OPCIONES */}
            <View className="-m-1 flex-row flex-wrap">
              {MORE_ITEMS.map((item) => {
                const activa = estaActiva(item.route);

                return (
                  <View
                    key={item.route}
                    className={cn(
                      "p-1",
                      width < 430 ? "w-1/2" : "w-1/3",
                    )}
                  >
                    <Pressable
                      onPress={() => navegar(item.route)}
                      className={cn(
                        "min-h-28 items-center rounded-2xl px-2 py-3 active:bg-surface-secondary",
                        activa && "border border-primary bg-primary-soft",
                      )}
                    >
                      <View
                        className={cn(
                          "h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary",
                          activa && "bg-primary",
                        )}
                      >
                        <Ionicons
                          name={activa ? item.iconActive : item.icon}
                          size={23}
                          className={
                            activa
                              ? "text-text-on-primary"
                              : "text-text-secondary"
                          }
                        />
                      </View>

                      <Text
                        numberOfLines={2}
                        className={cn(
                          "mt-2 text-center font-nunito-semibold text-xs leading-4 text-text",
                          activa && "font-nunito-bold text-primary",
                        )}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* CERRAR SESIÓN */}
            <View className="mt-4 border-t border-border pt-3">
              <Pressable
                disabled={cerrandoSesion}
                onPress={cerrarSesion}
                className={cn(
                  "min-h-14 flex-row items-center rounded-2xl px-2 active:bg-surface-secondary",
                  cerrandoSesion && "opacity-60",
                )}
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary">
                  {cerrandoSesion ? (
                    <ActivityIndicator
                      size="small"
                      color={colores.danger}
                    />
                  ) : (
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      className="text-danger"
                    />
                  )}
                </View>

                <Text className="ml-3 flex-1 font-nunito-semibold text-sm text-danger">
                  {cerrandoSesion
                    ? "Cerrando sesión..."
                    : "Cerrar sesión"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      )}

      {/* BARRA INFERIOR */}
      <View
        className="flex-row items-center border-t border-border bg-surface px-2 pt-1"
        style={{ paddingBottom }}
      >
        {MAIN_ITEMS.map((item) => (
          <NavItem key={item.route} item={item} />
        ))}

        <Pressable
          onPress={() => setMenuAbierto((x) => !x)}
          className="h-16 flex-1 items-center justify-center active:opacity-70"
        >
          <View
            className={cn(
              "h-9 w-12 items-center justify-center rounded-xl",
              (secundariaActiva || menuAbierto) && "bg-primary-soft",
            )}
          >
            <Ionicons
              name={
                secundariaActiva || menuAbierto
                  ? "apps"
                  : "apps-outline"
              }
              size={24}
              className={
                secundariaActiva || menuAbierto
                  ? "text-primary"
                  : "text-text-secondary"
              }
            />
          </View>

          <Text
            className={cn(
              "mt-1 text-center font-nunito-medium text-[10px] text-text-secondary",
              (secundariaActiva || menuAbierto) &&
                "font-nunito-bold text-primary",
            )}
          >
            Más
          </Text>
        </Pressable>
      </View>
    </View>
  );
}