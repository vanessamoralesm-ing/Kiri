export type PeriodoReporte = "30" | "90" | "365" | "todo";
export interface ResumenReporte {
  total: number;
  activos: number;
  inactivos: number;
}
export interface CatalogoInstitucion {
  id: string;
  nombre: string;
  codigo: string;
}
export interface InstitucionReporte
  extends CatalogoInstitucion, ResumenReporte {
  estado: string | null;
}
export interface RolReporte extends ResumenReporte {
  id: string;
  nombre: string;
}
export interface UsoReporte {
  id: string;
  nombre: string;
  total: number;
}
export interface RankingReporte {
  items: UsoReporte[];
  error: string | null;
}
export type UsoGlobalReporte = Record<
  "tests" | "tecnicas" | "diarios",
  RankingReporte
>;
export type FormatoReporte = "excel" | "pdf";
export interface ReporteGlobal {
  generadoEn: string;
  desde: string | null;
  hasta: string;
  catalogo: CatalogoInstitucion[];
  instituciones: ResumenReporte;
  usuarios: ResumenReporte;
  solicitudes: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
  };
  porInstitucion: InstitucionReporte[];
  porRol: RolReporte[];
  uso: UsoGlobalReporte;
}
