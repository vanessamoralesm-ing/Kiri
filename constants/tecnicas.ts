// ============================================================
// CONFIGURACIÓN FRONTEND - TÉCNICAS COMPLEMENTARIAS
// ============================================================

export const CANTIDAD_GROUNDING: Record<number, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
};

export const REPETICIONES_JACOBSON = 2;


// ============================================================
// INFORMACIÓN ADICIONAL PARA LA INTERFAZ
// ============================================================

export const INFO_TECNICAS = {
  grounding: {
    beneficios: [
      "Volver a centrarte en el presente.",
      "Dirigir tu atención hacia tus sentidos.",
      "Crear una pausa ante una sobrecarga de pensamientos.",
    ],

    recomendaciones: [
      "Busca un lugar tranquilo si es posible.",
      "Observa tu entorno sin apresurarte.",
      "Puedes realizar de una a tres respiraciones profundas.",
      "Haz el ejercicio a tu propio ritmo.",
      "No necesitas hacerlo de manera perfecta.",
    ],

    advertencia:
      "Esta técnica es una herramienta de apoyo y no sustituye la atención profesional. Si experimentas malestar intenso o persistente, considera buscar orientación profesional.",

    duracion: "5 minutos aproximadamente",
  },

  jacobson: {
    beneficios: [
      "Reducir la tensión muscular acumulada.",
      "Favorecer un estado de relajación.",
      "Reconocer cuándo tu cuerpo está tenso.",
      "Prepararte ante situaciones de estrés.",
    ],

    recomendaciones: [
      "Busca un lugar cómodo y tranquilo.",
      "Utiliza ropa que te permita moverte con facilidad.",
      "Puedes realizar la técnica sentado o acostado.",
      "Genera tensión muscular sin provocar dolor.",
      "Cada grupo muscular se trabajará dos veces.",
    ],

    advertencia:
      "Si tienes alguna lesión, molestia o dolencia física, consulta con un profesional antes de realizar estos ejercicios.",

    duracion: "20–30 minutos al comenzar",
  },
} as const;


// ============================================================
// TEXTO COMPLEMENTARIO DE LOS PASOS
// ============================================================

export const DETALLE_PASOS = {
  grounding: {
    1: "Pueden ser objetos cotidianos como una ventana, una silla, una pantalla, una lámpara o cualquier elemento cercano. Observa cada uno durante unos segundos.",

    2: "Puedes tocar tu ropa, una mesa, un vaso u otro objeto cercano. Nota su textura, temperatura y la sensación que produce.",

    3: "Escucha sonidos cercanos o lejanos: personas, vehículos, pájaros, electrodomésticos o cualquier sonido presente.",

    4: "Puede ser el aroma del café, tu ropa, un perfume o el ambiente. No importa si es agradable o desagradable; simplemente obsérvalo.",

    5: "Puede ser el sabor de una bebida que hayas tomado recientemente o simplemente la sensación que percibes en tu boca.",
  },

  jacobson: {
    1: "Si cerrar el puño no te resulta cómodo, puedes apoyar el brazo y ejercer una presión suave hacia abajo.",

    2: "Haz fuerza de manera controlada, presta atención a la tensión y después libera lentamente.",

    3: "Frunce el ceño, eleva ligeramente la nariz, aprieta suavemente los labios y la mandíbula y luego libera toda la tensión.",

    4: "Puedes realizar dos movimientos: llevar suavemente la cabeza hacia atrás y después dirigir la barbilla hacia el pecho sin llegar a tocarlo.",

    5: "Primero lleva los hombros hacia atrás intentando acercar los omóplatos y después llévalos suavemente hacia adelante.",

    6: "Arquea ligeramente la espalda y lleva el pecho hacia adelante. Mantén una tensión controlada y después deja de hacer fuerza.",

    7: "Si este movimiento te resulta difícil, también puedes llevar suavemente el ombligo hacia dentro.",

    8: "Hazlo suavemente. No fuerces la pierna ni mantengas una tensión que pueda provocarte molestias o calambres.",

    9: "Mantén una tensión moderada y después libera completamente la pierna, prestando atención a la sensación de relajación.",
  },
} as const;


// ============================================================
// HELPERS
// ============================================================

export type TipoTecnica = keyof typeof INFO_TECNICAS;

export function obtenerTipoTecnica(
  nombre = ""
): TipoTecnica | null {
  const texto = nombre.toLowerCase();

  if (texto.includes("grounding")) return "grounding";
  if (texto.includes("jacobson")) return "jacobson";

  return null;
}

export function obtenerDetallePaso(
  tipo: TipoTecnica | null,
  orden?: number
): string | null {
  if (!tipo || !orden) return null;

  return (
    DETALLE_PASOS[tipo][
      orden as keyof (typeof DETALLE_PASOS)[typeof tipo]
    ] ?? null
  );
}