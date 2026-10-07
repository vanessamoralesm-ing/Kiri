import React from "react";
import { Text, View } from "react-native";
import type { RankingReporte } from "@/types/superadmin/reportes";
import AdminCard from "./AdminCard";

export default function AdminRankingChart({
  titulo,
  ranking,
}: {
  titulo: string;
  ranking: RankingReporte;
}) {
  const items = ranking.items.slice(0, 5);
  const maximo = Math.max(1, ...items.map((item) => item.total));
  const total = ranking.items.reduce((suma, item) => suma + item.total, 0);
  return (
    <AdminCard>
      <Text className="font-nunito-bold text-lg text-text">{titulo}</Text>
      {ranking.error ? (
        <Text
          accessibilityRole="alert"
          className="font-nunito-medium text-sm text-danger"
        >
          {ranking.error}
        </Text>
      ) : items.length === 0 ? (
        <Text className="font-nunito-medium text-sm text-text-muted">
          Sin usos completados en este período.
        </Text>
      ) : (
        <>
          <Text className="font-nunito-medium text-xs text-text-muted">
            Top {items.length} · {total.toLocaleString("es-GT")} usos en total
          </Text>
          {items.map((item) => (
            <View
              key={item.id}
              className="gap-2"
              accessibilityLabel={`${item.nombre}: ${item.total} usos completados`}
            >
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 font-nunito-semibold text-sm text-text">
                  {item.nombre}
                </Text>
                <Text className="font-nunito-bold text-sm text-primary">
                  {item.total.toLocaleString("es-GT")}
                </Text>
              </View>
              <View className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.total / maximo) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </>
      )}
    </AdminCard>
  );
}
