import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Button from "@/components/ui/Button";
interface Props {
  title: string;
  subtitle: string;
  cargando: boolean;
  guardando: boolean;
  error: string | null;
  disabled?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  contentClassName?: string;
  onGuardar: () => void;
  onVolver: () => void;
  children: ReactNode;
}
export default function AdminFormScreen({
  title,
  subtitle,
  cargando,
  guardando,
  error,
  disabled,
  onGuardar,
  onVolver,
  children,
  submitLabel = "Guardar",
  loadingLabel = "Cargando formulario...",
  contentClassName = "rounded-3xl border border-border bg-surface p-4 md:p-6",
}: Props) {
  if (cargando)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
        <Text className="mt-3 font-nunito-medium text-text-muted">{loadingLabel}</Text>
      </View>
    );
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-4 py-6 md:px-8"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-4xl self-center">
        <View className="mb-6 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            disabled={guardando}
            onPress={onVolver}
            className="h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface"
          >
            <Ionicons name="arrow-back-outline" size={22} className="text-icon" />
          </Pressable>
          <View className="min-w-0 flex-1">
            <Text className="font-nunito-bold text-2xl text-text">{title}</Text>
            <Text className="mt-1 font-nunito-medium text-text-secondary">{subtitle}</Text>
          </View>
        </View>
        <View className={contentClassName}>{children}</View>
        {error && (
          <Text accessibilityRole="alert" className="mt-4 font-nunito-semibold text-danger">
            {error}
          </Text>
        )}
        <View className="mt-5 gap-2 md:flex-row md:justify-end">
          <View className="md:w-32">
            <Button title="Cancelar" variant="secondary" onPress={onVolver} disabled={guardando} />
          </View>
          <View className="md:w-44">
            <Button
              title={guardando ? "Guardando..." : submitLabel}
              onPress={onGuardar}
              disabled={guardando || disabled}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
