import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import Input from "@/components/ui/Input";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import type { Genero } from "@/types/auth";
import { cn } from "@/utils/cn";
import { EDAD_MINIMA } from "@/utils/validations";

export interface UsuarioFormValues {
  nombres: string;
  apellidos: string;
  nombrePreferido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  genero: Genero | "";
  password: string;
  confirmPassword: string;
}

interface Props {
  values: UsuarioFormValues;

  onChange: <K extends keyof UsuarioFormValues>(
    campo: K,
    valor: UsuarioFormValues[K],
  ) => void;

  disabled?: boolean;
  mostrarEmail?: boolean;
  mostrarPassword?: boolean;
  mostrarConfirmPassword?: boolean;
  mostrarFechaNacimiento?: boolean;
  mostrarGenero?: boolean;
}

const OPCIONES_GENERO: {
  label: string;
  value: Genero;
}[] = [
  {
    label: "Femenino",
    value: "femenino",
  },
  {
    label: "Masculino",
    value: "masculino",
  },
  {
    label: "Otro",
    value: "otro",
  },
  {
    label: "Prefiero no decir",
    value: "prefiero_no_decir",
  },
];

function formatearFecha(fecha: Date) {
  const year = fecha.getFullYear();

  const month = String(
    fecha.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    fecha.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function obtenerFechaMaxima() {
  const hoy = new Date();

  return new Date(
    hoy.getFullYear() - EDAD_MINIMA,
    hoy.getMonth(),
    hoy.getDate(),
  );
}

function convertirFecha(value: string) {
  if (!value) return null;

  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
  );
}

export default function UsuarioForm({
  values,
  onChange,
  disabled = false,
  mostrarEmail = true,
  mostrarPassword = true,
  mostrarConfirmPassword = true,
  mostrarFechaNacimiento = true,
  mostrarGenero = true,
}: Props) {
  const { isDarkMode } = useThemeMode();

  const colores = isDarkMode
    ? Colors.dark
    : Colors.light;

  const [
    mostrarCalendario,
    setMostrarCalendario,
  ] = useState(false);

  const [
    mostrarClave,
    setMostrarClave,
  ] = useState(false);

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);

  const fechaSeleccionada = useMemo(
    () =>
      convertirFecha(
        values.fechaNacimiento,
      ),
    [values.fechaNacimiento],
  );

  const cambiarFecha = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setMostrarCalendario(false);
    }

    if (
      event.type === "dismissed" ||
      !selectedDate
    ) {
      return;
    }

    onChange(
      "fechaNacimiento",
      formatearFecha(selectedDate),
    );
  };

  return (
    <View className="w-full">
      {/* NOMBRES / APELLIDOS */}
      <View className="gap-x-4 md:flex-row">
        <View className="flex-1">
          <Input
            label="Nombres"
            placeholder="Ej: Auxiliadora Vanessa"
            value={values.nombres}
            editable={!disabled}
            onChangeText={(value) =>
              onChange("nombres", value)
            }
            autoCapitalize="words"
          />
        </View>

        <View className="flex-1">
          <Input
            label="Apellidos"
            placeholder="Ej: Morales Moreno"
            value={values.apellidos}
            editable={!disabled}
            onChangeText={(value) =>
              onChange("apellidos", value)
            }
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* NOMBRE PREFERIDO / TELÉFONO */}
      <View className="gap-x-4 md:flex-row">
        <View className="flex-1">
          <Input
            label="¿Cómo prefieres que te llamemos?"
            placeholder="Ej: Vanessa"
            value={values.nombrePreferido}
            editable={!disabled}
            onChangeText={(value) =>
              onChange(
                "nombrePreferido",
                value,
              )
            }
            autoCapitalize="words"
          />
        </View>

        <View className="flex-1">
          <Input
            label="Teléfono"
            placeholder="Ej: 88888888"
            value={values.telefono}
            editable={!disabled}
            onChangeText={(value) => {
              const numeros =
                value.replace(/\D/g, "");

              onChange(
                "telefono",
                numeros.slice(0, 8),
              );
            }}
            keyboardType="number-pad"
            maxLength={8}
          />
        </View>
      </View>

      {/* CORREO */}
      {mostrarEmail && (
        <Input
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          value={values.email}
          editable={!disabled}
          onChangeText={(value) =>
            onChange("email", value)
          }
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
      )}

      {/* FECHA DE NACIMIENTO */}
      {mostrarFechaNacimiento && (
        <>
          <Text className="mb-2 font-nunito-semibold text-base text-text">
            Fecha de nacimiento
          </Text>

          {Platform.OS === "web" ? (
            <View className="mb-5 min-h-14 justify-center rounded-2xl border border-input-border bg-input px-4">
              <input
                type="date"
                disabled={disabled}
                value={
                  values.fechaNacimiento
                }
                min="1900-01-01"
                max={formatearFecha(
                  obtenerFechaMaxima(),
                )}
                onChange={(event) =>
                  onChange(
                    "fechaNacimiento",
                    event.currentTarget.value,
                  )
                }
                style={{
                  width: "100%",
                  height: 52,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 15,
                  fontFamily:
                    "Nunito-Medium",
                  color: colores.text,
                  cursor: disabled
                    ? "default"
                    : "pointer",
                  colorScheme: isDarkMode
                    ? "dark"
                    : "light",
                }}
              />
            </View>
          ) : (
            <>
              <Pressable
                disabled={disabled}
                onPress={() =>
                  setMostrarCalendario(true)
                }
                className={cn(
                  "mb-5 min-h-14 flex-row items-center justify-between rounded-2xl border border-input-border bg-input px-4",
                  disabled
                    ? "opacity-50"
                    : "active:opacity-80",
                )}
              >
                <Text
                  className={cn(
                    "flex-1 font-nunito-medium text-sm",
                    values.fechaNacimiento
                      ? "text-text"
                      : "text-text-muted",
                  )}
                >
                  {fechaSeleccionada
                    ? fechaSeleccionada.toLocaleDateString(
                        "es-NI",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "Selecciona tu fecha de nacimiento"}
                </Text>

                <Ionicons
                  name="calendar-outline"
                  size={20}
                  className="text-primary"
                />
              </Pressable>

              {mostrarCalendario && (
                <DateTimePicker
                  value={
                    fechaSeleccionada ??
                    obtenerFechaMaxima()
                  }
                  mode="date"
                  display={
                    Platform.OS === "ios"
                      ? "spinner"
                      : "calendar"
                  }
                  minimumDate={
                    new Date(1900, 0, 1)
                  }
                  maximumDate={
                    obtenerFechaMaxima()
                  }
                  onChange={cambiarFecha}
                />
              )}

              {Platform.OS === "ios" &&
                mostrarCalendario && (
                  <Pressable
                    onPress={() =>
                      setMostrarCalendario(
                        false,
                      )
                    }
                    className="mb-5 self-end rounded-xl bg-primary px-4 py-2"
                  >
                    <Text className="font-nunito-semibold text-sm text-text-on-primary">
                      Listo
                    </Text>
                  </Pressable>
                )}
            </>
          )}
        </>
      )}

      {/* GÉNERO */}
      {mostrarGenero && (
        <>
          <Text className="mb-2 font-nunito-semibold text-base text-text">
            Género
          </Text>

          <View
            accessibilityRole="radiogroup"
            className="-m-1 mb-5 flex-row flex-wrap"
          >
            {OPCIONES_GENERO.map(
              (opcion) => {
                const activo =
                  values.genero ===
                  opcion.value;

                return (
                  <View
                    key={opcion.value}
                    className="w-1/2 p-1 md:w-1/4"
                  >
                    <Pressable
                      disabled={disabled}
                      onPress={() =>
                        onChange(
                          "genero",
                          opcion.value,
                        )
                      }
                      accessibilityRole="radio"
                      accessibilityLabel={
                        opcion.label
                      }
                      accessibilityState={{
                        checked: activo,
                      }}
                      className={cn(
                        "min-h-16 w-full flex-row items-center gap-2 rounded-2xl border px-3 py-3",
                        activo
                          ? "border-2 border-primary bg-primary-soft"
                          : "border-border bg-surface-secondary",
                        disabled &&
                          "opacity-50",
                      )}
                    >
                      <Ionicons
                        name={
                          activo
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={19}
                        className={
                          activo
                            ? "text-primary"
                            : "text-text-muted"
                        }
                      />

                      <Text
                        className={cn(
                          "shrink font-nunito-medium text-xs",
                          activo
                            ? "font-nunito-bold text-primary"
                            : "text-text",
                        )}
                      >
                        {opcion.label}
                      </Text>
                    </Pressable>
                  </View>
                );
              },
            )}
          </View>
        </>
      )}

      {/* CONTRASEÑAS */}
      {mostrarPassword && (
        <View
          className={cn(
            "gap-x-4",
            mostrarConfirmPassword &&
              "md:flex-row",
          )}
        >
          <View className="flex-1">
            <Input
              label="Contraseña"
              placeholder="********"
              value={values.password}
              editable={!disabled}
              onChangeText={(value) =>
                onChange(
                  "password",
                  value,
                )
              }
              secureTextEntry={
                !mostrarClave
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              rightIcon={
                <Pressable
                  hitSlop={8}
                  disabled={disabled}
                  onPress={() =>
                    setMostrarClave(
                      (prev) => !prev,
                    )
                  }
                >
                  <Ionicons
                    name={
                      mostrarClave
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    className="text-text-secondary"
                  />
                </Pressable>
              }
            />
          </View>

          {mostrarConfirmPassword && (
            <View className="flex-1">
              <Input
                label="Confirmar contraseña"
                placeholder="********"
                value={
                  values.confirmPassword
                }
                editable={!disabled}
                onChangeText={(value) =>
                  onChange(
                    "confirmPassword",
                    value,
                  )
                }
                secureTextEntry={
                  !mostrarConfirmacion
                }
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                rightIcon={
                  <Pressable
                    hitSlop={8}
                    disabled={disabled}
                    onPress={() =>
                      setMostrarConfirmacion(
                        (prev) => !prev,
                      )
                    }
                  >
                    <Ionicons
                      name={
                        mostrarConfirmacion
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={21}
                      className="text-text-secondary"
                    />
                  </Pressable>
                }
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}