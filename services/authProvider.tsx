import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import type { SignUpInput, SignUpResult, UsuarioPerfil } from '@/types/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UsuarioPerfil | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // DATOS DE AUTENTICACIÓN
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // PERFIL public.usuario
  const [profile, setProfile] = useState<UsuarioPerfil | null>(null);

  // ESTADOS DE CARGA
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // 1. INICIALIZAR SESIÓN Y ESCUCHAR DEEP LINKS
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Error obteniendo sesión:', error.message);
          setSession(null);
          setUser(null);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        // Si ya existe una sesión guardada, todavía falta consultar public.usuario
        if (session?.user) {
          setProfileLoading(true);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initializeSession();

    // Escuchar enlaces de confirmación entrantes en móvil (Deep Links)
    let subscriptionLinking: { remove: () => void } | null = null;

    if (Platform.OS !== 'web') {
      subscriptionLinking = Linking.addEventListener('url', () => {
        supabase.auth.getSession();
      });
    }

    // ESCUCHAR CAMBIOS DE SUPABASE AUTH (Funciona nativo y web)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Usuario autenticado
      if (newSession?.user) {
        // Eliminamos un posible perfil anterior mientras se carga el correspondiente al nuevo usuario
        setProfile(null);
        setProfileLoading(true);
      } else {
        // Logout
        setProfile(null);
        setProfileLoading(false);
      }

      setAuthLoading(false);
    });

    // CLEANUP
    return () => {
      mounted = false;
      subscription.unsubscribe();
      subscriptionLinking?.remove();
    };
  }, []);

  // 2. CARGAR PERFIL DE public.usuario
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('usuario')
          .select(`
            *,
            rol (
              id_rol,
              nombre,
              descripcion
            )
          `)
          .eq('id_usuario', user.id)
          .single();

        if (cancelled) return;

        if (error) {
          console.error('Error cargando public.usuario:', error.message);
          setProfile(null);
          return;
        }

        setProfile(data as UsuarioPerfil);
      } catch (error) {
        if (!cancelled) {
          console.error('Error inesperado cargando perfil:', error);
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // 3. REGISTRO
  const signUp = async (input: SignUpInput): Promise<SignUpResult> => {
    // Validaciones básicas
    if (!input.nombres.trim()) throw new Error('Los nombres son obligatorios.');
    if (!input.apellidos.trim()) throw new Error('Los apellidos son obligatorios.');
    if (!input.email.trim()) throw new Error('El correo es obligatorio.');
    if (!input.telefono.trim()) throw new Error('El teléfono es obligatorio.');
    if (!input.fechaNacimiento.trim()) throw new Error('La fecha de nacimiento es obligatoria.');
    if (!input.genero) throw new Error('El género es obligatorio.');
    if (!input.password) throw new Error('La contraseña es obligatoria.');
    if (input.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

    // Construcción de la URL de redirección compatible con Web y Móvil
    const redirectUrl =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : Linking.createURL('/(auth)/login');

    // CREAR USUARIO EN auth.users
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          // Campos sincronizados con public.handle_new_user()
          nombres: input.nombres.trim(),
          apellidos: input.apellidos.trim(),
          nombre_preferido: input.nombrePreferido?.trim() || null,
          telefono: input.telefono.trim(),
          fecha_nacimiento: input.fechaNacimiento.trim(),
          genero: input.genero,
          foto_perfil: null,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo crear la cuenta.');

    return {
      requiresEmailConfirmation: !data.session,
    };
  };

  // 4. LOGIN
  const signIn = async (email: string, password: string) => {
    if (!email.trim()) throw new Error('El correo es obligatorio.');
    if (!password) throw new Error('La contraseña es obligatoria.');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;
  };

  // 5. LOGOUT
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  // LOADING GENERAL
  const loading = authLoading || profileLoading;

  // CONTEXT
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOOK useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return context;
};