// ==========================================================
// EDUCACIÓN - TYPES
// ==========================================================


// ==========================================================
// CATEGORÍA
// ==========================================================

export interface Categoria {
  id_categoria: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
}


// ==========================================================
// RECURSO PSICOEDUCATIVO
// ==========================================================

export interface RecursoPsicoeducativo {
  id_recurso: string;
  titulo: string;
  descripcion: string | null;
  tipo_recurso: string | null;
  contenido: string | null;
  url_recurso: string | null;
  imagen_portada: string | null;
  autor_fuente: string | null;
  fecha_publicacion: string | null;
  estado: string | null;
}


// ==========================================================
// RECURSO - CATEGORÍA
// ==========================================================

export interface RecursoCategoria {
  id_recurso: string;
  id_categoria: string;
}


// ==========================================================
// VISUALIZACIÓN DE RECURSO
// ==========================================================

export interface VisualizacionRecurso {
  id_visualizacion: string;
  id_usuario: string;
  id_recurso: string;
  fecha: string | null;
}