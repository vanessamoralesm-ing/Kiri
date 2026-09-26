
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  actualizarPerfil,
  cambiarPassword,
  obtenerPerfilCompleto,
  subirFotoPerfil,
} from "@/services/perfil/perfilService";

import type {
  PerfilCompleto,
} from "@/services/perfil/perfilService";

import LogoutModal from "@/components/ui/LogoutModal";

import {
  useThemeMode,
} from "@/contexts/ThemeModeContext";

import type {
  ThemePreference,
} from "@/contexts/ThemeModeContext";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";

// ==========================================================
// CONSTANTES
// ==========================================================

const GENEROS = [
  {
    label: "Femenino",
    value: "femenino",
  },
  {
    label: "Masculino",
    value: "masculino",
  },
  {
    label: "Otro",
    value: "otro",
  },
  {
    label: "Prefiero no decir",
    value: "prefiero_no_decir",
  },
];

const FONT = {
  regular: "Nunito-Medium",
  semibold: "Nunito-SemiBold",
  bold: "Nunito-Bold",
};

type Icono = keyof typeof Ionicons.glyphMap;

interface OpcionTema {
  value: ThemePreference;
  title: string;
  description: string;
  icon: Icono;
}

const OPCIONES_TEMA: OpcionTema[] = [
  {
    value: "system",
    title: "Tema del dispositivo",
    description: "Seguir automáticamente el tema del sistema",
    icon: "phone-portrait-outline",
  },
  {
    value: "light",
    title: "Modo claro",
    description: "Mantener siempre la apariencia clara",
    icon: "sunny-outline",
  },
  {
    value: "dark",
    title: "Modo oscuro",
    description: "Mantener siempre la apariencia oscura",
    icon: "moon-outline",
  },
];

// ==========================================================
// PANTALLA PRINCIPAL
// ==========================================================

export default function PerfilScreen() {
  const { width } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const esTelefono = width < 768;

  const esTablet = width >= 768 && width < 1100;

  const esEscritorio = width >= 1100;

  const paddingHorizontal = esEscritorio
    ? 40
    : esTablet
      ? 32
      : 20;

  const anchoDisponible = Math.max(
    0,
    width - paddingHorizontal * 2,
  );

  const anchoContenido = Math.min(
    anchoDisponible,
    esEscritorio ? 1180 : esTablet ? 768 : 600,
  );

  const columnasFormulario = esTelefono ? 1 : 2;

  const paddingInferior = esEscritorio
    ? 56
    : Math.max(insets.bottom + 120, 140);

  // ========================================================
  // TEMA
  // ========================================================

  const {
    themeMode,
    themePreference,
    systemTheme,
    setThemeMode,
  } = useThemeMode();

  const backgroundColor = useThemeColor(
    {},
    "background",
  );

  const surfaceColor = useThemeColor(
    {},
    "surface",
  );

  const surfaceSecondaryColor = useThemeColor(
    {},
    "surfaceSecondary",
  );

  const borderColor = useThemeColor(
    {},
    "border",
  );

  const dividerColor = useThemeColor(
    {},
    "divider",
  );

  const textColor = useThemeColor(
    {},
    "text",
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary",
  );

  const textMutedColor = useThemeColor(
    {},
    "textMuted",
  );

  const primaryColor = useThemeColor(
    {},
    "primary",
  );

  const primarySoftColor = useThemeColor(
    {},
    "primarySoft",
  );

  const secondaryColor = useThemeColor(
    {},
    "secondary",
  );

  const inputBackgroundColor = useThemeColor(
    {},
    "inputBackground",
  );

  const inputBorderColor = useThemeColor(
    {},
    "inputBorder",
  );

  const iconColor = useThemeColor(
    {},
    "icon",
  );

  // ========================================================
  // ESTADOS
  // ========================================================

  const [perfil, setPerfil] =
    useState<PerfilCompleto | null>(null);

  const [nombres, setNombres] = useState("");

  const [apellidos, setApellidos] = useState("");

  const [nombrePreferido, setNombrePreferido] =
    useState("");

  const [telefono, setTelefono] = useState("");

  const [fechaNacimiento, setFechaNacimiento] =
    useState("");

  const [genero, setGenero] = useState("");

  const [mostrarGeneros, setMostrarGeneros] =
    useState(false);

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [nuevaPassword, setNuevaPassword] =
    useState("");

  const [confirmarPassword, setConfirmarPassword] =
    useState("");

  const [verPassword, setVerPassword] =
    useState(false);

  const [verConfirmacion, setVerConfirmacion] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [guardandoPassword, setGuardandoPassword] =
    useState(false);

  const [subiendoFoto, setSubiendoFoto] =
    useState(false);

  const [mostrarLogout, setMostrarLogout] =
    useState(false);

  const [versionFoto, setVersionFoto] =
    useState(0);

  // ========================================================
  // CARGAR PERFIL
  // ========================================================

  const cargarPerfil = useCallback(
    async (mostrarCarga = false) => {
      try {
        if (mostrarCarga) {
          setCargando(true);
        }

        const datos =
          await obtenerPerfilCompleto();

        setPerfil(datos);

        setNombres(datos.nombres ?? "");

        setApellidos(datos.apellidos ?? "");

        setNombrePreferido(
          datos.nombre_preferido ?? "",
        );

        setTelefono(datos.telefono ?? "");

        setFechaNacimiento(
          datos.fecha_nacimiento ?? "",
        );

        setGenero(datos.genero ?? "");
      } catch (error) {
        Alert.alert(
          "No pudimos cargar tu perfil",
          error instanceof Error
            ? error.message
            : "Inténtalo nuevamente.",
        );
      } finally {
        setCargando(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      void cargarPerfil(true);
    }, [cargarPerfil]),
  );

  // ========================================================
  // DATOS DERIVADOS
  // ========================================================

  const esIndependiente =
    perfil?.rol_nombre
      ?.trim()
      .toLowerCase() === "independiente";

  const generoTexto =
    GENEROS.find(
      (item) => item.value === genero,
    )?.label ?? "Selecciona una opción";

  const uriFoto = perfil?.foto_url
    ? `${perfil.foto_url
    }${perfil.foto_url.includes("?")
      ? "&"
      : "?"
    }kiri_avatar_v=${versionFoto}`
    : null;

  // ========================================================
  // GUARDAR CAMBIOS
  // ========================================================

  async function guardarCambios() {
    if (
      !nombres.trim() ||
      !apellidos.trim()
    ) {
      Alert.alert(
        "Datos incompletos",
        "Ingresa tus nombres y apellidos.",
      );

      return;
    }

    if (
      fechaNacimiento &&
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)
    ) {
      Alert.alert(
        "Fecha incorrecta",
        "Utiliza el formato AAAA-MM-DD.",
      );

      return;
    }

    try {
      setGuardando(true);

      await actualizarPerfil({
        nombres,
        apellidos,
        nombre_preferido: nombrePreferido,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        genero,
      });

      await cargarPerfil();

      Alert.alert(
        "Cambios guardados",
        "Tu información fue actualizada correctamente.",
      );
    } catch (error) {
      Alert.alert(
        "No se pudo guardar",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente.",
      );
    } finally {
      setGuardando(false);
    }
  }

  // ========================================================
  // FOTOGRAFÍA
  // ========================================================

  function seleccionarFoto() {
    if (Platform.OS === "web") {
      void abrirGaleria();

      return;
    }

    Alert.alert(
      "Foto de perfil",
      "Selecciona una opción",
      [
        {
          text: "Cámara",
          onPress: () => {
            void tomarFoto();
          },
        },
        {
          text: "Galería",
          onPress: () => {
            void abrirGaleria();
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
    );
  }

  async function tomarFoto() {
    try {
      const permiso =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permiso.granted) {
        Alert.alert(
          "Permiso necesario",
          "Kiri necesita acceso a la cámara para tomar tu foto.",
        );

        return;
      }

      const resultado =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (
        !resultado.canceled &&
        resultado.assets[0]
      ) {
        await guardarFoto(
          resultado.assets[0],
        );
      }
    } catch (error) {
      Alert.alert(
        "No se pudo abrir la cámara",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente.",
      );
    }
  }

  async function abrirGaleria() {
    try {
      const permiso =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        Alert.alert(
          "Permiso necesario",
          "Kiri necesita acceso a tus imágenes para cambiar la foto de perfil.",
        );

        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (
        !resultado.canceled &&
        resultado.assets[0]
      ) {
        await guardarFoto(
          resultado.assets[0],
        );
      }
    } catch (error) {
      Alert.alert(
        "No se pudo abrir la galería",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente.",
      );
    }
  }

  async function guardarFoto(
    asset: ImagePicker.ImagePickerAsset,
  ) {
    try {
      setSubiendoFoto(true);

      await subirFotoPerfil(
        asset.uri,
        asset.mimeType ?? "image/jpeg",
      );

      await cargarPerfil();

      setVersionFoto(
        (actual) => actual + 1,
      );

      Alert.alert(
        "Foto actualizada",
        "Tu foto de perfil fue actualizada.",
      );
    } catch (error) {
      Alert.alert(
        "No se pudo cambiar la foto",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente.",
      );
    } finally {
      setSubiendoFoto(false);
    }
  }

  // ========================================================
  // CONTRASEÑA
  // ========================================================

  async function actualizarPassword() {
    if (
      !nuevaPassword ||
      !confirmarPassword
    ) {
      Alert.alert(
        "Datos incompletos",
        "Completa ambos campos.",
      );

      return;
    }

    if (nuevaPassword.length < 8) {
      Alert.alert(
        "Contraseña muy corta",
        "Utiliza al menos 8 caracteres.",
      );

      return;
    }

    if (
      nuevaPassword !==
      confirmarPassword
    ) {
      Alert.alert(
        "Las contraseñas no coinciden",
        "Verifica ambas contraseñas.",
      );

      return;
    }

    try {
      setGuardandoPassword(true);

      await cambiarPassword(
        nuevaPassword,
      );

      setNuevaPassword("");

      setConfirmarPassword("");

      setMostrarPassword(false);

      Alert.alert(
        "Contraseña actualizada",
        "Tu contraseña fue modificada correctamente.",
      );
    } catch (error) {
      Alert.alert(
        "No se pudo actualizar",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente.",
      );
    } finally {
      setGuardandoPassword(false);
    }
  }

  // ========================================================
  // ESTILOS RESPONSIVE
  // ========================================================

  const tarjetaBase = {
    width: "100%" as const,
    backgroundColor: surfaceColor,
    borderWidth: 1,
    borderColor,
    borderRadius: 18,
  };

  const estiloFilaFormulario = {
    width: "100%" as const,

    flexDirection:
      columnasFormulario === 2
        ? ("row" as const)
        : ("column" as const),

    alignItems: "stretch" as const,

    gap:
      columnasFormulario === 2
        ? 16
        : 0,
  };

  const estiloCampoFormulario = {
    flex:
      columnasFormulario === 2
        ? 1
        : undefined,

    width:
      columnasFormulario === 2
        ? undefined
        : ("100%" as const),

    minWidth: 0,
  };

  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator
          size="large"
          color={primaryColor}
        />

        <Text
          style={{
            marginTop: 14,
            fontFamily: FONT.regular,
            fontSize: 14,
            color: textSecondaryColor,
            textAlign: "center",
          }}
        >
          Preparando tu perfil...
        </Text>
      </View>
    );
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        minWidth: 0,
        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
          alignItems: "center",
          paddingTop: esTelefono ? 22 : 30,
          paddingBottom: paddingInferior,
        }}
      >
        {/* CONTENEDOR CENTRAL */}

        <View
          style={{
            width: anchoContenido,
            maxWidth: 1180,
            alignSelf: "center",
            flexDirection: "column",
            alignItems: "stretch",
            minWidth: 0,
          }}
        >
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginBottom: esTelefono
                ? 26
                : 32,
            }}
          >
            <Text
              style={{
                fontFamily: FONT.bold,
                fontSize: esEscritorio
                  ? 30
                  : 25,
                color: textColor,
                textAlign: "center",
              }}
            >
              Mi perfil
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontFamily: FONT.regular,
                fontSize: esTelefono
                  ? 14
                  : 15,
                lineHeight: 22,
                color: textSecondaryColor,
                textAlign: "center",
              }}
            >
              Administra tu información y tu cuenta
            </Text>
          </View>

          {/* ==================================================
              LAYOUT PRINCIPAL
          ================================================== */}

            disabled={subiendoFoto}

              flexDirection:
                esEscritorio
                  ? "row"
                  : "column",

              alignItems: "stretch",

              gap: esEscritorio
                ? 28
                : 0,
            }}
          >
            {/* ==================================================
                COLUMNA IZQUIERDA
            ================================================== */}

            <View
              style={{
                width: esEscritorio
                  ? 320
                  : "100%",

                minWidth: 0,

                flexShrink:
                  esEscritorio
                    ? 0
                    : 1,
              }}
            >
              {/* ==============================================
                  FOTO DE PERFIL
              ============================================== */}

              <View
                style={{
                  ...tarjetaBase,

                  alignItems: "center",

                  padding: esEscritorio
                    ? 24
                    : 20,

                  marginBottom: 22,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: esEscritorio
                        ? 124
                        : 112,

                      height: esEscritorio
                        ? 124
                        : 112,

                      position: "relative",

                      marginBottom: 22,
                    }}
                  >
                    {/* AVATAR */}

                    <View
                      style={{
                        width: "100%",
                        height: "100%",

                        borderRadius: 100,

                        borderWidth: 3,

                        borderColor:
                          secondaryColor,

                        backgroundColor:
                          surfaceSecondaryColor,

                        alignItems: "center",

                        justifyContent: "center",

                        overflow: "hidden",
                      }}
                    >
                      {uriFoto ? (
                        <Image
                          key={uriFoto}
                          source={{
                            uri: uriFoto,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="person"
                          size={58}
                          color={primaryColor}
                        />
                      )}
                    </View>

                    {/* CÁMARA */}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={subiendoFoto}
                      onPress={seleccionarFoto}
                      accessibilityRole="button"
                      accessibilityLabel="Cambiar foto de perfil"
                      style={{
                        position: "absolute",

                        right: -3,
                        bottom: -3,

                        width: 40,
                        height: 40,

                        borderRadius: 20,

                        borderWidth: 3,

                        borderColor:
                          surfaceColor,

                        backgroundColor:
                          primaryColor,

                        alignItems: "center",

                        justifyContent: "center",

                        opacity:
                          subiendoFoto
                            ? 0.6
                            : 1,
                      }}
                    >
                      {subiendoFoto ? (
                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                        />
                      ) : (
                        <Ionicons
                          name="camera"
                          size={18}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      fontFamily:
                        FONT.regular,

                      fontSize: 13,

                      lineHeight: 19,

                      color:
                        textSecondaryColor,

                      textAlign: "center",
                    }}
                  >
                    Toca la cámara para cambiar tu foto
                  </Text>
                </View>
              </View>

              {/* ==============================================
                  CUENTA E INSTITUCIÓN
              ============================================== */}

              <TituloSeccion>
                CUENTA E INSTITUCIÓN
              </TituloSeccion>

              <View
                style={{
                  ...tarjetaBase,

                  padding: 17,

                  marginBottom: 24,
                }}
              >
                <FilaInformacion
                  icono="person-circle-outline"
                  color={primaryColor}
                  titulo="Tipo de cuenta"
                  valor={
                    perfil?.rol_nombre ??
                    "Sin rol"
                  }
                />

                <View
                  style={{
                    width: "100%",

                    height: 1,

                    backgroundColor:
                      dividerColor,

                    marginVertical: 16,
                  }}
                />

                <FilaInformacion
                  icono="school-outline"
                  color={secondaryColor}
                  titulo="Institución"
                  valor={
                    perfil?.institucion_nombre ??
                    "Cuenta independiente"
                  }
                />
              </View>

              {/* ==============================================
                  APARIENCIA
              ============================================== */}

              <TituloSeccion>
                APARIENCIA
              </TituloSeccion>

              <View
                accessibilityRole="radiogroup"
                style={{
                  ...tarjetaBase,

                  padding: 16,

                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT.bold,

                    fontSize: 15,

                    color: textColor,
                  }}
                >
                  Tema de la aplicación
                </Text>

                <Text
                  style={{
                    marginTop: 5,

                    marginBottom: 16,

                    fontFamily: FONT.regular,

                    fontSize: 12,

                    lineHeight: 19,

                    color:
                      textSecondaryColor,
                  }}
                >
                  Elige cómo quieres visualizar Kiri.
                  Por defecto utilizamos la apariencia
                  de tu dispositivo.
                </Text>

                {/* OPCIONES DE TEMA */}

                <View
                  style={{
                    width: "100%",

                    gap: 10,
                  }}
                >
                  {OPCIONES_TEMA.map(
                    (opcion) => {
                      const seleccionada =
                        themePreference ===
                        opcion.value;

                      const descripcion =
                        opcion.value ===
                          "system"
                          ? `Seguir el dispositivo (actualmente ${systemTheme ===
                            "dark"
                            ? "oscuro"
                            : "claro"
                          })`
                          : opcion.description;

                      return (
                        <TouchableOpacity
                          key={opcion.value}
                          activeOpacity={0.8}
                          onPress={() =>
                            setThemeMode(
                              opcion.value,
                            )
                          }
                          accessibilityRole="radio"
                          accessibilityLabel={
                            opcion.title
                          }
                          accessibilityState={{
                            checked:
                              seleccionada,
                          }}
                          style={{
                            width: "100%",

                            borderRadius: 15,

                            overflow:
                              "hidden",
                          }}
                        >
                          <View
                            style={{
                              width: "100%",

                              minHeight: 76,

                              paddingHorizontal:
                                12,

                              paddingVertical:
                                12,

                              borderWidth:
                                seleccionada
                                  ? 2
                                  : 1,

                              borderColor:
                                seleccionada
                                  ? primaryColor
                                  : borderColor,

                              borderRadius:
                                15,

                              backgroundColor:
                                seleccionada
                                  ? primarySoftColor
                                  : surfaceSecondaryColor,

                              flexDirection:
                                "row",

                              alignItems:
                                "center",

                              gap: 11,
                            }}
                          >
                            {/* ICONO */}

                            <View
                              style={{
                                width: 42,

                                height: 42,

                                borderRadius:
                                  13,

                                flexShrink: 0,

                                backgroundColor:
                                  surfaceColor,

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",
                              }}
                            >
                              <Ionicons
                                name={
                                  opcion.icon
                                }
                                size={21}
                                color={
                                  primaryColor
                                }
                              />
                            </View>

                            {/* DESCRIPCIÓN */}

                            <View
                              style={{
                                flex: 1,

                                minWidth: 0,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily:
                                    FONT.bold,

                                  fontSize:
                                    14,

                                  lineHeight:
                                    19,

                                  color:
                                    textColor,
                                }}
                              >
                                {
                                  opcion.title
                                }
                              </Text>

                              <Text
                                style={{
                                  marginTop:
                                    3,

                                  fontFamily:
                                    FONT.regular,

                                  fontSize:
                                    12,

                                  lineHeight:
                                    17,

                                  color:
                                    textSecondaryColor,
                                }}
                              >
                                {
                                  descripcion
                                }
                              </Text>
                            </View>

                            {/* SELECCIÓN */}

                            <Ionicons
                              name={
                                seleccionada
                                  ? "radio-button-on"
                                  : "radio-button-off"
                              }
                              size={23}
                              color={
                                seleccionada
                                  ? primaryColor
                                  : textMutedColor
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>

                {/* TEMA ACTIVO */}

                <View
                  style={{
                    width: "100%",

                    marginTop: 16,

                    paddingTop: 13,

                    borderTopWidth: 1,

                    borderTopColor:
                      dividerColor,

                    flexDirection: "row",

                    alignItems: "center",

                    gap: 8,
                  }}
                >
                  <Ionicons
                    name={
                      themeMode === "dark"
                        ? "moon-outline"
                        : "sunny-outline"
                    }
                    size={17}
                    color={primaryColor}
                  />

                  <Text
                    style={{
                      fontFamily:
                        FONT.semibold,

                      fontSize: 12,

                      color:
                        textSecondaryColor,
                    }}
                  >
                    Tema activo:{" "}
                    {themeMode === "dark"
                      ? "Oscuro"
                      : "Claro"}
                  </Text>
                </View>
              </View>

              {/* ==============================================
                  PRIVACIDAD
              ============================================== */}

              <TituloSeccion>
                PRIVACIDAD
              </TituloSeccion>

              <View
                style={{
                  width: "100%",

                  borderWidth: 1,

                  borderColor,

                  borderRadius: 18,

                  backgroundColor:
                    primarySoftColor,

                  padding: 17,

                  marginBottom: 24,

                  flexDirection: "row",

                  alignItems:
                    "flex-start",

                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 44,

                    height: 44,

                    borderRadius: 22,

                    flexShrink: 0,

                    alignItems: "center",

                    justifyContent:
                      "center",

                    backgroundColor:
                      surfaceColor,
                  }}
                >
                  {opcion.label}
                </Text>

                {genero === opcion.value && (
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={23}
                    color={primaryColor}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Campo
          titulo="Teléfono"
          valor={telefono}
          onChange={setTelefono}
          placeholder="Número de teléfono"
          icono="call-outline"
          keyboardType="phone-pad"
        />

                <View
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily:
                        FONT.bold,

                      fontSize: 15,

                      color: textColor,
                    }}
                  >
                    Privacidad de datos
                  </Text>

                  <Text
                    style={{
                      marginTop: 5,

                      fontFamily:
                        FONT.regular,

                      fontSize: 12,

                      lineHeight: 19,

                      color:
                        textSecondaryColor,
                    }}
                  >
                    Tu información personal se mantiene
                    privada y se utiliza para personalizar
                    tu experiencia dentro de Kiri.
                  </Text>
                </View>
              </View>

              {/* ==============================================
                  CERRAR SESIÓN EN ESCRITORIO
              ============================================== */}

              {esEscritorio && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setMostrarLogout(
                      true,
                    )
                  }
                  style={{
                    ...tarjetaBase,

                    minHeight: 54,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    gap: 9,

                    paddingHorizontal:
                      16,
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={21}
                    color={iconColor}
                  />

                  <Text
                    style={{
                      fontFamily:
                        FONT.bold,

                      fontSize: 15,

                      color: textColor,
                    }}
                  >
                    Cerrar sesión
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ==================================================
                COLUMNA DERECHA
            ================================================== */}

            <View
              style={{
                flex: esEscritorio
                  ? 1
                  : undefined,

                width: esEscritorio
                  ? undefined
                  : "100%",

                minWidth: 0,

                flexShrink: 1,
              }}
            >
              {/* ==============================================
                  INFORMACIÓN PERSONAL
              ============================================== */}

              <View
                style={{
                  ...tarjetaBase,

                  padding: esTelefono
                    ? 18
                    : 24,

                  marginBottom: 22,
                }}
              >
                <TituloSeccion
                  sinMargenSuperior
                >
                  INFORMACIÓN PERSONAL
                </TituloSeccion>

                {/* NOMBRES / APELLIDOS */}

                <View
                  style={
                    estiloFilaFormulario
                  }
                >
                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Campo
                      titulo="Nombres"
                      valor={nombres}
                      onChange={
                        setNombres
                      }
                      placeholder="Tus nombres"
                      icono="person-outline"
                    />
                  </View>

                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Campo
                      titulo="Apellidos"
                      valor={
                        apellidos
                      }
                      onChange={
                        setApellidos
                      }
                      placeholder="Tus apellidos"
                      icono="person-outline"
                    />
                  </View>
                </View>

                {/* NOMBRE PREFERIDO / NACIMIENTO */}

                <View
                  style={
                    estiloFilaFormulario
                  }
                >
                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Campo
                      titulo="Nombre preferido"
                      valor={
                        nombrePreferido
                      }
                      onChange={
                        setNombrePreferido
                      }
                      placeholder="¿Cómo quieres que te llamemos?"
                      icono="happy-outline"
                    />
                  </View>

                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Campo
                      titulo="Fecha de nacimiento"
                      valor={
                        fechaNacimiento
                      }
                      onChange={
                        setFechaNacimiento
                      }
                      placeholder="AAAA-MM-DD"
                      icono="calendar-outline"
                      keyboardType="default"
                    />
                  </View>
                </View>

                {/* GÉNERO / TELÉFONO */}

                <View
                  style={{
                    ...estiloFilaFormulario,

                    alignItems:
                      "flex-start",
                  }}
                >
                  {/* GÉNERO */}

                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Text
                      style={{
                        marginBottom:
                          7,

                        fontFamily:
                          FONT.semibold,

                        fontSize: 13,

                        color:
                          textColor,
                      }}
                    >
                      Género
                    </Text>

                    <TouchableOpacity
                      activeOpacity={
                        0.8
                      }
                      onPress={() =>
                        setMostrarGeneros(
                          (actual) =>
                            !actual,
                        )
                      }
                      style={{
                        width:
                          "100%",

                        minHeight:
                          52,

                        borderWidth:
                          1,

                        borderColor:
                          inputBorderColor,

                        borderRadius:
                          14,

                        backgroundColor:
                          inputBackgroundColor,

                        paddingHorizontal:
                          14,

                        flexDirection:
                          "row",

                        alignItems:
                          "center",

                        gap: 10,
                      }}
                    >
                      <Ionicons
                        name="people-outline"
                        size={19}
                        color={
                          primaryColor
                        }
                      />

                      <Text
                        numberOfLines={
                          1
                        }
                        style={{
                          flex: 1,

                          minWidth:
                            0,

                          fontFamily:
                            FONT.regular,

                          fontSize:
                            14,

                          color:
                            textColor,
                        }}
                      >
                        {
                          generoTexto
                        }
                      </Text>

                      <Ionicons
                        name={
                          mostrarGeneros
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={18}
                        color={
                          iconColor
                        }
                      />
                    </TouchableOpacity>

                    {/* LISTA DE GÉNEROS */}

                    {mostrarGeneros && (
                      <View
                        style={{
                          width:
                            "100%",

                          marginTop:
                            7,

                          marginBottom:
                            16,

                          backgroundColor:
                            surfaceColor,

                          borderWidth:
                            1,

                          borderColor,

                          borderRadius:
                            14,

                          overflow:
                            "hidden",
                        }}
                      >
                        {GENEROS.map(
                          (
                            opcion,
                            index,
                          ) => (
                            <TouchableOpacity
                              key={
                                opcion.value
                              }
                              activeOpacity={
                                0.75
                              }
                              onPress={() => {
                                setGenero(
                                  opcion.value,
                                );

                                setMostrarGeneros(
                                  false,
                                );
                              }}
                              style={{
                                minHeight:
                                  47,

                                paddingHorizontal:
                                  14,

                                flexDirection:
                                  "row",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "space-between",

                                borderBottomWidth:
                                  index ===
                                    GENEROS.length -
                                    1
                                    ? 0
                                    : 1,

                                borderBottomColor:
                                  dividerColor,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily:
                                    FONT.regular,

                                  fontSize:
                                    14,

                                  color:
                                    textColor,
                                }}
                              >
                                {
                                  opcion.label
                                }
                              </Text>

                              {genero ===
                                opcion.value && (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color={
                                      secondaryColor
                                    }
                                  />
                                )}
                            </TouchableOpacity>
                          ),
                        )}
                      </View>
                    )}
                  </View>

                  {/* TELÉFONO */}

                  <View
                    style={
                      estiloCampoFormulario
                    }
                  >
                    <Campo
                      titulo="Teléfono"
                      valor={
                        telefono
                      }
                      onChange={
                        setTelefono
                      }
                      placeholder="Número de teléfono"
                      icono="call-outline"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              {/* ==============================================
                  CUENTA
              ============================================== */}

              <View
                style={{
                  ...tarjetaBase,

                  padding: esTelefono
                    ? 18
                    : 24,

                  marginBottom: 22,
                }}
              >
                <TituloSeccion
                  sinMargenSuperior
                >
                  CUENTA
                </TituloSeccion>

              <View style={styles.flex}>
                <Text
                  style={{
                    marginBottom: 7,

                    fontFamily:
                      FONT.semibold,

                    fontSize: 13,

                    color: textColor,
                  }}
                >
                  Cambiar contraseña
                </Text>

                <View
                  style={{
                    width: "100%",

                    minHeight: 52,

                    borderWidth: 1,

                    borderColor,

                    borderRadius: 14,

                    backgroundColor:
                      surfaceSecondaryColor,

                    paddingHorizontal:
                      14,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap: 10,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={19}
                    color={
                      primaryColor
                    }
                  />

                  <Text
                    numberOfLines={
                      1
                    }
                    style={{
                      flex: 1,

                      minWidth: 0,

                      fontFamily:
                        FONT.regular,

                      fontSize: 14,

                      color:
                        textSecondaryColor,
                    }}
                  >
                    {perfil?.correo ??
                      ""}
                  </Text>

                  <Ionicons
                    name="lock-closed-outline"
                    size={17}
                    color={
                      iconColor
                    }
                  />
                </View>
              </View>

              {/* ==============================================
                  SEGURIDAD
              ============================================== */}

              {esIndependiente && (
                <View
                  style={{
                    ...tarjetaBase,

                    padding: esTelefono
                      ? 18
                      : 24,

                    marginBottom:
                      22,
                  }}
                >
                  <TituloSeccion
                    sinMargenSuperior
                  >
                    SEGURIDAD
                  </TituloSeccion>

                  <TouchableOpacity
                    activeOpacity={
                      0.8
                    }
                    onPress={() =>
                      setMostrarPassword(
                        (actual) =>
                          !actual,
                      )
                    }
                    style={{
                      width: "100%",

                      minHeight: 75,

                      padding: 14,

                      backgroundColor:
                        surfaceSecondaryColor,

                      borderRadius: 15,

                      flexDirection:
                        "row",

                      alignItems:
                        "center",

                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 43,

                        height: 43,

                        borderRadius:
                          22,

                        backgroundColor:
                          primarySoftColor,

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        flexShrink:
                          0,
                      }}
                    >
                      <Ionicons
                        name="key-outline"
                        size={21}
                        color={
                          primaryColor
                        }
                      />

                    <View
                      style={{
                        flex: 1,

                        minWidth:
                          0,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily:
                            FONT.bold,

                          fontSize:
                            15,

                          color:
                            textColor,
                        }}
                      >
                        Actualizar contraseña
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

                      <Text
                        style={{
                          marginTop:
                            3,

                          fontFamily:
                            FONT.regular,

                          fontSize:
                            12,

                          lineHeight:
                            18,

                          color:
                            textSecondaryColor,
                        }}
                      >
                        Actualiza la contraseña de tu cuenta
                      </Text>
                    </View>

                    <Ionicons
                      name={
                        mostrarPassword
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={19}
                      color={
                        iconColor
                      }
                    />
                  </TouchableOpacity>

                  {/* FORMULARIO DE CONTRASEÑA */}

                  {mostrarPassword && (
                    <View
                      style={{
                        width: "100%",

                        marginTop:
                          14,

                        padding:
                          esTelefono
                            ? 14
                            : 18,

                        borderWidth:
                          1,

                        borderColor,

                        borderRadius:
                          15,

                        backgroundColor:
                          surfaceColor,
                      }}
                    >
                      <PasswordInput
                        titulo="Nueva contraseña"
                        valor={
                          nuevaPassword
                        }
                        onChange={
                          setNuevaPassword
                        }
                        visible={
                          verPassword
                        }
                        onToggle={() =>
                          setVerPassword(
                            (actual) =>
                              !actual,
                          )
                        }
                      />

                      <PasswordInput
                        titulo="Confirmar contraseña"
                        valor={
                          confirmarPassword
                        }
                        onChange={
                          setConfirmarPassword
                        }
                        visible={
                          verConfirmacion
                        }
                        onToggle={() =>
                          setVerConfirmacion(
                            (actual) =>
                              !actual,
                          )
                        }
                      />

                      <TouchableOpacity
                        activeOpacity={
                          0.8
                        }
                        disabled={
                          guardandoPassword
                        }
                        onPress={
                          actualizarPassword
                        }
                        style={{
                          width:
                            "100%",

                          minHeight:
                            50,

                          borderRadius:
                            14,

                          backgroundColor:
                            primaryColor,

                          flexDirection:
                            "row",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          gap: 9,

                          paddingHorizontal:
                            12,

                          opacity:
                            guardandoPassword
                              ? 0.65
                              : 1,
                        }}
                      >
                        {guardandoPassword ? (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                          />
                        ) : (
                          <>
                            <Ionicons
                              name="shield-checkmark-outline"
                              size={19}
                              color="#FFFFFF"
                            />

                            <Text
                              style={{
                                fontFamily:
                                  FONT.bold,

                                fontSize:
                                  14,

                                color:
                                  "#FFFFFF",
                              }}
                            >
                              Actualizar contraseña
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* ==============================================
                  GUARDAR CAMBIOS
              ============================================== */}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={guardando}
                onPress={
                  guardarCambios
                }
                style={{
                  width:
                    esEscritorio
                      ? 320
                      : "100%",

                  alignSelf:
                    esEscritorio
                      ? "flex-end"
                      : "stretch",

                  minHeight: 54,

                  borderRadius: 15,

                  backgroundColor:
                    primaryColor,

                  paddingHorizontal:
                    18,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap: 10,

                  opacity:
                    guardando
                      ? 0.65
                      : 1,
                }}
              >
                {guardando ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={{
                        fontFamily:
                          FONT.bold,

                        fontSize: 15,

                        color:
                          "#FFFFFF",
                      }}
                    >
                      Guardar cambios
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* ==============================================
                  CERRAR SESIÓN MÓVIL / TABLET
              ============================================== */}

              {!esEscritorio && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setMostrarLogout(
                      true,
                    )
                  }
                  style={{
                    ...tarjetaBase,

                    minHeight: 54,

                    marginTop: 14,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    gap: 9,

                    paddingHorizontal:
                      16,
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={21}
                    color={iconColor}
                  />

                  <Text
                    style={{
                      fontFamily:
                        FONT.bold,

                      fontSize: 15,

                      color: textColor,
                    }}
                  >
                    Cerrar sesión
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ==================================================
          MODAL DE CIERRE DE SESIÓN
      ================================================== */}

      <LogoutModal
        visible={mostrarLogout}
        onClose={() =>
          setMostrarLogout(false)
        }
      />
    </View>
  );
}

// ==========================================================
// CAMPO DE TEXTO
// ==========================================================

type CampoProps = {
  titulo: string;
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
  icono: Icono;
  keyboardType?: "default" | "phone-pad";
};

function Campo({
  titulo,
  valor,
  onChange,
  placeholder,
  icono,
  keyboardType = "default",
}: CampoProps) {
  const textColor = useThemeColor(
    {},
    "text",
  );

  const primaryColor = useThemeColor(
    {},
    "primary",
  );

  const inputBackgroundColor = useThemeColor(
    {},
    "inputBackground",
  );

  const inputBorderColor = useThemeColor(
    {},
    "inputBorder",
  );

  const placeholderColor = useThemeColor(
    {},
    "placeholder",
  );

  return (
    <View
      style={{
        width: "100%",
        minWidth: 0,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          marginBottom: 7,

          fontFamily:
            FONT.semibold,

          fontSize: 13,

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      <View
        style={{
          width: "100%",

          minHeight: 52,

          borderWidth: 1,

          borderColor:
            inputBorderColor,

          borderRadius: 14,

          backgroundColor:
            inputBackgroundColor,

          flexDirection: "row",

          alignItems: "center",

          paddingHorizontal: 14,

          gap: 10,
        }}
      >
        <Ionicons
          name={icono}
          size={19}
          color={primaryColor}
        />

        <TextInput
          value={valor}

          onChangeText={onChange}

          placeholder={placeholder}
          placeholderTextColor={
            placeholderColor
          }
          selectionColor={primaryColor}

          keyboardType={keyboardType}
          style={{
            flex: 1,

            minWidth: 0,

            minHeight: 50,

            fontFamily:
              FONT.regular,

            fontSize: 14,

            color: textColor,

            paddingVertical: 8,
          }}
        />
      </View>
    </View>
  );
}

// ==========================================================
// CAMPO DE CONTRASEÑA
// ==========================================================

type PasswordProps = {
  titulo: string;
  valor: string;
  onChange: (valor: string) => void;
  visible: boolean;
  onToggle: () => void;
};

function PasswordInput({
  titulo,
  valor,
  onChange,
  visible,
  onToggle,
}: PasswordProps) {
  const textColor = useThemeColor(
    {},
    "text",
  );

  const iconColor = useThemeColor(
    {},
    "icon",
  );

  const primaryColor = useThemeColor(
    {},
    "primary",
  );

  const inputBackgroundColor = useThemeColor(
    {},
    "inputBackground",
  );

  const inputBorderColor = useThemeColor(
    {},
    "inputBorder",
  );

  const placeholderColor = useThemeColor(
    {},
    "placeholder",
  );

  return (
    <View
      style={{
        width: "100%",
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          marginBottom: 7,

          fontFamily:
            FONT.semibold,

          fontSize: 13,

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      <View
        style={{
          width: "100%",

          minHeight: 52,

          borderWidth: 1,

          borderColor:
            inputBorderColor,

          borderRadius: 14,

          backgroundColor:
            inputBackgroundColor,

          paddingHorizontal: 14,

          flexDirection: "row",

          alignItems: "center",

          gap: 10,
        }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color={primaryColor}
        />

        <TextInput
          value={valor}

          onChangeText={onChange}

          secureTextEntry={!visible}

          placeholder="••••••••"
          placeholderTextColor={
            placeholderColor
          }
          selectionColor={primaryColor}

          autoCapitalize="none"
          style={{
            flex: 1,

            minWidth: 0,

            minHeight: 50,

            fontFamily:
              FONT.regular,

            fontSize: 14,

            color: textColor,

            paddingVertical: 8,
          }}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggle}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={
            visible
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          style={{
            width: 30,

            height: 36,

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <Ionicons
            name={
              visible
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={19}

            color={iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==========================================================
// FILA DE INFORMACIÓN
// ==========================================================

type FilaProps = {
  icono: Icono;
  color: string;
  titulo: string;
  valor: string;
};

function FilaInformacion({
  icono,
  color,
  titulo,
  valor,
}: FilaProps) {
  const textColor = useThemeColor(
    {},
    "text",
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary",
  );

  const surfaceSecondaryColor = useThemeColor(
    {},
    "surfaceSecondary",
  );

  return (
    <View
      style={{
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        gap: 13,
      }}
    >
      <View
        style={{
          width: 44,

          height: 44,

          borderRadius: 22,

          flexShrink: 0,

          backgroundColor:
            surfaceSecondaryColor,

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Ionicons
          name={icono}
          size={22}
          color={color}
        />
      </View>

      <View
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Text
          style={{
            fontFamily:
              FONT.regular,

            fontSize: 12,

            color:
              textSecondaryColor,
          }}
        >
          {titulo}
        </Text>

        <Text
          style={{
            marginTop: 3,

            fontFamily:
              FONT.bold,

            fontSize: 15,

            lineHeight: 21,

            color: textColor,
          }}
        >
          {valor}
        </Text>
      </View>
    </View>
  );
}

// ==========================================================
// TÍTULO DE SECCIÓN
// ==========================================================

function TituloSeccion({
  children,
  sinMargenSuperior = false,
}: {
  children: React.ReactNode;
  sinMargenSuperior?: boolean;
}) {
  const primaryColor = useThemeColor(
    {},
    "primary",
  );

  return (
    <Text
      style={{
        width: "100%",

        marginTop:
          sinMargenSuperior
            ? 0
            : 7,

        marginBottom: 14,

        fontFamily: FONT.bold,

        fontSize: 12,

        letterSpacing: 0.8,

        color: primaryColor,
      }}
    >
      {children}
    </Text>
  );
}