import { useThemeMode } from "@/contexts/ThemeModeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import BotonVolver from "@/components/ui/BotonVolver";
import GoogleButton from "@/components/ui/GoogleButton";
import Input from "@/components/ui/Input";
import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";
import type { Genero } from "@/types/auth";
import { EDAD_MINIMA, validateRegister } from "@/utils/validations";

const OPCIONES_GENERO: { label: string; value: Genero }[] = [
  { label: "Femenino", value: "femenino" },
  { label: "Masculino", value: "masculino" },
  { label: "Otro", value: "otro" },
  { label: "Prefiero no decir", value: "prefiero_no_decir" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();
  const { themeMode } = useThemeMode();

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const dividerColor = useThemeColor({}, "divider");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const dangerColor = useThemeColor({}, "danger");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nombrePreferido, setNombrePreferido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [genero, setGenero] = useState<Genero | "">("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [aceptoCondi, setAceptoCondi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paddingHorizontal = esEscritorio ? PADDING_RESPONSIVE.escritorio : esTablet ? PADDING_RESPONSIVE.tablet : PADDING_RESPONSIVE.telefono;
  const maxWidthPantalla = esEscritorio ? MAX_WIDTHS.dashboard : esTablet ? MAX_WIDTHS.contenido : undefined;
  const maxWidthFormulario = esEscritorio ? 860 : esTablet ? MAX_WIDTHS.formulario : undefined;
  const paddingTop = esEscritorio ? 36 : Math.max(insets.top + 18, 28);
  const paddingBottom = esEscritorio ? 54 : Math.max(insets.bottom + 32, 44);
  const paddingTarjeta = esEscritorio ? 30 : esTablet ? 26 : esTelefono ? 0 : 22;
  const columnasGenero = esTelefono ? 2 : 4;
  const anchoOpcionGenero = columnasGenero === 2 ? "48%" : "23.5%";

  const limpiarError = () => {
    setError(null);
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
  const mostrarFecha = () => {
    if (!fechaSeleccionada) {
      return "Selecciona tu fecha de nacimiento";
    }
    return fechaSeleccionada.toLocaleDateString("es-NI", { day: "2-digit", month: "long", year: "numeric" });
  };
  const obtenerFechaMaxima = () => {
    const hoy = new Date();
    return new Date(hoy.getFullYear() - EDAD_MINIMA, hoy.getMonth(), hoy.getDate());
  };
  const handleFechaChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
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

  const registrar = async () => {
    if (submitting) {
      return;
    }
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
        router.replace({ pathname: "/(auth)/registro_exitoso", params: { email: correo.trim().toLowerCase() } });
        return;
      }
    } catch (err: any) {
      console.error("Error registrando usuario:", err);
      const message = err?.message?.toLowerCase?.() ?? "";
      if (message.includes("already registered") || message.includes("already exists")) {
        setError("Ya existe una cuenta registrada con este correo.");
      } else if (message.includes("password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(err?.message ?? "No se pudo crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // NativeWind: flex-1 ocupa el espacio disponible; grow equivale a flexGrow: 1 en el contenido.
    // Los valores [Npx] conservan medidas exactas. Colores, responsive, estados y sombras siguen en style.
    <ScrollView className="flex-1" contentContainerClassName="grow" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} style={{ backgroundColor }} contentContainerStyle={{ paddingTop, paddingBottom }}>
      {/* w-full = ancho 100%; self-center = alignSelf center; items-center = alignItems center. */}
      <View className="w-full self-center items-center" style={{ maxWidth: maxWidthPantalla, paddingHorizontal }}>
        <View
          className="w-full"
          style={{
            maxWidth: maxWidthFormulario,
            padding: paddingTarjeta,
            borderWidth: esTelefono ? 0 : 1,
            borderRadius: esTelefono ? 0 : 26,
            borderColor,
            backgroundColor: esTelefono ? "transparent" : surfaceColor,
            ...(Platform.OS === "web" && !esTelefono ? ({ boxShadow: "0px 6px 20px rgba(0,0,0,0.045)" } as any) : {}),
            ...(Platform.OS === "ios" && !esTelefono
              ? { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 }
              : {}),
            ...(Platform.OS === "android" && !esTelefono ? { elevation: 3 } : {}),
          }}
        >
          {/* items-start alinea a la izquierda; mb-[12px] mantiene 12 px de margen inferior. */}
          <View className="w-full items-start mb-[12px]">
            <BotonVolver onPress={() => router.replace("/(auth)/modo_acceso")} />
          </View>
          {/* justify-center centra en el eje principal; overflow-hidden recorta al borde del logo. */}
          <View className="items-center">
            <View className="items-center justify-center overflow-hidden" style={{ width: esEscritorio ? 120 : 100, height: esEscritorio ? 120 : 100, borderRadius: esEscritorio ? 28 : 23 }}>
              <Image
                source={themeMode === "dark" ? require("../../assets/images/splash-icon-ps.png") : require("../../assets/images/splash-icon.png")}
                resizeMode="contain"
                style={{ width: esEscritorio ? 120 : 100, height: esEscritorio ? 120 : 100 }}
              />
            </View>
          </View>
          {/* mt-[16px]/mt-[4px] = margen superior; text-center centra texto; font-nunito-* conserva la fuente sin añadir fontWeight. */}
          <Text className="mt-[16px] font-nunito-bold text-center" style={{ fontSize: esEscritorio ? 32 : esTablet ? 29 : 27, lineHeight: esEscritorio ? 40 : 35, color: primaryColor }}>
            Únete a Kiri
          </Text>
          {/* leading-[22px] mantiene lineHeight: 22; margen inferior y tamaño de fuente siguen siendo responsive. */}
          <Text className="mt-[4px] font-nunito-medium leading-[22px] text-center" style={{ marginBottom: esTelefono ? 24 : 30, fontSize: esEscritorio ? 16 : 15, color: textSecondaryColor }}>
            Tu refugio emocional comienza hoy
          </Text>
          {/* min-w-0 permite reducir el ancho de campos; flex y gap mantienen sus condiciones responsive originales. */}
          <View className="w-full">
            <View style={{ flexDirection: esTelefono ? "column" : "row", gap: esTelefono ? 0 : 14 }}>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
                <Input label="Nombres" placeholder="Ej: Auxiliadora Vanessa" value={nombres} onChangeText={(value) => { setNombres(value); limpiarError(); }} autoCapitalize="words" />
              </View>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
                <Input label="Apellidos" placeholder="Ej: Morales Moreno" value={apellidos} onChangeText={(value) => { setApellidos(value); limpiarError(); }} autoCapitalize="words" />
              </View>
            </View>
            <View style={{ flexDirection: esTelefono ? "column" : "row", gap: esTelefono ? 0 : 14 }}>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
                <Input label="¿Cómo prefieres que te llamemos?" placeholder="Ej: Vanessa" value={nombrePreferido} onChangeText={(value) => { setNombrePreferido(value); limpiarError(); }} autoCapitalize="words" />
              </View>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
                <Input
                  label="Teléfono"
                  placeholder="Ej: 88888888"
                  value={telefono}
                  onChangeText={(value) => {
                    const soloNumeros = value.replace(/\D/g, "");
                    setTelefono(soloNumeros.slice(0, 8));
                    limpiarError();
                  }}
                  keyboardType="number-pad"
                  maxLength={8}
                />
              </View>
            </View>
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
            {/* mb-[10px] = margen inferior 10; text-[15px] = fontSize 15; font-nunito-semibold = Nunito-SemiBold. */}
            <Text className="mb-[10px] font-nunito-semibold text-[15px]" style={{ color: textColor }}>Fecha de nacimiento</Text>
            {Platform.OS === "web" ? (
              // min-h-[56px] = alto mínimo 56; px-[15px] = padding horizontal 15; border-[1px]/rounded-[14px] = borde 1/radio 14.
              <View className="w-full min-h-[56px] mb-[24px] px-[15px] border-[1px] rounded-[14px] justify-center" style={{ borderColor, backgroundColor: surfaceSecondaryColor }}>
                {/* HTML solo web: h-[52px] = alto 52; [border:none]/[outline:none] quitan borde/contorno; [background:transparent] mantiene el fondo; cursor-pointer = cursor de enlace. */}
                <input
                  className="w-full h-[52px] [border:none] [outline:none] [background:transparent] text-[15px] font-nunito-medium cursor-pointer"
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
                    } else {
                      setFechaSeleccionada(null);
                    }
                    limpiarError();
                  }}
                  style={{
                    color: textColor,
                    colorScheme: backgroundColor === "#FFFFFF" ? "light" : "dark",
                  }}
                />
              </View>
            ) : (
              <>
                <Pressable
                  onPress={() => {
                    setMostrarCalendario(true);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar fecha de nacimiento"
                  className="w-full mb-[24px] rounded-[14px] overflow-hidden"
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                >
                  {/* flex-row = fila; justify-between separa extremos; gap-[12px] = separación 12; py-[12px] = padding vertical 12. */}
                  <View className="w-full min-h-[58px] px-[16px] py-[12px] border-[1px] rounded-[14px] flex-row items-center justify-between gap-[12px]" style={{ borderColor, backgroundColor: surfaceSecondaryColor }}>
                    {/* text-[14px]/leading-[20px] conservan tamaño 14/interlineado 20; flex-1 usa el espacio restante. */}
                    <Text className="flex-1 min-w-0 font-nunito-medium text-[14px] leading-[20px]" numberOfLines={2} style={{ color: fechaNacimiento ? textColor : textSecondaryColor }}>
                      {mostrarFecha()}
                    </Text>
                    {/* w/h-[36px] = 36 × 36; rounded-[10px] = radio 10; shrink-0 impide encoger el icono. */}
                    <View className="w-[36px] h-[36px] rounded-[10px] shrink-0 items-center justify-center" style={{ backgroundColor: primarySoftColor }}>
                      <Ionicons name="calendar-outline" size={20} color={primaryColor} />
                    </View>
                  </View>
                </Pressable>
                {mostrarCalendario && (
                  <DateTimePicker
                    value={fechaSeleccionada ?? obtenerFechaMaxima()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    minimumDate={new Date(1900, 0, 1)}
                    maximumDate={obtenerFechaMaxima()}
                    onChange={handleFechaChange}
                  />
                )}
                {Platform.OS === "ios" && mostrarCalendario && (
                  // self-end alinea al final; mt-[-8px]/mb-[18px] = márgenes -8/18; px/py-[18px]/[10px] = padding 18/10.
                  <Pressable
                    onPress={() => {
                      setMostrarCalendario(false);
                    }}
                    className="self-end mt-[-8px] mb-[18px] px-[18px] py-[10px] rounded-[10px]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Text className="font-nunito-semibold text-[14px]" style={{ color: textOnPrimaryColor }}>Listo</Text>
                  </Pressable>
                )}
              </>
            )}
            {/* flex-wrap permite varias filas; gap-y-[12px] separa filas 12; mb-[26px] conserva margen inferior 26. */}
            <Text className="mb-[12px] font-nunito-semibold text-[15px]" style={{ color: textColor }}>Género</Text>
            <View className="w-full flex-row flex-wrap items-start justify-between gap-y-[12px] mb-[26px]" accessibilityRole="radiogroup">
              {OPCIONES_GENERO.map((opcion) => {
                const activo = genero === opcion.value;
                return (
                  <Pressable
                    key={opcion.value}
                    onPress={() => {
                      setGenero(opcion.value);
                      limpiarError();
                    }}
                    accessibilityRole="radio"
                    accessibilityLabel={opcion.label}
                    accessibilityState={{ checked: activo }}
                    className="min-h-[64px] rounded-[14px] overflow-hidden"
                    style={({ pressed }) => ({ width: anchoOpcionGenero, opacity: pressed ? 0.8 : 1 })}
                  >
                    {/* min-h-[64px] = alto mínimo 64; gap-[9px] = separación 9; justify-start alinea contenido al inicio. */}
                    <View
                      className="w-full min-h-[64px] py-[12px] rounded-[14px] flex-row items-center justify-start gap-[9px]"
                      style={{
                        paddingHorizontal: esTelefono ? 10 : 12,
                        borderWidth: activo ? 2 : 1,
                        borderColor: activo ? primaryColor : borderColor,
                        backgroundColor: activo ? primarySoftColor : surfaceSecondaryColor,
                      }}
                    >
                      <Ionicons name={activo ? "radio-button-on" : "radio-button-off"} size={20} color={activo ? primaryColor : textSecondaryColor} />
                      {/* shrink equivale a flexShrink: 1; leading-[18px] conserva interlineado 18; fuente/tamaño dependen del estado/pantalla. */}
                      <Text className="shrink leading-[18px]" style={{ fontFamily: activo ? "Nunito-Bold" : "Nunito-Medium", fontSize: esTelefono ? 12 : 13, color: activo ? primaryColor : textColor }}>
                        {opcion.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <View style={{ flexDirection: esTelefono ? "column" : "row", gap: esTelefono ? 0 : 14 }}>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
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
                    <Pressable hitSlop={8} onPress={() => { setMostrarContraseña(!mostrarContraseña); }}>
                      <Ionicons name={mostrarContraseña ? "eye-off" : "eye"} size={22} color={textSecondaryColor} />
                    </Pressable>
                  }
                />
              </View>
              <View className="min-w-0" style={{ flex: esTelefono ? undefined : 1 }}>
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
                    <Pressable hitSlop={8} onPress={() => { setMostrarConfirmar(!mostrarConfirmar); }}>
                      <Ionicons name={mostrarConfirmar ? "eye-off" : "eye"} size={22} color={textSecondaryColor} />
                    </Pressable>
                  }
                />
              </View>
            </View>
            {/* mt-[2px]/mb-[22px] conservan márgenes 2/22; checkbox w/h-[24px], borde 2 y radio 7. */}
            <View className="w-full mt-[2px] mb-[22px] flex-row items-start">
              {/* mt-[1px]/mr-[11px] = márgenes superior 1/derecho 11; shrink-0 mantiene el tamaño del checkbox. */}
              <Pressable
                onPress={() => {
                  setAceptoCondi(!aceptoCondi);
                  limpiarError();
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: aceptoCondi }}
                hitSlop={8}
                className="w-[24px] h-[24px] shrink-0 mt-[1px] mr-[11px] border-[2px] rounded-[7px] items-center justify-center"
                style={{
                  borderColor: primaryColor,
                  backgroundColor: aceptoCondi ? primaryColor : surfaceSecondaryColor,
                }}
              >
                {aceptoCondi && <Ionicons name="checkmark" size={16} color={textOnPrimaryColor} />}
              </Pressable>
              {/* text-[13px]/leading-[20px] mantienen tamaño 13/interlineado 20; los enlaces conservan Nunito-SemiBold. */}
              <Text className="flex-1 min-w-0 font-nunito-medium text-[13px] leading-[20px]" style={{ color: textSecondaryColor }}>
                Acepto los{" "}
                <Text className="font-nunito-semibold" style={{ color: primaryColor }} onPress={() => { console.log("Ver Términos"); }}>
                  Términos y Condiciones
                </Text>{" "}
                y la{" "}
                <Text className="font-nunito-semibold" style={{ color: primaryColor }} onPress={() => { console.log("Ver Política de Privacidad"); }}>
                  Política de Privacidad
                </Text>{" "}
                de Kiri.
              </Text>
            </View>
            {error && (
              // p-[14px] = padding 14; rounded-[13px] = radio 13; mb-[16px]/gap-[10px] = margen 16/separación 10.
              <View className="w-full mb-[16px] p-[14px] rounded-[13px] flex-row items-start gap-[10px]" style={{ backgroundColor: surfaceSecondaryColor }}>
                <Ionicons name="alert-circle-outline" size={21} color={dangerColor} />
                <Text className="flex-1 min-w-0 font-nunito-medium text-[13px] leading-[19px]" style={{ color: dangerColor }}>{error}</Text>
              </View>
            )}
            <Button title={submitting ? "Creando cuenta..." : "Crear cuenta"} variant="primary" onPress={registrar} disabled={submitting} />
            {/* mt-[12px] separa el indicador; my-[20px] = margen vertical 20; h-[1px] = alto del divisor 1. */}
            {submitting && <ActivityIndicator className="mt-[12px]" color={primaryColor} />}
            <View className="w-full my-[20px] flex-row items-center">
              <View className="flex-1 h-[1px]" style={{ backgroundColor: dividerColor }} />
              {/* mx-[14px] mantiene margen horizontal 14. */}
              <Text className="mx-[14px] font-nunito-medium text-[13px]" style={{ color: textMutedColor }}>o regístrate con</Text>
              <View className="flex-1 h-[1px]" style={{ backgroundColor: dividerColor }} />
            </View>
            <GoogleButton onPress={() => { console.log("Registro con Google — pendiente de implementar"); }} />
            {/* mt-[22px] = margen superior 22; flex-row/flex-wrap permiten fila con salto; items/justify-center centran el grupo. */}
            <View className="mt-[22px] flex-row flex-wrap items-center justify-center">
              <Text className="font-nunito-medium text-[14px]" style={{ color: textSecondaryColor }}>
                ¿Ya tienes una cuenta?{" "}
              </Text>
              <Pressable onPress={irALogin} hitSlop={8}>
                <Text className="font-nunito-semibold text-[14px]" style={{ color: primaryColor }}>Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
