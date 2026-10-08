import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";
import { Colors } from "@/constants/theme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Button from "../../components/ui/Button";
import BotonVolver from "../../components/ui/BotonVolver";
import OptionCard from "../../components/ui/OptionCard";

export default function AccessTypeScreen() {
  const router = useRouter();
  const { width, esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // Navegacion
  const handleIndependetUser = () => { router.push("/(auth)/registro"); };
  const handleEducationalInstitution = () => { router.push("/(auth)/institucion_codigo"); };
  const handleAdminInstitucion = () => { router.push("/(auth)/registro_institucion"); };
  const irLogin = () => { router.push("/(auth)/login"); };

  // Valores responsive y calculo del ancho disponible
  const paddingHorizontal = esEscritorio ? PADDING_RESPONSIVE.escritorio : esTablet ? PADDING_RESPONSIVE.tablet : PADDING_RESPONSIVE.telefono;
  const maxWidthContenido = esEscritorio ? MAX_WIDTHS.contenido : esTablet ? 900 : 520;
  const tamanoLogo = esEscritorio ? 190 : esTablet ? 175 : 160;
  const tamanoTitulo = esEscritorio ? 40 : esTablet ? 37 : 35;
  const tamanoSubtitulo = esEscritorio ? 24 : esTablet ? 23 : 22;
  const anchoContenedor = Math.min(width, maxWidthContenido);
  const anchoUtil = anchoContenedor - paddingHorizontal * 2;
  const gapCards = 16;
  const anchoCard = esEscritorio ? (anchoUtil - gapCards * 2) / 3 : esTablet ? (anchoUtil - gapCards) / 2 : anchoUtil;

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: Colors.light.background }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      {/* NativeWind: flex-1 = flex: 1 (ocupa espacio disponible). El fondo se mantiene fijo en modo claro desde theme.ts. */}
      {/* NativeWind: w-full = 100% de ancho; flex-1 = ocupa espacio; self-center = centrado; items-center/justify-center = centra contenido; py-[30px] = padding vertical fijo de 30 px. */}
      {/* maxWidth y paddingHorizontal en style son valores responsive: cambian segun teléfono, tablet o escritorio. */}
      <View className="w-full flex-1 self-center items-center justify-center py-[30px]" style={{ maxWidth: maxWidthContenido, paddingHorizontal }}>
        {/* NativeWind: mb-3 = margen inferior fijo de 12 px; w-full = ancho completo; items-start = alinea el botón a la izquierda. */}
        <View className="mb-3 w-full items-start">
          <BotonVolver onPress={() => router.replace("/(auth)/welcome")} />
        </View>

        {/* Logo: su alto, margen y ancho responsive siguen en style para conservar exactamente sus dimensiones. */}
        <Image source={require("../../assets/images/logo_secundario.png")} style={{ height: 100, marginBottom: -11, width: tamanoLogo }} resizeMode="contain" />
        {/* Titulo: mb-2 = 8 px de separacion; text-center = centrado; font-nunito-bold/font-bold = fuente y peso fijos. */}
        {/* El fontSize y color se conservan en style; fontSize cambia segun el dispositivo. */}
        <Text className="mb-2 text-center font-nunito-bold font-bold" style={{ fontSize: tamanoTitulo, color: "#2C3E50" }}>¿Cómo accederás?</Text>
        {/* Subtitulo: mb-6 = 24 px de separacion; text-center = centrado; font-nunito-medium/font-normal = fuente y peso fijos. */}
        {/* El fontSize es responsive; el color viene de Colors.light en theme.ts. */}
        <Text className="mb-6 text-center font-nunito-medium font-normal" style={{ fontSize: tamanoSubtitulo, color: Colors.light.textSecondary }}>Selecciona una opción para comenzar.</Text>

        {/* Opciones */}
        {/* NativeWind: w-full = 100% de ancho; flex-wrap = permite ajustar tarjetas; items-stretch = estira en el eje cruzado; justify-center = centra. */}
        {/* gap y flexDirection en style conservan valores calculados: separacion 16 px y columna en telefono/fila en tablet o escritorio. */}
        {/* Cada width en style es responsive: 100% en teléfono y anchoCard calculado en pantallas mayores. */}
        <View className="w-full flex-wrap items-stretch justify-center" style={{ gap: gapCards, flexDirection: esTelefono ? "column" : "row" }}>
          <View style={{ width: esTelefono ? "100%" : anchoCard }}>
            <OptionCard title="Usuario Independiente" description="Cuida tu bienestar emocional con herramientas personalizadas." imageSource={require("../../assets/images/usuario.png")} onPress={handleIndependetUser} />
          </View>
          <View style={{ width: esTelefono ? "100%" : anchoCard }}>
            <OptionCard title="Institución Educativa" description="Accede con el código de tu colegio o universidad." imageSource={require("../../assets/images/institucion_user.png")} onPress={handleEducationalInstitution} />
          </View>
          <View style={{ width: esTelefono ? "100%" : anchoCard }}>
            <OptionCard title="Soy Institución" description="Quiero crear un panel para mi comunidad." imageSource={require("../../assets/images/institucion.png")} onPress={handleAdminInstitucion} />
          </View>
        </View>

        {/* Login: NativeWind mt-6 = margen superior fijo de 24 px; w-full = 100%; self-center = centrado. */}
        {/* maxWidth en style se adapta al dispositivo y mantiene el limite del formulario fuera del telefono. */}
        <View className="mt-6 w-full self-center" style={{ maxWidth: esTelefono ? undefined : MAX_WIDTHS.formularioAuth }}>
          <Button title="¿Ya tienes una cuenta? Iniciar Sesión" variant="secondary" onPress={irLogin} />
        </View>
      </View>
    </ScrollView>
  );
}