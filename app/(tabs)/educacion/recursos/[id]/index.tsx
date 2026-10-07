import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, Pressable, Text, View } from "react-native";

import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BotonVolver from "@/components/ui/BotonVolver";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { obtenerDetalleRecurso } from "@/services/educacion/educacionService";
import { RecursoPsicoeducativo } from "@/types/educacion";

// Detalle del recurso.
export default function DetalleRecurso() {
  const router = useRouter(); // Navegación.
  const insets = useSafeAreaInsets(); // Área segura.
  const { id, categoriaId, origen } = useLocalSearchParams<{
  id?: string;
  categoriaId?: string;
  origen?: string;
}>(); // Parámetros de ruta.

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout(); // Responsive.

  const [recurso, setRecurso] = useState<RecursoPsicoeducativo | null>(null); // Libro.
  const [cargando, setCargando] = useState(true); // Estado de carga.
  const [esFavorito, setEsFavorito] = useState(false); // Favorito.
  const [descargando, setDescargando] = useState(false); // Estado de descarga.

  const scrollY = useSharedValue(0); // Posición del scroll.
  const escalaCorazon = useSharedValue(1); // Animación del favorito.
  const escalaDescargar = useSharedValue(1); // Animación de descarga.
  const escalaLeer = useSharedValue(1); // Animación de lectura.

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  }); // Controla el scroll.

  const estiloPortadaAnimada = useAnimatedStyle(() => {
    const escala = interpolate(
      scrollY.value,
      [0, 220],
      [1, 0.86],
      Extrapolation.CLAMP
    );
    const desplazamiento = interpolate(
      scrollY.value,
      [0, 220],
      [0, -12],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: desplazamiento }, { scale: escala }],
    };
  }); // Reduce la portada al bajar.

  const estiloCorazon = useAnimatedStyle(() => ({
    transform: [{ scale: escalaCorazon.value }],
  })); // Escala del corazón.

  const estiloDescargar = useAnimatedStyle(() => ({
    transform: [{ scale: escalaDescargar.value }],
  })); // Escala de descarga.

  const estiloLeer = useAnimatedStyle(() => ({
    transform: [{ scale: escalaLeer.value }],
  })); // Escala de leer.

  const backgroundColor = useThemeColor({}, "background"); // Fondo.
  const surfaceColor = useThemeColor({}, "surface"); // Superficie.
  const textColor = useThemeColor({}, "text"); // Texto principal.
  const textSecondaryColor = useThemeColor({}, "textSecondary"); // Texto secundario.
  const accentColor = useThemeColor({}, "accent"); // Acento.
  const borderColor = useThemeColor({}, "border"); // Bordes.
  const colorBotones = "#7C5CFC"; // Morado de acciones.

  useEffect(() => {
    let componenteActivo = true;

    async function cargarRecurso() {
      if (!id) {
        if (componenteActivo) setCargando(false);
        return;
      }

      setCargando(true);
      const recursoSupabase = await obtenerDetalleRecurso(id);

      if (componenteActivo) {
        setRecurso(recursoSupabase);
        setCargando(false);
      }
    }

    cargarRecurso();

    return () => {
      componenteActivo = false;
    };
  }, [id]); // Carga el libro.

  function formatearFecha(fecha: string | null) {
    if (!fecha) return "Fecha no disponible";

    const fechaRecurso = new Date(fecha);
    if (Number.isNaN(fechaRecurso.getTime())) return "Fecha no disponible";

    return fechaRecurso.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } // Formatea la fecha.

 function volverACategoria() {
  if (origen === "lecturas") {
    router.replace("/(tabs)/educacion/lecturas" as any);
    return;
  }

  if (categoriaId) {
    router.replace({
      pathname: "/(tabs)/educacion/[id]",
      params: { id: categoriaId },
    } as any);
    return;
  }

  router.replace("/(tabs)/educacion" as any);
} // Regresa a la categoría.

  function cambiarFavorito() {
    setEsFavorito((valorActual) => !valorActual);
  } // Cambia el favorito.

  async function descargarPdf() {
    if (!recurso || !recurso.url_recurso?.trim() || descargando) return;

    const recursoActual = recurso; // Mantiene una referencia segura del recurso.
    const urlPdf = recurso.url_recurso.trim(); // URL del PDF.
    try {
      setDescargando(true); // Evita descargas repetidas.

      if (Platform.OS === "web") {
        const respuesta = await fetch(urlPdf); // Descarga el PDF en web.
        if (!respuesta.ok) throw new Error("No se pudo descargar el PDF.");

        const archivo = await respuesta.blob(); // Convierte la respuesta en archivo.
        const urlArchivo = URL.createObjectURL(archivo); // Crea una URL temporal.
        const enlace = document.createElement("a"); // Crea el enlace de descarga.

        enlace.href = urlArchivo;
        enlace.download = `${recursoActual.titulo || "libro"}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        URL.revokeObjectURL(urlArchivo); // Libera la URL temporal.
        return;
      }

      //borre algo
      const nombreArchivo = `${recursoActual.titulo || "libro"}.pdf`.replace(
        /[\\/:*?"<>|]/g,
        "-"
      ); // Limpia caracteres inválidos.

      const rutaArchivo = `${FileSystem.cacheDirectory}${nombreArchivo}`; // Ruta temporal.
      const descarga = await FileSystem.downloadAsync(urlPdf, rutaArchivo); // Descarga el PDF.

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Descarga completada", "El PDF se descargó correctamente.");
        return;
      }

      await Sharing.shareAsync(descarga.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Guardar PDF",
        UTI: "com.adobe.pdf",
      }); // Abre las opciones del dispositivo.
    } catch {
      Alert.alert(
        "No se pudo descargar",
        "Ocurrió un problema al descargar el PDF. Inténtalo nuevamente."
      );
    } finally {
      setDescargando(false); // Habilita nuevamente el botón.
    }
  } // Descarga el PDF según la plataforma.

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor }}>
        <Text
          className="font-nunito-semibold"
          style={{ fontSize: 15, color: textSecondaryColor }}
        >
          Cargando libro...
        </Text>
      </View>
    );
  } // Pantalla de carga.

  if (!recurso) {
    return (
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          backgroundColor,
        }}
      >
        <BotonVolver onPress={volverACategoria} />

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="book-outline" size={48} color={textSecondaryColor} />

          <Text
            className="mt-4 text-center font-nunito-bold"
            style={{ fontSize: 18, color: textColor }}
          >
            Recurso no encontrado
          </Text>

          <Text
            className="mt-2 text-center font-nunito-medium"
            style={{ fontSize: 14, color: textSecondaryColor }}
          >
            No fue posible encontrar la información de este libro.
          </Text>
        </View>
      </View>
    );
  } // Recurso no encontrado.

  const anchoContenido = esEscritorio ? 1120 : esTablet ? 720 : "100%"; // Ancho principal.
  const paddingExterior = esEscritorio ? 32 : esTablet ? 24 : 14; // Espacio exterior.
  const paddingInformacion = esEscritorio ? 38 : esTablet ? 30 : 22; // Espacio interno.
  const anchoZonaPortada = esEscritorio ? 430 : "100%"; // Ancho de portada.
  const altoZonaPortada = esEscritorio ? 540 : esTablet ? 520 : 470; // Alto de portada.
  const anchoPortada = esEscritorio ? 310 : esTablet ? 300 : "68%"; // Ancho de imagen.
  const altoPortada = esEscritorio ? 455 : esTablet ? 430 : 350; // Alto de imagen.
  const radioPortada = 18; // Radio de portada.

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: esEscritorio ? 34 : 16,
          paddingBottom: insets.bottom + (esEscritorio ? 40 : 120),
        }}
      >
        <View
          className="w-full items-center"
          style={{ paddingHorizontal: paddingExterior }}
        >
          {/* Contenedor principal. */}
          <View
            style={{
              width: anchoContenido,
              maxWidth: "100%",
              flexDirection: esEscritorio ? "row" : "column",
              alignItems: "stretch",
              gap: esEscritorio ? 24 : 0,
            }}
          >
            {/* Card de portada. */}
            <View
              className="relative items-center justify-center"
              style={{
                width: anchoZonaPortada,
                maxWidth: "100%",
                height: altoZonaPortada,
                backgroundColor: surfaceColor,
                borderRadius: 30,
                borderWidth: 1,
                borderColor,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              {/* Imagen de portada. */}
              <Animated.View
                style={[
                  {
                    width: anchoPortada,
                    height: altoPortada,
                    maxWidth: "82%",
                    alignSelf: "center",
                    borderRadius: radioPortada,
                    overflow: "hidden",
                    backgroundColor: surfaceColor,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                  },
                  !esEscritorio ? estiloPortadaAnimada : undefined,
                ]}
              >
                {recurso.imagen_portada ? (
                  <Image
                    source={{ uri: recurso.imagen_portada }}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: radioPortada,
                    }}
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Ionicons
                      name="library-outline"
                      size={esEscritorio ? 70 : 62}
                      color={accentColor}
                    />
                  </View>
                )}
              </Animated.View>

              {/* Botón volver. */}
              <View
                className="absolute"
                style={{
                  top: esEscritorio ? 18 : 20,
                  left: esEscritorio ? 18 : 20,
                  zIndex: 30,
                  elevation: 10,
                }}
              >
                <BotonVolver onPress={volverACategoria} />
              </View>

              {/* Botón favorito. */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: esEscritorio ? 18 : 20,
                    right: esEscritorio ? 18 : 20,
                    zIndex: 30,
                    elevation: 10,
                  },
                  estiloCorazon,
                ]}
              >
                <Pressable
                  onPress={cambiarFavorito}
                  onPressIn={() => {
                    escalaCorazon.value = withSpring(0.82);
                  }}
                  onPressOut={() => {
                    escalaCorazon.value = withSpring(1);
                  }}
                  hitSlop={12}
                  className="h-[54px] w-[54px] items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
                >
                  <Ionicons
                    name={esFavorito ? "heart" : "heart-outline"}
                    size={41}
                    color={accentColor}
                  />
                </Pressable>
              </Animated.View>
            </View>

            {/* Card de información. */}
            <Animated.View
              entering={FadeInDown.duration(350)}
              style={{
                flex: esEscritorio ? 1 : undefined,
                width: esEscritorio ? undefined : "100%",
                marginTop: esEscritorio ? 0 : -24,
                zIndex: 20,
                paddingHorizontal: paddingInformacion,
                paddingTop: esEscritorio ? 38 : 40,
                paddingBottom: esEscritorio ? 38 : 32,
                backgroundColor: surfaceColor,
                borderRadius: 30,
                borderWidth: 1,
                borderColor,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              {/* Título. */}
              <Text
                className="font-nunito-bold"
                style={{
                  fontSize: esEscritorio ? 30 : esTablet ? 27 : 23,
                  lineHeight: esEscritorio ? 38 : esTablet ? 35 : 30,
                  color: textColor,
                }}
              >
                {recurso.titulo}
              </Text>

              {/* Autor. */}
              <View className="mt-[22px] flex-row items-center">
                <Ionicons
                  name="person-circle-outline"
                  size={esEscritorio ? 32 : 30}
                  color={accentColor}
                />
                <Text
                  className="ml-3 flex-1 font-nunito-semibold"
                  style={{
                    fontSize: esEscritorio ? 17 : 15,
                    color: textSecondaryColor,
                  }}
                >
                  {recurso.autor_fuente || "Autor no disponible"}
                </Text>
              </View>

              {/* Fecha. */}
              <View className="mt-[14px] flex-row items-center">
                <Ionicons
                  name="calendar-number-outline"
                  size={esEscritorio ? 31 : 29}
                  color={accentColor}
                />
                <Text
                  className="ml-3 flex-1 font-nunito-medium"
                  style={{
                    fontSize: esEscritorio ? 16 : 14,
                    color: textSecondaryColor,
                  }}
                >
                  {formatearFecha(recurso.fecha_publicacion)}
                </Text>
              </View>

              {/* Descripción. */}
              <View style={{ marginTop: esEscritorio ? 30 : 26 }}>
                <Text
                  className="font-nunito-bold"
                  style={{
                    fontSize: esEscritorio ? 21 : 19,
                    color: textColor,
                  }}
                >
                  Descripción
                </Text>

                <Text
                  className="mt-[14px] font-nunito-medium"
                  style={{
                    fontSize: esEscritorio ? 16 : 14,
                    lineHeight: esEscritorio ? 26 : 23,
                    textAlign: "justify",
                    color: textSecondaryColor,
                  }}
                >
                  {recurso.descripcion ||
                    "Este recurso no tiene una descripción disponible."}
                </Text>
              </View>

              {/* Botones de acción. */}
              <View
                className="w-full flex-row items-center"
                style={{ gap: 10, marginTop: esEscritorio ? 34 : 28 }}
              >
                {/* Botón descargar. */}
                <Animated.View
                  style={[
                    {
                      width: esTelefono ? 54 : esEscritorio ? 66 : 58,
                      height: esTelefono ? 54 : esEscritorio ? 60 : 56,
                      borderRadius: esTelefono ? 15 : 17,
                      backgroundColor: colorBotones,
                      overflow: "hidden",
                      elevation: 4,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.14,
                      shadowRadius: 5,
                    },
                    estiloDescargar,
                  ]}
                >
                  <Pressable
                    onPress={descargarPdf}
                    disabled={descargando}
                    onPressIn={() => {
                      escalaDescargar.value = withSpring(0.9);
                    }}
                    onPressOut={() => {
                      escalaDescargar.value = withSpring(1);
                    }}
                    className="h-full w-full items-center justify-center"
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? "#6E4BEF" : colorBotones,
                      opacity: descargando ? 0.7 : 1,
                    })}
                  >
                    <View
                      className="items-center justify-center"
                      style={{
                        width: esTelefono ? 28 : 32,
                        height: esTelefono ? 28 : 32,
                      }}
                    >
                      <Ionicons
                        name="download-outline"
                        size={esTelefono ? 21 : esTablet ? 24 : 26}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                </Animated.View>

                {/* Botón leer. */}
                <Animated.View
                  style={[
                    {
                      flex: 1,
                      minWidth: 0,
                      height: esTelefono ? 54 : esEscritorio ? 60 : 56,
                      borderRadius: esTelefono ? 15 : 17,
                      backgroundColor: colorBotones,
                      overflow: "hidden",
                      elevation: 4,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.14,
                      shadowRadius: 5,
                    },
                    estiloLeer,
                  ]}
                >
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/educacion/recursos/[id]/lector",
                        params: {
                          id: recurso.id_recurso,
                          categoriaId,
                          origen,
                        },
                      } as any);
                    }}
                    onPressIn={() => {
                      escalaLeer.value = withSpring(0.96);
                    }}
                    onPressOut={() => {
                      escalaLeer.value = withSpring(1);
                    }}
                    className="h-full w-full flex-row items-center"
                    style={({ pressed }) => ({
                      paddingHorizontal: esTelefono ? 14 : 18,
                      backgroundColor: pressed ? "#6E4BEF" : colorBotones,
                    })}
                  >
                    {/* Texto del botón. */}
                    <Text
                      className="flex-1 text-center font-nunito-bold"
                      numberOfLines={1}
                      style={{
                        fontSize: esTelefono ? 15 : esEscritorio ? 18 : 16,
                        color: "#FFFFFF",
                      }}
                    >
                      Leer
                    </Text>

                    {/* Flecha de entrada. */}
                    <View
                      className="items-center justify-center"
                      style={{
                        width: esTelefono ? 28 : 32,
                        height: esTelefono ? 28 : 32,
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={esTelefono ? 20 : esTablet ? 22 : 24}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}