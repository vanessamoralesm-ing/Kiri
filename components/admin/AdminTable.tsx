import React, { type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export type AdminColumn<T> = {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
  className?: string;
};

export type AdminTableProps<T> = {
  items: T[];
  columns: AdminColumn<T>[];
  keyExtractor: (item: T) => string;
  onPressItem?: (item: T) => void;
  selectedKey?: string;
};

export default function AdminTable<T>({
  items,
  columns,
  keyExtractor,
  onPressItem,
  selectedKey,
}: AdminTableProps<T>) {
  return (
    <ScrollView
      horizontal
      className="w-full"
      contentContainerClassName="min-w-full"
      showsHorizontalScrollIndicator={false}
    >
      <View className="w-full overflow-hidden rounded-2xl border border-border bg-surface">
        <View className="flex-row bg-surface-secondary">
          {columns.map((c) => (
            <View key={c.key} className={`p-4 ${c.className ?? "flex-1"}`}>
              <Text className="font-nunito-bold text-xs text-text-muted">{c.title}</Text>
            </View>
          ))}
        </View>

        {items.map((item) => {
          const key = keyExtractor(item);
          const selected = key === selectedKey;
          const cells = columns.map((c) => (
            <View key={c.key} className={`p-4 ${c.className ?? "flex-1"}`}>
              {c.render(item)}
            </View>
          ));
          const cls = `flex-row items-center border-t border-border ${selected ? "bg-primary-soft" : ""}`;

          return onPressItem ? (
            <Pressable
              key={key}
              className={cls}
              onPress={() => onPressItem(item)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              {cells}
            </Pressable>
          ) : (
            <View key={key} className={cls}>{cells}</View>
          );
        })}
      </View>
    </ScrollView>
  );
}