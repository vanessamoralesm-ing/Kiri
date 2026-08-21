// app/(entrevista_ninos)
// preguntas de modo prueba.

export const seccionesEntrevista = [
  {
    titulo: "Conociendo al cliente",
    preguntas: [
      {
        texto: "¿Cómo se siente normalmente su hijo/a cuando está en casa?",
        tipoRespuesta: "estado",
        opciones: ["Muy bien", "Bien", "Regular", "Mal"],
      },
      {
        texto:
          "¿Cómo se siente normalmente su hijo/a cuando está en la escuela?",
        tipoRespuesta: "estado",
        opciones: ["Muy bien", "Bien", "Regular", "Mal"],
      },
      {
        texto:
          "¿Hay algo que le preocupe a su hijo/a o que le haga sentir mal últimamente?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "No, nada actualmente",
          "A veces",
          "Con frecuencia",
          "Sí, bastante",
        ],
      },
    ],
  },

  {
    titulo: "Escuela",
    preguntas: [
      {
        texto: "¿Qué es lo que más le gusta de la escuela?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "Hacer amiguitos",
          "Aprender/hacer las tareas",
          "Estar fuera de casa",
          "Que la maestra lo quiera",
        ],
      },
      {
        texto: "¿Qué es lo que menos le gusta de la escuela?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "Compartir con sus compañeros",
          "Hacer mucha tarea",
          "Copiar del pizarron",
          "Los examenes son dificiles",
        ],
      },
      {
        texto: "¿Cómo le va con las tareas?",
        tipoRespuesta: "desempeno",
        opciones: ["Muy bien", "Bien", "Regular", "Tiene dificultades"],
      },
      {
        texto: "¿Cómo se lleva con su maestra o maestro?",
        tipoRespuesta: "relacion",
        opciones: ["Muy bien", "Bien", "Regular", "Tiene dificultades"],
      },
      {
        texto: "¿Cómo se relaciona con sus compañeros?",
        tipoRespuesta: "relacion",
        opciones: ["Muy bien", "Bien", "Regular", "Tiene dificultades"],
      },
      {
        texto: "¿Hace amigos con facilidad?",
        tipoRespuesta: "frecuencia",
        opciones: ["Siempre", "Casi siempre", "A veces", "Casi nunca"],
      },
      {
        texto: "¿Cómo se relaciona con los niños de otro sexo?",
        tipoRespuesta: "relacion",
        opciones: ["Muy bien", "Bien", "Regular", "Tiene dificultades"],
      },
      {
        texto: "¿Se mete frecuentemente en peleas?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Muy frecuentemente"],
      },
      {
        texto: "¿Los demás se burlan de él o ella?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Muy frecuentemente"],
      },
      {
        texto: "¿Sobre qué aspectos de la vida pregunta con mayor frecuencia?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué tan bien se baña, se viste, come y duerme actualmente?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Lo realiza muy bien",
          "Lo realiza con poca ayuda",
          "Necesita bastante ayuda",
          "Tiene muchas dificultades",
        ],
      },
      {
        texto: "¿Qué le gusta hacer en su tiempo libre?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué actividades no le gusta realizar?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué tipo de deportes le gustan?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Cuáles son sus juegos favoritos?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué programas de televisión o contenido audiovisual mira?",
        tipoRespuesta: "abierta",
      },
    ],
  },

  {
    titulo: "Emociones",
    preguntas: [
      {
        texto: "¿Qué cosas hacen feliz a su hijo/a?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué situaciones suelen poner triste a su hijo/a?",
        tipoRespuesta: "abierta",
      },
      {
        texto:
          "¿Qué situaciones suelen hacer que su hijo/a se enoje o se frustre?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "¿Qué cosas le ocasionan miedo?",
        tipoRespuesta: "abierta",
      },
      {
        texto: "Cuando tiene un problema, ¿a quién busca para sentirse mejor?",
        tipoRespuesta: "abierta",
      },
      {
        texto:
          "¿Ha notado cambios recientes en el estado de ánimo de su hijo/a?",
        tipoRespuesta: "cambio",
        opciones: [
          "No he notado cambios",
          "Cambios leves",
          "Cambios frecuentes",
          "Cambios muy marcados",
        ],
      },
      {
        texto: "¿Ha notado que prefiere estar solo/a más de lo habitual?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
    ],
  },

  {
    titulo: "Conductas y señales de alerta",
    preguntas: [
      {
        texto: "¿Actúa como si fuera menor que su edad?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto:
          "¿No se puede concentrar o no puede estar atento/a durante mucho tiempo?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿No puede quedarse quieto/a, es inquieto/a o hiperactivo/a?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es demasiado dependiente o apegado/a a los adultos?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es cruel con los animales?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es cruel, abusivo/a o malo/a con los demás?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Rompe o destroza cosas o juguetes?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Tiene dificultades para obedecer las reglas en casa?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿No obedece en la escuela?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Ha disminuido o aumentado su apetito?",
        tipoRespuesta: "cambio",
        opciones: [
          "No ha cambiado",
          "Ha cambiado un poco",
          "Ha cambiado bastante",
          "Ha cambiado mucho",
        ],
      },
      {
        texto: "¿No parece sentirse culpable después de portarse mal?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Oye cosas que no existen, por ejemplo, voces?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "Una vez", "A veces", "Frecuentemente"],
      },
      {
        texto:
          "¿Prefiere estar solo/a en lugar de convivir con otras personas?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Miente con frecuencia?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Tiene gestos o movimientos nerviosos?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Tiene pesadillas con frecuencia?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es demasiado miedoso/a?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Se irrita con facilidad?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es demasiado tímido/a?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Es poco activo/a o lento/a, o parece tener poca energía?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Parece estar infeliz o deprimido/a?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
    ],
  },

  {
    titulo: "Síntomas neuróticos",
    preguntas: [
      {
        texto:
          "¿Tiene terrores nocturnos o se despierta muy asustado/a durante la noche?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Tiene episodios de sonambulismo?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Tiene berrinches frecuentes o muy intensos?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Ha vuelto a presentar comportamientos que ya había superado.",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto:
          "¿Tiene accidentes de orina después de haber aprendido a controlar sus necesidades?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto:
          "¿Tiene accidentes de popó después de haber aprendido a usar el baño?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto: "¿Se muerde las uñas con frecuencia.",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
      {
        texto:
          "¿Se arranca repetidamente el cabello, dejando zonas con menos cabello?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"],
      },
    ],
  },
];
