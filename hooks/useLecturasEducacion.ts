import { useEffect, useState } from "react";

import {
  obtenerCategoriasEducacion,
  obtenerRecursosPorCategoria,
} from "@/services/educacion/educacionService";

import { RecursoPsicoeducativo } from "@/types/educacion";

// ==========================================================
// TIPO DE LECTURA
// ==========================================================

// Conserva el nombre de la categoría junto al recurso para
// poder utilizarlo en los filtros y búsquedas de la biblioteca.
export type LecturaBiblioteca =
  RecursoPsicoeducativo & {
    categoria: string;
  };

// ==========================================================
// HOOK DE LECTURAS DE EDUCACIÓN
// ==========================================================

export function useLecturasEducacion() {
  const [lecturas, setLecturas] = useState<
    LecturaBiblioteca[]
  >([]);

  // ========================================================
  // CARGAR LECTURAS DESDE SUPABASE
  // ========================================================

  // Se obtienen las categorías activas y después los recursos
  // relacionados con cada categoría para formar la biblioteca.
  useEffect(() => {
    let componenteActivo = true;

    async function cargarLecturas() {
      const categoriasSupabase =
        await obtenerCategoriasEducacion();

      const resultados = await Promise.all(
        categoriasSupabase.map(
          async (categoriaSupabase) => {
            const recursos =
              await obtenerRecursosPorCategoria(
                categoriaSupabase.id_categoria
              );

            return recursos.map((recurso) => ({
              ...recurso,
              categoria:
                categoriaSupabase.nombre,
            }));
          }
        )
      );

      // Une los recursos encontrados en todas las categorías.
      const todasLasLecturas =
        resultados.flat();

      // Evita mostrar dos veces el mismo recurso si está
      // relacionado con más de una categoría.
      const lecturasSinDuplicados =
        todasLasLecturas.filter(
          (lectura, index, arreglo) =>
            arreglo.findIndex(
              (item) =>
                item.id_recurso ===
                lectura.id_recurso
            ) === index
        );

      if (componenteActivo) {
        setLecturas(
          lecturasSinDuplicados
        );
      }
    }

    cargarLecturas();

    return () => {
      componenteActivo = false;
    };
  }, []);

  return {
    lecturas,
  };
}