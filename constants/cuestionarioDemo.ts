import { Cuestionario } from "@/types/cuestionarios";

export const cuestionariosDemo: Cuestionario[] = [
    {
        id: "rathus",
        titulo: "Test de Asertividad de Rathus",
        descripcion:
            "Instrumento orientado a explorar conductas relacionadas con la expresión de opiniones, peticiones y límites personales.",
        instrucciones:
            "Selecciona la alternativa que mejor describa qué tanto te caracteriza cada afirmación.",
        tipo: "opcion_unica",

        preguntas: [
            {
                id: "r1",
                texto: "Mucha gente parece ser más agresiva que yo.",
                descripcion:
                    "Selecciona la opción que mejor represente tu comportamiento habitual.",
                opciones: [
                    {
                        id: "r1-1",
                        texto: "Muy característico de mí",
                        valor: 3,
                    },
                    {
                        id: "r1-2",
                        texto: "Bastante característico de mí",
                        valor: 2,
                    },
                    {
                        id: "r1-3",
                        texto: "Algo característico de mí",
                        valor: 1,
                    },
                    {
                        id: "r1-4",
                        texto: "Algo no característico de mí",
                        valor: -1,
                    },
                    {
                        id: "r1-5",
                        texto: "Bastante poco característico de mí",
                        valor: -2,
                    },
                    {
                        id: "r1-6",
                        texto: "Muy poco característico de mí",
                        valor: -3,
                    },
                ],
            },

            {
                id: "r2",
                texto:
                    "He dudado en solicitar o aceptar citas por timidez.",
                descripcion:
                    "Selecciona la opción que mejor represente tu comportamiento habitual.",
                opciones: [
                    {
                        id: "r2-1",
                        texto: "Muy característico de mí",
                        valor: 3,
                    },
                    {
                        id: "r2-2",
                        texto: "Bastante característico de mí",
                        valor: 2,
                    },
                    {
                        id: "r2-3",
                        texto: "Algo característico de mí",
                        valor: 1,
                    },
                    {
                        id: "r2-4",
                        texto: "Algo no característico de mí",
                        valor: -1,
                    },
                    {
                        id: "r2-5",
                        texto: "Bastante poco característico de mí",
                        valor: -2,
                    },
                    {
                        id: "r2-6",
                        texto: "Muy poco característico de mí",
                        valor: -3,
                    },
                ],
            },
        ],
    },

    {
        id: "coopersmith-adultos",
        titulo: "Inventario de Autoestima de Coopersmith",
        descripcion:
            "Cuestionario orientado a explorar la percepción habitual que la persona tiene sobre sí misma.",
        instrucciones:
            "Indica si cada declaración describe o no cómo te sientes habitualmente.",
        tipo: "opcion_unica",

        preguntas: [
            {
                id: "c1",
                texto: "Paso mucho tiempo soñando despierto(a).",
                opciones: [
                    {
                        id: "c1-1",
                        texto: "Igual que yo",
                        valor: 1,
                    },
                    {
                        id: "c1-2",
                        texto: "Distinto a mí",
                        valor: 0,
                    },
                ],
            },

            {
                id: "c2",
                texto: "Estoy seguro(a) de mí mismo(a).",
                opciones: [
                    {
                        id: "c2-1",
                        texto: "Igual que yo",
                        valor: 1,
                    },
                    {
                        id: "c2-2",
                        texto: "Distinto a mí",
                        valor: 0,
                    },
                ],
            },
        ],
    },

    {
        id: "fss",
        titulo: "Escala de Severidad de Fatiga",
        descripcion:
            "Escala orientada a explorar el impacto de la fatiga en distintas actividades.",
        instrucciones:
            "Selecciona un valor del 1 al 7, donde 1 representa total desacuerdo y 7 totalmente de acuerdo.",
        tipo: "escala",

        preguntas: [
            {
                id: "f1",
                texto: "Mi motivación se reduce cuando estoy fatigado.",
                opciones: [
                    { id: "f1-1", texto: "1", valor: 1 },
                    { id: "f1-2", texto: "2", valor: 2 },
                    { id: "f1-3", texto: "3", valor: 3 },
                    { id: "f1-4", texto: "4", valor: 4 },
                    { id: "f1-5", texto: "5", valor: 5 },
                    { id: "f1-6", texto: "6", valor: 6 },
                    { id: "f1-7", texto: "7", valor: 7 },
                ],
            },
        ],
    },

    {
        id: "sads",
        titulo: "Escala de Evitación y Malestar Social",
        descripcion:
            "Instrumento compuesto por afirmaciones relacionadas con las reacciones ante situaciones sociales.",
        instrucciones:
            "Indica si cada afirmación refleja o no tu reacción habitual.",
        tipo: "verdadero_falso",

        preguntas: [
            {
                id: "s1",
                texto:
                    "Me siento relajado incluso en situaciones sociales no familiares.",
                opciones: [
                    {
                        id: "s1-v",
                        texto: "Verdadero",
                        valor: 1,
                    },
                    {
                        id: "s1-f",
                        texto: "Falso",
                        valor: 0,
                    },
                ],
            },
        ],
    },
];