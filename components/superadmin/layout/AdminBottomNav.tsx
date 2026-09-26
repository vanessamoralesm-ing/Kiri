import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

// ==========================================================
// TIPOS
// ==========================================================

interface NavigationItem {
    label: string;
    labelMovil: string;

    route: string;

    icon: keyof typeof Ionicons.glyphMap;

    iconActive: keyof typeof Ionicons.glyphMap;
}

// ==========================================================
// NAVEGACIÓN PRINCIPAL
// ==========================================================

const MAIN_ITEMS: NavigationItem[] = [
    {
        label: "Inicio",
        labelMovil: "Inicio",
        route: "/superadmin",
        icon: "grid-outline",
        iconActive: "grid",
    },
    {
        label: "Solicitudes",
        labelMovil: "Solic.",
        route: "/superadmin/solicitudes",
        icon: "mail-outline",
        iconActive: "mail",
    },
    {
        label: "Instituciones",
        labelMovil: "Instit.",
        route: "/superadmin/instituciones",
        icon: "business-outline",
        iconActive: "business",
    },
];

// ==========================================================
// OPCIONES SECUNDARIAS
// ==========================================================

const MORE_ITEMS: NavigationItem[] = [
    {
        label: "Catálogo oficial",
        labelMovil: "Catálogo",
        route: "/superadmin/catalogo-oficial",
        icon: "library-outline",
        iconActive: "library",
    },
    {
        label: "Gestión de usuarios",
        labelMovil: "Usuarios",
        route: "/superadmin/usuarios",
        icon: "people-outline",
        iconActive: "people",
    },
    {
        label: "Gestión de contenido",
        labelMovil: "Contenido",
        route: "/superadmin/contenido",
        icon: "documents-outline",
        iconActive: "documents",
    },
    {
        label: "Cuestionarios",
        labelMovil: "Cuestionarios",
        route: "/superadmin/cuestionarios",
        icon: "clipboard-outline",
        iconActive: "clipboard",
    },
    {
        label: "Reportes globales",
        labelMovil: "Reportes",
        route: "/superadmin/reportes",
        icon: "analytics-outline",
        iconActive: "analytics",
    },
    {
        label: "Configuración",
        labelMovil: "Configuración",
        route: "/superadmin/configuracion",
        icon: "settings-outline",
        iconActive: "settings",
    },
];

// ==========================================================
// COMPONENTE
// ==========================================================

export default function AdminBottomNav() {
    const router = useRouter();

    const pathname = usePathname();

    const { width, height } = useWindowDimensions();

    const insets = useSafeAreaInsets();

    const { signOut } = useAuth();

    // ========================================================
    // ESTADOS
    // ========================================================

    const [menuAbierto, setMenuAbierto] = useState(false);

    const [cerrandoSesion, setCerrandoSesion] = useState(false);

    // ========================================================
    // TEMA
    // ========================================================

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const dangerColor = useThemeColor({}, "danger");

    // ========================================================
    // RESPONSIVE REAL
    // ========================================================

    const esMovil = width < 600;

    const esMovilPequeno = width < 380;

    // ========================================================
    // BARRA INFERIOR
    // ========================================================

    const paddingInferior = Math.max(insets.bottom, 8);

    const paddingHorizontalBarra = 8;

    const alturaContenidoBarra = 58;

    const alturaBarra = alturaContenidoBarra + paddingInferior + 6;

    /*
     * IMPORTANTE:
     * calculamos el ancho numéricamente.
     *
     * No usamos flexGrow, width:"25%" ni flexBasis.
     */
    const anchoDisponibleBarra = width - paddingHorizontalBarra * 2;

    const anchoItemBarra = anchoDisponibleBarra / 4;

    // ========================================================
    // PANEL MÁS
    // ========================================================

    const margenPanel = esMovil ? 12 : 20;

    const anchoMaximoPanel = esMovil
        ? width - margenPanel * 2
        : Math.min(680, width - margenPanel * 2);

    const paddingGrid = 14;

    const gapGrid = 12;

    const columnasGrid = width < 430 ? 2 : 3;

    const anchoDisponibleGrid = anchoMaximoPanel - paddingGrid * 2;

    const anchoItemGrid =
        (anchoDisponibleGrid - gapGrid * (columnasGrid - 1)) / columnasGrid;

    /*
     * El panel nunca puede invadir
     * la zona superior segura.
     */
    const alturaMaximaPanel = Math.min(
        esMovil ? 570 : 520,

        height - insets.top - alturaBarra - 28,
    );

    // ========================================================
    // RUTA ACTUAL
    // ========================================================

    const rutaActual = useMemo(() => {
        if (pathname === "/superadmin" || pathname === "/superadmin/") {
            return "/superadmin";
        }

        return pathname;
    }, [pathname]);

    function estaActiva(route: string) {
        if (route === "/superadmin") {
            return rutaActual === "/superadmin";
        }

        return rutaActual === route || rutaActual.startsWith(`${route}/`);
    }

    const secundariaActiva = useMemo(
        () =>
            MORE_ITEMS.some(
                (item) =>
                    rutaActual === item.route || rutaActual.startsWith(`${item.route}/`),
            ),
        [rutaActual],
    );

    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    function navegar(route: string) {
        setMenuAbierto(false);

        if (rutaActual === route) {
            return;
        }

        router.push(route as never);
    }

    // ========================================================
    // CERRAR SESIÓN
    // ========================================================

    async function manejarCerrarSesion() {
        if (cerrandoSesion) {
            return;
        }

        try {
            setCerrandoSesion(true);

            await signOut();

            setMenuAbierto(false);
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
            setCerrandoSesion(false);
        }
    }

    // ========================================================
    // ITEM DE BARRA
    // ========================================================

    function renderItemBarra(item: NavigationItem) {
        const activa = estaActiva(item.route);

        return (
            <Pressable
                key={item.route}
                onPress={() => navegar(item.route)}
                style={({ pressed }) => ({
                    width: anchoItemBarra,

                    height: alturaContenidoBarra,

                    alignItems: "center",

                    justifyContent: "center",

                    opacity: pressed ? 0.7 : 1,
                })}
            >
                <View
                    style={{
                        width: 44,

                        height: 36,

                        borderRadius: 12,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: activa ? primarySoftColor : "transparent",
                    }}
                >
                    <Ionicons
                        name={activa ? item.iconActive : item.icon}
                        size={23}
                        color={activa ? primaryColor : textSecondaryColor}
                    />
                </View>

                <Text
                    numberOfLines={1}
                    style={{
                        width: anchoItemBarra - 6,

                        marginTop: 3,

                        fontFamily: activa ? "Nunito-Bold" : "Nunito-Medium",

                        fontSize: esMovilPequeno ? 9 : 10,

                        lineHeight: 12,

                        textAlign: "center",

                        color: activa ? primaryColor : textSecondaryColor,
                    }}
                >
                    {esMovil ? item.labelMovil : item.label}
                </Text>
            </Pressable>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                width: "100%",

                position: "relative",

                zIndex: 5000,
            }}
        >
            {/* ====================================================
          FONDO OSCURO
      ==================================================== */}

            {menuAbierto && (
                <Pressable
                    onPress={() => setMenuAbierto(false)}
                    style={{
                        position: "absolute",

                        left: 0,

                        bottom: alturaBarra,

                        width,

                        height: Math.max(0, height - alturaBarra - insets.top),

                        backgroundColor: "rgba(0,0,0,0.42)",

                        zIndex: 4998,
                    }}
                />
            )}

            {/* ====================================================
          PANEL MÁS
      ==================================================== */}

            {menuAbierto && (
                <View
                    style={{
                        position: "absolute",

                        width: anchoMaximoPanel,

                        maxHeight: alturaMaximaPanel,

                        alignSelf: "center",

                        bottom: alturaBarra + 10,

                        borderWidth: 1,

                        borderColor,

                        borderRadius: 24,

                        overflow: "hidden",

                        backgroundColor: surfaceColor,

                        zIndex: 5001,

                        ...(Platform.OS === "web"
                            ? ({
                                boxShadow: "0px -8px 28px rgba(0,0,0,0.18)",
                            } as any)
                            : {}),

                        ...(Platform.OS === "ios"
                            ? {
                                shadowColor: "#000",

                                shadowOffset: {
                                    width: 0,
                                    height: -5,
                                },

                                shadowOpacity: 0.18,

                                shadowRadius: 14,
                            }
                            : {}),

                        ...(Platform.OS === "android"
                            ? {
                                elevation: 24,
                            }
                            : {}),
                    }}
                >
                    {/* ================================================
              HEADER DEL PANEL
          ================================================ */}

                    <View
                        style={{
                            minHeight: 76,

                            paddingHorizontal: 18,

                            paddingVertical: 14,

                            flexDirection: "row",

                            alignItems: "center",

                            borderBottomWidth: 1,

                            borderBottomColor: borderColor,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,

                                minWidth: 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: 18,

                                    color: textColor,
                                }}
                            >
                                Más opciones
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 12,

                                    color: textMutedColor,
                                }}
                            >
                                Administración de Kiri
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => setMenuAbierto(false)}
                            hitSlop={10}
                            style={({ pressed }) => ({
                                width: 40,

                                height: 40,

                                borderRadius: 12,

                                alignItems: "center",

                                justifyContent: "center",

                                opacity: pressed ? 0.65 : 1,

                                backgroundColor: pressed
                                    ? surfaceSecondaryColor
                                    : "transparent",
                            })}
                        >
                            <Ionicons name="close" size={25} color={textSecondaryColor} />
                        </Pressable>
                    </View>

                    {/* ================================================
              SCROLL INTERNO
          ================================================ */}

                    <ScrollView
                        style={{
                            width: "100%",
                        }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            width: "100%",

                            padding: paddingGrid,

                            alignItems: "stretch",
                        }}
                    >
                        {/* ==============================================
    GRID DE OPCIONES
============================================== */}

                        <View
                            style={{
                                width: "100%",

                                flexDirection: "row",
                                flexWrap: "wrap",

                                columnGap: gapGrid,
                                rowGap: 16,
                            }}
                        >
                            {MORE_ITEMS.map((item) => {
                                const activa = estaActiva(item.route);

                                return (
                                    <Pressable
                                        key={item.route}
                                        onPress={() => navegar(item.route)}
                                        style={({ pressed }) => ({
                                            width: anchoItemGrid,

                                            minHeight: 108,

                                            paddingHorizontal: 4,

                                            paddingVertical: 10,

                                            borderRadius: 16,

                                            borderWidth: activa ? 1 : 0,

                                            borderColor: activa ? primaryColor : "transparent",

                                            alignItems: "center",

                                            justifyContent: "flex-start",

                                            opacity: pressed ? 0.78 : 1,

                                            backgroundColor: activa
                                                ? primarySoftColor
                                                : pressed
                                                    ? surfaceSecondaryColor
                                                    : "transparent",
                                        })}
                                    >
                                        {/* ==========================================
            CONTENEDOR CENTRAL
        ========================================== */}

                                        <View
                                            style={{
                                                width: "100%",

                                                flex: 1,

                                                alignItems: "center",

                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {/* ICONO */}

                                            <View
                                                style={{
                                                    width: 48,

                                                    height: 48,

                                                    borderRadius: 14,

                                                    alignItems: "center",

                                                    justifyContent: "center",

                                                    flexShrink: 0,

                                                    backgroundColor: activa
                                                        ? primaryColor
                                                        : surfaceSecondaryColor,
                                                }}
                                            >
                                                <Ionicons
                                                    name={activa ? item.iconActive : item.icon}
                                                    size={23}
                                                    color={
                                                        activa ? textOnPrimaryColor : textSecondaryColor
                                                    }
                                                />
                                            </View>

                                            {/* TEXTO */}

                                            <View
                                                style={{
                                                    width: "100%",

                                                    minHeight: 38,

                                                    marginTop: 8,

                                                    alignItems: "center",

                                                    justifyContent: "flex-start",
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={2}
                                                    style={{
                                                        width: "100%",

                                                        fontFamily: activa
                                                            ? "Nunito-Bold"
                                                            : "Nunito-SemiBold",

                                                        fontSize: 12,

                                                        lineHeight: 17,

                                                        textAlign: "center",

                                                        includeFontPadding: false,

                                                        color: activa ? primaryColor : textColor,
                                                    }}
                                                >
                                                    {item.label}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* ==============================================
                SEPARADOR
            ============================================== */}

                        <View
                            style={{
                                width: "100%",

                                height: 1,

                                marginTop: 16,

                                marginBottom: 8,

                                backgroundColor: borderColor,
                            }}
                        />

                        {/* =================================================
    ACCIONES SECUNDARIAS
================================================= */}

                        <View
                            style={{
                                width: "100%",

                                marginTop: 18,
                                paddingTop: 12,

                                borderTopWidth: 1,
                                borderTopColor: borderColor,
                            }}
                        >
                            {/* =================================================
      AYUDA Y DOCS
  ================================================= */}

                            <Pressable
                                onPress={() => {
                                    console.log("Abrir documentación");
                                    setMenuAbierto(false);
                                }}
                                style={({ pressed }) => ({
                                    width: "100%",

                                    borderRadius: 14,

                                    overflow: "hidden",

                                    backgroundColor: pressed
                                        ? surfaceSecondaryColor
                                        : "transparent",
                                })}
                            >
                                <View
                                    style={{
                                        width: "100%",

                                        minHeight: 54,

                                        paddingHorizontal: 10,
                                        paddingVertical: 7,

                                        flexDirection: "row",

                                        alignItems: "center",

                                        justifyContent: "flex-start",
                                    }}
                                >
                                    {/* ICONO */}

                                    <View
                                        style={{
                                            width: 38,
                                            height: 38,

                                            borderRadius: 11,

                                            flexShrink: 0,

                                            alignItems: "center",
                                            justifyContent: "center",

                                            backgroundColor: surfaceSecondaryColor,
                                        }}
                                    >
                                        <Ionicons
                                            name="help-circle-outline"
                                            size={20}
                                            color={textSecondaryColor}
                                        />
                                    </View>

                                    {/* TEXTO */}

                                    <View
                                        style={{
                                            flex: 1,

                                            minWidth: 0,

                                            marginLeft: 12,

                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 13,
                                                lineHeight: 18,

                                                includeFontPadding: false,

                                                color: textSecondaryColor,
                                            }}
                                        >
                                            Ayuda y Docs
                                        </Text>
                                    </View>

                                    {/* FLECHA */}

                                    <View
                                        style={{
                                            width: 28,

                                            flexShrink: 0,

                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Ionicons
                                            name="chevron-forward"
                                            size={18}
                                            color={textMutedColor}
                                        />
                                    </View>
                                </View>
                            </Pressable>

                            {/* =================================================
      CERRAR SESIÓN
  ================================================= */}

                            <Pressable
                                disabled={cerrandoSesion}
                                onPress={manejarCerrarSesion}
                                style={({ pressed }) => ({
                                    width: "100%",

                                    marginTop: 4,

                                    borderRadius: 14,

                                    overflow: "hidden",

                                    opacity: cerrandoSesion ? 0.6 : 1,

                                    backgroundColor: pressed
                                        ? "rgba(220, 38, 38, 0.08)"
                                        : "transparent",
                                })}
                            >
                                <View
                                    style={{
                                        width: "100%",

                                        minHeight: 54,

                                        paddingHorizontal: 10,
                                        paddingVertical: 7,

                                        flexDirection: "row",

                                        alignItems: "center",

                                        justifyContent: "flex-start",
                                    }}
                                >
                                    {/* ICONO */}

                                    <View
                                        style={{
                                            width: 38,
                                            height: 38,

                                            borderRadius: 11,

                                            flexShrink: 0,

                                            alignItems: "center",
                                            justifyContent: "center",

                                            backgroundColor: "rgba(220, 38, 38, 0.10)",
                                        }}
                                    >
                                        {cerrandoSesion ? (
                                            <ActivityIndicator size="small" color={dangerColor} />
                                        ) : (
                                            <Ionicons
                                                name="log-out-outline"
                                                size={20}
                                                color={dangerColor}
                                            />
                                        )}
                                    </View>

                                    {/* TEXTO */}

                                    <View
                                        style={{
                                            flex: 1,

                                            minWidth: 0,

                                            marginLeft: 12,

                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 13,
                                                lineHeight: 18,

                                                includeFontPadding: false,

                                                color: dangerColor,
                                            }}
                                        >
                                            {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* ====================================================
          BA{/* ====================================================
    BARRA INFERIOR
==================================================== */}

            <View
                style={{
                    width,

                    minHeight: alturaBarra,

                    paddingTop: 6,

                    paddingBottom: paddingInferior,

                    paddingHorizontal: paddingHorizontalBarra,

                    borderTopWidth: 1,
                    borderTopColor: borderColor,

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",

                    backgroundColor: surfaceColor,

                    zIndex: 5002,
                }}
            >
                {MAIN_ITEMS.map((item) => {
                    const activa = estaActiva(item.route);

                    return (
                        <Pressable
                            key={item.route}
                            onPress={() => navegar(item.route)}
                            style={({ pressed }) => ({
                                width: anchoItemBarra,

                                height: 60,

                                alignItems: "center",

                                justifyContent: "center",

                                opacity: pressed ? 0.7 : 1,
                            })}
                        >
                            {/* ICONO */}

                            <View
                                style={{
                                    width: 48,
                                    height: 38,

                                    borderRadius: 12,

                                    alignItems: "center",

                                    justifyContent: "center",

                                    backgroundColor: activa ? primarySoftColor : "transparent",
                                }}
                            >
                                <Ionicons
                                    name={activa ? item.iconActive : item.icon}
                                    size={24}
                                    color={activa ? primaryColor : textSecondaryColor}
                                />
                            </View>

                            {/* TEXTO */}

                            <Text
                                numberOfLines={1}
                                style={{
                                    width: "100%",

                                    marginTop: 4,

                                    fontFamily: activa ? "Nunito-Bold" : "Nunito-Medium",

                                    fontSize: 10,

                                    lineHeight: 13,

                                    textAlign: "center",

                                    color: activa ? primaryColor : textSecondaryColor,
                                }}
                            >
                                {esMovil ? item.labelMovil : item.label}
                            </Text>
                        </Pressable>
                    );
                })}

                {/* MÁS */}

                <Pressable
                    onPress={() => setMenuAbierto((actual) => !actual)}
                    style={({ pressed }) => ({
                        width: anchoItemBarra,

                        height: 60,

                        alignItems: "center",

                        justifyContent: "center",

                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <View
                        style={{
                            width: 48,
                            height: 38,

                            borderRadius: 12,

                            alignItems: "center",

                            justifyContent: "center",

                            backgroundColor:
                                secundariaActiva || menuAbierto
                                    ? primarySoftColor
                                    : "transparent",
                        }}
                    >
                        <Ionicons
                            name={secundariaActiva || menuAbierto ? "apps" : "apps-outline"}
                            size={24}
                            color={
                                secundariaActiva || menuAbierto
                                    ? primaryColor
                                    : textSecondaryColor
                            }
                        />
                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            width: "100%",

                            marginTop: 4,

                            fontFamily:
                                secundariaActiva || menuAbierto
                                    ? "Nunito-Bold"
                                    : "Nunito-Medium",

                            fontSize: 10,

                            lineHeight: 13,

                            textAlign: "center",

                            color:
                                secundariaActiva || menuAbierto
                                    ? primaryColor
                                    : textSecondaryColor,
                        }}
                    >
                        Más
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
