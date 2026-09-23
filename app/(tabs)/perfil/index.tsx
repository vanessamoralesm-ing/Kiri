
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

import { useThemeColor } from "@/hooks/use-theme-color";

import { useThemeMode } from "@/contexts/ThemeModeContext";

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

  const movil = width < 600;

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

    Alert.alert("Foto de perfil", "Selecciona una opción", [
      {
        text: "Cámara",

        onPress: tomarFoto,
      },

      {
        text: "Galería",

        onPress: abrirGaleria,
      },

      {
        text: "Cancelar",

        style: "cancel",
      },
    ]);
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
    <SafeAreaView
      edges={["top"]}

      style={[
        styles.pantalla,

        {
          backgroundColor,
        },
      ]}
    >
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

        contentContainerStyle={[
          styles.scroll,

          movil && {
            paddingBottom: Math.max(
              insets.bottom + 120,

              145,
            ),
          },
        ]}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <Text
            style={[
              styles.titulo,

              {
                color: textColor,
              },
            ]}
          >
            Mi perfil
          </Text>

          <Text
            style={[
              styles.subtitulo,

              {
                color: textSecondaryColor,
              },
            ]}
          >
            Administra tu información y tu cuenta
          </Text>
        </View>

        {/* =================================================
            FOTO
        ================================================= */}

        <View style={styles.fotoZona}>
          <View
            style={[
              styles.avatar,

              {
                backgroundColor: surfaceSecondaryColor,

                borderColor,
              },
            ]}
          >
            {perfil?.foto_url ? (
              <Image
                source={{
                  uri: perfil.foto_url,
                }}

                style={styles.foto}
              />
            ) : (
              <Ionicons name="person" size={54} color={primaryColor} />
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.75}

            disabled={subiendoFoto}

            onPress={seleccionarFoto}

            style={[
              styles.camara,

              subiendoFoto && styles.deshabilitado,

              {
                backgroundColor: primaryColor,
              },
            ]}
          >
            {subiendoFoto ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="camera" size={17} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <Text
            style={[
              styles.cambiarFoto,

              {
                color: textSecondaryColor,
              },
            ]}
          >
            Toca la cámara para cambiar tu foto
          </Text>
        </View>

        {/* =================================================
            INFORMACIÓN PERSONAL
        ================================================= */}

        <TituloSeccion>INFORMACIÓN PERSONAL</TituloSeccion>

        <Campo
          titulo="Nombres"
          valor={nombres}
          onChange={setNombres}
          placeholder="Tus nombres"
          icono="person-outline"
        />

        <Campo
          titulo="Apellidos"
          valor={apellidos}
          onChange={setApellidos}
          placeholder="Tus apellidos"
          icono="person-outline"
        />

        <Campo
          titulo="Nombre preferido"
          valor={nombrePreferido}
          onChange={setNombrePreferido}
          placeholder="¿Cómo quieres que te llamemos?"
          icono="happy-outline"
        />

        <Campo
          titulo="Fecha de nacimiento"
          valor={fechaNacimiento}
          onChange={setFechaNacimiento}
          placeholder="AAAA-MM-DD"
          icono="calendar-outline"
        />

        {/* Género */}

        <Text
          style={[
            styles.label,

            {
              color: textColor,
            },
          ]}
        >
          Género
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}

          onPress={() => setMostrarGeneros((actual) => !actual)}

          style={[
            styles.input,

            {
              backgroundColor: inputBackgroundColor,

              borderColor: inputBorderColor,
            },
          ]}
        >
          <Ionicons name="people-outline" size={19} color={primaryColor} />

          <Text
            style={[
              styles.inputTexto,

              {
                color: textColor,
              },
            ]}
          >
            {generoTexto}
          </Text>

          <Ionicons
            name={mostrarGeneros ? "chevron-up" : "chevron-down"}

            size={18}

            color={iconColor}
          />
        </TouchableOpacity>

        {mostrarGeneros && (
          <View
            style={[
              styles.listaGenero,

              {
                backgroundColor: surfaceColor,

                borderColor,
              },
            ]}
          >
            {GENEROS.map((opcion) => (
              <TouchableOpacity
                key={opcion.value}

                activeOpacity={0.7}

                onPress={() => {
                  setGenero(opcion.value);

                  setMostrarGeneros(false);
                }}

                style={[
                  styles.opcionGenero,

                  {
                    borderBottomColor: dividerColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textoGenero,

                    {
                      color: textColor,
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
                  {opcion.label}
                </Text>

                {genero === opcion.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={secondaryColor}
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

        {/* =================================================
            CUENTA
        ================================================= */}

        <TituloSeccion>CUENTA</TituloSeccion>

        <Text
          style={[
            styles.label,

            {
              color: textColor,
            },
          ]}
        >
          Correo electrónico
        </Text>

        <View
          style={[
            styles.input,
            styles.bloqueado,

            {
              backgroundColor: surfaceSecondaryColor,

              borderColor,
            },
          ]}
        >
          <Ionicons name="mail-outline" size={19} color={primaryColor} />

          <Text
            numberOfLines={1}

            style={[
              styles.inputTexto,

              {
                color: textSecondaryColor,
              },
            ]}
          >
            {perfil?.correo}
          </Text>

          <Ionicons name="lock-closed-outline" size={17} color={iconColor} />
        </View>

        {/* =================================================
            CUENTA E INSTITUCIÓN
        ================================================= */}

        <TituloSeccion>CUENTA E INSTITUCIÓN</TituloSeccion>

        <View
          style={[
            styles.tarjetaCuenta,

            {
              backgroundColor: surfaceColor,

              borderColor,
            },
          ]}
        >
          <FilaInformacion
            icono="person-circle-outline"

            color={primaryColor}

            titulo="Tipo de cuenta"

            valor={perfil?.rol_nombre ?? "Sin rol"}
          />

          <View
            style={[
              styles.separador,

              {
                backgroundColor: dividerColor,
              },
            ]}
          />

          <FilaInformacion
            icono="school-outline"

            color={secondaryColor}

            titulo="Institución"

            valor={perfil?.institucion_nombre ?? "Cuenta independiente"}
          />
        </View>

        {/* =================================================
            APARIENCIA
        ================================================= */}

        <TituloSeccion>APARIENCIA</TituloSeccion>

        <View
          style={[
            styles.opcionSeguridad,

            {
              backgroundColor: surfaceColor,

              borderColor,
            },
          ]}
        >
          {/* Icono del tema */}

          <View
            style={[
              styles.iconoCuenta,

              {
                backgroundColor: primarySoftColor,
              },
            ]}
          >
            <Ionicons
              name={isDarkMode ? "moon" : "sunny-outline"}

              size={21}

              color={primaryColor}
            />
          </View>

          {/* Información */}

          <View style={styles.flex}>
            <Text
              style={[
                styles.valorCuenta,

                {
                  color: textColor,
                },
              ]}
            >
              Modo oscuro
            </Text>

            <Text
              style={[
                styles.labelCuenta,

                {
                  color: textSecondaryColor,
                },
              ]}
            >
              {isDarkMode
                ? "El tema oscuro está activado"
                : "El tema claro está activado"}
            </Text>
          </View>

          {/* Interruptor */}

          <Switch
            value={isDarkMode}

            onValueChange={toggleDarkMode}

            trackColor={{
              false: surfaceSecondaryColor,

              true: primarySoftColor,
            }}

            thumbColor={isDarkMode ? primaryColor : textMutedColor}

            ios_backgroundColor={surfaceSecondaryColor}
          />
        </View>

        {/* =================================================
            SEGURIDAD
        ================================================= */}

        {esIndependiente && (
          <>
            <TituloSeccion>SEGURIDAD</TituloSeccion>

            <TouchableOpacity
              activeOpacity={0.75}

              onPress={() => setMostrarPassword((actual) => !actual)}

              style={[
                styles.opcionSeguridad,

                {
                  backgroundColor: surfaceColor,

                  borderColor,
                },
              ]}
            >
              <View
                style={[
                  styles.iconoCuenta,

                  {
                    backgroundColor: primarySoftColor,
                  },
                ]}
              >
                <Ionicons name="key-outline" size={20} color={primaryColor} />
              </View>

              <View style={styles.flex}>
                <Text
                  style={[
                    styles.valorCuenta,

                    fontFamily:
                      FONT.semibold,

                    fontSize: 13,

                    color: textColor,
                  }}
                >
                  Cambiar contraseña
                </Text>

                <Text
                  style={[
                    styles.labelCuenta,

                    {
                      color: textSecondaryColor,
                    },
                  ]}
                >
                  Actualiza la contraseña de tu cuenta
                </Text>
              </View>

              <Ionicons
                name={mostrarPassword ? "chevron-up" : "chevron-down"}

                size={19}

                color={iconColor}
              />
            </TouchableOpacity>

            {mostrarPassword && (
              <View
                style={[
                  styles.passwordCard,

                  {
                    backgroundColor: surfaceColor,

                    borderColor,
                  },
                ]}
              >
                <PasswordInput
                  titulo="Nueva contraseña"

                  valor={nuevaPassword}

                  onChange={setNuevaPassword}

                  visible={verPassword}

                  onToggle={() => setVerPassword((actual) => !actual)}
                />

                <PasswordInput
                  titulo="Confirmar contraseña"

                  valor={confirmarPassword}

                  onChange={setConfirmarPassword}

                  visible={verConfirmacion}

                  onToggle={() => setVerConfirmacion((actual) => !actual)}
                />

                <TouchableOpacity
                  activeOpacity={0.8}

                  disabled={guardandoPassword}

                  onPress={actualizarPassword}

                  style={[
                    styles.botonPassword,

                    guardandoPassword && styles.deshabilitado,

                    {
                      backgroundColor: primaryColor,
                    },
                  ]}
                >
                  {guardandoPassword ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text
                        style={[
                          styles.textoBotonPrincipal,

                          {
                            color: "#FFFFFF",
                          },
                        ]}
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

        {/* =================================================
            PRIVACIDAD
        ================================================= */}

        <TituloSeccion>PRIVACIDAD</TituloSeccion>

        <View
          style={[
            styles.privacidad,

            {
              backgroundColor: primarySoftColor,

              borderColor,
            },
          ]}
        >
          <View
            style={[
              styles.privacidadIcono,

              {
                backgroundColor: surfaceColor,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={24}

              color={primaryColor}
            />
          </View>

          <View style={styles.flex}>
            <Text
              style={[
                styles.privacidadTitulo,

                {
                  color: textColor,
                },
              ]}
            >
              Privacidad de datos
            </Text>

            <Text
              style={[
                styles.privacidadTexto,

                {
                  color: textSecondaryColor,
                },
              ]}
            >
              Tu información personal se mantiene privada y se utiliza para
              personalizar tu experiencia dentro de Kiri.
            </Text>
          </View>
        </View>

        {/* =================================================
            GUARDAR
        ================================================= */}

        <TouchableOpacity
          activeOpacity={0.8}

          disabled={guardando}

          onPress={guardarCambios}

          style={[
            styles.botonGuardar,

            guardando && styles.deshabilitado,

            {
              backgroundColor: primaryColor,
            },
          ]}
        >
          {guardando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />

              <Text
                style={[
                  styles.textoBotonPrincipal,

                  {
                    color: "#FFFFFF",
                  },
                ]}
              >
                Guardar cambios
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* =================================================
            CERRAR SESIÓN
        ================================================= */}

        <TouchableOpacity
          activeOpacity={0.75}

          onPress={() => setMostrarLogout(true)}

          style={[
            styles.botonSalir,

            {
              backgroundColor: surfaceColor,

              borderColor,
            },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={21}

            color={iconColor}
          />

          <Text
            style={[
              styles.textoSalir,

              {
                color: textColor,
              },
            ]}
          >
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ==================================================
          MODAL DE CIERRE DE SESIÓN
      ================================================== */}

      <LogoutModal
        visible={mostrarLogout}

        onClose={() => setMostrarLogout(false)}
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

          placeholderTextColor={placeholderColor}

          selectionColor={primaryColor}

          keyboardType={keyboardType}

          style={[
            styles.textInput,

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

          placeholderTextColor={placeholderColor}

          selectionColor={primaryColor}

          autoCapitalize="none"

          style={[
            styles.textInput,

            paddingVertical: 8,
          }}
        />

        <TouchableOpacity
          activeOpacity={0.7}

          onPress={onToggle}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}

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

          size={21}

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