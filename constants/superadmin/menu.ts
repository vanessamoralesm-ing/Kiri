import { Ionicons } from "@expo/vector-icons";

export interface SuperAdminMenuItem {
    label: string;
    route: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export const SUPERADMIN_MENU: SuperAdminMenuItem[] = [
    { label: "Dashboard", route: "/(superadmin)", icon: "grid-outline" },
    {
        label: "Solicitudes",
        route: "/(superadmin)/solicitudes",
        icon: "document-text-outline",
    },
    {
        label: "Instituciones",
        route: "/(superadmin)/instituciones",
        icon: "business-outline",
    },
    {
        label: "Catálogo oficial",
        route: "/(superadmin)/catalogo-oficial",
        icon: "library-outline",
    },
    {
        label: "Gestión de usuarios",
        route: "/(superadmin)/usuarios",
        icon: "people-outline",
    },
    {
        label: "Gestión de contenido",
        route: "/(superadmin)/contenido",
        icon: "albums-outline",
    },
    {
        label: "Cuestionarios",
        route: "/(superadmin)/cuestionarios",
        icon: "clipboard-outline",
    },
    {
        label: "Reportes globales",
        route: "/(superadmin)/reportes",
        icon: "stats-chart-outline",
    },
    {
        label: "Configuración",
        route: "/(superadmin)/configuracion",
        icon: "settings-outline",
    },
];
