import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import Logo from "@/components/ui/Logo_izq";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useAuth } from "@/services/authProvider";
import { cn } from "@/utils/cn";

interface MenuItem {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", route: "/superadmin", icon: "grid-outline" },
  { label: "Solicitudes", route: "/superadmin/solicitudes", icon: "mail-outline" },
  { label: "Instituciones", route: "/superadmin/instituciones", icon: "business-outline" },
  { label: "Catálogo oficial", route: "/superadmin/catalogo-oficial", icon: "library-outline" },
  { label: "Gestión de usuarios", route: "/superadmin/usuarios", icon: "people-outline" },
  { label: "Gestión de contenido", route: "/superadmin/contenido", icon: "documents-outline" },
  { label: "Cuestionarios", route: "/superadmin/cuestionarios", icon: "clipboard-outline" },
  { label: "Reportes globales", route: "/superadmin/reportes", icon: "analytics-outline" },
  { label: "Configuración", route: "/superadmin/configuracion", icon: "settings-outline" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { isDarkMode } = useThemeMode();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const colores = isDarkMode ? Colors.dark : Colors.light;

  const rutaActual = useMemo(
    () => (pathname === "/superadmin/" ? "/superadmin" : pathname),
    [pathname],
  );

  const estaActiva = (route: string) =>
    route === "/superadmin"
      ? rutaActual === route
      : rutaActual === route || rutaActual.startsWith(`${route}/`);

  const navegar = (route: string) => {
    if (!estaActiva(route)) router.push(route as never);
  };

  const cerrarSesion = async () => {
    if (cerrandoSesion) return;

    try {
      setCerrandoSesion(true);
      await signOut();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      setCerrandoSesion(false);
    }
  };

  return (
    <View className="h-full w-[270px] min-w-[270px] border-r border-border bg-surface px-3.5 pb-4 pt-5">
      {/* MARCA */}
      <View className="mb-5 min-h-16 flex-row items-center px-2.5">
        <Logo ancho={105} alto={46} />

        <View className="ml-2.5">
          <View className="self-start rounded-full bg-primary-soft px-2 py-1">
            <Text className="font-nunito-bold text-[8px] text-primary">
              ADMIN
            </Text>
          </View>

          <Text className="mt-1 font-nunito-bold text-[9px] tracking-wide text-text-muted">
            SUPERADMIN
          </Text>
        </View>
      </View>

      {/* MENÚ */}
      <View className="gap-1">
        {MENU_ITEMS.map((item) => {
          const activa = estaActiva(item.route);

          return (
            <Pressable
              key={item.route}
              onPress={() => navegar(item.route)}
              className={cn(
                "min-h-12 flex-row items-center rounded-xl px-3.5 active:bg-surface-secondary",
                activa && "bg-primary",
              )}
            >
              <Ionicons
                name={item.icon}
                size={19}
                className={activa ? "text-text-on-primary" : "text-text-secondary"}
              />

              <Text
                className={cn(
                  "ml-3 flex-1 font-nunito-medium text-sm text-text-secondary",
                  activa && "font-nunito-bold text-text-on-primary",
                )}
              >
                {item.label}
              </Text>

              {activa && (
                <Ionicons
                  name="chevron-forward"
                  size={15}
                  className="text-text-on-primary"
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <View className="flex-1" />

      {/* CERRAR SESIÓN */}
      <Pressable
        disabled={cerrandoSesion}
        onPress={cerrarSesion}
        className={cn(
          "mt-1 min-h-12 flex-row items-center rounded-xl px-3.5 active:bg-surface-secondary",
          cerrandoSesion && "opacity-60",
        )}
      >
        {cerrandoSesion ? (
          <ActivityIndicator size="small" color={colores.danger} />
        ) : (
          <Ionicons
            name="log-out-outline"
            size={19}
            className="text-danger"
          />
        )}

        <Text className="ml-3 font-nunito-semibold text-sm text-danger">
          {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
        </Text>
      </Pressable>
    </View>
  );
}