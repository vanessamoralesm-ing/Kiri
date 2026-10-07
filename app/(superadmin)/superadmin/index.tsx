import React from "react";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";
import {
  ACCIONES_DASHBOARD,
  INDICADORES_DASHBOARD,
} from "@/constants/superadmin/dashboard";
import useSuperAdminDashboard from "@/hooks/superadmin/useSuperAdminDashboard";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();
  const { estadisticas, cargando, error, recargar } = useSuperAdminDashboard();
  const nombre = profile?.nombre_preferido?.trim() || profile?.nombres?.trim() || "Usuario";

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View
        className={`mx-auto w-full max-w-7xl gap-6 ${
          esEscritorio ? "px-12 pb-12 pt-7" : esTablet ? "px-8 pb-9 pt-6" : "px-5 pb-9 pt-5"
        }`}
      >
        <View className="gap-2">
          <Text className={`font-nunito-bold text-text ${esEscritorio ? "text-3xl" : "text-2xl"}`}>
            Panel de Control General
          </Text>
          <Text className="max-w-3xl font-nunito-medium text-sm leading-5 text-text-secondary">
            Bienvenido, {nombre}. Aquí podrás administrar el ecosistema de Kiri.
          </Text>
        </View>

        <AdminCard>
          <Text className="font-nunito-bold text-lg text-text">Acciones rápidas</Text>
          <Text className="font-nunito-medium text-sm text-text-muted">
            Accede rápidamente a las funciones principales de administración.
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {ACCIONES_DASHBOARD.map((a) => (
              <Button
                key={a.ruta}
                title={a.titulo}
                icon={a.icono}
                variant="secondary"
                onPress={() => router.push(a.ruta)}
                className={`my-0 border-0 ${a.fondo} ${
                  esEscritorio ? "flex-1" : esTelefono ? "w-full" : "w-1/2 flex-1"
                }`}
                textClassName={`text-sm ${a.color}`}
                iconClassName={a.color}
              />
            ))}
          </View>
        </AdminCard>

        {error ? (
          <AdminCard>
            <AdminEmptyState error mensaje={error} />
            <Button title="Reintentar" onPress={recargar} />
          </AdminCard>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {INDICADORES_DASHBOARD.map(({ clave, ...item }) => (
              <View
                key={clave}
                className={esEscritorio ? "w-1/4 flex-1" : esTelefono ? "w-full" : "w-1/2 flex-1"}
              >
                <AdminStatCard
                  {...item}
                  valor={cargando || !estadisticas ? "—" : estadisticas[clave].toLocaleString("es-NI")}
                />
              </View>
            ))}
          </View>
        )}

        <AdminCard>
          <Text className="font-nunito-bold text-lg text-text">
            Crecimiento y adopción de la comunidad
          </Text>
          <Text className="font-nunito-medium text-sm leading-5 text-text-secondary">
            Esta sección será reemplazada posteriormente por los gráficos reales del dashboard.
          </Text>
          <View className="rounded-2xl bg-surface-secondary">
            <AdminEmptyState mensaje="Área reservada para gráficas" icono="analytics-outline" />
          </View>
        </AdminCard>
      </View>
    </ScrollView>
  );
}