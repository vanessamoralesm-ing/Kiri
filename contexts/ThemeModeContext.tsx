import React, {
    createContext,
    useContext,
    useState,
} from "react";

import {
    useColorScheme,
} from "react-native";


type ThemeMode =
    | "light"
    | "dark";


interface ThemeModeContextType {
    themeMode: ThemeMode;
    isDarkMode: boolean;
    setThemeMode: (
        mode: ThemeMode
    ) => void;
    toggleDarkMode: () => void;
}


const ThemeModeContext =
    createContext<
        ThemeModeContextType | undefined
    >(undefined);


// ==========================================================
// PROVIDER
// ==========================================================

export function ThemeModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const systemColorScheme =
        useColorScheme();


    const [
        themeMode,
        setThemeMode,
    ] =
        useState<ThemeMode>(
            systemColorScheme === "dark"
                ? "dark"
                : "light"
        );


    const isDarkMode =
        themeMode === "dark";


    function toggleDarkMode() {

        setThemeMode(
            current =>
                current === "dark"
                    ? "light"
                    : "dark"
        );

    }


    return (

        <ThemeModeContext.Provider
            value={{
                themeMode,
                isDarkMode,
                setThemeMode,
                toggleDarkMode,
            }}
        >

            {children}

        </ThemeModeContext.Provider>

    );

}


// ==========================================================
// HOOK
// ==========================================================

export function useThemeMode() {

    const context =
        useContext(
            ThemeModeContext
        );


    if (
        !context
    ) {

        throw new Error(
            "useThemeMode debe utilizarse dentro de ThemeModeProvider"
        );

    }


    return context;

}