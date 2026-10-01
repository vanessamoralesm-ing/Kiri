import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/responsive";

export function useResponsiveLayout() {
    const { width, height } = useWindowDimensions();

    const esTelefono =
        width < BREAKPOINTS.telefono;

    const esTablet =
        width >= BREAKPOINTS.telefono &&
        width < BREAKPOINTS.escritorio;

    const esEscritorio =
        width >= BREAKPOINTS.escritorio;

    return {
        width,
        height,
        esTelefono,
        esTablet,
        esEscritorio,
    };
}