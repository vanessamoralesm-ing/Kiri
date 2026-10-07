import type { AdminStatCardProps } from "@/components/admin/AdminStatCard";
import type { SuperAdminDashboardStats } from "@/services/superadmin/dashboardService";

export const INDICADORES_DASHBOARD: (Omit<AdminStatCardProps, "valor"> & {
  clave: keyof SuperAdminDashboardStats;
})[] = [
  {
    clave: "solicitudesPendientes",
    titulo: "SOLICITUDES",
    descripcion: "Requieren validación",
    icono: "mail-outline",
    variante: "primary",
  },
  {
    clave: "institucionesActivas",
    titulo: "INST. ACTIVAS",
    descripcion: "Instituciones activas",
    icono: "business-outline",
    variante: "secondary",
  },
  {
    clave: "usuariosRegistrados",
    titulo: "USUARIOS",
    descripcion: "Usuarios registrados",
    icono: "people-outline",
    variante: "primary",
  },
  {
    clave: "cuestionariosActivos",
    titulo: "CUESTIONARIOS",
    descripcion: "Cuestionarios activos",
    icono: "clipboard-outline",
    variante: "secondary",
  },
];

export const ACCIONES_DASHBOARD = [
  {
    titulo: "Revisar solicitudes",
    ruta: "/superadmin/solicitudes",
    icono: "mail-outline",
    fondo: "bg-primary-soft",
    color: "text-primary",
  },
  {
    titulo: "Agregar institución",
    ruta: "/superadmin/instituciones/nuevo",
    icono: "business-outline",
    fondo: "bg-secondary-soft",
    color: "text-secondary",
  },
  {
    titulo: "Crear cuestionario",
    ruta: "/superadmin/cuestionarios/nuevo",
    icono: "clipboard-outline",
    fondo: "bg-accent-soft",
    color: "text-accent",
  },
] as const;