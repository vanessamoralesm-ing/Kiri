import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

// IMPORTAMOS COMPONENTES REUTILIZABLES
import Logo from '@/components/ui/Logo_izq';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegistroInstitucionPantalla() {
  const router = useRouter();

  // ESTADO PARA CONTROLAR EL PASO ACTUAL (1 o 2)
  const [pasoActual, setPasoActual] = useState(1);

  // ESTADOS DEL FORMULARIO - PASO 1 (INSTITUCIÓN)
  const [nombreInstitucion, setNombreInstitucion] = useState('');
  const [codigoMined, setCodigoMined] = useState('');
  const [tipoInstitucion, setTipoInstitucion] = useState('');
  const [departamento, setDepartamento] = useState('');

  // ESTADOS DEL FORMULARIO - PASO 2 (SOLICITANTE Y CONTACTO)
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [cedula, setCedula] = useState('');
  const [cargo, setCargo] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('');

  // Funcion para volver a pantalla anterior o al paso1
  const regresar = () => {
    if (pasoActual === 2) {
      setPasoActual(1); // Si estamos en el paso 2, regresamos al paso 1
    } else {
      router.back(); // Si estamos en el paso 1, salimos de la pantalla
    }
  };

  // VALIDAR Y AVANZAR AL PASO 2
  const irAlPaso2 = () => {
    if (!nombreInstitucion.trim() || !codigoMined.trim() || !departamento.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor completa los datos obligatorios de la institución.');
      return;
    }
    setPasoActual(2);
  };

  // ENVIAR FORMULARIO FINAL
  const enviarSolicitud = () => {
    if (!nombreSolicitante.trim() || !cedula.trim() || !correo.trim() || !telefono.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor completa tus datos de contacto.');
      return;
    }

    Alert.alert(
      'Solicitud Registrada',
      'Tu información ha sido enviada al Administrador. Te notificaremos por correo cuando tu panel esté habilitado.',
      [
        {
          text: 'Entendido',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        
        {/* CABECERA CON FLECHA DE REGRESO Y LOGO */}
        <View style={styles.cabecera}>
          <TouchableOpacity onPress={regresar} activeOpacity={0.7}>
            <Text style={styles.flechaRegreso}>←</Text>
          </TouchableOpacity>
          <Logo />
        </View>

        {/* TÍTULO PRINCIPAL */}
        <Text style={styles.titulo}>Solicitud de Institución</Text>
         <Text style={styles.subtitulo}>
          Únete al ecosistema de Kiri y transforma el bienestar emocional de tu comunidad educativa.
        </Text>
        <Text style={styles.subtitulo}>
          {pasoActual === 1
            ? 'Paso 1: Información general de tu centro educativo'
            : 'Paso 2: Datos del representante legal y contacto'}
        </Text>

        {/* BARRA DE PROGRESO DE 2 PASOS */}
        <View style={styles.contenedorBarra}>
          <View style={[styles.barraPaso, styles.barraActiva]} />
          <View style={[styles.barraPaso, pasoActual === 2 && styles.barraActiva]} />
        </View>

        {/* TARJETA BLANCA DEL FORMULARIO */}
        <View style={styles.tarjetaFormulario}>
          
          {/* Paso 1*/}
          {pasoActual === 1 && (
            <>
              <Input
                label="Nombre de la Institución *"
                placeholder="Ej. Colegio Jose Madriz"
                value={nombreInstitucion}
                onChangeText={setNombreInstitucion}
              />

              <View style={styles.filaCampos}>
                <View style={styles.columnaMedia}>
                  <Input
                    label="Código MINED *"
                    placeholder="MINED-0321"
                    value={codigoMined}
                    onChangeText={setCodigoMined}
                  />
                </View>

                <View style={styles.columnaMedia}>
                  <Input
                    label="Tipo de Institución *"
                    placeholder="Ej. Colegio"
                    value={tipoInstitucion}
                    onChangeText={setTipoInstitucion}
                  />
                </View>
              </View>

              <Input
                label="Departamento *"
                placeholder="Ej. León, Managua, Estelí"
                value={departamento}
                onChangeText={setDepartamento}
              />

              <Button
                title="Siguiente ➔"
                variant="primary"
                onPress={irAlPaso2}
                style={styles.botonAccion}
              />
            </>
          )}

          {/*Paso 2*/}
          {pasoActual === 2 && (
            <>
              <Input
                label="Nombre del Solicitante*"
                placeholder="Ej. Felix Pedro"
                value={nombreSolicitante}
                onChangeText={setNombreSolicitante}
              />

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
                placeholder="@unanleon.edu.ni"
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
                placeholder="¿Por qué desean utilizar Kiri en su colegio?"
                value={motivo}
                onChangeText={setMotivo}
                multiline
                numberOfLines={3}
                style={styles.inputMultilinea}
              />

              <Button
                title="Enviar Solicitud"
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

//Estilos
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },

  /* CABECERA */
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: -10,
  },
  flechaRegreso: {
    fontSize: 40,
    color: '#64748B',
    fontWeight: 'bold',
  },

  /* TEXTOS ENCABEZADO */
  titulo: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 15,
  },

  /* Barra de progreso */
  contenedorBarra: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  barraPaso: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  barraActiva: {
    backgroundColor: '#4F8EF7',
  },

  /* TARJETA */
  tarjetaFormulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 4,
  },
  filaCampos: {
    flexDirection: 'row',
    gap: 10,
  },
  columnaMedia: {
    flex: 1,
  },
  inputMultilinea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  botonAccion: {
    marginTop: 10,
  },
  botonEnviar: {
    marginTop: 10,
    backgroundColor: '#7BBF9A',
  },
});