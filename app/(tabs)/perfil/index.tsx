import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import {
  actualizarPerfil,
  cambiarPassword,
  obtenerPerfilCompleto,
  PerfilCompleto,
  subirFotoPerfil,
} from "@/services/perfil/perfilService";

import LogoutModal from "@/components/ui/LogoutModal";

import { styles } from "@/styles/perfil.styles";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeMode } from "@/contexts/ThemeModeContext";

// ==========================================================
// GÉNEROS
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

// ==========================================================
// COMPONENTE
// ==========================================================

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // CONTROL GLOBAL DEL TEMA
  // ========================================================

  const { isDarkMode, toggleDarkMode } = useThemeMode();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const dividerColor = useThemeColor({}, "divider");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const secondaryColor = useThemeColor({}, "secondary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const iconColor = useThemeColor({}, "icon");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? 1180
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  const gapColumnas = esEscritorio ? 28 : 0;

  const paddingBottom = esEscritorio ? 56 : Math.max(insets.bottom + 120, 145);

  // ========================================================
  // ESTADOS
  // ========================================================

  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);

  const [nombres, setNombres] = useState("");

  const [apellidos, setApellidos] = useState("");

  const [nombrePreferido, setNombrePreferido] = useState("");

  const [telefono, setTelefono] = useState("");

  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [genero, setGenero] = useState("");

  const [mostrarGeneros, setMostrarGeneros] = useState(false);

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [nuevaPassword, setNuevaPassword] = useState("");

  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [verPassword, setVerPassword] = useState(false);

  const [verConfirmacion, setVerConfirmacion] = useState(false);

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [mostrarLogout, setMostrarLogout] = useState(false);

  // ========================================================
  // CARGA
  // ========================================================

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, []),
  );

  async function cargarPerfil() {
    try {
      setCargando(true);

      const datos = await obtenerPerfilCompleto();

      setPerfil(datos);

      setNombres(datos.nombres ?? "");

      setApellidos(datos.apellidos ?? "");

      setNombrePreferido(datos.nombre_preferido ?? "");

      setTelefono(datos.telefono ?? "");

      setFechaNacimiento(datos.fecha_nacimiento ?? "");

      setGenero(datos.genero ?? "");
    } catch (error) {
      Alert.alert(
        "No pudimos cargar tu perfil",

        error instanceof Error ? error.message : "Inténtalo nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  }

  // ========================================================
  // DATOS DERIVADOS
  // ========================================================

  const esIndependiente =
    perfil?.rol_nombre?.trim().toLowerCase() === "independiente";

  const generoTexto =
    GENEROS.find((item) => item.value === genero)?.label ??
    "Selecciona una opción";

  // ========================================================
  // GUARDAR PERFIL
  // ========================================================

  async function guardarCambios() {
    if (!nombres.trim() || !apellidos.trim()) {
      Alert.alert("Datos incompletos", "Ingresa tus nombres y apellidos.");

      return;
    }

    if (fechaNacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
      Alert.alert("Fecha incorrecta", "Utiliza el formato AAAA-MM-DD.");

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

        error instanceof Error ? error.message : "Inténtalo nuevamente.",
      );
    } finally {
      setGuardando(false);
    }
  }

  // ========================================================
  // FOTO
  // ========================================================

  function seleccionarFoto() {
    if (Platform.OS === "web") {
      abrirGaleria();

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
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Kiri necesita acceso a la cámara para tomar tu foto.",
      );

      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.8,
    });

    if (resultado.canceled) {
      return;
    }

    await guardarFoto(resultado.assets[0]);
  }

  async function abrirGaleria() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Kiri necesita acceso a tus imágenes para cambiar la foto de perfil.",
      );

      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],

      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.8,
    });

    if (resultado.canceled) {
      return;
    }

    await guardarFoto(resultado.assets[0]);
  }

  async function guardarFoto(asset: ImagePicker.ImagePickerAsset) {
    try {
      setSubiendoFoto(true);

      await subirFotoPerfil(
        asset.uri,

        asset.mimeType ?? "image/jpeg",
      );

      await cargarPerfil();

      Alert.alert("Foto actualizada", "Tu foto de perfil fue actualizada.");
    } catch (error) {
      Alert.alert(
        "No se pudo cambiar la foto",

        error instanceof Error ? error.message : "Inténtalo nuevamente.",
      );
    } finally {
      setSubiendoFoto(false);
    }
  }

  // ========================================================
  // CONTRASEÑA
  // ========================================================

  async function actualizarPassword() {
    if (!nuevaPassword || !confirmarPassword) {
      Alert.alert("Datos incompletos", "Completa ambos campos.");

      return;
    }

    if (nuevaPassword.length < 8) {
      Alert.alert("Contraseña muy corta", "Utiliza al menos 8 caracteres.");

      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      Alert.alert(
        "Las contraseñas no coinciden",
        "Verifica ambas contraseñas.",
      );

      return;
    }

    try {
      setGuardandoPassword(true);

      await cambiarPassword(nuevaPassword);

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

        error instanceof Error ? error.message : "Inténtalo nuevamente.",
      );
    } finally {
      setGuardandoPassword(false);
    }
  }

  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {
    return (
      <SafeAreaView
        style={[
          styles.pantalla,

          {
            backgroundColor,
          },
        ]}
      >
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={primaryColor} />

          <Text
            style={[
              styles.textoCargando,

              {
                color: textSecondaryColor,
              },
            ]}
          >
            Preparando tu perfil...
          </Text>
        </View>
      </SafeAreaView>
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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,

          {
            paddingBottom,
          },
        ]}
      >
        {/* =================================================
            CONTENEDOR RESPONSIVE
        ================================================= */}

        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={[
              styles.header,

              {
                marginBottom: esEscritorio ? 28 : 22,
              },
            ]}
          >
            <Text
              style={[
                styles.titulo,

                {
                  color: textColor,

                  fontSize: esEscritorio ? 30 : undefined,
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

                  marginTop: 4,
                },
              ]}
            >
              Administra tu información y tu cuenta
            </Text>
          </View>

          {/* =================================================
              LAYOUT PRINCIPAL
          ================================================= */}

          <View
            style={{
              width: "100%",

              flexDirection: esEscritorio ? "row" : "column",

              alignItems: esEscritorio ? "flex-start" : "stretch",

              gap: gapColumnas,
            }}
          >
            {/* =================================================
                COLUMNA IZQUIERDA
            ================================================= */}

            <View
              style={{
                width: esEscritorio ? 320 : "100%",

                flexShrink: 0,
              }}
            >
              {/* ===============================================
                  FOTO
              =============================================== */}

              <View
                style={{
                  width: "100%",

                  borderWidth: esEscritorio ? 1 : 0,

                  borderColor,

                  borderRadius: esEscritorio ? 24 : 0,

                  backgroundColor: esEscritorio ? surfaceColor : "transparent",

                  padding: esEscritorio ? 24 : 0,

                  marginBottom: 24,
                }}
              >
                <View
                  style={[
                    styles.fotoZona,

                    {
                      marginTop: 0,

                      marginBottom: esEscritorio ? 0 : undefined,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.avatar,

                      {
                        backgroundColor: surfaceSecondaryColor,

                        borderColor,

                        width: esEscritorio ? 124 : undefined,

                        height: esEscritorio ? 124 : undefined,

                        borderRadius: esEscritorio ? 62 : undefined,
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
                      <Ionicons
                        name="person"
                        size={esEscritorio ? 58 : 54}
                        color={primaryColor}
                      />
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

                        textAlign: "center",
                      },
                    ]}
                  >
                    Toca la cámara para cambiar tu foto
                  </Text>
                </View>
              </View>

              {/* ===============================================
                  CUENTA E INSTITUCIÓN
              =============================================== */}

              <TituloSeccion>CUENTA E INSTITUCIÓN</TituloSeccion>

              <View
                style={[
                  styles.tarjetaCuenta,

                  {
                    backgroundColor: surfaceColor,

                    borderColor,

                    marginBottom: 24,
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

              {/* ===============================================
                  APARIENCIA
              =============================================== */}

              <TituloSeccion>APARIENCIA</TituloSeccion>

              <View
                style={[
                  styles.opcionSeguridad,

                  {
                    backgroundColor: surfaceColor,

                    borderColor,

                    marginBottom: 24,
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
                  <Ionicons
                    name={isDarkMode ? "moon" : "sunny-outline"}
                    size={21}
                    color={primaryColor}
                  />
                </View>

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

              {/* ===============================================
                  PRIVACIDAD
              =============================================== */}

              <TituloSeccion>PRIVACIDAD</TituloSeccion>

              <View
                style={[
                  styles.privacidad,

                  {
                    backgroundColor: primarySoftColor,

                    borderColor,

                    marginBottom: 24,
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
                    Tu información personal se mantiene privada y se utiliza
                    para personalizar tu experiencia dentro de Kiri.
                  </Text>
                </View>
              </View>

              {/* ===============================================
                  CERRAR SESIÓN - DESKTOP
              =============================================== */}

              {esEscritorio && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setMostrarLogout(true)}
                  style={[
                    styles.botonSalir,

                    {
                      backgroundColor: surfaceColor,

                      borderColor,

                      marginTop: 0,
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
              )}
            </View>

            {/* =================================================
                COLUMNA DERECHA
            ================================================= */}

            <View
              style={{
                flex: esEscritorio ? 1 : undefined,

                width: esEscritorio ? undefined : "100%",

                minWidth: 0,
              }}
            >
              {/* ===============================================
                  INFORMACIÓN PERSONAL
              =============================================== */}

              <View
                style={{
                  width: "100%",

                  backgroundColor: esEscritorio ? surfaceColor : "transparent",

                  borderWidth: esEscritorio ? 1 : 0,

                  borderColor,

                  borderRadius: esEscritorio ? 24 : 0,

                  padding: esEscritorio ? 24 : 0,

                  marginBottom: 24,
                }}
              >
                <TituloSeccion>INFORMACIÓN PERSONAL</TituloSeccion>

                {/* =============================================
                    FILA 1
                ============================================= */}

                <View
                  style={{
                    flexDirection: esEscritorio ? "row" : "column",

                    gap: esEscritorio ? 18 : 0,
                  }}
                >
                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                    }}
                  >
                    <Campo
                      titulo="Nombres"
                      valor={nombres}
                      onChange={setNombres}
                      placeholder="Tus nombres"
                      icono="person-outline"
                    />
                  </View>

                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                    }}
                  >
                    <Campo
                      titulo="Apellidos"
                      valor={apellidos}
                      onChange={setApellidos}
                      placeholder="Tus apellidos"
                      icono="person-outline"
                    />
                  </View>
                </View>

                {/* =============================================
                    FILA 2
                ============================================= */}

                <View
                  style={{
                    flexDirection: esEscritorio ? "row" : "column",

                    gap: esEscritorio ? 18 : 0,
                  }}
                >
                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                    }}
                  >
                    <Campo
                      titulo="Nombre preferido"
                      valor={nombrePreferido}
                      onChange={setNombrePreferido}
                      placeholder="¿Cómo quieres que te llamemos?"
                      icono="happy-outline"
                    />
                  </View>

                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,
                    }}
                  >
                    <Campo
                      titulo="Fecha de nacimiento"
                      valor={fechaNacimiento}
                      onChange={setFechaNacimiento}
                      placeholder="AAAA-MM-DD"
                      icono="calendar-outline"
                    />
                  </View>
                </View>

                {/* =============================================
                    FILA 3
                ============================================= */}

                <View
                  style={{
                    flexDirection: esEscritorio ? "row" : "column",

                    gap: esEscritorio ? 18 : 0,

                    alignItems: esEscritorio ? "flex-start" : "stretch",
                  }}
                >
                  {/* GÉNERO */}

                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,

                      width: esEscritorio ? undefined : "100%",
                    }}
                  >
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
                      <Ionicons
                        name="people-outline"
                        size={19}
                        color={primaryColor}
                      />

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
                              ]}
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
                  </View>

                  {/* TELÉFONO */}

                  <View
                    style={{
                      flex: esEscritorio ? 1 : undefined,

                      width: esEscritorio ? undefined : "100%",
                    }}
                  >
                    <Campo
                      titulo="Teléfono"
                      valor={telefono}
                      onChange={setTelefono}
                      placeholder="Número de teléfono"
                      icono="call-outline"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              {/* ===============================================
                  CUENTA
              =============================================== */}

              <View
                style={{
                  width: "100%",

                  backgroundColor: esEscritorio ? surfaceColor : "transparent",

                  borderWidth: esEscritorio ? 1 : 0,

                  borderColor,

                  borderRadius: esEscritorio ? 24 : 0,

                  padding: esEscritorio ? 24 : 0,

                  marginBottom: 24,
                }}
              >
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
                  <Ionicons
                    name="mail-outline"
                    size={19}
                    color={primaryColor}
                  />

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

                  <Ionicons
                    name="lock-closed-outline"
                    size={17}
                    color={iconColor}
                  />
                </View>
              </View>

              {/* ===============================================
                  SEGURIDAD
              =============================================== */}

              {esIndependiente && (
                <View
                  style={{
                    width: "100%",

                    backgroundColor: esEscritorio
                      ? surfaceColor
                      : "transparent",

                    borderWidth: esEscritorio ? 1 : 0,

                    borderColor,

                    borderRadius: esEscritorio ? 24 : 0,

                    padding: esEscritorio ? 24 : 0,

                    marginBottom: 24,
                  }}
                >
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
                      <Ionicons
                        name="key-outline"
                        size={20}
                        color={primaryColor}
                      />
                    </View>

                    <View style={styles.flex}>
                      <Text
                        style={[
                          styles.valorCuenta,

                          {
                            color: textColor,
                          },
                        ]}
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
                </View>
              )}

              {/* ===============================================
                  GUARDAR
              =============================================== */}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={guardando}
                onPress={guardarCambios}
                style={[
                  styles.botonGuardar,

                  guardando && styles.deshabilitado,

                  {
                    backgroundColor: primaryColor,

                    maxWidth: esEscritorio ? 320 : undefined,

                    alignSelf: esEscritorio ? "flex-end" : "stretch",

                    width: esEscritorio ? 320 : "100%",

                    marginTop: 0,
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

              {/* ===============================================
                  CERRAR SESIÓN - MÓVIL / TABLET
              =============================================== */}

              {!esEscritorio && (
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
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={mostrarLogout}
        onClose={() => setMostrarLogout(false)}
      />
    </SafeAreaView>
  );
}

// ==========================================================
// CAMPO
// ==========================================================

type CampoProps = {
  titulo: string;

  valor: string;

  onChange: (texto: string) => void;

  placeholder: string;

  icono: keyof typeof Ionicons.glyphMap;

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
  const textColor = useThemeColor({}, "text");

  const primaryColor = useThemeColor({}, "primary");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  return (
    <>
      <Text
        style={[
          styles.label,

          {
            color: textColor,
          },
        ]}
      >
        {titulo}
      </Text>

      <View
        style={[
          styles.input,

          {
            backgroundColor: inputBackgroundColor,

            borderColor: inputBorderColor,
          },
        ]}
      >
        <Ionicons name={icono} size={19} color={primaryColor} />

        <TextInput
          value={valor}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          selectionColor={primaryColor}
          keyboardType={keyboardType}
          style={[
            styles.textInput,

            {
              color: textColor,
            },
          ]}
        />
      </View>
    </>
  );
}

// ==========================================================
// PASSWORD
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
  const textColor = useThemeColor({}, "text");

  const iconColor = useThemeColor({}, "icon");

  const primaryColor = useThemeColor({}, "primary");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  return (
    <>
      <Text
        style={[
          styles.label,

          {
            color: textColor,
          },
        ]}
      >
        {titulo}
      </Text>

      <View
        style={[
          styles.input,

          {
            backgroundColor: inputBackgroundColor,

            borderColor: inputBorderColor,
          },
        ]}
      >
        <Ionicons name="lock-closed-outline" size={19} color={primaryColor} />

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

            {
              color: textColor,
            },
          ]}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={onToggle}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={19}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

// ==========================================================
// FILA DE INFORMACIÓN
// ==========================================================

type FilaProps = {
  icono: keyof typeof Ionicons.glyphMap;

  color: string;

  titulo: string;

  valor: string;
};

function FilaInformacion({ icono, color, titulo, valor }: FilaProps) {
  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  return (
    <View style={styles.filaCuenta}>
      <View
        style={[
          styles.iconoCuenta,

          {
            backgroundColor: surfaceSecondaryColor,
          },
        ]}
      >
        <Ionicons name={icono} size={21} color={color} />
      </View>

      <View style={styles.flex}>
        <Text
          style={[
            styles.labelCuenta,

            {
              color: textSecondaryColor,
            },
          ]}
        >
          {titulo}
        </Text>

        <Text
          style={[
            styles.valorCuenta,

            {
              color: textColor,
            },
          ]}
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

function TituloSeccion({ children }: { children: React.ReactNode }) {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <Text
      style={[
        styles.seccionTitulo,

        {
          color: primaryColor,
        },
      ]}
    >
      {children}
    </Text>
  );
}
