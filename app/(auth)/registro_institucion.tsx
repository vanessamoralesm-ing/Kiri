import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

// COMPONENTES
import Logo from "@/components/ui/Logo_izq";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// SERVICE
import { crearSolicitudInstitucional } from "@/services/instituciones/solicitudInstitucionService";

// TYPES
import type { TipoInstitucion } from "@/types/superadmin/solicitudes";

// COMPONENTE
export default function RegistroInstitucionPantalla() {
  const router = useRouter();

  // ESTADOS GENERALES
  const [pasoActual, setPasoActual] = useState(1);
  const [enviando, setEnviando] = useState(false);

  // PASO 1 - DATOS DE LA INSTITUCIÓN
  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [codigoInstitucional, setCodigoInstitucional] = useState("");
  const [tipoInstitucion, setTipoInstitucion] = useState<TipoInstitucion | null>(null);
  const [departamento, setDepartamento] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [direccion, setDireccion] = useState("");

  // PASO 2 - DATOS DEL SOLICITANTE
  const [nombreSolicitante, setNombreSolicitante] = useState("");
  const [apellidoSolicitante, setApellidoSolicitante] = useState("");
  const [cedula, setCedula] = useState("");
  const [cargo, setCargo] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("");

  function regresar() {
    if (enviando) return;
    if (pasoActual === 2) {
      setPasoActual(1);
      return;
    }
    router.back();
  }

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
        "Por favor completa todos los datos obligatorios de la institución."
      );
      return;
    }
    setPasoActual(2);
  }

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
        "Por favor completa todos los datos obligatorios del solicitante."
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
        nombre_institucion: nombreInstitucion,
        codigo_institucional: codigoInstitucional,
        tipo_institucion: tipoInstitucion,
        direccion,
        municipio,
        departamento,
        nombre_solicitante: nombreSolicitante,
        apellido_solicitante: apellidoSolicitante,
        cedula_solicitante: cedula,
        cargo_solicitante: cargo,
        correo,
        telefono,
        descripcion: motivo,
      });

      Alert.alert(
        "Solicitud registrada",
        "Tu solicitud ha sido enviada correctamente. El equipo de Kiri revisará la información y te notificará por correo cuando exista una resolución.",
        [{ text: "Entendido", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error enviando solicitud institucional:", error);
      Alert.alert(
        "No se pudo enviar la solicitud",
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContenedor}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.contenedor}>
        {/* CABECERA */}
        <View style={styles.cabecera}>
          <TouchableOpacity onPress={regresar} activeOpacity={0.7} disabled={enviando}>
            <Text style={styles.flechaRegreso}>←</Text>
          </TouchableOpacity>
          <Logo />
        </View>

        {/* ENCABEZADO */}
        <Text style={styles.titulo}>Solicitud de Institución</Text>
        <Text style={styles.subtitulo}>
          Únete al ecosistema de Kiri y transforma el bienestar emocional de tu comunidad.
        </Text>
        <Text style={styles.descripcionPaso}>
          {pasoActual === 1
            ? "Paso 1: Información general de la institución"
            : "Paso 2: Datos del representante y contacto"}
        </Text>

        {/* BARRA DE PROGRESO */}
        <View style={styles.contenedorBarra}>
          <View style={[styles.barraPaso, styles.barraActiva]} />
          <View style={[styles.barraPaso, pasoActual === 2 && styles.barraActiva]} />
        </View>

        {/* TARJETA DEL FORMULARIO */}
        <View style={styles.tarjetaFormulario}>
          {/* PASO 1 */}
          {pasoActual === 1 && (
            <>
              <Input
                label="Nombre de la Institución *"
                placeholder="Ej. Colegio José Madriz"
                value={nombreInstitucion}
                onChangeText={setNombreInstitucion}
              />
              <Input
                label="Código Institucional *"
                placeholder="Ej. MINED-0321"
                value={codigoInstitucional}
                onChangeText={setCodigoInstitucional}
              />

              <Text style={styles.label}>Tipo de Institución *</Text>
              <View style={styles.contenedorTipos}>
                <Pressable
                  onPress={() => setTipoInstitucion("educacion_superior")}
                  style={[styles.tipoBoton, tipoInstitucion === "educacion_superior" && styles.tipoBotonActivo]}
                >
                  <Text style={[styles.tipoTexto, tipoInstitucion === "educacion_superior" && styles.tipoTextoActivo]}>
                    Educación superior
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setTipoInstitucion("escolar")}
                  style={[styles.tipoBoton, tipoInstitucion === "escolar" && styles.tipoBotonActivo]}
                >
                  <Text style={[styles.tipoTexto, tipoInstitucion === "escolar" && styles.tipoTextoActivo]}>
                    Escolar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setTipoInstitucion("salud")}
                  style={[styles.tipoBoton, tipoInstitucion === "salud" && styles.tipoBotonActivo]}
                >
                  <Text style={[styles.tipoTexto, tipoInstitucion === "salud" && styles.tipoTextoActivo]}>
                    Salud
                  </Text>
                </Pressable>
              </View>

              <View style={styles.filaCampos}>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Departamento *"
                    placeholder="Ej. León"
                    value={departamento}
                    onChangeText={setDepartamento}
                  />
                </View>
                <View style={styles.columnaMedia}>
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

              <Button
                title="Siguiente ➔"
                variant="primary"
                onPress={irAlPaso2}
                style={styles.botonAccion}
              />
            </>
          )}

          {/* PASO 2 */}
          {pasoActual === 2 && (
            <>
              <View style={styles.filaCampos}>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Nombre del Solicitante *"
                    placeholder="Ej. Félix Pedro"
                    value={nombreSolicitante}
                    onChangeText={setNombreSolicitante}
                  />
                </View>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Apellido del Solicitante *"
                    placeholder="Ej. López Pérez"
                    value={apellidoSolicitante}
                    onChangeText={setApellidoSolicitante}
                  />
                </View>
              </View>

              <View style={styles.filaCampos}>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Número de Cédula *"
                    placeholder="001-123456-0001P"
                    value={cedula}
                    onChangeText={setCedula}
                  />
                </View>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Cargo *"
                    placeholder="Ej. Director"
                    value={cargo}
                    onChangeText={setCargo}
                  />
                </View>
              </View>

              <Input
                label="Correo Institucional *"
                placeholder="admin@institucion.edu.ni"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Teléfono de Contacto *"
                placeholder="8888-1234"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />

              <Input
                label="Motivo de la Solicitud *"
                placeholder="¿Por qué desean utilizar Kiri?"
                value={motivo}
                onChangeText={setMotivo}
                multiline
                numberOfLines={3}
                style={styles.inputMultilinea}
              />

              <Button
                title={enviando ? "Enviando..." : "Enviar Solicitud"}
                variant="primary"
                onPress={enviarSolicitud}
                style={styles.botonEnviar}
              />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: -10,
  },
  flechaRegreso: {
    fontSize: 40,
    color: "#64748B",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 35,
    fontFamily: "Nunito-Bold",
    color: "#4F8EF7",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 10,
  },
  descripcionPaso: {
    fontSize: 15,
    fontFamily: "Nunito-SemiBold",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 15,
  },
  contenedorBarra: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  barraPaso: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
  },
  barraActiva: {
    backgroundColor: "#4F8EF7",
  },
  tarjetaFormulario: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 4,
  },
  filaCampos: {
    flexDirection: "row",
    gap: 10,
  },
  columnaMedia: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
    color: "#2D3748",
  },
  contenedorTipos: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  tipoBoton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  tipoBotonActivo: {
    borderColor: "#4F8EF7",
    backgroundColor: "#EFF6FF",
  },
  tipoTexto: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  tipoTextoActivo: {
    color: "#4F8EF7",
  },
  inputMultilinea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  botonAccion: {
    marginTop: 10,
  },
  botonEnviar: {
    marginTop: 10,
    backgroundColor: "#7BBF9A",
  },
});