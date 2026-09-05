import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CANTIDAD_GROUNDING,
  INFO_TECNICAS,
  obtenerDetallePaso,
  obtenerTipoTecnica,
  REPETICIONES_JACOBSON,
} from "@/constants/tecnicas";

import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";

import type {
  PasoTecnica,
  RegistroTecnica,
  TecnicaComplementaria,
} from "@/types/tecnicas";

// ============================================================
// CONFIGURACIÓN VISUAL
// ============================================================

const NECESIDADES = [
  {
    nombre: "Respirar",
    icono: "leaf-outline" as const,
    color: "secondary" as const,
    fondo: "secondarySoft" as const,
  },
  {
    nombre: "Relajarme",
    icono: "body-outline" as const,
    color: "accent" as const,
    fondo: "accentSoft" as const,
  },
  {
    nombre: "Calmar la ansiedad",
    icono: "heart-outline" as const,
    color: "primary" as const,
    fondo: "primarySoft" as const,
  },
];

// ============================================================
// HOOK DE COLORES
// ============================================================

function useTecnicasColors() {
  const { isDarkMode } = useThemeMode();

  return isDarkMode ? Colors.dark : Colors.light;
}

// ============================================================
// ESTADO DE CARGA / ERROR
// ============================================================

function Estado({
  cargando,
  error,
  reintentar,
}: {
  cargando: boolean;
  error?: string | null;
  reintentar?: () => void;
}) {
  const colors = useTecnicasColors();

  if (cargando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!error) return null;

  return (
    <View style={styles.estado}>
      <Text style={[styles.error, { color: colors.textSecondary }]}>
        {error}
      </Text>

      {reintentar && (
        <Pressable onPress={reintentar}>
          <Text style={[styles.reintentar, { color: colors.primary }]}>
            Intentar nuevamente
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ============================================================
// TÍTULO DE SECCIÓN
// ============================================================

function TituloSeccion({
  children,
}: {
  children: React.ReactNode;
}) {
  const colors = useTecnicasColors();

  return (
    <Text style={[styles.subtituloDetalle, { color: colors.text }]}>
      {children}
    </Text>
  );
}

// ============================================================
// PANTALLA PRINCIPAL
// ============================================================

export function TecnicasInicioInterface({
  tecnicas,
  cargando,
  error,
  onReintentar,
  onAbrir,
  onHistorial,
}: {
  tecnicas: TecnicaComplementaria[];
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  onAbrir: (id: string) => void;
  onHistorial: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useTecnicasColors();

  const [busqueda, setBusqueda] = useState("");

  const tecnicasFiltradas = useMemo(() => {
    const valor = busqueda.trim().toLowerCase();

    if (!valor) return tecnicas;

    return tecnicas.filter((tecnica) =>
      `${tecnica.nombre} ${tecnica.descripcion} ${tecnica.objetivo}`
        .toLowerCase()
        .includes(valor)
    );
  }, [tecnicas, busqueda]);

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: Math.max(insets.bottom + 118, 145),
          },
        ]}
      >
        <Text style={[styles.tituloInicio, { color: colors.primary }]}>
          Técnicas Complementarias
        </Text>

        <Text style={[styles.descripcion, { color: colors.textSecondary }]}>
          Explora técnicas basadas en evidencia para ayudarte a comprender,
          regular y afrontar tus emociones de manera saludable.
        </Text>

        {/* ====================================================
            BUSCADOR
        ==================================================== */}

        <View
          style={[
            styles.buscador,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={24}
            color={colors.icon}
          />

          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar técnica"
            placeholderTextColor={colors.placeholder}
            style={[styles.inputBusqueda, { color: colors.text }]}
          />

          {!!busqueda && (
            <Pressable onPress={() => setBusqueda("")}>
              <Ionicons
                name="close-circle"
                size={22}
                color={colors.icon}
              />
            </Pressable>
          )}
        </View>

        {/* ====================================================
            NECESIDADES
        ==================================================== */}

        <View style={styles.filaTitulo}>
          <Text style={[styles.seccionTitulo, { color: colors.text }]}>
            ¿Qué necesitas en este momento?
          </Text>
        </View>

        <View style={styles.necesidades}>
          {NECESIDADES.map((item, index) => {
            const tecnica = tecnicas.length
              ? tecnicas[index % tecnicas.length]
              : undefined;

            return (
              <Pressable
                key={item.nombre}
                onPress={() => tecnica && onAbrir(tecnica.id_tecnica)}
                style={[
                  styles.necesidad,
                  {
                    backgroundColor: colors[item.fondo],
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconoNecesidad,
                    {
                      backgroundColor: colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icono}
                    size={38}
                    color={colors[item.color]}
                  />
                </View>

                <Text style={[styles.necesidadTexto, { color: colors.text }]}>
                  {item.nombre}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ====================================================
            TÉCNICAS RECOMENDADAS
        ==================================================== */}

        <View style={styles.filaTitulo}>
          <Text style={[styles.seccionTitulo, { color: colors.text }]}>
            Técnicas recomendadas para ti
          </Text>

          <Pressable
            onPress={onHistorial}
            hitSlop={10}
            style={styles.historialIcono}
          >
            <Ionicons
              name="time-outline"
              size={28}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <Estado
          cargando={cargando}
          error={error}
          reintentar={onReintentar}
        />

        {!cargando &&
          !error &&
          tecnicasFiltradas.map((tecnica) => {
            const tipo = obtenerTipoTecnica(tecnica.nombre);
            const esJacobson = tipo === "jacobson";
            const color = esJacobson ? colors.accent : colors.primary;
            const fondo = esJacobson ? colors.accentSoft : colors.primarySoft;

            return (
              <Pressable
                key={tecnica.id_tecnica}
                onPress={() => onAbrir(tecnica.id_tecnica)}
                style={[
                  styles.tarjeta,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.icono, { backgroundColor: fondo }]}>
                  <Ionicons
                    name={esJacobson ? "body-outline" : "eye-outline"}
                    size={38}
                    color={color}
                  />
                </View>

                <View style={styles.flex}>
                  <Text style={[styles.nombre, { color: colors.text }]}>
                    {tecnica.nombre}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.resumen,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {tecnica.descripcion}
                  </Text>

                  <View style={styles.filaDuracion}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={color}
                    />

                    <Text style={[styles.duracion, { color }]}>
                      {tecnica.duracion_estimada ?? "—"} min
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={27}
                  color={colors.icon}
                />
              </Pressable>
            );
          })}

        {!cargando &&
          !error &&
          tecnicasFiltradas.length === 0 && (
            <View style={styles.sinResultados}>
              <Ionicons
                name="search-outline"
                size={38}
                color={colors.textMuted}
              />

              <Text
                style={[
                  styles.sinResultadosTexto,
                  { color: colors.textSecondary },
                ]}
              >
                No encontramos técnicas relacionadas con &quot;{busqueda}&quot;.
              </Text>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

// ============================================================
// DETALLE DE TÉCNICA
// ============================================================

export function DetalleTecnicaInterface({
  tecnica,
  cargando,
  error,
  iniciando,
  onVolver,
  onReintentar,
  onComenzar,
}: {
  tecnica: TecnicaComplementaria | null;
  cargando: boolean;
  error: string | null;
  iniciando: boolean;
  onVolver: () => void;
  onReintentar: () => void;
  onComenzar: () => void;
}) {
  const colors = useTecnicasColors();

  const tipo = tecnica ? obtenerTipoTecnica(tecnica.nombre) : null;
  const info = tipo ? INFO_TECNICAS[tipo] : null;

  const colorTecnica =
    tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detalleScroll}
      >
        <Pressable onPress={onVolver} style={styles.volver}>
          <Ionicons
            name="arrow-back"
            size={25}
            color={colors.text}
          />
        </Pressable>

        <Estado
          cargando={cargando}
          error={error}
          reintentar={onReintentar}
        />

        {tecnica && (
          <>
            <View
              style={[
                styles.iconoGrande,
                {
                  backgroundColor: fondoTecnica,
                },
              ]}
            >
              <Ionicons
                name={tipo === "jacobson" ? "body-outline" : "eye-outline"}
                size={48}
                color={colorTecnica}
              />
            </View>

            <Text style={[styles.tituloDetalle, { color: colors.text }]}>
              {tecnica.nombre}
            </Text>

            <TituloSeccion>¿Qué es?</TituloSeccion>

            <Text
              style={[
                styles.descripcionDetalle,
                { color: colors.textSecondary },
              ]}
            >
              {tecnica.descripcion}
            </Text>

            <TituloSeccion>¿Para qué puede ayudarte?</TituloSeccion>

            <Text
              style={[
                styles.infoTexto,
                { color: colors.textSecondary },
              ]}
            >
              {tecnica.objetivo}
            </Text>

            {info?.beneficios.map((item) => (
              <View key={item} style={styles.itemLista}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colorTecnica}
                />

                <Text
                  style={[
                    styles.itemTexto,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}

            <View
              style={[
                styles.info,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={colorTecnica}
              />

              <View style={styles.flex}>
                <Text style={[styles.infoTitulo, { color: colors.text }]}>
                  Duración aproximada
                </Text>

                <Text
                  style={[
                    styles.infoTexto,
                    { color: colors.textSecondary },
                  ]}
                >
                  {info?.duracion ??
                    `${tecnica.duracion_estimada ?? "—"} minutos`}
                </Text>
              </View>
            </View>

            {info && (
              <>
                <TituloSeccion>Antes de comenzar</TituloSeccion>

                <View
                  style={[
                    styles.objetivo,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {info.recomendaciones.map((item) => (
                    <View key={item} style={styles.itemLista}>
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color={colorTecnica}
                      />

                      <Text
                        style={[
                          styles.itemTexto,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.advertencia,
                    {
                      backgroundColor: fondoTecnica,
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={colorTecnica}
                  />

                  <Text
                    style={[
                      styles.advertenciaTexto,
                      { color: colors.text },
                    ]}
                  >
                    {info.advertencia}
                  </Text>
                </View>
              </>
            )}

            <Pressable
              onPress={onComenzar}
              disabled={iniciando}
              style={[
                styles.boton,
                styles.botonDetalle,
                {
                  backgroundColor: colors.primary,
                  opacity: iniciando ? 0.7 : 1,
                },
              ]}
            >
              {iniciando ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <>
                  <Text style={styles.botonTexto}>Comenzar práctica</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color={colors.textOnPrimary}
                  />
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================
// EJERCICIO
// ============================================================

export function EjercicioTecnicaInterface({
  tecnica,
  pasos,
  indice,
  cargando,
  error,
  finalizando,
  onCerrar,
  onReintentar,
  onSiguiente,
}: {
  tecnica: TecnicaComplementaria | null;
  pasos: PasoTecnica[];
  indice: number;
  cargando: boolean;
  error: string | null;
  finalizando: boolean;
  onCerrar: () => void;
  onReintentar: () => void;
  onSiguiente: () => void;
}) {
  const colors = useTecnicasColors();

  const paso = pasos[indice];
  const tipo = obtenerTipoTecnica(tecnica?.nombre);

  const cantidad =
    tipo === "grounding" && paso
      ? CANTIDAD_GROUNDING[paso.orden] ?? 0
      : 0;

  const detalle = obtenerDetallePaso(tipo, paso?.orden);

  const [respuestas, setRespuestas] = useState<Record<string, string[]>>({});
  const [repeticion, setRepeticion] = useState(1);

  useEffect(() => {
    setRepeticion(1);
  }, [indice]);

  const valores = paso
    ? respuestas[paso.id_paso] ?? Array(cantidad).fill("")
    : [];

  const actualizarRespuesta = (posicion: number, valor: string) => {
    if (!paso) return;

    const nuevas = [...valores];
    nuevas[posicion] = valor;

    setRespuestas((prev) => ({
      ...prev,
      [paso.id_paso]: nuevas,
    }));
  };

  const avanzar = () => {
    if (tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON) {
      setRepeticion((actual) => actual + 1);
      return;
    }

    onSiguiente();
  };

  const ultimo = indice === pasos.length - 1;

  const textoBoton =
    tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON
      ? "Segunda repetición"
      : ultimo
      ? "Finalizar práctica"
      : "Siguiente";

  const colorTecnica =
    tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Estado
        cargando={cargando}
        error={error}
        reintentar={onReintentar}
      />

      {paso && (
        <View style={styles.ejercicio}>
          <View style={styles.cabecera}>
            <Pressable onPress={onCerrar} style={styles.volver}>
              <Ionicons
                name="close"
                size={27}
                color={colors.text}
              />
            </Pressable>

            <Text
              style={[
                styles.progreso,
                { color: colors.textSecondary },
              ]}
            >
              Paso {indice + 1} de {pasos.length}
            </Text>
          </View>

          <View style={styles.barras}>
            {pasos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.barra,
                  {
                    backgroundColor:
                      i <= indice ? colorTecnica : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ejercicioScroll}
          >
            <Text
              style={[
                styles.nombreTecnica,
                { color: colors.textSecondary },
              ]}
            >
              {tecnica?.nombre}
            </Text>

            <View
              style={[
                styles.pasoCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.numero,
                  {
                    backgroundColor: fondoTecnica,
                  },
                ]}
              >
                <Text style={[styles.numeroTexto, { color: colorTecnica }]}>
                  {indice + 1}
                </Text>
              </View>

              <Text style={[styles.tituloPaso, { color: colors.text }]}>
                {paso.titulo}
              </Text>

              <Text
                style={[
                  styles.instruccion,
                  { color: colors.textSecondary },
                ]}
              >
                {paso.instruccion}
              </Text>

              {detalle && (
                <Text
                  style={[
                    styles.detallePaso,
                    { color: colors.textSecondary },
                  ]}
                >
                  {detalle}
                </Text>
              )}

              {paso.tipo_recurso === "imagen" && paso.url_recurso && (
                <Image
                  source={{
                    uri: paso.url_recurso,
                  }}
                  style={styles.imagenPaso}
                  resizeMode="contain"
                />
              )}

              {tipo === "grounding" && (
                <View style={styles.inputsGrounding}>
                  {valores.map((valor, index) => (
                    <View key={index} style={styles.inputFila}>
                      <Text
                        style={[
                          styles.numeroInput,
                          { color: colors.primary },
                        ]}
                      >
                        {index + 1}.
                      </Text>

                      <TextInput
                        value={valor}
                        onChangeText={(texto) =>
                          actualizarRespuesta(index, texto)
                        }
                        placeholder="Escribe aquí"
                        placeholderTextColor={colors.placeholder}
                        style={[
                          styles.inputGrounding,
                          {
                            color: colors.text,
                            borderColor: colors.inputBorder,
                            backgroundColor: colors.inputBackground,
                          },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              )}

              {tipo === "jacobson" && (
                <View
                  style={[
                    styles.repeticion,
                    {
                      backgroundColor: colors.accentSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="repeat-outline"
                    size={21}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.repeticionTexto,
                      { color: colors.accent },
                    ]}
                  >
                    Repetición {repeticion} de {REPETICIONES_JACOBSON}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <Pressable
            disabled={finalizando}
            onPress={avanzar}
            style={[
              styles.boton,
              {
                backgroundColor: colors.primary,
                opacity: finalizando ? 0.7 : 1,
              },
            ]}
          >
            {finalizando ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <>
                <Text style={styles.botonTexto}>{textoBoton}</Text>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color={colors.textOnPrimary}
                />
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ============================================================
// HISTORIAL
// ============================================================

export function HistorialTecnicasInterface({
  registros,
  cargando,
  error,
  onVolver,
  onReintentar,
}: {
  registros: RegistroTecnica[];
  cargando: boolean;
  error: string | null;
  onVolver: () => void;
  onReintentar: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useTecnicasColors();

  return (
    <View
      style={[
        styles.pantalla,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: Math.max(insets.bottom + 120, 150),
          },
        ]}
      >
        <Pressable onPress={onVolver} style={styles.volverConTexto}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />

          <Text style={[styles.volverTexto, { color: colors.text }]}>
            Volver
          </Text>
        </Pressable>

        <Text style={[styles.tituloHistorial, { color: colors.text }]}>
          Historial de técnicas
        </Text>

        <Text
          style={[
            styles.descripcion,
            { color: colors.textSecondary },
          ]}
        >
          Aquí encontrarás las prácticas que has realizado.
        </Text>

        <Estado
          cargando={cargando}
          error={error}
          reintentar={onReintentar}
        />

        {!cargando &&
          !error &&
          (registros.length === 0 ? (
            <View style={styles.estado}>
              <Ionicons
                name="sparkles-outline"
                size={46}
                color={colors.primary}
              />

              <Text style={[styles.vacio, { color: colors.textSecondary }]}>
                Todavía no has completado ninguna técnica.
              </Text>
            </View>
          ) : (
            registros.map((registro) => (
              <View
                key={registro.id_registro}
                style={[
                  styles.tarjeta,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconoHistorial,
                    {
                      backgroundColor: registro.completada
                        ? colors.success
                        : colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name={registro.completada ? "checkmark" : "play"}
                    size={20}
                    color={colors.textOnPrimary}
                  />
                </View>

                <View style={styles.flex}>
                  <Text style={[styles.nombre, { color: colors.text }]}>
                    {registro.tecnica_complementaria?.nombre ??
                      "Técnica complementaria"}
                  </Text>

                  <Text
                    style={[
                      styles.fecha,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {new Date(registro.fecha_inicio).toLocaleDateString(
                      "es-GT",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.estadoTexto,
                    {
                      color: registro.completada
                        ? colors.success
                        : colors.primary,
                    },
                  ]}
                >
                  {registro.completada ? "Completada" : "En progreso"}
                </Text>
              </View>
            ))
          ))}
      </ScrollView>
    </View>
  );
}

// ============================================================
// TÉCNICA COMPLETADA
// ============================================================

export function TecnicaCompletadaInterface({
  nombre,
  cargando,
  onVolver,
  onHistorial,
}: {
  nombre?: string;
  cargando: boolean;
  onVolver: () => void;
  onHistorial: () => void;
}) {
  const colors = useTecnicasColors();

  const tipo = obtenerTipoTecnica(nombre);

  const mensaje =
    tipo === "grounding"
      ? "Tómate unos segundos para observar nuevamente tu entorno antes de continuar con tus actividades."
      : tipo === "jacobson"
      ? "Permanece unos momentos en una posición cómoda y observa cómo se siente tu cuerpo después del ejercicio."
      : "Regálate unos instantes para notar cómo te sientes ahora.";

  if (cargando) {
    return (
      <View
        style={[
          styles.pantalla,
          styles.centro,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pantalla,
        styles.completada,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.check,
          {
            backgroundColor: colors.success,
          },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={55}
          color={colors.textOnPrimary}
        />
      </View>

      <Text style={[styles.tituloCompletada, { color: colors.text }]}>
        ¡Técnica completada!
      </Text>

      <Text
        style={[
          styles.descripcionCompletada,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Has terminado{"\n"}
        {nombre ?? "la técnica complementaria"}.
      </Text>

      <View
        style={[
          styles.mensaje,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.mensajeTexto,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {mensaje}
        </Text>
      </View>

      <View style={styles.flex} />

      <Pressable
        onPress={onVolver}
        style={[
          styles.boton,
          {
            width: "100%",
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.botonTexto}>Volver a técnicas</Text>
      </Pressable>

      <Pressable style={styles.enlace} onPress={onHistorial}>
        <Text style={[styles.enlaceTexto, { color: colors.primary }]}>
          Ver mi historial
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  scroll: {
    padding: 18,
  },

  tituloInicio: {
    fontFamily: "Nunito-Bold",
    fontSize: 24,
    marginTop: 8,
  },

  descripcion: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },

  // ==========================================================
  // BUSCADOR
  // ==========================================================

  buscador: {
    height: 54,
    borderWidth: 1,
    borderRadius: 17,
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  inputBusqueda: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 15,
  },

  sinResultados: {
    alignItems: "center",
    paddingVertical: 35,
    gap: 10,
  },

  sinResultadosTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  // ==========================================================
  // TÍTULOS
  // ==========================================================

  filaTitulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 14,
  },

  seccionTitulo: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    maxWidth: "85%",
  },

  // ==========================================================
  // NECESIDADES
  // ==========================================================

  necesidades: {
    flexDirection: "row",
    gap: 10,
  },

  necesidad: {
    flex: 1,
    minHeight: 125,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
  },

  iconoNecesidad: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  necesidadTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    lineHeight: 18,
  },

  historialIcono: {
    padding: 3,
  },

  // ==========================================================
  // TARJETAS
  // ==========================================================

  tarjeta: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  icono: {
    width: 68,
    height: 68,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  nombre: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    lineHeight: 21,
  },

  resumen: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  filaDuracion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },

  duracion: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
  },

  // ==========================================================
  // ESTADOS
  // ==========================================================

  estado: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },

  error: {
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  reintentar: {
    fontFamily: "Nunito-Bold",
  },

  // ==========================================================
  // DETALLE
  // ==========================================================

  detalleScroll: {
    padding: 20,
    paddingBottom: 40,
  },

  volver: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },

  iconoGrande: {
    width: 96,
    height: 96,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  tituloDetalle: {
    fontFamily: "Nunito-Bold",
    fontSize: 27,
    lineHeight: 33,
    marginTop: 22,
  },

  subtituloDetalle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 7,
  },

  descripcionDetalle: {
    fontFamily: "Nunito-Medium",
    fontSize: 15,
    lineHeight: 23,
  },

  info: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
    marginTop: 25,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  objetivo: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
  },

  infoTitulo: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },

  infoTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 3,
  },

  itemLista: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 9,
  },

  itemTexto: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 20,
  },

  advertencia: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 15,
    borderRadius: 16,
    marginTop: 15,
  },

  advertenciaTexto: {
    flex: 1,
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 19,
  },

  botonDetalle: {
    marginTop: 25,
  },

  // ==========================================================
  // BOTONES
  // ==========================================================

  boton: {
    minHeight: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  botonTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  // ==========================================================
  // EJERCICIO
  // ==========================================================

  ejercicio: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },

  ejercicioScroll: {
    paddingBottom: 20,
  },

  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progreso: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
  },

  barras: {
    flexDirection: "row",
    gap: 4,
    marginTop: 18,
  },

  barra: {
    height: 5,
    borderRadius: 4,
    flex: 1,
  },

  nombreTecnica: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    textAlign: "center",
    marginTop: 25,
  },

  pasoCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginTop: 15,
    alignItems: "center",
  },

  numero: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  numeroTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 23,
  },

  tituloPaso: {
    fontFamily: "Nunito-Bold",
    fontSize: 23,
    textAlign: "center",
    marginTop: 18,
  },

  instruccion: {
    fontFamily: "Nunito-Medium",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 13,
  },

  detallePaso: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
  },

  imagenPaso: {
    width: "100%",
    height: 220,
    marginTop: 18,
  },

  // ==========================================================
  // GROUNDING
  // ==========================================================

  inputsGrounding: {
    width: "100%",
    marginTop: 18,
    gap: 10,
  },

  inputFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  numeroInput: {
    width: 22,
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },

  inputGrounding: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
  },

  // ==========================================================
  // JACOBSON
  // ==========================================================

  repeticion: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 20,
  },

  repeticionTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },

  // ==========================================================
  // HISTORIAL
  // ==========================================================

  volverConTexto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 8,
  },

  volverTexto: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
  },

  tituloHistorial: {
    fontFamily: "Nunito-Bold",
    fontSize: 25,
    marginTop: 20,
  },

  vacio: {
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  iconoHistorial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  fecha: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
    marginTop: 3,
  },

  estadoTexto: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 11,
    maxWidth: 73,
    textAlign: "right",
  },

  // ==========================================================
  // COMPLETADA
  // ==========================================================

  centro: {
    alignItems: "center",
    justifyContent: "center",
  },

  completada: {
    alignItems: "center",
    padding: 25,
    paddingTop: 100,
  },

  check: {
    width: 105,
    height: 105,
    borderRadius: 53,
    alignItems: "center",
    justifyContent: "center",
  },

  tituloCompletada: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: 27,
  },

  descripcionCompletada: {
    fontFamily: "Nunito-Medium",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
  },

  mensaje: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
  },

  mensajeTexto: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  enlace: {
    padding: 18,
  },

  enlaceTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },
});