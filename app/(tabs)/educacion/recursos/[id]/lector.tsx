import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BotonVolver from "@/components/ui/BotonVolver";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { obtenerDetalleRecurso } from "@/services/educacion/educacionService";
import { RecursoPsicoeducativo } from "@/types/educacion";

// ==========================================================
// LECTOR DEL RECURSO
// ==========================================================

export default function LectorRecurso() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Datos recibidos desde la ruta.
  const { id, categoriaId } = useLocalSearchParams<{
    id?: string;
    categoriaId?: string;
  }>();

  // Responsive del proyecto.
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // Estados del recurso y del lector.
  const [recurso, setRecurso] = useState<RecursoPsicoeducativo | null>(null);
  const [cargandoRecurso, setCargandoRecurso] = useState(true);
  const [cargandoDocumento, setCargandoDocumento] = useState(true);
  const [errorDocumento, setErrorDocumento] = useState(false);
  const [intentoDocumento, setIntentoDocumento] = useState(0);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  // Colores del tema.
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const accentColor = useThemeColor({}, "accent");
  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // CARGAR LIBRO
  // ========================================================

  useEffect(() => {
    let componenteActivo = true;

    async function cargarRecurso() {
      if (!id) {
        if (componenteActivo) setCargandoRecurso(false);
        return;
      }

      setCargandoRecurso(true);
      const recursoSupabase = await obtenerDetalleRecurso(id);

      if (componenteActivo) {
        setRecurso(recursoSupabase);
        setCargandoRecurso(false);
      }
    }

    cargarRecurso();

    return () => {
      componenteActivo = false;
    };
  }, [id]);

  // Regresa al detalle del mismo libro.
  function volverAlDetalle() {
    if (!id) {
      router.replace("/(tabs)/educacion" as any);
      return;
    }

    router.replace({
      pathname: "/(tabs)/educacion/recursos/[id]",
      params: { id, categoriaId },
    } as any);
  }

  // ========================================================
  // PDF
  // ========================================================

  // URL guardada en Supabase.
  const urlPdf = recurso?.url_recurso?.trim() || null;

  // Ajusta el PDF en web.
  const urlPdfWeb = urlPdf
    ? `${urlPdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
    : null;

  // Android utiliza el visor remoto.
  const urlVisualizacion =
    urlPdf && Platform.OS === "android"
      ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(urlPdf)}`
      : urlPdf;

  // Oculta controles innecesarios del visor móvil.
  const ocultarControlesVisor = `
    (function() {
      function limpiarVisor() {
        try {
          var elementos = document.querySelectorAll(
            '[role="toolbar"], header, .toolbar, #toolbar'
          );

          elementos.forEach(function(elemento) {
            elemento.style.display = 'none';
            elemento.style.visibility = 'hidden';
            elemento.style.height = '0px';
            elemento.style.minHeight = '0px';
            elemento.style.overflow = 'hidden';
          });

          var botones = document.querySelectorAll('button, a');

          botones.forEach(function(boton) {
            var texto = (boton.innerText || '').toLowerCase();
            var etiqueta = (boton.getAttribute('aria-label') || '').toLowerCase();

            if (
              texto.includes('acceder') ||
              texto.includes('imprimir') ||
              texto.includes('descargar') ||
              etiqueta.includes('print') ||
              etiqueta.includes('download') ||
              etiqueta.includes('imprimir') ||
              etiqueta.includes('descargar')
            ) {
              boton.style.display = 'none';
            }
          });

          document.documentElement.style.margin = '0';
          document.documentElement.style.padding = '0';
          document.body.style.margin = '0';
          document.body.style.padding = '0';
        } catch (error) {
          // El PDF puede seguir funcionando.
        }
      }

      limpiarVisor();
      setTimeout(limpiarVisor, 500);
      setTimeout(limpiarVisor, 1500);
      setTimeout(limpiarVisor, 3000);
      true;
    })();
  `;

  // Vuelve a cargar el documento.
  function reintentarDocumento() {
    setErrorDocumento(false);
    setCargandoDocumento(true);
    setIntentoDocumento((valor) => valor + 1);
  }

  // Abre o cierra la pantalla completa.
  function cambiarPantallaCompleta() {
    setPantallaCompleta((valor) => !valor);
  }

  // ========================================================
// BOTÓN MÓVIL Y TABLET
// ========================================================

// Botón flotante abajo a la derecha.
function renderizarControlMovil() {
  if (Platform.OS === "web" || errorDocumento) return null;

  return (
    <View
      style={{
        position: "absolute",
        right: esTablet ? 20 : 14,
        bottom: Math.max(insets.bottom + 8, 12),
        width: esTablet ? 56 : 54,
        height: esTablet ? 56 : 54,
        borderRadius: 17,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        elevation: 30,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 7,
      }}
    >
      <Pressable
        onPress={cambiarPantallaCompleta}
        style={({ pressed }) => ({
          width: "100%",
          height: "100%",
          borderRadius: 17,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons
          name={pantallaCompleta ? "contract-outline" : "expand-outline"}
          size={28}
          color="#7C5CFC"
        />
      </Pressable>
    </View>
  );
}

  // ========================================================
  // VISOR DEL PDF
  // ========================================================

  // Se reutiliza en vista normal y pantalla completa.
  function renderizarVisor(esPantallaCompleta = false) {
    return (
      <View
        className="flex-1 overflow-hidden"
        style={{
          position: "relative",
          backgroundColor: surfaceColor,
          borderRadius: esPantallaCompleta || esTelefono ? 0 : 22,
          borderWidth: esPantallaCompleta || esTelefono ? 0 : 1,
          borderColor,
        }}
      >
        {/* Cargando PDF */}
        {cargandoDocumento && !errorDocumento && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ zIndex: 40, backgroundColor: surfaceColor }}
          >
            <ActivityIndicator size="large" color={accentColor} />
            <Text
              className="mt-4 font-nunito-semibold"
              style={{ fontSize: 14, color: textSecondaryColor }}
            >
              Cargando libro...
            </Text>
          </View>
        )}

        {/* Error del PDF */}
        {errorDocumento && (
          <View
            className="absolute inset-0 items-center justify-center px-7"
            style={{ zIndex: 50, backgroundColor: surfaceColor }}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 68,
                height: 68,
                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={accentColor}
              />
            </View>

            <Text
              className="mt-5 text-center font-nunito-bold"
              style={{ fontSize: 18, color: textColor }}
            >
              No pudimos abrir el libro
            </Text>

            <Text
              className="mt-2 text-center font-nunito-medium"
              style={{
                maxWidth: 380,
                fontSize: 14,
                lineHeight: 21,
                color: textSecondaryColor,
              }}
            >
              Verifica que el archivo PDF esté disponible e inténtalo nuevamente.
            </Text>

            <Pressable
              onPress={reintentarDocumento}
              className="mt-5 flex-row items-center justify-center rounded-[14px] px-5"
              style={({ pressed }) => ({
                minHeight: 46,
                gap: 7,
                backgroundColor: "#7C5CFC",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="refresh-outline" size={19} color="#FFFFFF" />
              <Text
                className="font-nunito-bold"
                style={{ fontSize: 14, color: "#FFFFFF" }}
              >
                Intentar nuevamente
              </Text>
            </Pressable>
          </View>
        )}

        {/* PDF en web */}
        {Platform.OS === "web" && !errorDocumento && urlPdfWeb && (
          <iframe
            key={`web-${intentoDocumento}-${esPantallaCompleta}`}
            src={urlPdfWeb}
            title={recurso?.titulo}
            onLoad={() => setCargandoDocumento(false)}
            onError={() => {
              setCargandoDocumento(false);
              setErrorDocumento(true);
            }}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              backgroundColor: surfaceColor,
            }}
          />
        )}

        {/* PDF en móvil y tablet */}
        {Platform.OS !== "web" && !errorDocumento && urlVisualizacion && (
          <WebView
            key={`movil-${intentoDocumento}-${esPantallaCompleta}`}
            source={{ uri: urlVisualizacion }}
            style={{ flex: 1, backgroundColor: surfaceColor }}
            originWhitelist={["*"]}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState={false}
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures
            injectedJavaScript={ocultarControlesVisor}
            injectedJavaScriptBeforeContentLoaded={ocultarControlesVisor}
            onLoadStart={() => setCargandoDocumento(true)}
            onLoadEnd={() => setCargandoDocumento(false)}
            onError={() => {
              setCargandoDocumento(false);
              setErrorDocumento(true);
            }}
            onHttpError={() => {
              setCargandoDocumento(false);
              setErrorDocumento(true);
            }}
          />
        )}

        {/* Botón de pantalla completa en web */}
        {Platform.OS === "web" && !errorDocumento && (
          <Pressable
            onPress={cambiarPantallaCompleta}
            style={({ pressed }) => ({
              position: "absolute",
              right: 18,
              bottom: 18,
              zIndex: 60,
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: surfaceColor,
              borderWidth: 1,
              borderColor,
              opacity: pressed ? 0.75 : 0.95,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 7,
              elevation: 6,
            })}
          >
            <Ionicons
              name={esPantallaCompleta ? "contract-outline" : "expand-outline"}
              size={24}
              color="#7C5CFC"
            />
          </Pressable>
        )}
      </View>
    );
  }

  // ========================================================
  // ESTADOS DE LA PANTALLA
  // ========================================================

  if (cargandoRecurso) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor }}
      >
        <ActivityIndicator size="large" color={accentColor} />
        <Text
          className="mt-4 font-nunito-semibold"
          style={{ fontSize: 15, color: textSecondaryColor }}
        >
          Preparando lectura...
        </Text>
      </View>
    );
  }

  if (!recurso) {
    return (
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor,
        }}
      >
        <BotonVolver onPress={volverAlDetalle} />

        <View className="flex-1 items-center justify-center px-6">
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons name="book-outline" size={34} color={accentColor} />
          </View>

          <Text
            className="mt-5 text-center font-nunito-bold"
            style={{ fontSize: 19, color: textColor }}
          >
            Libro no encontrado
          </Text>

          <Text
            className="mt-2 text-center font-nunito-medium"
            style={{
              maxWidth: 360,
              fontSize: 14,
              lineHeight: 21,
              color: textSecondaryColor,
            }}
          >
            No fue posible encontrar la información de este libro.
          </Text>
        </View>
      </View>
    );
  }

  if (!urlPdf) {
    return (
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor,
        }}
      >
        <BotonVolver onPress={volverAlDetalle} />

        <View className="flex-1 items-center justify-center px-6">
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons name="document-outline" size={34} color={accentColor} />
          </View>

          <Text
            className="mt-5 text-center font-nunito-bold"
            style={{ fontSize: 19, color: textColor }}
          >
            Lectura no disponible
          </Text>

          <Text
            className="mt-2 text-center font-nunito-medium"
            style={{
              maxWidth: 360,
              fontSize: 14,
              lineHeight: 21,
              color: textSecondaryColor,
            }}
          >
            Este libro todavía no tiene un documento disponible para leer.
          </Text>
        </View>
      </View>
    );
  }

  // ========================================================
  // MEDIDAS RESPONSIVE
  // ========================================================

  const maxWidthContenido = esEscritorio ? 1200 : esTablet ? 900 : undefined;
  const paddingHorizontal = esEscritorio ? 32 : esTablet ? 24 : 0;

  // ========================================================
  // INTERFAZ
  // ========================================================

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor }}
    >
      {/* Encabezado */}
      <View
        className="w-full"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          backgroundColor: surfaceColor,
        }}
      >
        <View
          className="w-full flex-row items-center"
          style={{
            maxWidth: maxWidthContenido,
            alignSelf: "center",
            minHeight: esTelefono ? 68 : 76,
            paddingHorizontal: esTelefono ? 14 : paddingHorizontal,
          }}
        >
          <BotonVolver onPress={volverAlDetalle} />

          <View
            className="flex-1"
            style={{ minWidth: 0, marginLeft: 14, marginRight: 12 }}
          >
            <Text
              className="font-nunito-bold"
              numberOfLines={1}
              style={{
                fontSize: esEscritorio ? 18 : 16,
                color: textColor,
              }}
            >
              {recurso.titulo}
            </Text>

            <Text
              className="mt-0.5 font-nunito-medium"
              numberOfLines={1}
              style={{
                fontSize: esEscritorio ? 13 : 12,
                color: textSecondaryColor,
              }}
            >
              Lector Kiri
            </Text>
          </View>

          <View
            className="items-center justify-center rounded-full"
            style={{
              width: esTelefono ? 38 : 42,
              height: esTelefono ? 38 : 42,
              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons
              name="book-outline"
              size={esTelefono ? 20 : 22}
              color={accentColor}
            />
          </View>
        </View>
      </View>

      {/* Área del lector */}
      <View
        className="flex-1 w-full"
        style={{
          position: "relative",
          maxWidth: maxWidthContenido,
          alignSelf: "center",
          paddingHorizontal: esTelefono ? 0 : paddingHorizontal,
          paddingTop: esTelefono ? 0 : 18,
          paddingBottom:
            Platform.OS === "web"
              ? esTelefono
                ? 0
                : insets.bottom + 18
              : 0,
        }}
      >
        {!pantallaCompleta && (
          <>
            {renderizarVisor(false)}
            {renderizarControlMovil()}
          </>
        )}
      </View>

      {/* Pantalla completa */}
      <Modal
        visible={pantallaCompleta}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setPantallaCompleta(false)}
      >
        <View
          className="flex-1"
          style={{ position: "relative", backgroundColor }}
        >
          {pantallaCompleta && (
            <>
              {renderizarVisor(true)}
              {renderizarControlMovil()}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}