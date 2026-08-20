import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/services/authProvider';

export default function HomeScreen() {
  const { user, profile, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // CERRAR SESIÓN
  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      // No hacemos router.replace() porque AuthProvider y RootNavigation gestionan la redirección al cambiar la sesión
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo cerrar la sesión.');
    } finally {
      setLoggingOut(false);
    }
  };

  // NOMBRE A MOSTRAR
  const nombreMostrar = profile?.nombre_preferido || profile?.nombres || 'Usuario';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ENCABEZADO */}
          <Text style={styles.logoText}>Kiri</Text>
          <Text style={styles.welcome}>Hola, {nombreMostrar}</Text>
          <Text style={styles.subtitle}>La autenticación está funcionando.</Text>

          {/* ESTADO AUTH */}
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>✓ Sesión iniciada</Text>
            <Text style={styles.successText}>
              Supabase Auth reconoció correctamente tu sesión.
            </Text>
          </View>

          {/* DATOS DE auth.users */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>auth.users</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{user?.email ?? 'No disponible'}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.row}>
              <Text style={styles.label}>UUID</Text>
              <Text style={styles.uuid}>{user?.id ?? 'No disponible'}</Text>
            </View>
          </View>

          {/* PERFIL public.usuario */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>public.usuario</Text>

            {profile ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Nombres</Text>
                  <Text style={styles.value}>{profile.nombres}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Apellidos</Text>
                  <Text style={styles.value}>{profile.apellidos}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Nombre preferido</Text>
                  <Text style={styles.value}>
                    {profile.nombre_preferido ?? 'No especificado'}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Teléfono</Text>
                  <Text style={styles.value}>
                    {profile.telefono ?? 'No especificado'}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Fecha nacimiento</Text>
                  <Text style={styles.value}>
                    {profile.fecha_nacimiento ?? 'No especificada'}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Género</Text>
                  <Text style={styles.value}>
                    {profile.genero ?? 'No especificado'}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Estado</Text>
                  <Text style={styles.activeText}>{profile.estado}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Rol</Text>
                  <Text style={styles.value}>
                    {profile.rol?.nombre ?? 'No disponible'}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.label}>Institución</Text>
                  <Text style={styles.value}>
                    {profile.id_institucion ?? 'Usuario independiente'}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Perfil no encontrado</Text>
                <Text style={styles.errorText}>
                  Auth funciona, pero no fue posible cargar public.usuario.
                </Text>
                <Text style={styles.errorText}>
                  Revisa el trigger y las políticas RLS.
                </Text>
              </View>
            )}
          </View>

          {/* COMPROBAR UUID */}
          {profile && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Verificación del UUID</Text>
              {user?.id === profile.id_usuario ? (
                <Text style={styles.successVerification}>
                  ✓ auth.users y public.usuario utilizan el mismo UUID.
                </Text>
              ) : (
                <Text style={styles.errorVerification}>
                  ✕ Los UUID no coinciden.
                </Text>
              )}
            </View>
          )}

          {/* LOGOUT */}
          <TouchableOpacity
            style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleSignOut}
            disabled={loggingOut}
          >
            <Text style={styles.logoutText}>
              {loggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  logoText: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcome: {
    fontSize: 30,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 19,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    marginBottom: 15,
  },
  successCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },
  successTitle: {
    fontSize: 17,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#047857',
    marginBottom: 4,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#065F46',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 16,
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 7,
  },
  row: {
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#718096',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  uuid: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#4A5568',
  },
  activeText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#059669',
  },
  separator: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 10,
  },
  successVerification: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#047857',
  },
  errorVerification: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#DC2626',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 14,
    borderRadius: 10,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#C53030',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#C53030',
    marginBottom: 2,
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});