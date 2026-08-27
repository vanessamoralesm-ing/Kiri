import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { actualizarPerfil, cambiarPassword, obtenerPerfilCompleto, PerfilCompleto, subirFotoPerfil } from "@/services/perfil/perfilService";
import LogoutModal from "@/components/ui/LogoutModal";
import { COLORES, styles } from "@/styles/perfil.styles";

const GENEROS = [
  { label: "Femenino", value: "femenino" },
  { label: "Masculino", value: "masculino" },
  { label: "Otro", value: "otro" },
  { label: "Prefiero no decir", value: "prefiero_no_decir" },
];

export default function PerfilScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const movil = width < 600;

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

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
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
      Alert.alert("No pudimos cargar tu perfil", error instanceof Error ? error.message : "Inténtalo nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  const esIndependiente = perfil?.rol_nombre?.trim().toLowerCase() === "independiente";
  const generoTexto = GENEROS.find((item) => item.value === genero)?.label ?? "Selecciona una opción";

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
      await actualizarPerfil({ nombres, apellidos, nombre_preferido: nombrePreferido, telefono, fecha_nacimiento: fechaNacimiento, genero });
      await cargarPerfil();
      Alert.alert("Cambios guardados", "Tu información fue actualizada correctamente.");
    } catch (error) {
      Alert.alert("No se pudo guardar", error instanceof Error ? error.message : "Inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  function seleccionarFoto() {
    if (Platform.OS === "web") {
      abrirGaleria();
      return;
    }
    Alert.alert("Foto de perfil", "Selecciona una opción", [
      { text: "Cámara", onPress: tomarFoto },
      { text: "Galería", onPress: abrirGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function tomarFoto() {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso necesario", "Kiri necesita acceso a la cámara para tomar tu foto.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (resultado.canceled) return;
    await guardarFoto(resultado.assets[0]);
  }

  async function abrirGaleria() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso necesario", "Kiri necesita acceso a tus imágenes para cambiar la foto de perfil.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (resultado.canceled) return;
    await guardarFoto(resultado.assets[0]);
  }

  async function guardarFoto(asset: ImagePicker.ImagePickerAsset) {
    try {
      setSubiendoFoto(true);
      await subirFotoPerfil(asset.uri, asset.mimeType ?? "image/jpeg");
      await cargarPerfil();
      Alert.alert("Foto actualizada", "Tu foto de perfil fue actualizada.");
    } catch (error) {
      Alert.alert("No se pudo cambiar la foto", error instanceof Error ? error.message : "Inténtalo nuevamente.");
    } finally {
      setSubiendoFoto(false);
    }
  }

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
      Alert.alert("Las contraseñas no coinciden", "Verifica ambas contraseñas.");
      return;
    }

    try {
      setGuardandoPassword(true);
      await cambiarPassword(nuevaPassword);
      setNuevaPassword("");
      setConfirmarPassword("");
      setMostrarPassword(false);
      Alert.alert("Contraseña actualizada", "Tu contraseña fue modificada correctamente.");
    } catch (error) {
      Alert.alert("No se pudo actualizar", error instanceof Error ? error.message : "Inténtalo nuevamente.");
    } finally {
      setGuardandoPassword(false);
    }
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={COLORES.azul} />
          <Text style={styles.textoCargando}>Preparando tu perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pantalla} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, movil && { paddingBottom: Math.max(insets.bottom + 120, 145) }]}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Mi perfil</Text>
          <Text style={styles.subtitulo}>Administra tu información y tu cuenta</Text>
        </View>

        <View style={styles.fotoZona}>
          <View style={styles.avatar}>
            {perfil?.foto_url ? (
              <Image source={{ uri: perfil.foto_url }} style={styles.foto} />
            ) : (
              <Ionicons name="person" size={54} color={COLORES.azul} />
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            disabled={subiendoFoto}
            onPress={seleccionarFoto}
            style={[styles.camara, subiendoFoto && styles.deshabilitado]}
          >
            {subiendoFoto ? (
              <ActivityIndicator size="small" color={COLORES.fondo} />
            ) : (
              <Ionicons name="camera" size={17} color={COLORES.fondo} />
            )}
          </TouchableOpacity>
          <Text style={styles.cambiarFoto}>Toca la cámara para cambiar tu foto</Text>
        </View>

        <TituloSeccion>INFORMACIÓN PERSONAL</TituloSeccion>
        <Campo titulo="Nombres" valor={nombres} onChange={setNombres} placeholder="Tus nombres" icono="person-outline" />
        <Campo titulo="Apellidos" valor={apellidos} onChange={setApellidos} placeholder="Tus apellidos" icono="person-outline" />
        <Campo titulo="Nombre preferido" valor={nombrePreferido} onChange={setNombrePreferido} placeholder="¿Cómo quieres que te llamemos?" icono="happy-outline" />
        <Campo titulo="Fecha de nacimiento" valor={fechaNacimiento} onChange={setFechaNacimiento} placeholder="AAAA-MM-DD" icono="calendar-outline" />

        <Text style={styles.label}>Género</Text>
        <TouchableOpacity activeOpacity={0.75} onPress={() => setMostrarGeneros((actual) => !actual)} style={styles.input}>
          <Ionicons name="people-outline" size={19} color={COLORES.azul} />
          <Text style={styles.inputTexto}>{generoTexto}</Text>
          <Ionicons name={mostrarGeneros ? "chevron-up" : "chevron-down"} size={18} color={COLORES.texto} />
        </TouchableOpacity>

        {mostrarGeneros && (
          <View style={styles.listaGenero}>
            {GENEROS.map((opcion) => (
              <TouchableOpacity
                key={opcion.value}
                activeOpacity={0.7}
                onPress={() => {
                  setGenero(opcion.value);
                  setMostrarGeneros(false);
                }}
                style={styles.opcionGenero}
              >
                <Text style={styles.textoGenero}>{opcion.label}</Text>
                {genero === opcion.value && <Ionicons name="checkmark-circle" size={20} color={COLORES.verde} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Campo titulo="Teléfono" valor={telefono} onChange={setTelefono} placeholder="Número de teléfono" icono="call-outline" keyboardType="phone-pad" />

        <TituloSeccion>CUENTA</TituloSeccion>
        <Text style={styles.label}>Correo electrónico</Text>
        <View style={[styles.input, styles.bloqueado]}>
          <Ionicons name="mail-outline" size={19} color={COLORES.azul} />
          <Text numberOfLines={1} style={styles.inputTexto}>{perfil?.correo}</Text>
          <Ionicons name="lock-closed-outline" size={17} color={COLORES.texto} />
        </View>

        <TituloSeccion>CUENTA E INSTITUCIÓN</TituloSeccion>
        <View style={styles.tarjetaCuenta}>
          <FilaInformacion icono="person-circle-outline" color={COLORES.azul} titulo="Tipo de cuenta" valor={perfil?.rol_nombre ?? "Sin rol"} />
          <View style={styles.separador} />
          <FilaInformacion icono="school-outline" color={COLORES.verde} titulo="Institución" valor={perfil?.institucion_nombre ?? "Cuenta independiente"} />
        </View>

        {esIndependiente && (
          <>
            <TituloSeccion>SEGURIDAD</TituloSeccion>
            <TouchableOpacity activeOpacity={0.75} onPress={() => setMostrarPassword((actual) => !actual)} style={styles.opcionSeguridad}>
              <View style={styles.iconoCuenta}>
                <Ionicons name="key-outline" size={20} color={COLORES.azul} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.valorCuenta}>Cambiar contraseña</Text>
                <Text style={styles.labelCuenta}>Actualiza la contraseña de tu cuenta</Text>
              </View>
              <Ionicons name={mostrarPassword ? "chevron-up" : "chevron-down"} size={19} color={COLORES.texto} />
            </TouchableOpacity>

            {mostrarPassword && (
              <View style={styles.passwordCard}>
                <PasswordInput titulo="Nueva contraseña" valor={nuevaPassword} onChange={setNuevaPassword} visible={verPassword} onToggle={() => setVerPassword((actual) => !actual)} />
                <PasswordInput titulo="Confirmar contraseña" valor={confirmarPassword} onChange={setConfirmarPassword} visible={verConfirmacion} onToggle={() => setVerConfirmacion((actual) => !actual)} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={guardandoPassword}
                  onPress={actualizarPassword}
                  style={[styles.botonPassword, guardandoPassword && styles.deshabilitado]}
                >
                  {guardandoPassword ? (
                    <ActivityIndicator size="small" color={COLORES.fondo} />
                  ) : (
                    <>
                      <Ionicons name="shield-checkmark-outline" size={19} color={COLORES.fondo} />
                      <Text style={styles.textoBotonPrincipal}>Actualizar contraseña</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <TituloSeccion>PRIVACIDAD</TituloSeccion>
        <View style={styles.privacidad}>
          <View style={styles.privacidadIcono}>
            <Ionicons name="shield-checkmark-outline" size={24} color={COLORES.azul} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.privacidadTitulo}>Privacidad de datos</Text>
            <Text style={styles.privacidadTexto}>
              Tu información personal se mantiene privada y se utiliza para personalizar tu experiencia dentro de Kiri.
            </Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} disabled={guardando} onPress={guardarCambios} style={[styles.botonGuardar, guardando && styles.deshabilitado]}>
          {guardando ? (
            <ActivityIndicator size="small" color={COLORES.fondo} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={COLORES.fondo} />
              <Text style={styles.textoBotonPrincipal}>Guardar cambios</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75} onPress={() => setMostrarLogout(true)} style={styles.botonSalir}>
          <Ionicons name="log-out-outline" size={21} color={COLORES.texto} />
          <Text style={styles.textoSalir}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogoutModal visible={mostrarLogout} onClose={() => setMostrarLogout(false)} />
    </SafeAreaView>
  );
}

type CampoProps = {
  titulo: string;
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
  icono: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "phone-pad";
};

function Campo({ titulo, valor, onChange, placeholder, icono, keyboardType = "default" }: CampoProps) {
  return (
    <>
      <Text style={styles.label}>{titulo}</Text>
      <View style={styles.input}>
        <Ionicons name={icono} size={19} color={COLORES.azul} />
        <TextInput
          value={valor}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLORES.texto}
          keyboardType={keyboardType}
          style={styles.textInput}
        />
      </View>
    </>
  );
}

type PasswordProps = {
  titulo: string;
  valor: string;
  onChange: (valor: string) => void;
  visible: boolean;
  onToggle: () => void;
};

function PasswordInput({ titulo, valor, onChange, visible, onToggle }: PasswordProps) {
  return (
    <>
      <Text style={styles.label}>{titulo}</Text>
      <View style={styles.input}>
        <Ionicons name="lock-closed-outline" size={19} color={COLORES.azul} />
        <TextInput
          value={valor}
          onChangeText={onChange}
          secureTextEntry={!visible}
          placeholder="••••••••"
          placeholderTextColor={COLORES.texto}
          autoCapitalize="none"
          style={styles.textInput}
        />
        <TouchableOpacity activeOpacity={0.7} onPress={onToggle}>
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={19} color={COLORES.texto} />
        </TouchableOpacity>
      </View>
    </>
  );
}

type FilaProps = {
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  titulo: string;
  valor: string;
};

function FilaInformacion({ icono, color, titulo, valor }: FilaProps) {
  return (
    <View style={styles.filaCuenta}>
      <View style={styles.iconoCuenta}>
        <Ionicons name={icono} size={21} color={color} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.labelCuenta}>{titulo}</Text>
        <Text style={styles.valorCuenta}>{valor}</Text>
      </View>
    </View>
  );
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return <Text style={styles.seccionTitulo}>{children}</Text>;
}