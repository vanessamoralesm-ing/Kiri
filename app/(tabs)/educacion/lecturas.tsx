import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router/react-navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import LecturaRecomendadaCard from "@/components/educacion/LecturaRecomendadaCard";
import BotonVolver from "@/components/ui/BotonVolver";
import EstadoVacio from "@/components/ui/EstadoVacio";
import FiltrosCategorias from "@/components/ui/FiltrosCategorias";
import SearchBar from "@/components/ui/SearchBar";
import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLecturasEducacion } from "@/hooks/useLecturasEducacion";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// Categorías disponibles para filtrar las lecturas.
const categorias = [
  "Todas",
  "Ansiedad",
  "Autoestima",
  "Estrés",
  "Procrastinación",
  "Soledad",
  "Depresión",
];

// Relaciona el nombre visible con el id utilizado por /educacion/[id].
const idsCategorias: Record<string, string> = {
  Ansiedad: "Ansiedad",
  Autoestima: "Autoestima",
  Estrés: "Estres",
  Procrastinación: "Procrastinacion",
  Soledad: "Soledad",
  Depresión: "Depresion",
};

// Elimina tildes y diferencias entre mayúsculas y minúsculas.
function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Pantalla principal de la biblioteca.
export default function LecturasScreen() {
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout(); // Responsive general.
  const scrollViewRef = useRef<ScrollView>(null); // Controla la posición del scroll.

  const [busqueda, setBusqueda] = useState(""); // Texto del buscador.
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoria || "Todas"
  ); // Filtro seleccionado.
  const [anchoGrid, setAnchoGrid] = useState(0); // Ancho real disponible del grid.

  const { lecturas } = useLecturasEducacion(); // Obtiene las lecturas desde Educación.

  const backgroundColor = useThemeColor({}, "background"); // Fondo.
  const textColor = useThemeColor({}, "text"); // Texto principal.
  const textMutedColor = useThemeColor({}, "textMuted"); // Texto secundario.

  // Actualiza el filtro cuando la categoría cambia desde la ruta.
  useEffect(() => {
    setCategoriaSeleccionada(categoria || "Todas");
    setBusqueda("");
  }, [categoria]);

  // Regresa el scroll al inicio cada vez que la pantalla recibe el foco.
  useFocusEffect(
    useCallback(() => {
      const frame = requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      });

      return () => cancelAnimationFrame(frame);
    }, [])
  );

  // Conserva los paddings definidos globalmente para cada dispositivo.
  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  // Limita el contenido para evitar que se estire demasiado.
  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  // Mantiene 2 columnas en teléfono, 3 en tablet y 4 en escritorio.
  const numeroColumnas = esEscritorio ? 4 : esTablet ? 3 : 2;

  // Conserva la separación original entre las tarjetas.
  const gapLecturas = esEscritorio ? 26 : esTablet ? 18 : 12;

  // Calcula el ancho disponible descontando los espacios entre columnas.
  const anchoDisponible =
    anchoGrid > 0
      ? Math.floor(
          (anchoGrid - gapLecturas * (numeroColumnas - 1)) / numeroColumnas
        )
      : 0;

  // Mantiene el margen de seguridad de Android y los tamaños originales.
  const anchoTarjeta =
    anchoDisponible > 0
      ? esEscritorio
        ? Math.min(anchoDisponible, 230)
        : esTablet
          ? Math.min(anchoDisponible, 190)
          : Math.max(anchoDisponible - 1, 0)
      : esEscritorio
        ? 230
        : esTablet
          ? 190
          : 150;

  // Filtra por categoría, título, descripción y autor.
  const lecturasFiltradas = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return lecturas.filter((lectura) => {
      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        normalizarTexto(lectura.categoria) ===
          normalizarTexto(categoriaSeleccionada);

      const coincideBusqueda =
        !texto ||
        normalizarTexto(lectura.titulo).includes(texto) ||
        normalizarTexto(lectura.descripcion || "").includes(texto) ||
        normalizarTexto(lectura.categoria).includes(texto) ||
        normalizarTexto(lectura.autor_fuente || "").includes(texto);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaSeleccionada, lecturas]);

  // Guarda el ancho real del grid evitando renders por cambios mínimos.
  function medirGrid(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    setAnchoGrid((anterior) =>
      Math.abs(nuevoAncho - anterior) > 1 ? nuevoAncho : anterior
    );
  }

  // Regresa a la categoría correspondiente o al inicio de Educación.
  function volverACategoria() {
    const destino =
      categoria && categoria !== "Todas"
        ? categoria
        : categoriaSeleccionada !== "Todas"
          ? categoriaSeleccionada
          : null;

    const id = destino ? idsCategorias[destino] : undefined;

    if (id) {
      router.replace({
        pathname: "/(tabs)/educacion/[id]",
        params: { id },
      });
      return;
    }

    router.replace("/(tabs)/educacion");
  }

  // Abre el detalle del libro reutilizando las pantallas existente.
  function abrirDetalleRecurso(idRecurso: string) {
  router.push({
    pathname: "/(tabs)/educacion/recursos/[id]",
    params: {
      id: idRecurso,
      origen: "lecturas",
    },
  } as any);
}

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1"
      style={{ backgroundColor }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: esEscritorio ? 28 : esTablet ? 24 : 20,
        paddingBottom: esEscritorio ? 64 : 140,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: maxWidthContenido,
          alignSelf: "center",
          paddingHorizontal,
        }}
      >
        {/* Botón para regresar a la categoría. */}
        <View
          style={{
            alignSelf: "flex-start",
            marginBottom: esEscritorio ? 22 : 18,
          }}
        >
          <BotonVolver onPress={volverACategoria} />
        </View>

        {/* Encabezado de la biblioteca. */}
        <Animated.View
          entering={FadeInDown.duration(450)}
          style={{
            width: "100%",
            maxWidth: esEscritorio ? 1100 : undefined,
            alignSelf: "center",
          }}
        >
          <EncabezadoCard
            imagen={require(
              "../../../assets/images_educacion/kiri_lee_bibliot_horiz.png"
            )}
            titulo="Biblioteca"
            subtitulo="Explora contenidos sobre bienestar emocional."
          />
        </Animated.View>

        {/* Buscador de lecturas. */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(450)}
          style={{
            width: "100%",
            maxWidth: esEscritorio ? 760 : undefined,
            alignSelf: "center",
            marginTop: esTelefono ? 20 : 24,
          }}
        >
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar una lectura..."
          />
        </Animated.View>

        {/* Filtros por categoría. */}
        <Animated.View
          entering={FadeInDown.delay(140).duration(450)}
          style={{ marginTop: esEscritorio ? 30 : 26 }}
        >
          <Text
            className="font-nunito-bold"
            style={{
              marginBottom: 12,
              fontSize: esEscritorio ? 20 : 18,
              color: textColor,
            }}
          >
            Categorías
          </Text>

          <FiltrosCategorias
            opciones={categorias}
            seleccionada={categoriaSeleccionada}
            onSeleccionar={setCategoriaSeleccionada}
          />
        </Animated.View>

        {/* Muestra la categoría seleccionada y cantidad de resultados. */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(450)}
          style={{
            marginTop: esEscritorio ? 30 : 24,
            marginBottom: esEscritorio ? 24 : 18,
          }}
        >
          <Text
            className="font-nunito-bold"
            style={{
              fontSize: esEscritorio ? 24 : 21,
              color: textColor,
            }}
          >
            {categoriaSeleccionada === "Todas"
              ? "Todas las lecturas"
              : categoriaSeleccionada}
          </Text>

          <Text
            className="font-nunito-medium"
            style={{
              marginTop: 4,
              fontSize: esEscritorio ? 14 : 13,
              color: textMutedColor,
            }}
          >
            {lecturasFiltradas.length}{" "}
            {lecturasFiltradas.length === 1
              ? "lectura encontrada"
              : "lecturas encontradas"}
          </Text>
        </Animated.View>

        {/* Grid responsive de lecturas. */}
        {lecturasFiltradas.length > 0 ? (
          <View
            onLayout={medirGrid}
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              columnGap: gapLecturas,
              rowGap: esEscritorio ? 30 : 20,
            }}
          >
            {lecturasFiltradas.map((lectura, index) => (
              <Animated.View
                key={lectura.id_recurso}
                entering={FadeInDown.delay(240 + index * 50).duration(400)}
                style={{ width: anchoTarjeta, minWidth: 0 }}
              >
                <LecturaRecomendadaCard
                  titulo={lectura.titulo}
                  imagenPortada={lectura.imagen_portada}
                  index={index}
                  ancho={anchoTarjeta}
                  onPress={() => abrirDetalleRecurso(lectura.id_recurso)}
                />
              </Animated.View>
            ))}
          </View>
        ) : (
          <EstadoVacio
            titulo="No encontramos esa categoría"
            descripcion="Prueba con otra palabra o explora las categorías disponibles."
            icono="search-outline"
          />
        )}
      </View>
    </ScrollView>
  );
}