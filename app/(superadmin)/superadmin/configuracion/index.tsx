import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import AdminIdentity from "@/components/admin/AdminIdentity";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { CAMPOS_PERFIL, TEMAS } from "@/constants/superadmin/configuracion";
import { useThemeMode, type ThemePreference } from "@/contexts/ThemeModeContext";
import { useConfiguracion } from "@/hooks/superadmin/useConfiguracion";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function ConfiguracionScreen() {
  const c = useConfiguracion();
  const { esEscritorio } = useResponsiveLayout();
  const { themePreference, setThemeMode, isThemeReady } = useThemeMode();
  const disabled = c.guardando !== null;

  const mensaje = (m: typeof c.mensajePerfil) =>
    m ? (
      <Text
        accessibilityRole={m.error ? "alert" : undefined}
        accessibilityLiveRegion="polite"
        className={`font-nunito-semibold text-sm ${m.error ? "text-danger" : "text-success"}`}
      >
        {m.texto}
      </Text>
    ) : null;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName={`grow gap-5 px-4 pt-6 md:px-8 ${esEscritorio ? "pb-6" : "pb-28"}`}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View className="w-full max-w-4xl self-center gap-5">
        <View>
          <Text className="font-nunito-bold text-2xl text-text">Configuración</Text>
          <Text className="mt-1 font-nunito-medium text-sm text-text-secondary">
            Administra tu perfil, apariencia y seguridad.
          </Text>
        </View>

        {c.cargando ? (
          <ActivityIndicator accessibilityLabel="Cargando configuración" />
        ) : !c.autorizado ? (
          <AdminEmptyState
            error
            mensaje="Esta sección requiere una cuenta de superadministrador activa."
          />
        ) : c.errorCarga ? (
          <View className="gap-3">
            <AdminEmptyState error mensaje={c.errorCarga} />
            <Button title="Reintentar" variant="secondary" onPress={c.reintentar} />
          </View>
        ) : (
          <>
            <AdminCard>
              <Text className="font-nunito-bold text-lg text-text">Mi perfil</Text>

              <AdminIdentity
                nombre={`${c.perfil?.nombres ?? ""} ${c.perfil?.apellidos ?? ""}`.trim()}
                detalle={c.perfil?.correo ?? ""}
                imagen={c.perfil?.foto_url}
              />

              <Text className="font-nunito-medium text-xs text-text-muted">
                Superadministrador · Tu correo y rol son administrados por el sistema.
              </Text>

              <View className="-mx-2 flex-row flex-wrap">
                {CAMPOS_PERFIL.map(({ key, label }) => (
                  <View key={key} className="w-full px-2 md:w-1/2">
                    <Input
                      label={label}
                      value={c.form[key]}
                      editable={!disabled}
                      maxLength={key === "telefono" ? 8 : 100}
                      keyboardType={key === "telefono" ? "phone-pad" : "default"}
                      autoComplete={key === "telefono" ? "tel" : undefined}
                      onChangeText={(valor) => c.cambiarCampo(key, valor)}
                    />
                  </View>
                ))}
              </View>

              {mensaje(c.mensajePerfil)}

              <View className="md:w-44 md:self-end">
                <Button
                  title={c.guardando === "perfil" ? "Guardando..." : "Guardar perfil"}
                  disabled={disabled}
                  onPress={c.guardarPerfil}
                />
              </View>
            </AdminCard>

            <AdminCard>
              <Text className="font-nunito-bold text-lg text-text">Apariencia</Text>

              <AdminFilterOptions
                label="Tema de la aplicación"
                options={TEMAS}
                value={themePreference}
                disabled={!isThemeReady}
                onChange={(value) => setThemeMode(value as ThemePreference)}
              />

              <Text className="font-nunito-medium text-sm text-text-muted">
                La preferencia se guarda en este dispositivo.
              </Text>
            </AdminCard>

            <AdminCard>
              <Text className="font-nunito-bold text-lg text-text">Seguridad</Text>

              <Text className="font-nunito-medium text-sm text-text-secondary">
                Elige una contraseña de al menos 8 caracteres.
              </Text>

              <View className="gap-x-4 md:flex-row">
                <View className="flex-1">
                  <Input
                    label="Nueva contraseña"
                    value={c.password}
                    onChangeText={c.setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    editable={!disabled}
                  />
                </View>

                <View className="flex-1">
                  <Input
                    label="Confirmar contraseña"
                    value={c.confirmacion}
                    onChangeText={c.setConfirmacion}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    editable={!disabled}
                  />
                </View>
              </View>

              {c.requiereCodigo && (
                <>
                  <Input
                    label="Código de verificación"
                    value={c.nonce}
                    onChangeText={c.setNonce}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="one-time-code"
                    keyboardType="number-pad"
                    editable={!disabled}
                  />

                  <Button
                    title="Reenviar código"
                    variant="secondary"
                    disabled={disabled}
                    onPress={c.reenviarCodigo}
                  />
                </>
              )}

              {mensaje(c.mensajePassword)}

              <View className="md:w-52 md:self-end">
                <Button
                  title={c.guardando === "password" ? "Procesando..." : "Actualizar contraseña"}
                  disabled={disabled}
                  onPress={c.guardarPassword}
                />
              </View>
            </AdminCard>
          </>
        )}
      </View>
    </ScrollView>
  );
}
