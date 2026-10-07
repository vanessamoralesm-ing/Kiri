import { supabase } from "@/lib/supabase";
import type {
  SignUpInput,
  SignUpResult,
  UsuarioPerfil,
} from "@/types/auth";

import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

// ==========================================================
// TIPOS
// ==========================================================

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UsuarioPerfil | null;
  role: string | null;
  isSuperAdmin: boolean;
  loading: boolean;

  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ==========================================================
// CONTEXTO
// ==========================================================

const AuthContext = createContext<AuthContextType | null>(null);

// ==========================================================
// PROVIDER
// ==========================================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UsuarioPerfil | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // ========================================================
  // 1. INICIALIZAR SESIÓN
  // ========================================================

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Error obteniendo sesión:", error.message);
          setSession(null);
          setUser(null);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error inicializando autenticación:", error);

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

    void initializeSession();

    // ======================================================
    // DEEP LINKS MÓVIL
    // ======================================================

    let subscriptionLinking: {
      remove: () => void;
    } | null = null;

    if (Platform.OS !== "web") {
      subscriptionLinking = Linking.addEventListener(
        "url",
        async () => {
          try {
            await supabase.auth.getSession();
          } catch (error) {
            console.error("Error procesando deep link:", error);
          }
        },
      );
    }

    // ======================================================
    // CAMBIOS DE AUTENTICACIÓN
    // ======================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setProfile(null);
        setProfileLoading(false);
      }

      setAuthLoading(false);

      if (__DEV__) {
        console.log("[AUTH] Evento:", event);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      subscriptionLinking?.remove();
    };
  }, []);

  // ========================================================
  // 2. CARGAR PERFIL
  // ========================================================

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setProfileLoading(true);

      try {
        let data: UsuarioPerfil | null = null;
        let error: Error | null = null;

        // Reintentos porque el perfil puede crearse unos
        // instantes después de auth.users.
        for (let intento = 0; intento < 3 && !data; intento++) {
          const resultado = await supabase
            .from("usuario")
            .select(`
              *,
              rol (
                id_rol,
                nombre,
                descripcion
              )
            `)
            .eq("id_usuario", user.id)
            .maybeSingle();

          data = resultado.data as UsuarioPerfil | null;
          error = resultado.error;

          if (!data && intento < 2) {
            await new Promise((resolve) =>
              setTimeout(resolve, 500),
            );
          }
        }

        if (cancelled) return;

        if (error || !data) {
          console.error(
            "Error cargando public.usuario:",
            error?.message ?? "Perfil no encontrado.",
          );

          setProfile(null);
          return;
        }

        // ==================================================
        // CUENTA INACTIVA
        // ==================================================

        if (data.estado === "inactivo") {
          if (__DEV__) {
            console.warn(
              "[AUTH] Sesión cerrada: cuenta inactiva.",
            );
          }

          await supabase.auth.signOut();

          if (!cancelled) {
            setProfile(null);
            setSession(null);
            setUser(null);
          }

          return;
        }

        setProfile(data);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Error inesperado cargando perfil:",
            error,
          );

          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ========================================================
  // 3. REGISTRO
  // ========================================================

  const signUp = async (
    input: SignUpInput,
  ): Promise<SignUpResult> => {
    if (!input.nombres.trim()) {
      throw new Error("Los nombres son obligatorios.");
    }

    if (!input.apellidos.trim()) {
      throw new Error("Los apellidos son obligatorios.");
    }

    if (!input.email.trim()) {
      throw new Error("El correo es obligatorio.");
    }

    if (!input.telefono.trim()) {
      throw new Error("El teléfono es obligatorio.");
    }

    if (!input.fechaNacimiento.trim()) {
      throw new Error(
        "La fecha de nacimiento es obligatoria.",
      );
    }

    if (!input.genero) {
      throw new Error("El género es obligatorio.");
    }

    if (!input.password) {
      throw new Error("La contraseña es obligatoria.");
    }

    if (input.password.length < 6) {
      throw new Error(
        "La contraseña debe tener al menos 6 caracteres.",
      );
    }

    const redirectUrl =
      Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : Linking.createURL("/(auth)/login");

    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nombres: input.nombres.trim(),
          apellidos: input.apellidos.trim(),
          nombre_preferido:
            input.nombrePreferido?.trim() || null,
          telefono: input.telefono.trim(),
          fecha_nacimiento: input.fechaNacimiento.trim(),
          genero: input.genero,
          foto_perfil: null,
        },
      },
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("No se pudo crear la cuenta.");
    }

    return {
      requiresEmailConfirmation: !data.session,
    };
  };

  // ========================================================
  // 4. LOGIN
  // ========================================================

  const signIn = async (
    email: string,
    password: string,
  ) => {
    if (!email.trim()) {
      throw new Error("El correo es obligatorio.");
    }

    if (!password) {
      throw new Error("La contraseña es obligatoria.");
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error) throw error;

    if (!data.user) {
      throw new Error("No se pudo iniciar sesión.");
    }

    // ======================================================
    // VERIFICAR ESTADO DE LA CUENTA
    // ======================================================

    const {
      data: perfil,
      error: perfilError,
    } = await supabase
      .from("usuario")
      .select("estado")
      .eq("id_usuario", data.user.id)
      .maybeSingle();

    if (perfilError) {
      await supabase.auth.signOut();

      throw new Error(
        "No fue posible verificar el estado de la cuenta.",
      );
    }

    if (!perfil) {
      await supabase.auth.signOut();

      throw new Error(
        "No se encontró el perfil asociado a esta cuenta.",
      );
    }

    if (perfil.estado === "inactivo") {
      await supabase.auth.signOut();

      throw new Error(
        "Tu cuenta se encuentra inactiva. Contacta al administrador.",
      );
    }
  };

  // ========================================================
  // 5. LOGOUT
  // ========================================================

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setProfile(null);
    setSession(null);
    setUser(null);
  };

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("usuario")
      .select("*, rol (id_rol, nombre, descripcion)")
      .eq("id_usuario", user.id)
      .single();
    if (error) throw error;
    const { data: actual } = await supabase.auth.getSession();
    if (actual.session?.user.id !== user.id) return;
    if (data.estado !== "activo") {
      await supabase.auth.signOut();
      return;
    }
    setProfile(data as UsuarioPerfil);
  }, [user]);

  // ========================================================
  // ESTADO GENERAL
  // ========================================================

  const loading = authLoading || profileLoading;

  const role = profile?.rol?.nombre ?? null;
  const isSuperAdmin = role === "superadministrador";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isSuperAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================================
// HOOK
// ==========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider",
    );
  }

  return context;
};
