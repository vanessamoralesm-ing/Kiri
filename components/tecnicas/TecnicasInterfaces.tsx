import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
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
// CONFIGURACIÓN
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

function useTecnicasColors() {
  const { isDarkMode } = useThemeMode();
  return isDarkMode ? Colors.dark : Colors.light;
}

function useTecnicasLayout() {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidth = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  return {
    esTelefono,
    esTablet,
    esEscritorio,
    paddingHorizontal,
    maxWidth,
  };
}

// ============================================================
// COMPONENTES COMPARTIDOS
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
      <View
        style={{
          paddingVertical: 40,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!error) return null;

  return (
    <View
      style={{
        padding: 24,
        alignItems: "center",
        gap: 14,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Medium",
          fontSize: 14,
          lineHeight: 21,
          textAlign: "center",
          color: colors.textSecondary,
        }}
      >
        {error}
      </Text>

      {!!reintentar && (
        <Pressable
          onPress={reintentar}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 18,
            borderRadius: 12,
            justifyContent: "center",
            backgroundColor: colors.primarySoft,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 14,
              color: colors.primary,
            }}
          >
            Intentar nuevamente
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function BotonPrimario({
  titulo,
  icono = "arrow-forward",
  onPress,
  disabled = false,
}: {
  titulo: string;
  icono?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colors = useTecnicasColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: "100%",
          minHeight: 56,
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor: colors.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: 16,
            textAlign: "center",
            color: colors.textOnPrimary,
          }}
        >
          {titulo}
        </Text>

        <Ionicons name={icono} size={21} color={colors.textOnPrimary} />
      </View>
    </Pressable>
  );
}

function TituloSeccion({
  children,
}: {
  children: React.ReactNode;
}) {
  const colors = useTecnicasColors();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      style={({ pressed }) => ({
        alignSelf: "flex-start",
        borderRadius: 12,
        opacity: pressed ? 0.7 : 1,
        overflow: "hidden",
      })}
    >
      <View
        style={{
          minHeight: 44,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 9,
          borderRadius: 12,
          backgroundColor: colors.surfaceSecondary,
        }}
      >
        <Ionicons name="arrow-back" size={20} color={colors.primary} />

        <Text
          style={{
            fontFamily: "Nunito-SemiBold",
            fontSize: 14,
            color: colors.text,
          }}
        >
          {texto}
        </Text>
      </View>
    </Pressable>
  );
}

// ============================================================
// 1. PANTALLA PRINCIPAL DE TÉCNICAS
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
  const colors = useTecnicasColors();
  const insets = useSafeAreaInsets();

  const [busqueda, setBusqueda] = useState("");

  const tecnicasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return tecnicas;

    return tecnicas.filter((tecnica) =>
      [tecnica.nombre, tecnica.descripcion, tecnica.objetivo]
        .join(" ")
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
// 2. DETALLE DE TÉCNICA
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

                {/* DURACIÓN */}

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
// 3. EJERCICIO DE TÉCNICA
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

  const colorTecnica = tipo === "jacobson" ? colors.accent : colors.primary;

  const fondoTecnica =
    tipo === "jacobson" ? colors.accentSoft : colors.primarySoft;

  const ultimo = indice === pasos.length - 1;

  const textoBoton =
    tipo === "jacobson" && repeticion < REPETICIONES_JACOBSON
      ? "Segunda repetición"
      : ultimo
      ? "Finalizar práctica"
      : "Siguiente";

  const colorTecnica =
    tipo === "jacobson" ? colors.accent : colors.primary;

    const nuevasRespuestas = [...valores];
    nuevasRespuestas[posicion] = valor;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
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

          {/* CONTENIDO DESPLAZABLE */}

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
// 4. HISTORIAL DE TÉCNICAS
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
// 5. TÉCNICA COMPLETADA
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
  const insets = useSafeAreaInsets();

  const { esEscritorio, paddingHorizontal } = useTecnicasLayout();

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
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
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
        <View
          style={{
            width: "100%",
            maxWidth: 560,
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* CONFIRMACIÓN */}

          <View
            style={{
              width: 105,
              height: 105,
              borderRadius: 53,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.success,
            }}
          >
            <Ionicons name="checkmark" size={55} color={colors.textOnPrimary} />
          </View>

          <Text
            style={{
              marginTop: 27,
              fontFamily: "Nunito-Bold",
              fontSize: esEscritorio ? 32 : 28,
              lineHeight: 38,
              textAlign: "center",
              color: colors.text,
            }}
          >
            ¡Técnica completada!
          </Text>

          <Text
            style={{
              marginTop: 12,
              fontFamily: "Nunito-Medium",
              fontSize: 16,
              lineHeight: 24,
              textAlign: "center",
              color: colors.textSecondary,
            }}
          >
            Has terminado{"\n"}
            {nombre ?? "la técnica complementaria"}.
          </Text>

          {/* MENSAJE */}

          <View
            style={{
              width: "100%",
              marginTop: 28,
              padding: 20,
              borderWidth: 1,
              borderRadius: 18,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Medium",
                fontSize: 14,
                lineHeight: 22,
                textAlign: "center",
                color: colors.textSecondary,
              }}
            >
              {mensaje}
            </Text>
          </View>

          <View
            style={{
              flexGrow: 1,
              minHeight: 28,
            }}
          />

          {/* ACCIONES */}

          <View
            style={{
              width: "100%",
              marginTop: 28,
            }}
          >
            <BotonPrimario
              titulo="Volver a técnicas"
              icono="arrow-back"
              onPress={onVolver}
            />

  enlaceTexto: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },
});
