import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoRespuesta from "./CampoRespuesta";
import EntrevistaHeader from "./EntrevistaHeader";
import OpcionRespuesta from "./OpcionRespuesta";
import PreguntaCard from "./PreguntaCard";
import ProgresoEntrevista from "./ProgresoEntrevista";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import type { PreguntaEntrevista } from "@/types/entrevista";

import { obtenerDescripcionPregunta } from "@/utils/entrevistaHelpers";

// ==========================================================
// PROPS
// ==========================================================

interface Props {
  cargando: boolean;

  guardando: boolean;

  errorPantalla: string | null;

  onReintentar: () => void;

  onBack: () => void;

  onContinuar: () => void;

  tituloModulo: string;

  indiceActual: number;

  totalPreguntas: number;

  preguntaActual?: PreguntaEntrevista;

  opcionesSeleccionadas: string[];

  onSeleccionarOpcion: (idOpcion: string) => void;

  textoRespuesta: string;

  onChangeTextoRespuesta: (text: string) => void;

  numeroRespuesta: string;

  onChangeNumeroRespuesta: (text: string) => void;

  esValida: boolean;

  headerBanner?: React.ReactNode;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EntrevistaPantallaBase({
  cargando,
  guardando,
  errorPantalla,
  onReintentar,
  onBack,
  onContinuar,
  tituloModulo,
  indiceActual,
  totalPreguntas,
  preguntaActual,
  opcionesSeleccionadas,
  onSeleccionarOpcion,
  textoRespuesta,
  onChangeTextoRespuesta,
  numeroRespuesta,
  onChangeNumeroRespuesta,
  esValida,
  headerBanner,
}: Props) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const borderColor = useThemeColor({}, "border");

  const dangerColor = useThemeColor({}, "danger");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

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

  const maxWidthEntrevista = esEscritorio ? 980 : esTablet ? 760 : undefined;

  const paddingBottom = esEscritorio ? 28 : 16;

  // ========================================================
  // ESTADOS DERIVADOS
  // ========================================================

  const botonDeshabilitado = guardando || !esValida;

  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <View
          style={{
            flex: 1,

            width: "100%",
            maxWidth: maxWidthPantalla,

            alignSelf: "center",

            alignItems: "center",
            justifyContent: "center",

            paddingHorizontal,
          }}
        >
          <View
            style={{
              width: 78,
              height: 78,

              borderRadius: 39,

              borderWidth: 1,
              borderColor,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: primarySoftColor,
            }}
          >
            <ActivityIndicator size="large" color={primaryColor} />
          </View>

          <Text
            style={{
              marginTop: 14,

              fontSize: 15,

              fontFamily: "Nunito-SemiBold",

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            Preparando esta sección...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================================
  // ERROR
  // ========================================================

  if (errorPantalla || !preguntaActual) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor,
        }}
      >
        <View
          style={{
            flex: 1,

            width: "100%",
            maxWidth: maxWidthPantalla,

            alignSelf: "center",

            alignItems: "center",
            justifyContent: "center",

            paddingHorizontal,
          }}
        >
          <View
            style={{
              width: 78,
              height: 78,

              borderRadius: 39,

              borderWidth: 1,
              borderColor,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={45}
              color={dangerColor}
            />
          </View>

          <Text
            style={{
              marginTop: 15,

              fontSize: 20,

              fontFamily: "Nunito-Bold",

              textAlign: "center",

              color: textColor,
            }}
          >
            No pudimos cargar esta sección
          </Text>

          <Text
            style={{
              marginTop: 9,

              maxWidth: 500,

              fontSize: 14,
              lineHeight: 21,

              fontFamily: "Nunito-Medium",

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            {errorPantalla ?? "No encontramos preguntas disponibles."}
          </Text>

          <Pressable
            onPress={onReintentar}
            style={({ pressed }) => ({
              marginTop: 22,

              minHeight: 48,

              paddingHorizontal: 25,
              paddingVertical: 13,

              borderRadius: 15,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",

              gap: 8,

              backgroundColor: primaryColor,

              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Ionicons
              name="refresh-outline"
              size={19}
              color={textOnPrimaryColor}
            />

            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: 14,

                color: textOnPrimaryColor,
              }}
            >
              Intentar nuevamente
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================================
  // PANTALLA PRINCIPAL
  // ========================================================

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <View
        style={{
          flex: 1,

          width: "100%",
          maxWidth: maxWidthPantalla,

          alignSelf: "center",

          paddingHorizontal,
          paddingBottom,
        }}
      >
        {/* =================================================
            CABECERA + PROGRESO
        ================================================= */}

        <View
          style={{
            width: "100%",
            maxWidth: maxWidthEntrevista,

            alignSelf: "center",
          }}
        >
          <EntrevistaHeader onBack={onBack} />

          <ProgresoEntrevista
            actual={indiceActual + 1}

            total={totalPreguntas}

            tituloModulo={tituloModulo}
          />

          {headerBanner}
        </View>

        {/* =================================================
            CONTENIDO
        ================================================= */}

        <ScrollView
          style={{
            flex: 1,
            width: "100%",
          }}
          contentContainerStyle={{
            flexGrow: 1,

            width: "100%",

            paddingTop: esEscritorio ? 18 : 10,

            paddingBottom: esEscritorio ? 24 : 14,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              width: "100%",
              maxWidth: maxWidthEntrevista,

              alignSelf: "center",
            }}
          >
            <PreguntaCard
              codigo={preguntaActual.codigo}

              pregunta={preguntaActual.enunciado}

              descripcion={obtenerDescripcionPregunta(preguntaActual)}

              opcional={!preguntaActual.obligatoria}
            >
              {/* ===============================================
                  OPCIONES
              =============================================== */}

              {(preguntaActual.tipo_pregunta === "opcion_unica" ||
                preguntaActual.tipo_pregunta === "opcion_multiple" ||
                preguntaActual.tipo_pregunta === "escala") &&
                preguntaActual.opciones.map((opcion) => (
                  <OpcionRespuesta
                    key={opcion.id_opcion}

                    texto={opcion.descripcion}

                    seleccionada={opcionesSeleccionadas.includes(
                      opcion.id_opcion,
                    )}

                    onPress={() => onSeleccionarOpcion(opcion.id_opcion)}
                  />
                ))}

              {/* ===============================================
                  RESPUESTA TEXTO
              =============================================== */}

              {preguntaActual.tipo_pregunta === "texto" && (
                <CampoRespuesta
                  valor={textoRespuesta}

                  onChangeText={onChangeTextoRespuesta}

                  tipo="texto"

                  placeholder="Escribe tu respuesta..."
                />
              )}

              {/* ===============================================
                  RESPUESTA NUMÉRICA
              =============================================== */}

              {preguntaActual.tipo_pregunta === "numero" && (
                <CampoRespuesta
                  valor={numeroRespuesta}

                  onChangeText={onChangeNumeroRespuesta}

                  tipo="numero"

                  placeholder="Escribe una cantidad..."
                />
              )}
            </PreguntaCard>
          </View>
        </ScrollView>

        {/* =================================================
            BOTÓN INFERIOR
        ================================================= */}

        <View
          style={{
            width: "100%",
            maxWidth: maxWidthEntrevista,

            alignSelf: "center",

            paddingTop: 10,

            alignItems: esEscritorio ? "flex-end" : "stretch",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={onContinuar}
            disabled={botonDeshabilitado}
            style={{
              width: esEscritorio ? 280 : "100%",

              minHeight: 56,

              borderRadius: 16,

              borderWidth: 1,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",

              gap: 9,

              paddingHorizontal: 20,

              backgroundColor: botonDeshabilitado
                ? surfaceSecondaryColor
                : primaryColor,

              borderColor: botonDeshabilitado ? borderColor : primaryColor,

              ...(Platform.OS === "web" && !botonDeshabilitado
                ? ({
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
                  } as any)
                : {}),

              ...(Platform.OS === "ios" && !botonDeshabilitado
                ? {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },

                    shadowOpacity: 0.08,

                    shadowRadius: 6,
                  }
                : {}),

              ...(Platform.OS === "android" && !botonDeshabilitado
                ? {
                    elevation: 2,
                  }
                : {}),
            }}
          >
            {guardando ? (
              <ActivityIndicator size="small" color={primaryColor} />
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 16,

                    fontFamily: "Nunito-Bold",

                    includeFontPadding: false,

                    color: botonDeshabilitado
                      ? textMutedColor
                      : textOnPrimaryColor,
                  }}
                >
                  {indiceActual === totalPreguntas - 1
                    ? "Finalizar sección"
                    : "Siguiente"}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color={
                    botonDeshabilitado ? textMutedColor : textOnPrimaryColor
                  }
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
