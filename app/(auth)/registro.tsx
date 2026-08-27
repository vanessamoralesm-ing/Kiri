import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GoogleButton from '@/components/ui/GoogleButton';
import { useAuth } from '@/services/authProvider';
import type { Genero } from '@/types/auth';
import { validateRegister, EDAD_MINIMA } from '@/utils/validations';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  // DATOS PERSONALES
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombrePreferido, setNombrePreferido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [genero, setGenero] = useState<Genero | ''>('');

  // CREDENCIALES
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmar, setConfirmar] = useState('');

  // TÉRMINOS
  const [aceptoCondi, setAceptoCondi] = useState(false);

  // ESTADOS DEL PROCESO
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OPCIONES DE GÉNERO
  const opcionesGenero: { label: string; value: Genero }[] = [
    { label: 'Femenino', value: 'femenino' },
    { label: 'Masculino', value: 'masculino' },
    { label: 'Otro', value: 'otro' },
    { label: 'Prefiero no decir', value: 'prefiero_no_decir' },
  ];

  // LIMPIAR ERROR
  const limpiarError = () => {
    if (error) setError(null);
  };

  // IR AL LOGIN
  const irALogin = () => router.push('/(auth)/login');

  // FORMATEAR FECHA
  const formatearFecha = (fecha: Date) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // CONTROLADOR DE FECHA
  const handleFechaChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android se cierra después de seleccionar
    if (Platform.OS === 'android') {
      setMostrarCalendario(false);
    }

    // Usuario canceló
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setFechaSeleccionada(selectedDate);
    setFechaNacimiento(formatearFecha(selectedDate));
    limpiarError();
  };

  // FECHA MÁXIMA PERMITIDA
  const obtenerFechaMaxima = () => {
    const hoy = new Date();
    return new Date(
      hoy.getFullYear() - EDAD_MINIMA,
      hoy.getMonth(),
      hoy.getDate()
    );
  };

  // REGISTRAR
  const registrar = async () => {
    setError(null);

    // VALIDAR GÉNERO ANTES DE CONSTRUIR SignUpInput
    if (!genero) {
      setError('Selecciona una opción de género.');
      return;
    }

    // VALIDACIONES DEL FORMULARIO
    const validationErrors = validateRegister({
      email: correo,
      password: contraseña,
      nombres,
      apellidos,
      nombrePreferido,
      telefono,
      fechaNacimiento,
      genero,
      confirmPassword: confirmar,
      aceptaTerminos: aceptoCondi,
    });

    // OBTENER EL PRIMER ERROR ENCONTRADO
    const firstError = Object.values(validationErrors).find(Boolean);
    if (firstError) {
      setError(firstError);
      return;
    }

    // REGISTRO EN SUPABASE
    try {
      setSubmitting(true);
      const result = await signUp({
        email: correo.trim().toLowerCase(),
        password: contraseña,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        nombrePreferido: nombrePreferido.trim(),
        telefono: telefono.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        genero,
      });

      // CONFIRMACIÓN DE CORREO ACTIVADA
      if (result.requiresEmailConfirmation) {
        router.replace({
          pathname: '/(auth)/registro_exitoso',
          params: {
            email: correo.trim().toLowerCase(),
          },
        });
        return;
      }
    } catch (err: any) {
      console.error('Error registrando usuario:', err);
      const message = err?.message?.toLowerCase?.() ?? '';

      if (message.includes('already registered') || message.includes('already exists')) {
        setError('Ya existe una cuenta registrada con este correo.');
      } else if (message.includes('password should be at least')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(err?.message ?? 'No se pudo crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/* TÍTULO */}
        <Text style={styles.title}>Únete a Kiri</Text>
        <Text style={styles.subtitle}>Tu refugio emocional comienza hoy</Text>

        {/* FORMULARIO */}
        <View style={styles.formContainer}>
          {/* NOMBRES */}
          <Input
            label="Nombres"
            placeholder="Ej: Auxiliadora Vanessa"
            value={nombres}
            onChangeText={(value) => {
              setNombres(value);
              limpiarError();
            }}
            autoCapitalize="words"
          />

          {/* APELLIDOS */}
          <Input
            label="Apellidos"
            placeholder="Ej: Morales Moreno"
            value={apellidos}
            onChangeText={(value) => {
              setApellidos(value);
              limpiarError();
            }}
            autoCapitalize="words"
          />

          {/* NOMBRE PREFERIDO */}
          <Input
            label="¿Cómo prefieres que te llamemos?"
            placeholder="Ej: Vanessa"
            value={nombrePreferido}
            onChangeText={(value) => {
              setNombrePreferido(value);
              limpiarError();
            }}
            autoCapitalize="words"
          />

          {/* CORREO */}
          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={(value) => {
              setCorreo(value);
              limpiarError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          {/* TELÉFONO */}
          <Input
            label="Teléfono"
            placeholder="Ej: 88888888"
            value={telefono}
            onChangeText={(value) => {
              const soloNumeros = value.replace(/\D/g, '');
              const limitado = soloNumeros.slice(0, 8);
              setTelefono(limitado);
              limpiarError();
            }}
            keyboardType="number-pad"
            maxLength={8}
          />

          {/* FECHA DE NACIMIENTO */}
          <Text style={styles.fieldLabel}>Fecha de nacimiento</Text>

          {/* CONTROL DE FECHA SEGÚN PLATAFORMA */}
          {Platform.OS === 'web' ? (
            <View style={styles.webDateContainer}>
              <input
                type="date"
                value={fechaNacimiento}
                min="1900-01-01"
                max={formatearFecha(obtenerFechaMaxima())}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setFechaNacimiento(value);

                  if (value) {
                    const [year, month, day] = value.split('-').map(Number);
                    setFechaSeleccionada(new Date(year, month - 1, day));
                  }

                  limpiarError();
                }}
                style={{
                  width: '100%',
                  height: 50,
                  borderWidth: 0,
                  borderStyle: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: 16,
                  color: '#2D3748',
                  fontFamily: 'Nunito-Medium',
                  cursor: 'pointer',
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateInput}
                activeOpacity={0.8}
                onPress={() => setMostrarCalendario(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    !fechaNacimiento && styles.datePlaceholder,
                  ]}
                >
                  {fechaNacimiento || 'Selecciona tu fecha de nacimiento'}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>

              {mostrarCalendario && (
                <DateTimePicker
                  value={fechaSeleccionada ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  minimumDate={new Date(1900, 0, 1)}
                  maximumDate={obtenerFechaMaxima()}
                  onChange={handleFechaChange}
                />
              )}

              {Platform.OS === 'ios' && mostrarCalendario && (
                <TouchableOpacity
                  style={styles.closeDateButton}
                  onPress={() => setMostrarCalendario(false)}
                >
                  <Text style={styles.closeDateText}>Listo</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* GÉNERO */}
          <Text style={styles.fieldLabel}>Género</Text>
          <View style={styles.genderContainer}>
            {opcionesGenero.map((opcion) => (
              <TouchableOpacity
                key={opcion.value}
                activeOpacity={0.8}
                style={[
                  styles.genderOption,
                  genero === opcion.value && styles.genderOptionActive,
                ]}
                onPress={() => {
                  setGenero(opcion.value);
                  limpiarError();
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    genero === opcion.value && styles.genderTextActive,
                  ]}
                >
                  {opcion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTRASEÑA */}
          <Input
            label="Contraseña"
            placeholder="********"
            value={contraseña}
            onChangeText={(value) => {
              setContraseña(value);
              limpiarError();
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
          />

          {/* CONFIRMAR CONTRASEÑA */}
          <Input
            label="Confirmar Contraseña"
            placeholder="********"
            value={confirmar}
            onChangeText={(value) => {
              setConfirmar(value);
              limpiarError();
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* TÉRMINOS */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.checkbox, aceptoCondi && styles.checkboxActive]}
              onPress={() => {
                setAceptoCondi(!aceptoCondi);
                limpiarError();
              }}
            >
              {aceptoCondi && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text
                style={styles.linkText}
                onPress={() => console.log('Ver Términos')}
              >
                Términos y Condiciones
              </Text>{' '}
              y la{' '}
              <Text
                style={styles.linkText}
                onPress={() => console.log('Ver Política de Privacidad')}
              >
                Política de Privacidad
              </Text>{' '}
              de Kiri.
            </Text>
          </View>

          {/* ERROR */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* CREAR CUENTA */}
          <Button
            title={submitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            variant="primary"
            onPress={registrar}
            disabled={submitting}
            style={styles.registroBoton}
          />

          {submitting && <ActivityIndicator style={styles.spinner} color="#4F8EF7" />}

          {/* SEPARADOR */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o regístrate con</Text>
            <View style={styles.line} />
          </View>

          {/* GOOGLE */}
          <GoogleButton
            onPress={() => console.log('Registro con Google — pendiente de implementar')}
          />

          {/* LOGIN */}
          <View style={styles.pieContenedor}>
            <Text style={styles.pieTexto}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={irALogin}>
              <Text style={styles.enlaceIngreso}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 30,
  },
  logoTop: {
    width: 200,
    height: 200,
    marginTop: -40,
    marginBottom: -58,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  genderOption: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#F8FAFC',
  },
  genderOptionActive: {
    borderColor: '#4F8EF7',
    backgroundColor: '#E8F1FF',
  },
  genderText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  genderTextActive: {
    color: '#4F8EF7',
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: -6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: '#F8FAFC',
  },
  checkboxActive: {
    backgroundColor: '#4F8EF7',
  },
  checkmark: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    lineHeight: 18,
  },
  linkText: {
    color: '#4F8EF7',
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginBottom: 10,
    textAlign: 'center',
  },
  registroBoton: {
    marginTop: -5,
  },
  spinner: {
    marginTop: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 5,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D3748',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  pieContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  pieTexto: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  enlaceIngreso: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4F8EF7',
  },
  dateInput: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  datePlaceholder: {
    color: '#A0AEC0',
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  closeDateButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 18,
  },
  closeDateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },
  webDateContainer: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
});