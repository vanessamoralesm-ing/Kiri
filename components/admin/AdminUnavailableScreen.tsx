import React from "react";
import { ScrollView, Text, View } from "react-native";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function AdminUnavailableScreen({ titulo }: { titulo: string }) {
  const { esEscritorio } = useResponsiveLayout();
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName={`grow px-4 pt-6 md:px-8 ${esEscritorio ? "pb-8" : "pb-28"}`}
    >
      <View className="w-full max-w-4xl self-center gap-5">
        <Text className="font-nunito-bold text-2xl text-text">{titulo}</Text>
        <AdminCard>
          <AdminEmptyState
            icono="construct-outline"
            mensaje="Este módulo aún no está disponible."
          />
        </AdminCard>
      </View>
    </ScrollView>
  );
}
