import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import UsuarioForm, {
  type UsuarioFormValues,
} from "@/components/usuarios/UsuarioForm";

import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useAuth } from "@/services/authProvider";
import { cn } from "@/utils/cn";
import { validateRegister } from "@/utils/validations";

const VALORES_INICIALES: UsuarioFormValues = {
  nombres: "",
  apellidos: "",
  nombrePreferido: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  genero: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { signUp } = useAuth();
  const { isDarkMode } = useThemeMode();

  const colores = isDarkMode
    ? Colors.dark
    : Colors.light;

  const [values, setValues] =
    useState<UsuarioFormValues>(
      VALORES_INICIALES,
    );

  const [
    aceptoCondiciones,
    setAceptoCondiciones,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const cambiarCampo = <
    K extends keyof UsuarioFormValues,
  >(
    campo: K,
    valor: UsuarioFormValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    setError(null);
  };

  const registrar = async () => {
    if (submitting) return;

    setError(null);

    /*
     * Igual que en superadmin:
     * primero validamos para que TypeScript
     * sepa que ya es Genero.
     */
    const genero = values.genero;

    if (!genero) {
      setError(
        "Selecciona una opción de género.",
      );
      return;
    }

    const validationErrors =
      validateRegister({
        email: values.email,
        password: values.password,
        nombres: values.nombres,
        apellidos: values.apellidos,
        nombrePreferido:
          values.nombrePreferido,
        telefono: values.telefono,
        fechaNacimiento:
          values.fechaNacimiento,
        genero,
        confirmPassword:
          values.confirmPassword,
        aceptaTerminos:
          aceptoCondiciones,
      });

    const firstError =
      Object.values(
        validationErrors,
      ).find(Boolean);

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setSubmitting(true);

      const result = await signUp({
        email:
          values.email
            .trim()
            .toLowerCase(),

        password:
          values.password,

        nombres:
          values.nombres.trim(),

        apellidos:
          values.apellidos.trim(),

        nombrePreferido:
          values.nombrePreferido.trim(),

        telefono:
          values.telefono.trim(),

        fechaNacimiento:
          values.fechaNacimiento.trim(),

        genero,
      });

      if (
        result.requiresEmailConfirmation
      ) {
        router.replace({
          pathname:
            "/(auth)/registro_exitoso",
          params: {
            email:
              values.email
                .trim()
                .toLowerCase(),
          },
        });

        return;
      }
    } catch (err) {
      console.error(
        "Error registrando usuario:",
        err,
      );

      const mensaje =
        err instanceof Error
          ? err.message
          : "No se pudo crear la cuenta. Intenta nuevamente.";

      const normalizado =
        mensaje.toLowerCase();

      if (
        normalizado.includes(
          "already registered",
        ) ||
        normalizado.includes(
          "already exists",
        )
      ) {
        setError(
          "Ya existe una cuenta registrada con este correo.",
        );
      } else if (
        normalizado.includes(
          "password should be at least",
        )
      ) {
        setError(
          "La contraseña debe tener al menos 6 caracteres.",
        );
      } else {
        setError(mensaje);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,

        paddingTop:
          Platform.OS === "web"
            ? 36
            : Math.max(
                insets.top + 18,
                28,
              ),

        paddingBottom:
          Platform.OS === "web"
            ? 54
            : Math.max(
                insets.bottom + 32,
                44,
              ),
      }}
    >
      <View className="w-full items-center px-4 md:px-6 lg:px-8">
        <View className="w-full max-w-4xl bg-background md:rounded-3xl md:border md:border-border md:bg-surface md:p-7 lg:p-8">
          {/* LOGO */}
          <View className="items-center">
            <Image
              source={
                isDarkMode
                  ? require("../../assets/images/splash-icon-ps.png")
                  : require("../../assets/images/splash-icon.png")
              }
              resizeMode="contain"
              className="h-24 w-24 lg:h-28 lg:w-28"
            />
          </View>

          {/* TÍTULO */}
          <Text className="mt-4 text-center font-nunito-bold text-3xl text-primary">
            Únete a Kiri
          </Text>

          <Text className="mb-7 mt-1 text-center font-nunito-medium text-base text-text-secondary">
            Tu refugio emocional comienza hoy
          </Text>

          {/* FORMULARIO */}
          <UsuarioForm
            values={values}
            onChange={cambiarCampo}
            disabled={submitting}
          />

          {/* TÉRMINOS */}
          <View className="mb-5 mt-1 flex-row items-start">
            <Pressable
              disabled={submitting}
              onPress={() => {
                setAceptoCondiciones(
                  (prev) => !prev,
                );

                setError(null);
              }}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked:
                  aceptoCondiciones,
              }}
              hitSlop={8}
              className={cn(
                "mr-3 mt-0.5 h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-primary",
                aceptoCondiciones
                  ? "bg-primary"
                  : "bg-surface-secondary",
                submitting &&
                  "opacity-50",
              )}
            >
              {aceptoCondiciones && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  className="text-text-on-primary"
                />
              )}
            </Pressable>

            <Text className="min-w-0 flex-1 font-nunito-medium text-sm leading-5 text-text-secondary">
              Acepto los{" "}
              <Text
                className="font-nunito-semibold text-primary"
                onPress={() =>
                  console.log(
                    "Ver Términos",
                  )
                }
              >
                Términos y Condiciones
              </Text>{" "}
              y la{" "}
              <Text
                className="font-nunito-semibold text-primary"
                onPress={() =>
                  console.log(
                    "Ver Política de Privacidad",
                  )
                }
              >
                Política de Privacidad
              </Text>{" "}
              de Kiri.
            </Text>
          </View>

          {/* ERROR */}
          {error && (
            <View className="mb-4 flex-row items-start gap-2 rounded-2xl bg-surface-secondary p-4">
              <Ionicons
                name="alert-circle-outline"
                size={21}
                className="text-danger"
              />

              <Text className="min-w-0 flex-1 font-nunito-medium text-sm leading-5 text-danger">
                {error}
              </Text>
            </View>
          )}

          {/* CREAR CUENTA */}
          <Button
            title={
              submitting
                ? "Creando cuenta..."
                : "Crear cuenta"
            }
            variant="primary"
            onPress={registrar}
            disabled={submitting}
          />

          {submitting && (
            <ActivityIndicator
              className="mt-3"
              color={colores.primary}
            />
          )}

          {/* SEPARADOR */}
          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-divider" />

            <Text className="mx-4 font-nunito-medium text-sm text-text-muted">
              o regístrate con
            </Text>

            <View className="h-px flex-1 bg-divider" />
          </View>

          {/* GOOGLE */}
          <GoogleButton
            onPress={() => {
              console.log(
                "Registro con Google — pendiente de implementar",
              );
            }}
          />

          {/* LOGIN */}
          <View className="mt-6 flex-row flex-wrap items-center justify-center">
            <Text className="font-nunito-medium text-sm text-text-secondary">
              ¿Ya tienes una cuenta?{" "}
            </Text>

            <Pressable
              hitSlop={8}
              onPress={() =>
                router.push(
                  "/(auth)/login",
                )
              }
            >
              <Text className="font-nunito-semibold text-sm text-primary">
                Inicia sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}