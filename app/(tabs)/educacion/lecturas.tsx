import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router/react-navigation";
import { router, useLocalSearchParams } from "expo-router";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import LecturaRecomendadaCard from "@/components/educacion/LecturaRecomendadaCard";
import SearchBar from "@/components/ui/SearchBar";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// DATOS
// ==========================================================

const lecturas = [
  {
    id: "que-es-la-ansiedad",
    categoria: "Ansiedad",
    titulo: "¿Qué es la ansiedad?",
    descripcion:
      "Conoce qué es la ansiedad, por qué aparece y cómo puede manifestarse en diferentes situaciones.",
  },
  {
    id: "reconocer-ansiedad",
    categoria: "Ansiedad",
    titulo: "Cómo reconocer la ansiedad",
    descripcion:
      "Aprende a identificar algunas señales físicas, emocionales y conductuales relacionadas con la ansiedad.",
  },
  {
    id: "comprender-autoestima",
    categoria: "Autoestima",
    titulo: "Comprendiendo la autoestima",
    descripcion:
      "Conoce qué es la autoestima y cómo puede influir en la manera en que pensamos y actuamos.",
  },
  {
    id: "fortalecer-autoestima",
    categoria: "Autoestima",
    titulo: "Cómo fortalecer tu autoestima",
    descripcion:
      "Descubre pequeñas acciones que pueden ayudarte a construir una relación más saludable contigo.",
  },
  {
    id: "comprender-estres",
    categoria: "Estrés",
    titulo: "Comprendiendo el estrés",
    descripcion:
      "Conoce por qué aparece el estrés y cuáles son algunas de las señales más comunes.",
  },
  {
    id: "manejar-estres",
    categoria: "Estrés",
    titulo: "Estrategias para manejar el estrés",
    descripcion:
      "Conoce algunas estrategias que pueden ayudarte a afrontar situaciones estresantes.",
  },
  {
    id: "entender-procrastinacion",
    categoria: "Procrastinación",
    titulo: "¿Por qué procrastinamos?",
    descripcion:
      "Comprende algunas de las razones que pueden llevarnos a posponer nuestras responsabilidades.",
  },
  {
    id: "evitar-procrastinacion",
    categoria: "Procrastinación",
    titulo: "Pequeños pasos para dejar de procrastinar",
    descripcion:
      "Aprende estrategias sencillas para comenzar tus tareas y organizar mejor tu tiempo.",
  },
  {
    id: "comprender-soledad",
    categoria: "Soledad",
    titulo: "Comprendiendo la soledad",
    descripcion:
      "Conoce las diferencias entre estar solo y experimentar sentimientos de soledad.",
  },
  {
    id: "conexiones-saludables",
    categoria: "Soledad",
    titulo: "Construyendo conexiones saludables",
    descripcion:
      "Descubre algunas formas de fortalecer nuestras relaciones y crear vínculos significativos.",
  },
];

// Categorías disponibles para filtrar las lecturas.
// "Todas" permite mostrar nuevamente la biblioteca completa.
const categorias = [
  "Todas",
  "Ansiedad",
  "Autoestima",
  "Estrés",
  "Procrastinación",
  "Soledad",
  "Depresión",
];

// Relaciona el nombre visible de una categoría con el id
// utilizado por la ruta /educacion/[id].
const idsCategorias: Record<string, string> = {
  Ansiedad: "Ansiedad",
  Autoestima: "Autoestima",
  Estrés: "Estres",
  Procrastinación: "Procrastinacion",
  Soledad: "Soledad",
  Depresión: "Depresion",
};

// ==========================================================
// NORMALIZAR TEXTO
// ==========================================================

// Elimina tildes y diferencias entre mayúsculas/minúsculas.
// Permite, por ejemplo, encontrar "Procrastinación"
// escribiendo "procrastinacion".
function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function LecturasScreen() {
  const { categoria } =
    useLocalSearchParams<{ categoria?: string }>();

  // ========================================================
  // RESPONSIVE
  // ========================================================

  // Se utiliza el sistema responsive general del proyecto.
  // No se modifican los breakpoints definidos por tu compañero.
  const {
    esTelefono,
    esTablet,
    esEscritorio,
  } = useResponsiveLayout();

  // Referencia utilizada para regresar el ScrollView
  // al inicio cada vez que se vuelve a esta pantalla.
  const scrollViewRef = useRef<ScrollView>(null);

  // ========================================================
  // ESTADOS
  // ========================================================

  const [busqueda, setBusqueda] = useState("");

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState(categoria || "Todas");

  // Guarda el ancho REAL disponible del contenedor
  // donde se dibujan las lecturas.
  const [anchoGrid, setAnchoGrid] = useState(0);

  // ========================================================
  // ANIMACIÓN BOTÓN VOLVER
  // ========================================================

  const escalaVolver = useSharedValue(1);

  const estiloVolver = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escalaVolver.value,
      },
    ],
  }));

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor({}, "background");

  const surfaceColor =
    useThemeColor({}, "surface");

  const surfaceSecondaryColor =
    useThemeColor({}, "surfaceSecondary");

  const textColor =
    useThemeColor({}, "text");

  const textSecondaryColor =
    useThemeColor({}, "textSecondary");

  const textMutedColor =
    useThemeColor({}, "textMuted");

  const primaryColor =
    useThemeColor({}, "primary");

  const primarySoftColor =
    useThemeColor({}, "primarySoft");

  const borderColor =
    useThemeColor({}, "border");

  // ========================================================
  // ACTUALIZAR CATEGORÍA
  // ========================================================

  // Cuando la pantalla recibe otra categoría desde la ruta,
  // actualizamos el filtro y limpiamos la búsqueda anterior.
  useEffect(() => {
    setCategoriaSeleccionada(
      categoria || "Todas"
    );

    setBusqueda("");
  }, [categoria]);

  // ========================================================
  // VOLVER SIEMPRE AL INICIO AL ENTRAR
  // ========================================================

  // Cada vez que esta pantalla vuelve a recibir el foco,
  // regresamos el scroll al inicio.
  useFocusEffect(
    useCallback(() => {
      const frame =
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: false,
          });
        });

      return () => {
        cancelAnimationFrame(frame);
      };
    }, [])
  );

  // ========================================================
  // RESPONSIVE DEL PROYECTO
  // ========================================================

  // Conservamos los paddings definidos globalmente.
  const paddingHorizontal =
    esEscritorio
      ? PADDING_RESPONSIVE.escritorio
      : esTablet
        ? PADDING_RESPONSIVE.tablet
        : PADDING_RESPONSIVE.telefono;

  // Limita el contenido en pantallas grandes para evitar
  // que la interfaz se estire demasiado.
  const maxWidthContenido =
    esEscritorio
      ? MAX_WIDTHS.dashboard
      : esTablet
        ? MAX_WIDTHS.contenido
        : undefined;

  // Número de columnas establecido para cada dispositivo.
  //
  // Teléfono   -> 2
  // Tablet     -> 3
  // Escritorio -> 4
  const numeroColumnas =
    esEscritorio
      ? 4
      : esTablet
        ? 3
        : 2;

  // Separación horizontal entre cards.
  const gapLecturas =
    esEscritorio
      ? 26
      : esTablet
        ? 18
        : 12;

  // ========================================================
  // ANCHO DE LOS CARDS
  // ========================================================

  /*
   * Calculamos cuánto espacio queda para cada card después
   * de descontar los espacios existentes entre columnas.
   *
   * Math.floor es importante principalmente en Android:
   * evita que un resultado decimal termine ocupando unas
   * décimas más de lo disponible y mande la segunda tarjeta
   * accidentalmente a la siguiente fila.
   */
  const anchoDisponible =
    anchoGrid > 0
      ? Math.floor(
          (
            anchoGrid -
            gapLecturas * (numeroColumnas - 1)
          ) / numeroColumnas
        )
      : 0;

  /*
   * En teléfono dejamos 1 px adicional de seguridad.
   *
   * No cambia visualmente el tamaño del card de forma
   * perceptible, pero evita problemas de redondeo en ciertos
   * dispositivos Android con diferentes densidades de pantalla.
   *
   * Tablet y escritorio conservan los tamaños máximos que
   * ya utilizábamos.
   */
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

  // ========================================================
  // FILTRAR LECTURAS
  // ========================================================

  // useMemo evita volver a filtrar innecesariamente mientras
  // la búsqueda y la categoría no hayan cambiado.
  const lecturasFiltradas = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return lecturas.filter((lectura) => {
      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        lectura.categoria === categoriaSeleccionada;

      const coincideBusqueda =
        !texto ||
        normalizarTexto(lectura.titulo).includes(texto) ||
        normalizarTexto(lectura.descripcion).includes(texto) ||
        normalizarTexto(lectura.categoria).includes(texto);

      return (
        coincideCategoria &&
        coincideBusqueda
      );
    });
  }, [
    busqueda,
    categoriaSeleccionada,
  ]);

  // ========================================================
  // MEDIR GRID
  // ========================================================

  /*
   * onLayout obtiene el ancho real del grid.
   *
   * Esto es preferible a usar un ancho fijo porque permite
   * que los cards se adapten al espacio que realmente tienen
   * disponible en cada teléfono, tablet o navegador.
   */
  function medirGrid(
    event: LayoutChangeEvent
  ) {
    const nuevoAncho =
      event.nativeEvent.layout.width;

    /*
     * Solo actualizamos el estado cuando el ancho realmente
     * cambió. Esto evita renders innecesarios por pequeñas
     * variaciones de medición.
     */
    setAnchoGrid((anterior) =>
      Math.abs(
        nuevoAncho - anterior
      ) > 1
        ? nuevoAncho
        : anterior
    );
  }

  // ========================================================
  // VOLVER A LA CATEGORÍA
  // ========================================================

  /*
   * Si entramos desde "Ver todas" de una categoría,
   * la flecha regresa al detalle de esa categoría.
   *
   * Si no existe una categoría específica, vuelve al
   * index principal de Educación.
   */
  function volverACategoria() {
    const destino =
      categoria &&
      categoria !== "Todas"
        ? categoria
        : categoriaSeleccionada !== "Todas"
          ? categoriaSeleccionada
          : null;

    const id =
      destino
        ? idsCategorias[destino]
        : undefined;

    if (id) {
      router.replace({
        pathname:
          "/(tabs)/educacion/[id]",
        params: {
          id,
        },
      });

      return;
    }

    router.replace(
      "/(tabs)/educacion"
    );
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1"
      style={{
        backgroundColor,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop:
          esEscritorio
            ? 28
            : esTablet
              ? 24
              : 20,

        paddingBottom:
          esEscritorio
            ? 64
            : 140,
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
        {/* =================================================
            BOTÓN VOLVER
            ================================================= */}

        <Animated.View
          style={[
            estiloVolver,
            {
              alignSelf: "flex-start",

              marginBottom:
                esEscritorio
                  ? 22
                  : 18,
            },
          ]}
        >
          <Pressable
            onPress={volverACategoria}
            onPressIn={() => {
              escalaVolver.value =
                withSpring(0.9);
            }}
            onPressOut={() => {
              escalaVolver.value =
                withSpring(1);
            }}
            hitSlop={10}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: 24,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                surfaceSecondaryColor,

              opacity:
                pressed
                  ? 0.72
                  : 1,
            })}
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color={textSecondaryColor}
            />
          </Pressable>
        </Animated.View>

        {/* =================================================
            ENCABEZADO
            ================================================= */}

        <Animated.View
          entering={
            FadeInDown.duration(450)
          }
          style={{
            width: "100%",

            maxWidth:
              esEscritorio
                ? 1100
                : undefined,

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

        {/* =================================================
            BUSCADOR
            ================================================= */}

        <Animated.View
          entering={
            FadeInDown
              .delay(80)
              .duration(450)
          }
          style={{
            width: "100%",

            maxWidth:
              esEscritorio
                ? 760
                : undefined,

            alignSelf: "center",

            marginTop:
              esTelefono
                ? 20
                : 24,
          }}
        >
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar una lectura..."
          />
        </Animated.View>

        {/* =================================================
            CATEGORÍAS
            ================================================= */}

        <Animated.View
          entering={
            FadeInDown
              .delay(140)
              .duration(450)
          }
          style={{
            marginTop:
              esEscritorio
                ? 30
                : 26,
          }}
        >
          <Text
            className="font-nunito-bold"
            style={{
              marginBottom: 12,

              fontSize:
                esEscritorio
                  ? 20
                  : 18,

              color: textColor,
            }}
          >
            Categorías
          </Text>

          {/* El ScrollView horizontal permite recorrer todas
              las categorías sin comprimir los botones. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: 4,
              paddingBottom: 8,
              paddingRight: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                gap:
                  esEscritorio
                    ? 12
                    : 9,
              }}
            >
              {categorias.map((item) => {
                const seleccionada =
                  categoriaSeleccionada ===
                  item;

                return (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setCategoriaSeleccionada(
                        item
                      )
                    }
                    style={({ pressed }) => ({
                      opacity:
                        pressed
                          ? 0.78
                          : 1,
                    })}
                  >
                    <View
                      style={{
                        minHeight:
                          esEscritorio
                            ? 44
                            : 40,

                        minWidth:
                          item === "Todas"
                            ? 78
                            : undefined,

                        paddingHorizontal:
                          esEscritorio
                            ? 20
                            : 17,

                        paddingVertical:
                          esEscritorio
                            ? 10
                            : 8,

                        borderRadius: 999,

                        borderWidth: 1,

                        borderColor:
                          seleccionada
                            ? primaryColor
                            : borderColor,

                        backgroundColor:
                          seleccionada
                            ? primaryColor
                            : surfaceSecondaryColor,

                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily:
                            seleccionada
                              ? "Nunito-Bold"
                              : "Nunito-SemiBold",

                          fontSize:
                            esEscritorio
                              ? 15
                              : 13,

                          color:
                            seleccionada
                              ? "#FFFFFF"
                              : textSecondaryColor,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        {/* =================================================
            TÍTULO DE RESULTADOS
            ================================================= */}

        <Animated.View
          entering={
            FadeInDown
              .delay(200)
              .duration(450)
          }
          style={{
            marginTop:
              esEscritorio
                ? 30
                : 24,

            marginBottom:
              esEscritorio
                ? 24
                : 18,
          }}
        >
          <Text
            className="font-nunito-bold"
            style={{
              fontSize:
                esEscritorio
                  ? 24
                  : 21,

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

              fontSize:
                esEscritorio
                  ? 14
                  : 13,

              color: textMutedColor,
            }}
          >
            {lecturasFiltradas.length}{" "}
            {lecturasFiltradas.length === 1
              ? "lectura encontrada"
              : "lecturas encontradas"}
          </Text>
        </Animated.View>

        {/* =================================================
            GRID DE LECTURAS
            ================================================= */}

        {lecturasFiltradas.length > 0 ? (
          <View
            onLayout={medirGrid}
            style={{
              width: "100%",

              flexDirection: "row",
              flexWrap: "wrap",

              /*
               * flex-start evita separar exageradamente los
               * libros cuando una categoría tiene solo 1 o 2.
               */
              justifyContent: "flex-start",

              alignItems: "flex-start",

              columnGap: gapLecturas,

              rowGap:
                esEscritorio
                  ? 30
                  : 20,
            }}
          >
            {lecturasFiltradas.map(
              (lectura, index) => (
                <Animated.View
                  key={lectura.id}
                  entering={
                    FadeInDown
                      .delay(
                        240 +
                          index * 50
                      )
                      .duration(400)
                  }
                  style={{
                    /*
                     * El ancho ya incluye el número correcto
                     * de columnas y un margen de seguridad
                     * para evitar saltos de fila en Android.
                     */
                    width: anchoTarjeta,

                    // Permite que el elemento pueda reducirse
                    // sin imponer un ancho mínimo inesperado.
                    minWidth: 0,
                  }}
                >
                  <LecturaRecomendadaCard
                    titulo={lectura.titulo}
                    index={index}
                    ancho={anchoTarjeta}
                    onPress={() => {
                      console.log(
                        "Lectura seleccionada:",
                        lectura.id
                      );
                    }}
                  />
                </Animated.View>
              )
            )}
          </View>
        ) : (
          /* =================================================
             ESTADO VACÍO
             ================================================= */

          <Animated.View
            entering={
              FadeInDown.duration(350)
            }
            style={{
              width: "100%",

              maxWidth:
                esEscritorio
                  ? 620
                  : undefined,

              alignSelf: "center",
              alignItems: "center",

              marginTop:
                esEscritorio
                  ? 12
                  : 16,

              paddingHorizontal:
                esEscritorio
                  ? 40
                  : 24,

              paddingVertical:
                esEscritorio
                  ? 38
                  : 34,

              borderRadius: 22,
              borderWidth: 1,
              borderColor,

              backgroundColor:
                surfaceColor,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor:
                  primarySoftColor,
              }}
            >
              <Ionicons
                name="search-outline"
                size={28}
                color={primaryColor}
              />
            </View>

            <Text
              className="font-nunito-bold"
              style={{
                marginTop: 16,

                textAlign: "center",

                fontSize:
                  esEscritorio
                    ? 18
                    : 17,

                color: textColor,
              }}
            >
              No encontramos esa categoría
            </Text>

            <Text
              className="font-nunito-medium"
              style={{
                maxWidth: 420,
                marginTop: 8,

                textAlign: "center",

                fontSize:
                  esEscritorio
                    ? 14
                    : 13,

                lineHeight:
                  esEscritorio
                    ? 21
                    : 20,

                color:
                  textSecondaryColor,
              }}
            >
              Prueba con otra palabra o explora las categorías disponibles.
            </Text>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}