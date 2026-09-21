import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import Input from "@/components/ui/Input";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useAuth } from "@/services/authProvider";

import type { Genero } from "@/types/auth";

import { EDAD_MINIMA, validateRegister } from "@/utils/validations";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function RegisterScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { signUp } = useAuth();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const dividerColor = useThemeColor({}, "divider");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const placeholderColor = useThemeColor({}, "placeholder");
  const iconColor = useThemeColor({}, "icon");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const dangerColor = useThemeColor({}, "danger");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // DATOS PERSONALES
  // ========================================================

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nombrePreferido, setNombrePreferido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const [genero, setGenero] = useState<Genero | "">("");

  // ========================================================
  // CREDENCIALES
  // ========================================================

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // ========================================================
  // TÉRMINOS
  // ========================================================

  const [aceptoCondi, setAceptoCondi] = useState(false);

  // ========================================================
  // ESTADOS DEL PROCESO
  // ========================================================

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // OPCIONES DE GÉNERO
  // ========================================================

  const opcionesGenero: {
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

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthPantalla = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthFormulario = esEscritorio
    ? 860
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  const paddingTop = esEscritorio ? 36 : Math.max(insets.top + 18, 28);

  const paddingBottom = esEscritorio ? 54 : Math.max(insets.bottom + 32, 44);

  const paddingTarjeta = esEscritorio
    ? 30
    : esTablet
      ? 26
      : esTelefono
        ? 0
        : 22;

  // ========================================================
  // UTILIDADES
  // ========================================================

  const limpiarError = () => {
    if (error) {
      setError(null);
    }
  };

  const irALogin = () => {
    router.push("/(auth)/login");
  };

  const formatearFecha = (fecha: Date) => {
    const year = fecha.getFullYear();

    const month = String(fecha.getMonth() + 1).padStart(2, "0");

    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ========================================================
  // FECHA
  // ========================================================

  const handleFechaChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setMostrarCalendario(false);
    }

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    setFechaSeleccionada(selectedDate);
    setFechaNacimiento(formatearFecha(selectedDate));

    limpiarError();
  };

  const obtenerFechaMaxima = () => {
    const hoy = new Date();

    return new Date(
      hoy.getFullYear() - EDAD_MINIMA,
      hoy.getMonth(),
      hoy.getDate(),
    );
  };

  // ========================================================
  // REGISTRAR
  // ========================================================

  const registrar = async () => {
    setError(null);

    if (!genero) {
      setError("Selecciona una opción de género.");

      return;
    }

    const validationErrors = validateRegister({
      email: correo,
      password: contraseña,
      nombres,
      apellidos,
      nombrePreferido,
      telefono,
      fechaNacimiento,
      genero,
      confirmPassword: confirmar,
      aceptaTerminos: aceptoCondi,
    });

    const firstError = Object.values(validationErrors).find(Boolean);

    if (firstError) {
      setError(firstError);

      return;
    }

    try {
      setSubmitting(true);

      const result = await signUp({
        email: correo.trim().toLowerCase(),

        password: contraseña,

        nombres: nombres.trim(),

        apellidos: apellidos.trim(),

        nombrePreferido: nombrePreferido.trim(),

        telefono: telefono.trim(),

        fechaNacimiento: fechaNacimiento.trim(),

        genero,
      });

      if (result.requiresEmailConfirmation) {
        router.replace({
          pathname: "/(auth)/registro_exitoso",

          params: {
            email: correo.trim().toLowerCase(),
          },
        });

        return;
      }
    } catch (err: any) {
      console.error("Error registrando usuario:", err);

      const message = err?.message?.toLowerCase?.() ?? "";

      if (
        message.includes("already registered") ||
        message.includes("already exists")
      ) {
        setError("Ya existe una cuenta registrada con este correo.");
      } else if (message.includes("password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(
          err?.message ?? "No se pudo crear la cuenta. Intenta nuevamente.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor,
        paddingTop,
        paddingBottom,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: maxWidthPantalla,
          alignSelf: "center",

          paddingHorizontal,

          alignItems: "center",
        }}
      >
        {/* ==================================================
            CONTENEDOR PRINCIPAL
        ================================================== */}

        <View
          style={{
            width: "100%",
            maxWidth: maxWidthFormulario,

            padding: paddingTarjeta,

            borderWidth: esTelefono ? 0 : 1,

            borderRadius: esTelefono ? 0 : 26,

            borderColor,

            backgroundColor: esTelefono ? "transparent" : surfaceColor,

            ...(Platform.OS === "web" && !esTelefono
              ? ({
                boxShadow: "0px 6px 20px rgba(0,0,0,0.045)",
              } as any)
              : {}),

            ...(Platform.OS === "ios" && !esTelefono
              ? {
                shadowColor: "#000000",

                shadowOffset: {
                  width: 0,
                  height: 4,
                },

                shadowOpacity: 0.05,
                shadowRadius: 12,
              }
              : {}),

            ...(Platform.OS === "android" && !esTelefono
              ? {
                elevation: 3,
              }
              : {}),
          }}
        >
          {/* ==================================================
              LOGO
          ================================================== */}

          <View
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: esEscritorio ? 92 : 82,

                height: esEscritorio ? 92 : 82,

                borderRadius: esEscritorio ? 28 : 25,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="heart-outline"
                size={esEscritorio ? 42 : 36}
                color={primaryColor}
              />
            </View>
          </View>

          {/* ==================================================
              TÍTULO
          ================================================== */}

          <Text
            style={{
              marginTop: 16,

              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 32 : esTablet ? 29 : 27,

              lineHeight: esEscritorio ? 40 : 34,

              textAlign: "center",

              color: primaryColor,
            }}
          >
            Únete a Kiri
          </Text>

          <Text
            style={{
              marginTop: 4,
              marginBottom: 26,

              fontFamily: "Nunito-Medium",

              fontSize: esEscritorio ? 16 : 15,

              lineHeight: 22,

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            Tu refugio emocional comienza hoy
          </Text>

          {/* ==================================================
              FORMULARIO
          ================================================== */}

          <View
            style={{
              width: "100%",
            }}
          >
            {/* NOMBRES + APELLIDOS */}

            <View
              style={{
                flexDirection: esTelefono ? "column" : "row",

                gap: esTelefono ? 0 : 14,
              }}
            >
              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="Nombres"
                  placeholder="Ej: Auxiliadora Vanessa"
                  value={nombres}
                  onChangeText={(value) => {
                    setNombres(value);
                    limpiarError();
                  }}
                  autoCapitalize="words"
                />
              </View>

              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="Apellidos"
                  placeholder="Ej: Morales Moreno"
                  value={apellidos}
                  onChangeText={(value) => {
                    setApellidos(value);
                    limpiarError();
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* PREFERIDO + TELÉFONO */}

            <View
              style={{
                flexDirection: esTelefono ? "column" : "row",

                gap: esTelefono ? 0 : 14,
              }}
            >
              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="¿Cómo prefieres que te llamemos?"
                  placeholder="Ej: Vanessa"
                  value={nombrePreferido}
                  onChangeText={(value) => {
                    setNombrePreferido(value);
                    limpiarError();
                  }}
                  autoCapitalize="words"
                />
              </View>

              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="Teléfono"
                  placeholder="Ej: 88888888"
                  value={telefono}
                  onChangeText={(value) => {
                    const soloNumeros = value.replace(/\D/g, "");

                    const limitado = soloNumeros.slice(0, 8);

                    setTelefono(limitado);
                    limpiarError();
                  }}
                  keyboardType="number-pad"
                  maxLength={8}
                />
              </View>
            </View>

            {/* CORREO */}

            <Input
              label="Correo Electrónico"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChangeText={(value) => {
                setCorreo(value);
                limpiarError();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            {/* ==================================================
                FECHA
            ================================================== */}

            <Text
              style={{
                marginBottom: 8,

                fontFamily: "Nunito-SemiBold",

                fontSize: 15,

                color: textColor,
              }}
            >
              Fecha de nacimiento
            </Text>

            {Platform.OS === "web" ? (
              <View
                style={{
                  width: "100%",

                  minHeight: 52,

                  marginBottom: 18,

                  paddingHorizontal: 15,

                  borderWidth: 1,
                  borderRadius: 12,

                  borderColor,

                  justifyContent: "center",

                  backgroundColor: surfaceColor,
                }}
              >
                <input
                  type="date"
                  value={fechaNacimiento}
                  min="1900-01-01"
                  max={formatearFecha(obtenerFechaMaxima())}
                  onChange={(event) => {
                    const value = event.currentTarget.value;

                    setFechaNacimiento(value);

                    if (value) {
                      const [year, month, day] = value.split("-").map(Number);

                      setFechaSeleccionada(new Date(year, month - 1, day));
                    }

                    limpiarError();
                  }}
                  style={{
                    width: "100%",
                    height: 50,

                    border: "none",
                    outline: "none",

                    background: "transparent",

                    fontSize: 15,

                    color: textColor,

                    fontFamily: "Nunito-Medium",

                    cursor: "pointer",
                  }}
                />
              </View>
            ) : (
              <>
                <Pressable
                  onPress={() => setMostrarCalendario(true)}
                  style={({ pressed }) => ({
                    width: "100%",

                    minHeight: 52,

                    marginBottom: 18,

                    paddingHorizontal: 15,

                    borderWidth: 1,
                    borderRadius: 12,

                    borderColor,

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",

                    backgroundColor: pressed
                      ? surfaceSecondaryColor
                      : surfaceColor,
                  })}
                >
                  <Text
                    style={{
                      flex: 1,

                      fontFamily: "Nunito-Medium",

                      fontSize: 15,

                      color: fechaNacimiento ? textColor : placeholderColor,
                    }}
                  >
                    {fechaNacimiento || "Selecciona tu fecha de nacimiento"}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={iconColor}
                  />
                </Pressable>

                {mostrarCalendario && (
                  <DateTimePicker
                    value={fechaSeleccionada ?? new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    minimumDate={new Date(1900, 0, 1)}
                    maximumDate={obtenerFechaMaxima()}
                    onChange={handleFechaChange}
                  />
                )}

                {Platform.OS === "ios" && mostrarCalendario && (
                  <Pressable
                    onPress={() => setMostrarCalendario(false)}
                    style={{
                      alignSelf: "flex-end",

                      marginTop: -8,
                      marginBottom: 18,

                      paddingHorizontal: 18,
                      paddingVertical: 8,

                      borderRadius: 10,

                      backgroundColor: primaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-SemiBold",

                        fontSize: 14,

                        color: textOnPrimaryColor,
                      }}
                    >
                      Listo
                    </Text>
                  </Pressable>
                )}
              </>
            )}

            {/* ==================================================
                GÉNERO
            ================================================== */}

            <Text
              style={{
                marginBottom: 8,

                fontFamily: "Nunito-SemiBold",

                fontSize: 15,

                color: textColor,
              }}
            >
              Género
            </Text>

            <View
              style={{
                width: "100%",

                flexDirection: "row",
                flexWrap: "wrap",

                gap: 8,

                marginBottom: 18,
              }}
            >
              {opcionesGenero.map((opcion) => {
                const activo = genero === opcion.value;

                return (
                  <Pressable
                    key={opcion.value}
                    onPress={() => {
                      setGenero(opcion.value);

                      limpiarError();
                    }}
                    style={({ pressed }) => ({
                      minHeight: 42,

                      paddingHorizontal: 14,
                      paddingVertical: 9,

                      borderWidth: 1,
                      borderRadius: 12,

                      borderColor: activo ? primaryColor : borderColor,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: activo
                        ? primarySoftColor
                        : pressed
                          ? surfaceSecondaryColor
                          : surfaceColor,
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: activo
                          ? "Nunito-SemiBold"
                          : "Nunito-Medium",

                        fontSize: 13,

                        color: activo ? primaryColor : textSecondaryColor,
                      }}
                    >
                      {opcion.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* ==================================================
                CONTRASEÑAS
            ================================================== */}

            <View
              style={{
                flexDirection: esTelefono ? "column" : "row",

                gap: esTelefono ? 0 : 14,
              }}
            >
              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="Contraseña"
                  placeholder="********"
                  value={contraseña}
                  onChangeText={(value) => {
                    setContraseña(value);
                    limpiarError();
                  }}
                  secureTextEntry={!mostrarContraseña}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  rightIcon={
                    <Pressable
                      hitSlop={8}
                      onPress={() => setMostrarContraseña(!mostrarContraseña)}
                    >
                      <Ionicons
                        name={mostrarContraseña ? "eye-off" : "eye"}
                        size={22}
                        color={iconColor}
                      />
                    </Pressable>
                  }
                />
              </View>

              <View
                style={{
                  flex: esTelefono ? undefined : 1,
                }}
              >
                <Input
                  label="Confirmar Contraseña"
                  placeholder="********"
                  value={confirmar}
                  onChangeText={(value) => {
                    setConfirmar(value);
                    limpiarError();
                  }}
                  secureTextEntry={!mostrarConfirmar}
                  autoCapitalize="none"
                  autoCorrect={false}
                  rightIcon={
                    <Pressable
                      hitSlop={8}
                      onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
                    >
                      <Ionicons
                        name={mostrarConfirmar ? "eye-off" : "eye"}
                        size={22}
                        color={iconColor}
                      />
                    </Pressable>
                  }
                />
              </View>
            </View>

            {/* ==================================================
                TÉRMINOS
            ================================================== */}

            <View
              style={{
                width: "100%",

                marginTop: 2,
                marginBottom: 20,

                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Pressable
                onPress={() => {
                  setAceptoCondi(!aceptoCondi);

                  limpiarError();
                }}
                hitSlop={6}
                style={{
                  width: 22,
                  height: 22,

                  flexShrink: 0,

                  marginTop: 2,
                  marginRight: 10,

                  borderWidth: 2,
                  borderRadius: 6,

                  borderColor: primaryColor,

                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: aceptoCondi ? primaryColor : surfaceColor,
                }}
              >
                {aceptoCondi && (
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={textOnPrimaryColor}
                  />
                )}
              </Pressable>

              <Text
                style={{
                  flex: 1,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,
                  lineHeight: 19,

                  color: textSecondaryColor,
                }}
              >
                Acepto los{" "}
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",

                    color: primaryColor,
                  }}
                  onPress={() => console.log("Ver Términos")}
                >
                  Términos y Condiciones
                </Text>{" "}
                y la{" "}
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",

                    color: primaryColor,
                  }}
                  onPress={() => console.log("Ver Política de Privacidad")}
                >
                  Política de Privacidad
                </Text>{" "}
                de Kiri.
              </Text>
            </View>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <View
                style={{
                  width: "100%",

                  marginBottom: 14,

                  padding: 13,

                  borderRadius: 13,

                  flexDirection: "row",
                  alignItems: "flex-start",

                  gap: 8,

                  backgroundColor: surfaceSecondaryColor,
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={dangerColor}
                />

                <Text
                  style={{
                    flex: 1,

                    fontFamily: "Nunito-Medium",

                    fontSize: 13,
                    lineHeight: 19,

                    color: dangerColor,
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* ==================================================
                CREAR CUENTA
            ================================================== */}

            <Button
              title={submitting ? "Creando cuenta..." : "Crear cuenta"}
              variant="primary"
              onPress={registrar}
              disabled={submitting}
            />

            {submitting && (
              <ActivityIndicator
                style={{
                  marginTop: 12,
                }}
                color={primaryColor}
              />
            )}

            {/* ==================================================
                SEPARADOR
            ================================================== */}

            <View
              style={{
                width: "100%",

                marginVertical: 18,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,

                  backgroundColor: dividerColor,
                }}
              />

              <Text
                style={{
                  marginHorizontal: 14,

                  fontFamily: "Nunito-Medium",

                  fontSize: 13,

                  color: textMutedColor,
                }}
              >
                o regístrate con
              </Text>

              <View
                style={{
                  flex: 1,
                  height: 1,

                  backgroundColor: dividerColor,
                }}
              />
            </View>

            {/* ==================================================
                GOOGLE
            ================================================== */}

            <GoogleButton
              onPress={() =>
                console.log("Registro con Google — pendiente de implementar")
              }
            />

            {/* ==================================================
                LOGIN
            ================================================== */}

            <View
              style={{
                marginTop: 20,

                flexDirection: "row",
                flexWrap: "wrap",

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  color: textSecondaryColor,
                }}
              >
                ¿Ya tienes una cuenta?{" "}
              </Text>

              <Pressable onPress={irALogin}>
                <Text
                  style={{
                    fontFamily: "Nunito-SemiBold",

                    fontSize: 14,

                    color: primaryColor,
                  }}
                >
                  Inicia sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
