import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useColorScheme } from "react-native";

// ==========================================================
// TIPOS
// ==========================================================

// Preferencia elegida por el usuario.
export type ThemePreference = "system" | "light" | "dark";

// Tema efectivo aplicado a la aplicación.
export type ThemeMode = "light" | "dark";

interface ThemeModeContextType {
    // Tema que se está utilizando realmente.
    themeMode: ThemeMode;

    // Preferencia del usuario.
    themePreference: ThemePreference;

    // Tema detectado del dispositivo.
    systemTheme: ThemeMode;

    isDarkMode: boolean;

    // Mantiene compatibilidad con los componentes existentes.
    setThemeMode: (mode: ThemePreference) => void;

    toggleDarkMode: () => void;

    // Permite volver a la configuración del dispositivo.
    useSystemTheme: () => void;

    // Indica si la preferencia guardada ya se ha cargado.
    isThemeReady: boolean;
}

// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const STORAGE_KEY = "@kiri:theme-preference";

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(
    undefined,
);

// ==========================================================
// PROVIDER
// ==========================================================

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    // Detecta los cambios del tema del dispositivo.
    const systemColorScheme = useColorScheme();

    const systemTheme: ThemeMode =
        systemColorScheme === "dark" ? "dark" : "light";

    // Por defecto, seguir el tema del dispositivo.
    const [themePreference, setThemePreference] =
        useState<ThemePreference>("system");

    const [isThemeReady, setIsThemeReady] = useState(false);

    // ========================================================
    // RECUPERAR PREFERENCIA
    // ========================================================

    useEffect(() => {
        let mounted = true;

        async function loadThemePreference() {
            try {
                const storedPreference = await AsyncStorage.getItem(STORAGE_KEY);

                if (
                    mounted &&
                    (storedPreference === "system" ||
                        storedPreference === "light" ||
                        storedPreference === "dark")
                ) {
                    setThemePreference(storedPreference);
                }
            } catch (error) {
                console.error("Error al recuperar la preferencia del tema:", error);
            } finally {
                if (mounted) {
                    setIsThemeReady(true);
                }
            }
        }

        loadThemePreference();

        return () => {
            mounted = false;
        };
    }, []);

    // ========================================================
    // TEMA EFECTIVO
    // ========================================================

    const themeMode: ThemeMode =
        themePreference === "system" ? systemTheme : themePreference;

    const isDarkMode = themeMode === "dark";

    // ========================================================
    // CAMBIAR PREFERENCIA
    // ========================================================

    const setThemeMode = useCallback((mode: ThemePreference) => {
        setThemePreference(mode);

        AsyncStorage.setItem(STORAGE_KEY, mode).catch((error) => {
            console.error("Error al guardar el tema:", error);
        });
    }, []);

    // ========================================================
    // ALTERNAR MODO CLARO / OSCURO
    // ========================================================

    const toggleDarkMode = useCallback(() => {
        const nextMode: ThemeMode = themeMode === "dark" ? "light" : "dark";

        setThemeMode(nextMode);
    }, [themeMode, setThemeMode]);

    // ========================================================
    // RESTABLECER TEMA DEL SISTEMA
    // ========================================================

    const useSystemTheme = useCallback(() => {
        setThemeMode("system");
    }, [setThemeMode]);

    // ========================================================
    // CONTEXTO
    // ========================================================

    const value = useMemo<ThemeModeContextType>(
        () => ({
            themeMode,
            themePreference,
            systemTheme,
            isDarkMode,
            setThemeMode,
            toggleDarkMode,
            useSystemTheme,
            isThemeReady,
        }),
        [
            themeMode,
            themePreference,
            systemTheme,
            isDarkMode,
            setThemeMode,
            toggleDarkMode,
            useSystemTheme,
            isThemeReady,
        ],
    );

    return (
        <ThemeModeContext.Provider value={value}>
            {children}
        </ThemeModeContext.Provider>
    );
}

// ==========================================================
// HOOK
// ==========================================================

export function useThemeMode() {
    const context = useContext(ThemeModeContext);

    if (!context) {
        throw new Error("useThemeMode debe utilizarse dentro de ThemeModeProvider");
    }

    return context;
}
