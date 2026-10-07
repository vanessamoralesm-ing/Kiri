import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import SearchBar from "@/components/ui/SearchBar";
export interface AdminFilter {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  horizontal?: boolean;
}
export function AdminFilterOptions({
  label,
  value,
  onChange,
  options,
  horizontal,
  disabled,
}: AdminFilter & { disabled?: boolean }) {
  const chips = (
    <View className={`flex-row gap-2 ${horizontal ? "" : "flex-wrap"}`}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ selected: o.value === value, disabled }}
          onPress={() => onChange(o.value)}
          className={`rounded-full border px-4 py-2 ${o.value === value ? "border-primary bg-primary-soft" : "border-border bg-surface-secondary"} ${disabled ? "opacity-50" : "active:opacity-70"}`}
        >
          <Text
            className={`font-nunito-semibold text-xs ${o.value === value ? "text-primary" : "text-text-secondary"}`}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  return (
    <View className="gap-2">
      <Text className="font-nunito-semibold text-sm text-text-secondary">
        {label}
      </Text>
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chips}
        </ScrollView>
      ) : (
        chips
      )}
    </View>
  );
}
export default function AdminFilters({
  busqueda,
  onBusquedaChange,
  filters,
  placeholder = "Buscar...",
}: {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filters: AdminFilter[];
  placeholder?: string;
}) {
  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <SearchBar
        value={busqueda}
        onChangeText={onBusquedaChange}
        placeholder={placeholder}
      />
      {filters.map((f) => (
        <AdminFilterOptions key={f.label} {...f} />
      ))}
    </View>
  );
}
