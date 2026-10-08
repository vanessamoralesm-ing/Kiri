import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "@/components/ui/Button";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/services/authProvider";

import {
  actualizarAutorregistroABCService,
  guardarAutorregistroABCService,
  obtenerDetalleRegistroABC,
} from "@/services/diario/autorregistro.service";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

// ==========================================================
// PROPS
// ==========================================================

interface FormularioAutorregistroABCProps {
  origen?: string;

   // Si no se envía, el formulario continúa funcionando
  // exactamente como formulario de creación.
  modo?: "crear" | "editar";

  // Solo se utiliza cuando modo === "editar".
  idRegistro?: string;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export function FormularioAutorregistroABC({
  origen,
  modo = "crear",
  idRegistro,
}: FormularioAutorregistroABCProps) {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } =
    useResponsiveLayout();

  const { user } = useAuth();

  const esModoEdicion = modo === "editar";

  // ========================================================
  // ESTADO
  // ========================================================

  const [contenido, setContenido] = useState("");

  const [guardando, setGuardando] = useState(false);

  const [escribiendo, setEscribiendo] = useState(false);

  const [cargandoRegistro, setCargandoRegistro] = useState(false);

  const [fechaRegistro, setFechaRegistro] = useState<Date>(
  new Date(),
  );
  // Referencia al editor.
  const inputRef = useRef<TextInput>(null);

  // Medimos únicamente la zona que el teclado realmente tapa; en dispositivos
  // que ya reducen la pantalla, esta distancia será cero.
  const contenedorRef = useRef<View>(null);
  const tecladoYRef = useRef<number | null>(null);
  const [espacioTeclado, setEspacioTeclado] = useState(0);

  const medirSolapamiento = useCallback(() => {
    if (tecladoYRef.current === null) return;

    contenedorRef.current?.measureInWindow((_x, y, _width, height) => {
      const tecladoY = tecladoYRef.current;
      if (tecladoY === null) return;

      // Solo compensar la parte del formulario que queda detrás del teclado.
      setEspacioTeclado(Math.max(0, y + height - tecladoY));
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const mostrar = Keyboard.addListener("keyboardDidShow", (event) => {
      tecladoYRef.current = event.endCoordinates.screenY;
      requestAnimationFrame(medirSolapamiento);
    });

    const ocultar = Keyboard.addListener("keyboardDidHide", () => {
      tecladoYRef.current = null;
      setEspacioTeclado(0);
    });

    return () => {
      mostrar.remove();
      ocultar.remove();
    };
  }, [medirSolapamiento]);

  // ========================================================
// CARGAR REGISTRO CUANDO ESTAMOS EDITANDO
// ========================================================

  useEffect(() => {
    if (!esModoEdicion) {
      return;
    }

    if (!idRegistro) {
      return;
    }

    const cargarRegistroABC = async () => {
      try {
        setCargandoRegistro(true);

        const detalle = await obtenerDetalleRegistroABC(
          idRegistro,
        );

        if (!detalle) {
          Alert.alert(
            "Error",
            "No se pudo encontrar el Autorregistro ABC.",
          );

          return;
        }

        setContenido(detalle.contenido);

        setFechaRegistro(new Date(detalle.fecha_inicio));
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message ||
            "No se pudo cargar el Autorregistro ABC.",
        );
      } finally {
        setCargandoRegistro(false);
      }
    };

    cargarRegistroABC();
  }, [esModoEdicion, idRegistro]);

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor(
    {},
    "surfaceSecondary",
  );

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary",
  );

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  /*
   * El card es más estrecho en escritorio para que las líneas
   * de texto no sean excesivamente largas.
   */
  const maxWidthFormulario = esEscritorio
    ? 820
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  // ========================================================
  // FECHA
  // ========================================================

  const fechaActual = fechaRegistro;

  const dia = fechaActual
    .getDate()
    .toString()
    .padStart(2, "0");

  const mes = fechaActual
    .toLocaleDateString("es-ES", {
      month: "short",
    })
    .replace(".", "")
    .toUpperCase();

  const anio = fechaActual.getFullYear();

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const regresar = () => {
      if (esModoEdicion) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/diario/nuevo" as never,

      params: {
        origen,
      },
    });
  };

  // ========================================================
  // GUARDAR
  // ========================================================

    const guardarRegistro = async () => {
    if (!contenido.trim()) {
      Alert.alert(
        "Atención",
        "Escribe algo antes de guardar el registro.",
      );

      return;
    }

    /*
    * En creación necesitamos al usuario porque vamos
    * a crear un registro nuevo asociado a su cuenta.
    */
    if (!esModoEdicion && !user?.id) {
      Alert.alert(
        "Error",
        "No se encontró una sesión de usuario activa.",
      );

      return;
    }

    /*
    * En edición necesitamos el ID del registro existente.
    */
    if (esModoEdicion && !idRegistro) {
      Alert.alert(
        "Error",
        "No se encontró el registro que deseas editar.",
      );

      return;
    }

    try {
      setGuardando(true);

      if (esModoEdicion) {
        await actualizarAutorregistroABCService({
          idRegistro: idRegistro!,
          contenido,
        });

        Alert.alert(
          "¡Actualizado!",
          "Tu autorregistro ha sido actualizado correctamente.",
          [
            {
              text: "OK",
              onPress: regresar,
            },
          ],
        );

        return;
      }

      await guardarAutorregistroABCService({
        idUsuario: user!.id,
        contenido,
      });

      Alert.alert(
        "¡Éxito!",
        "Tu autorregistro ha sido guardado correctamente.",
        [
          {
            text: "OK",
            onPress: regresar,
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        esModoEdicion
          ? "Error al actualizar"
          : "Error al guardar",
        error.message || "Ocurrió un error inesperado.",
      );
    } finally {
      setGuardando(false);
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : Platform.OS === "android"
            ? "height"
            : undefined
      }
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? insets.top
          : 0
      }
    >
      {/* ====================================================
          CONTENEDOR RESPONSIVE
      ==================================================== */}

      <View
        ref={contenedorRef}
        onLayout={() => {
          // Recalcular si Android cambia el tamaño de la ventana tras abrir
          // el teclado; así no añadimos espacio dos veces.
          if (tecladoYRef.current !== null) {
            requestAnimationFrame(medirSolapamiento);
          }
        }}
        style={{
          flex: 1,
          minHeight: 0,

          width: "100%",
          maxWidth: maxWidthContenido,
          alignSelf: "center",

          paddingHorizontal,

          paddingTop: esEscritorio
            ? 28
            : Math.max(insets.top + 8, 16),

          // Conserva el padding original y libera únicamente el espacio
          // cubierto por el teclado para que el cursor siga visible.
          paddingBottom: (esEscritorio
            ? 28
            : Math.max(insets.bottom + 12, 18)) + espacioTeclado,
        }}
      >
        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <View
          style={{
            width: "100%",
            maxWidth: maxWidthFormulario,
            alignSelf: "center",

            flexDirection: "row",
            alignItems: "center",

            marginBottom:
              escribiendo && esTelefono ? 12 : 22,
          }}
        >
          <Pressable
            onPress={regresar}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 46,
              height: 46,

              flexShrink: 0,

              borderRadius: 15,

              borderWidth: 1,
              borderColor,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: pressed
                ? surfaceSecondaryColor
                : surfaceColor,
            })}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={textColor}
            />
          </Pressable>

          <View
            style={{
              flex: 1,
              minWidth: 0,
              paddingHorizontal: 16,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio
                  ? 30
                  : esTablet
                    ? 29
                    : 25,

                color: primaryColor,
              }}
            >
              Autorregistro ABC
            </Text>

            {!escribiendo && (
              <Text
                numberOfLines={1}
                style={{
                  marginTop: 3,

                  fontFamily: "Nunito-Medium",

                  fontSize: 14,

                  color: textMutedColor,
                }}
              >
                Tu espacio personal de reflexión
              </Text>
            )}
          </View>

          {/* ==================================================
              BOTÓN GUARDAR
          ================================================== */}

          <View
            style={{
              flexShrink: 0,
            }}
          >
            <Button
              title={
                guardando
                  ? "Guardando..."
                  : esModoEdicion
                    ? "Guardar cambios"
                    : "Guardar"
              }
              onPress={guardarRegistro}
              disabled={guardando || cargandoRegistro}
            />
          </View>
        </View>

        {/* ==================================================
            FECHA
        ================================================== */}

        <View
          style={{
            width: "100%",
            maxWidth: maxWidthFormulario,
            alignSelf: "center",

            flexDirection: "row",
            alignItems: "center",

            marginBottom:
              escribiendo && esTelefono ? 10 : 18,
          }}
        >
          <View
            style={{
              paddingHorizontal: 14,

              paddingVertical:
                escribiendo && esTelefono ? 7 : 10,

              borderRadius: 14,

              backgroundColor: primarySoftColor,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize:
                  escribiendo && esTelefono ? 15 : 17,

                color: primaryColor,
              }}
            >
              {dia} {mes} {anio}
            </Text>
          </View>
        </View>

        {/* ==================================================
            CARD DE ESCRITURA
        ================================================== */}

        <View
          style={{
            flex: 1,

            /*
             * Permite que el card reduzca su altura cuando
             * aparece el teclado en móvil.
             */
            minHeight: 0,

            width: "100%",
            maxWidth: maxWidthFormulario,

            alignSelf: "center",

            borderRadius: esTelefono ? 22 : 26,

            borderWidth: 1,
            borderColor,

            backgroundColor: surfaceColor,

            /*
             * El overflow mantiene el editor dentro
             * de los bordes redondeados.
             */
            overflow: "hidden",

            /*
             * Sombra suave similar al lenguaje
             * visual del Diario Emocional.
             */
            shadowColor: "#000",

            shadowOffset: {
              width: 0,
              height: 4,
            },

            shadowOpacity: 0.06,

            shadowRadius: 12,

            elevation: 2,
          }}
        >
          {/* ================================================
              CABECERA DEL CARD
          ================================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              paddingHorizontal: esTelefono ? 18 : 24,

              paddingTop:
                escribiendo && esTelefono ? 14 : 20,

              paddingBottom:
                escribiendo && esTelefono ? 12 : 16,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,

                borderRadius: 13,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="book-outline"
                size={22}
                color={primaryColor}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 18 : 20,

                  color: textColor,
                }}
              >
                Escribe libremente
              </Text>

              {!escribiendo && (
                <Text
                  style={{
                    marginTop: 2,

                    fontFamily: "Nunito-Medium",

                    fontSize: 13,

                    color: textSecondaryColor,
                  }}
                >
                  Este espacio es solo para ti
                </Text>
              )}
            </View>
          </View>

          {/* LÍNEA DIVISORIA */}

          <View
            style={{
              height: 1,

              marginHorizontal: esTelefono ? 18 : 24,

              backgroundColor: borderColor,
            }}
          />

          {/* ================================================
              ZONA DE ESCRITURA
          ================================================ */}

          <View
            style={{
              flex: 1,

              /*
               * Muy importante:
               * permite que la zona de escritura se reduzca
               * cuando el teclado ocupa parte de la pantalla.
               */
              minHeight: 0,

              paddingHorizontal: esTelefono ? 18 : 24,

              paddingTop: esTelefono ? 16 : 20,

              paddingBottom: esTelefono ? 16 : 20,
            }}
          >
            {contenido.length === 0 && !escribiendo && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",

                  top: esTelefono ? 16 : 20,

                  left: esTelefono ? 18 : 24,

                  right: esTelefono ? 18 : 24,

                  zIndex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: esTelefono ? 17 : 18,

                    lineHeight: esTelefono ? 26 : 28,

                    color: textMutedColor,
                  }}
                >
                  Escribe sobre lo que ocurrió, lo que
                  pensaste, sentiste o cualquier cosa que
                  quieras expresar...
                </Text>
              </View>
            )}

            <TextInput
              ref={inputRef}

              value={contenido}

              onChangeText={setContenido}

              multiline

              /*
               * Cuando el contenido supera el espacio
               * disponible, el desplazamiento ocurre
               * dentro del propio editor.
               */
              scrollEnabled={true}

              textAlignVertical="top"

              onFocus={() => {
                setEscribiendo(true);
              }}

              onBlur={() => {
                setEscribiendo(false);
              }}

              placeholder={
                escribiendo && contenido.length === 0
                  ? "Empieza a escribir..."
                  : ""
              }

              placeholderTextColor={textMutedColor}

              style={{
                flex: 1,

                /*
                 * Permite que el TextInput se reduzca junto
                 * con el card cuando aparece el teclado.
                 */
                minHeight: 0,

                width: "100%",

                padding: 0,

                fontFamily: "Nunito-Medium",

                fontSize: esTelefono ? 17 : 18,

                lineHeight: esTelefono ? 27 : 29,

                color: textColor,

                backgroundColor: "transparent",
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
