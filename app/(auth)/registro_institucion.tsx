import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// COMPONENTES
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo_izq";

// RESPONSIVE
import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// TEMA
import { useThemeColor } from "@/hooks/use-theme-color";

// SERVICE
import { crearSolicitudInstitucional } from "@/services/instituciones/solicitudInstitucionService";

// TYPES
import type { TipoInstitucion } from "@/types/superadmin/solicitudes";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function RegistroInstitucionPantalla() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const secondaryColor = useThemeColor({}, "secondary");
  const secondarySoftColor = useThemeColor({}, "secondarySoft");
  const iconColor = useThemeColor({}, "icon");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADOS GENERALES
  // ========================================================

  const [pasoActual, setPasoActual] = useState(1);
  const [enviando, setEnviando] = useState(false);

  // ========================================================
  // PASO 1 - DATOS DE LA INSTITUCIÓN
  // ========================================================

  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [codigoInstitucional, setCodigoInstitucional] = useState("");

  const [tipoInstitucion, setTipoInstitucion] =
    useState<TipoInstitucion | null>(null);

  const [departamento, setDepartamento] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [direccion, setDireccion] = useState("");

  // ========================================================
  // PASO 2 - DATOS DEL SOLICITANTE
  // ========================================================

  const [nombreSolicitante, setNombreSolicitante] = useState("");
  const [apellidoSolicitante, setApellidoSolicitante] = useState("");
  const [cedula, setCedula] = useState("");
  const [cargo, setCargo] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("");

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

  const maxWidthFormulario = esEscritorio
    ? 900
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  const paddingTop = esEscritorio ? 30 : Math.max(insets.top + 12, 20);

  const paddingBottom = esEscritorio ? 54 : Math.max(insets.bottom + 32, 44);

  const paddingTarjeta = esEscritorio ? 30 : esTablet ? 26 : 20;

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function regresar() {
    if (enviando) return;

    if (pasoActual === 2) {
      setPasoActual(1);
      return;
    }

    router.back();
  }

  // ========================================================
  // VALIDACIONES
  // ========================================================

  function correoValido(valor: string) {
    const correoLimpio = valor.trim();

    return correoLimpio.includes("@") && correoLimpio.includes(".");
  }

  function irAlPaso2() {
    if (
      !nombreInstitucion.trim() ||
      !codigoInstitucional.trim() ||
      !tipoInstitucion ||
      !departamento.trim() ||
      !municipio.trim() ||
      !direccion.trim()
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los datos obligatorios de la institución.",
      );

      return;
    }

    setPasoActual(2);
  }

  // ========================================================
  // ENVIAR SOLICITUD
  // ========================================================

  async function enviarSolicitud() {
    if (enviando) return;

    if (
      !nombreSolicitante.trim() ||
      !apellidoSolicitante.trim() ||
      !cedula.trim() ||
      !cargo.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !motivo.trim()
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los datos obligatorios del solicitante.",
      );

      return;
    }

    if (!correoValido(correo)) {
      Alert.alert("Correo inválido", "Ingresa un correo institucional válido.");

      return;
    }

    if (!tipoInstitucion) {
      Alert.alert("Tipo de institución", "Selecciona un tipo de institución.");

      return;
    }

    try {
      setEnviando(true);

      await crearSolicitudInstitucional({
        nombre_institucion: nombreInstitucion.trim(),
        codigo_institucional: codigoInstitucional.trim(),
        tipo_institucion: tipoInstitucion,
        direccion: direccion.trim(),
        municipio: municipio.trim(),
        departamento: departamento.trim(),

        nombre_solicitante: nombreSolicitante.trim(),
        apellido_solicitante: apellidoSolicitante.trim(),
        cedula_solicitante: cedula.trim(),
        cargo_solicitante: cargo.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        descripcion: motivo.trim(),
      });

      Alert.alert(
        "Solicitud registrada",
        "Tu solicitud ha sido enviada correctamente. El equipo de Kiri revisará la información y te notificará por correo cuando exista una resolución.",
        [
          {
            text: "Entendido",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error("Error enviando solicitud institucional:", error);

      Alert.alert(
        "No se pudo enviar la solicitud",
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor,
        paddingTop,
        paddingBottom,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: maxWidthPantalla,
          alignSelf: "center",
          paddingHorizontal,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthFormulario,
            alignSelf: "center",
          }}
        >
          {/* ==================================================
              CABECERA
          ================================================== */}

          <View
            style={{
              minHeight: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={regresar}
              disabled={enviando}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 46,
                height: 46,

                borderRadius: 15,

                borderWidth: 1,
                borderColor,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

                opacity: enviando ? 0.5 : 1,
              })}
            >
              <Ionicons name="arrow-back" size={23} color={iconColor} />
            </Pressable>

            <View
              style={{
                flexShrink: 0,
              }}
            >
              <Logo />
            </View>
          </View>

          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              marginTop: esEscritorio ? 20 : 16,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: esEscritorio ? 58 : 52,
                height: esEscritorio ? 58 : 52,

                borderRadius: esEscritorio ? 18 : 16,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="business-outline"
                size={esEscritorio ? 28 : 25}
                color={primaryColor}
              />
            </View>

            <Text
              style={{
                marginTop: 14,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 32 : esTablet ? 29 : 26,

                lineHeight: esEscritorio ? 40 : 34,

                textAlign: "center",

                color: primaryColor,
              }}
            >
              Solicitud de Institución
            </Text>

            <Text
              style={{
                marginTop: 7,

                maxWidth: 650,

                fontFamily: "Nunito-Medium",

                fontSize: esEscritorio ? 16 : 14,

                lineHeight: esEscritorio ? 23 : 21,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
              Únete al ecosistema de Kiri y transforma el bienestar emocional de
              tu comunidad.
            </Text>
          </View>

          {/* ==================================================
              INDICADOR DE PASOS
          ================================================== */}

          <View
            style={{
              marginTop: esEscritorio ? 28 : 22,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,

                  borderRadius: 17,

                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: primaryColor,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 13,
                    color: textOnPrimaryColor,
                  }}
                >
                  1
                </Text>
              </View>

              <View
                style={{
                  flex: 1,

                  height: 4,

                  marginHorizontal: 8,

                  borderRadius: 999,

                  backgroundColor:
                    pasoActual === 2 ? primaryColor : borderColor,
                }}
              />

              <View
                style={{
                  width: 34,
                  height: 34,

                  borderRadius: 17,

                  alignItems: "center",
                  justifyContent: "center",

                  borderWidth: pasoActual === 1 ? 1 : 0,
                  borderColor,

                  backgroundColor:
                    pasoActual === 2 ? primaryColor : surfaceColor,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 13,

                    color:
                      pasoActual === 2 ? textOnPrimaryColor : textMutedColor,
                  }}
                >
                  2
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              marginTop: 10,

              fontFamily: "Nunito-SemiBold",

              fontSize: 14,

              textAlign: "center",

              color: textMutedColor,
            }}
          >
            {pasoActual === 1
              ? "Paso 1 de 2 · Información general de la institución"
              : "Paso 2 de 2 · Datos del representante y contacto"}
          </Text>

          {/* ==================================================
              TARJETA DEL FORMULARIO
          ================================================== */}

          <View
            style={{
              width: "100%",

              marginTop: 22,

              padding: paddingTarjeta,

              borderWidth: 1,
              borderRadius: 24,

              borderColor,

              backgroundColor: surfaceColor,

              ...(Platform.OS === "web"
                ? ({
                  boxShadow: "0px 4px 16px rgba(0,0,0,0.04)",
                } as any)
                : {}),

              ...(Platform.OS === "ios"
                ? {
                  shadowColor: "#000000",

                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },

                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                }
                : {}),

              ...(Platform.OS === "android"
                ? {
                  elevation: 2,
                }
                : {}),
            }}
          >
            {/* ==================================================
                PASO 1
            ================================================== */}

            {pasoActual === 1 && (
              <>
                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 21 : 18,

                      color: textColor,
                    }}
                  >
                    Información de la institución
                  </Text>

                  <Text
                    style={{
                      marginTop: 4,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,
                      lineHeight: 19,

                      color: textMutedColor,
                    }}
                  >
                    Ingresa los datos generales de la organización que desea
                    utilizar Kiri.
                  </Text>
                </View>

                {/* NOMBRE Y CÓDIGO */}

                <View
                  style={{
                    flexDirection: esEscritorio || esTablet ? "row" : "column",

                    gap: esEscritorio ? 18 : esTablet ? 14 : 0,
                  }}
                >
                  <View
                    style={{
                      flex: esEscritorio || esTablet ? 1 : undefined,
                    }}
                  >
                    <Input
                      label="Nombre de la Institución *"
                      placeholder="Ej. Colegio José Madriz"
                      value={nombreInstitucion}
                      onChangeText={setNombreInstitucion}
                    />
                  </View>

                  <View
                    style={{
                      flex: esEscritorio || esTablet ? 1 : undefined,
                    }}
                  >
                    <Input
                      label="Código Institucional *"
                      placeholder="Ej. MINED-0321"
                      value={codigoInstitucional}
                      onChangeText={setCodigoInstitucional}
                    />
                  </View>
                </View>

                {/* TIPO */}

                <Text
                  style={{
                    marginTop: 5,
                    marginBottom: 9,

                    fontFamily: "Nunito-SemiBold",

                    fontSize: 14,

                    color: textColor,
                  }}
                >
                  Tipo de Institución *
                </Text>

                <View
                  style={{
                    width: "100%",

                    flexDirection: esTelefono ? "column" : "row",

                    gap: 10,

                    marginBottom: 18,
                  }}
                >
                  <Pressable
                    onPress={() => setTipoInstitucion("educacion_superior")}
                    style={({ pressed }) => ({
                      flex: esTelefono ? undefined : 1,

                      width: esTelefono ? "100%" : undefined,

                      minHeight: 50,

                      paddingHorizontal: 13,

                      borderWidth: 1,
                      borderRadius: 14,

                      borderColor:
                        tipoInstitucion === "educacion_superior"
                          ? primaryColor
                          : borderColor,

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",

                      gap: 8,

                      backgroundColor:
                        tipoInstitucion === "educacion_superior"
                          ? primarySoftColor
                          : pressed
                            ? surfaceSecondaryColor
                            : surfaceColor,
                    })}
                  >
                    <Ionicons
                      name="school-outline"
                      size={19}
                      color={
                        tipoInstitucion === "educacion_superior"
                          ? primaryColor
                          : iconColor
                      }
                    />

                    <Text
                      style={{
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 13,

                        textAlign: "center",

                        color:
                          tipoInstitucion === "educacion_superior"
                            ? primaryColor
                            : textSecondaryColor,
                      }}
                    >
                      Educación superior
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setTipoInstitucion("escolar")}
                    style={({ pressed }) => ({
                      flex: esTelefono ? undefined : 1,

                      width: esTelefono ? "100%" : undefined,

                      minHeight: 50,

                      paddingHorizontal: 13,

                      borderWidth: 1,
                      borderRadius: 14,

                      borderColor:
                        tipoInstitucion === "escolar"
                          ? primaryColor
                          : borderColor,

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",

                      gap: 8,

                      backgroundColor:
                        tipoInstitucion === "escolar"
                          ? primarySoftColor
                          : pressed
                            ? surfaceSecondaryColor
                            : surfaceColor,
                    })}
                  >
                    <Ionicons
                      name="book-outline"
                      size={19}
                      color={
                        tipoInstitucion === "escolar" ? primaryColor : iconColor
                      }
                    />

                    <Text
                      style={{
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 13,

                        color:
                          tipoInstitucion === "escolar"
                            ? primaryColor
                            : textSecondaryColor,
                      }}
                    >
                      Escolar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setTipoInstitucion("salud")}
                    style={({ pressed }) => ({
                      flex: esTelefono ? undefined : 1,

                      width: esTelefono ? "100%" : undefined,

                      minHeight: 50,

                      paddingHorizontal: 13,

                      borderWidth: 1,
                      borderRadius: 14,

                      borderColor:
                        tipoInstitucion === "salud"
                          ? primaryColor
                          : borderColor,

                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",

                      gap: 8,

                      backgroundColor:
                        tipoInstitucion === "salud"
                          ? primarySoftColor
                          : pressed
                            ? surfaceSecondaryColor
                            : surfaceColor,
                    })}
                  >
                    <Ionicons
                      name="medkit-outline"
                      size={19}
                      color={
                        tipoInstitucion === "salud" ? primaryColor : iconColor
                      }
                    />

                    <Text
                      style={{
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 13,

                        color:
                          tipoInstitucion === "salud"
                            ? primaryColor
                            : textSecondaryColor,
                      }}
                    >
                      Salud
                    </Text>
                  </Pressable>
                </View>

                {/* DEPARTAMENTO + MUNICIPIO */}

                <View
                  style={{
                    flexDirection: esTelefono ? "column" : "row",

                    gap: esTelefono ? 0 : 14,
                  }}
                >
                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Departamento *"
                      placeholder="Ej. León"
                      value={departamento}
                      onChangeText={setDepartamento}
                    />
                  </View>

                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Municipio *"
                      placeholder="Ej. León"
                      value={municipio}
                      onChangeText={setMunicipio}
                    />
                  </View>
                </View>

                <Input
                  label="Dirección de la Institución *"
                  placeholder="Ej. Barrio El Sagrario, frente al parque..."
                  value={direccion}
                  onChangeText={setDireccion}
                />

                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <Button
                    title="Siguiente"
                    variant="primary"
                    onPress={irAlPaso2}
                  />
                </View>
              </>
            )}

            {/* ==================================================
                PASO 2
            ================================================== */}

            {pasoActual === 2 && (
              <>
                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 21 : 18,

                      color: textColor,
                    }}
                  >
                    Datos del representante
                  </Text>

                  <Text
                    style={{
                      marginTop: 4,

                      fontFamily: "Nunito-Medium",

                      fontSize: 13,
                      lineHeight: 19,

                      color: textMutedColor,
                    }}
                  >
                    Proporciona los datos de la persona responsable de la
                    solicitud institucional.
                  </Text>
                </View>

                {/* NOMBRE + APELLIDO */}

                <View
                  style={{
                    flexDirection: esTelefono ? "column" : "row",

                    gap: esTelefono ? 0 : 14,
                  }}
                >
                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Nombre del Solicitante *"
                      placeholder="Ej. Félix Pedro"
                      value={nombreSolicitante}
                      onChangeText={setNombreSolicitante}
                    />
                  </View>

                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Apellido del Solicitante *"
                      placeholder="Ej. López Pérez"
                      value={apellidoSolicitante}
                      onChangeText={setApellidoSolicitante}
                    />
                  </View>
                </View>

                {/* CÉDULA + CARGO */}

                <View
                  style={{
                    flexDirection: esTelefono ? "column" : "row",

                    gap: esTelefono ? 0 : 14,
                  }}
                >
                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Número de Cédula *"
                      placeholder="001-123456-0001P"
                      value={cedula}
                      onChangeText={setCedula}
                    />
                  </View>

                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Cargo *"
                      placeholder="Ej. Director"
                      value={cargo}
                      onChangeText={setCargo}
                    />
                  </View>
                </View>

                {/* CORREO + TELÉFONO */}

                <View
                  style={{
                    flexDirection: esTelefono ? "column" : "row",

                    gap: esTelefono ? 0 : 14,
                  }}
                >
                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Correo Institucional *"
                      placeholder="admin@institucion.edu.ni"
                      value={correo}
                      onChangeText={setCorreo}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View
                    style={{
                      flex: esTelefono ? undefined : 1,
                    }}
                  >
                    <Input
                      label="Teléfono de Contacto *"
                      placeholder="8888-1234"
                      value={telefono}
                      onChangeText={setTelefono}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <Input
                  label="Motivo de la Solicitud *"
                  placeholder="¿Por qué desean utilizar Kiri?"
                  value={motivo}
                  onChangeText={setMotivo}
                  multiline
                  numberOfLines={4}
                  style={{
                    minHeight: 110,
                    textAlignVertical: "top",
                    paddingTop: 12,
                  }}
                />

                {/* AVISO */}

                <View
                  style={{
                    width: "100%",

                    marginTop: 8,
                    marginBottom: 18,

                    padding: 14,

                    borderRadius: 15,

                    flexDirection: "row",
                    alignItems: "flex-start",

                    gap: 10,

                    backgroundColor: secondarySoftColor,
                  }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color={secondaryColor}
                  />

                  <Text
                    style={{
                      flex: 1,

                      fontFamily: "Nunito-Medium",

                      fontSize: 12,
                      lineHeight: 18,

                      color: textSecondaryColor,
                    }}
                  >
                    La información será revisada por el equipo de Kiri antes de
                    habilitar el acceso institucional.
                  </Text>
                </View>

                {/* BOTONES */}

                <View
                  style={{
                    width: "100%",

                    flexDirection: esTelefono ? "column" : "row",

                    gap: 12,
                  }}
                >
                  <Pressable
                    disabled={enviando}
                    onPress={() => setPasoActual(1)}
                    style={({ pressed }) => ({
                      flex: esTelefono ? undefined : 1,

                      width: esTelefono ? "100%" : undefined,

                      minHeight: 54,

                      borderWidth: 1,
                      borderRadius: 16,

                      borderColor,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: pressed
                        ? surfaceSecondaryColor
                        : surfaceColor,

                      opacity: enviando ? 0.5 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 15,
                        color: textSecondaryColor,
                      }}
                    >
                      Anterior
                    </Text>
                  </Pressable>

                  <View
                    style={{
                      flex: esTelefono ? undefined : 2,
                      width: esTelefono ? "100%" : undefined,
                    }}
                  >
                    <Button
                      title={enviando ? "Enviando..." : "Enviar solicitud"}
                      variant="primary"
                      onPress={enviarSolicitud}
                      style={{
                        opacity: enviando ? 0.7 : 1,
                      }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ==================================================
              MENSAJE INFERIOR
          ================================================== */}

          <Text
            style={{
              marginTop: 18,

              maxWidth: 620,
              alignSelf: "center",

              fontFamily: "Nunito-Medium",

              fontSize: 12,
              lineHeight: 18,

              textAlign: "center",

              color: textMutedColor,
            }}
          >
            Los campos marcados con * son obligatorios.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
