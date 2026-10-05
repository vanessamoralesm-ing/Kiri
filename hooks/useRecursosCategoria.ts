import { useEffect, useState } from "react";

import {
  obtenerCategoriaPorNombre,
  obtenerRecursosPorCategoria,
} from "@/services/educacion/educacionService";

import { RecursoPsicoeducativo } from "@/types/educacion";

// ==========================================================
// HOOK DE RECURSOS POR CATEGORÍA
// ==========================================================

export function useRecursosCategoria(
  nombreCategoria?: string
) {
  const [recursos, setRecursos] = useState<
    RecursoPsicoeducativo[]
  >([]);

  // ========================================================
  // CARGAR RECURSOS DESDE SUPABASE
  // ========================================================

  // Busca la categoría por su nombre y obtiene los recursos
  // relacionados con ella.
  useEffect(() => {
    let componenteActivo = true;

    async function cargarRecursos() {
      if (!nombreCategoria) {
        if (componenteActivo) {
          setRecursos([]);
        }

        return;
      }

      const categoriaSupabase =
        await obtenerCategoriaPorNombre(
          nombreCategoria
        );

      if (!categoriaSupabase) {
        if (componenteActivo) {
          setRecursos([]);
        }

        return;
      }

      const recursosSupabase =
        await obtenerRecursosPorCategoria(
          categoriaSupabase.id_categoria
        );

      if (componenteActivo) {
        setRecursos(recursosSupabase);
      }
    }

    cargarRecursos();

    return () => {
      componenteActivo = false;
    };
  }, [nombreCategoria]);

  return {
    recursos,
  };
}