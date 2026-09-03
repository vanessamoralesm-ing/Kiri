import React, { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";

import { Platform } from "react-native";

import type { Session, User } from "@supabase/supabase-js";

import * as Linking from "expo-linking";

import { supabase } from "@/lib/supabase";

import type { SignUpInput, SignUpResult, UsuarioPerfil } from "@/types/auth";

// ==========================================================
// TIPOS
// ==========================================================

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UsuarioPerfil | null;
  loading: boolean;

  signUp: (input: SignUpInput) => Promise<SignUpResult>;

  signIn: (email: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;
}

// ==========================================================
// CONTEXTO
// ==========================================================

const AuthContext = createContext<AuthContextType | null>(null);

// ==========================================================
// PROVIDER
// ==========================================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ======================================================
  // AUTENTICACIÓN
  // ======================================================

  const [session, setSession] = useState<Session | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [profile, setProfile] = useState<UsuarioPerfil | null>(null);

  // ======================================================
  // CARGA
  // ======================================================

  const [authLoading, setAuthLoading] = useState(true);

  const [profileLoading, setProfileLoading] = useState(false);

  // ======================================================
  // 1. INICIALIZAR SESIÓN
  // ======================================================

  useEffect(() => {
    let mounted = true;

    // ==================================================
    // SESIÓN INICIAL
    // ==================================================

    const initializeSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

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

    initializeSession();

    // ==================================================
    // DEEP LINKS EN MÓVIL
    // ==================================================

    let subscriptionLinking: {
      remove: () => void;
    } | null = null;

    if (Platform.OS !== "web") {
      subscriptionLinking = Linking.addEventListener("url", async () => {
        try {
          await supabase.auth.getSession();
        } catch (error) {
          console.error("Error procesando deep link:", error);
        }
      });
    }

    // ==================================================
    // CAMBIOS DE AUTENTICACIÓN
    // ==================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) {
        return;
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);

      /*
       * IMPORTANTE:
       *
       * TOKEN_REFRESHED no debe limpiar el perfil
       * ni activar profileLoading.
       *
       * La carga del perfil se controla exclusivamente
       * mediante el useEffect que depende de user?.id.
       */

      if (!newSession?.user) {
        setProfile(null);
        setProfileLoading(false);
      }

      setAuthLoading(false);

      if (__DEV__) {
        console.log("[AUTH] Evento:", event);
      }
    });

    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      mounted = false;

      subscription.unsubscribe();

      subscriptionLinking?.remove();
    };
  }, []);

  // ======================================================
  // 2. CARGAR PERFIL
  // ======================================================

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      /*
       * El propio efecto del usuario controla
       * profileLoading.
       *
       * Así un TOKEN_REFRESHED no puede dejar
       * loading bloqueado.
       */

      setProfileLoading(true);

      try {
        let data: UsuarioPerfil | null = null;

        let error: Error | null = null;

        // ==========================================
        // REINTENTOS
        // ==========================================

        for (let intento = 0; intento < 3 && !data; intento++) {
          const resultado = await supabase
            .from("usuario")
            .select(
              `
                            *,
                            rol (
                                id_rol,
                                nombre,
                                descripcion
                            )
                        `,
            )
            .eq("id_usuario", user.id)
            .maybeSingle();

          data = resultado.data as UsuarioPerfil | null;

          error = resultado.error;

          if (!data && intento < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        if (cancelled) {
          return;
        }

        // ==========================================
        // ERROR
        // ==========================================

        if (error || !data) {
          console.error(
            "Error cargando public.usuario:",
            error?.message ?? "Perfil no encontrado.",
          );

          setProfile(null);

          return;
        }

        // ==========================================
        // PERFIL
        // ==========================================

        setProfile(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Error inesperado cargando perfil:", error);

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

  // ======================================================
  // 3. REGISTRO
  // ======================================================

  const signUp = async (input: SignUpInput): Promise<SignUpResult> => {
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
      throw new Error("La fecha de nacimiento es obligatoria.");
    }

    if (!input.genero) {
      throw new Error("El género es obligatorio.");
    }

    if (!input.password) {
      throw new Error("La contraseña es obligatoria.");
    }

    if (input.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    // ==================================================
    // URL DE REDIRECCIÓN
    // ==================================================

    const redirectUrl =
      Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : Linking.createURL("/(auth)/login");

    // ==================================================
    // CREAR USUARIO
    // ==================================================

    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),

      password: input.password,

      options: {
        emailRedirectTo: redirectUrl,

        data: {
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

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("No se pudo crear la cuenta.");
    }

    return {
      requiresEmailConfirmation: !data.session,
    };
  };

  // ======================================================
  // 4. LOGIN
  // ======================================================

  const signIn = async (email: string, password: string) => {
    if (!email.trim()) {
      throw new Error("El correo es obligatorio.");
    }

    if (!password) {
      throw new Error("La contraseña es obligatoria.");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),

      password,
    });

    if (error) {
      throw error;
    }
  };

  // ======================================================
  // 5. LOGOUT
  // ======================================================

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setProfile(null);
  };

  // ======================================================
  // LOADING GENERAL
  // ======================================================

  const loading = authLoading || profileLoading;

  // ======================================================
  // CONTEXT
  // ======================================================

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

// ==========================================================
// HOOK
// ==========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
};
