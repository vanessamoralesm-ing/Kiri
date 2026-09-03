// app/(entrevista_ninos)
// preguntas de modo prueba.

export const seccionesEntrevista = [
  {
    titulo: "Conociendo al menor",
    preguntas: [
      {
        texto:
          "¿Cómo observa el comportamiento de su hijo cuando está en casa?",
        tipoRespuesta: "estado",
        opciones: ["Animado", "Triste", "Hiperactivo", "No obedece"],
      },
      {
        texto:
          "¿Cómo observa la conducta de su hijo cuando está en la escuela?",
        tipoRespuesta: "estado",
        opciones: [
          "Animado",
          "Triste",
          "Hiperactivo",
          "Tiene problemas de comunicación",
        ],
      },
      {
        texto:
          "¿Nota algo que le preocupe a su hijo o que le haga sentir mal últimamente?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "No hay algo en específico que le preocupe",
          "Se muestra temeroso",
          "Hace preguntas inadecuadas para su edad",
          "Se siente inseguro al hablar con los demás",
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
          "Reunirse con sus compañeros",
          "Aprender algo nuevo",
          "Salir de casa",
          "Nada / le da igual",
        ],
      },
      {
        texto: "¿Qué es lo que menos le gusta de la escuela?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "Le gusta ir",
          "Interactuar con sus compañeros",
          "Le aburre o le molesta",
          "Las reglas",
        ],
      },
      {
        texto: "¿Cómo le va con las tareas?",
        tipoRespuesta: "desempeno",
        opciones: [
          "Muy bien",
          "Bien",
          "Regular",
          "Necesita ayuda para hacerlas",
        ],
      },
      {
        texto: "¿Cómo se lleva con su maestra o maestro?",
        tipoRespuesta: "relacion",
        opciones: [
          "Muy bien",
          "Regular",
          "Se siente mal o con temor",
          "Se muestra desobediente",
        ],
      },
      {
        texto: "¿Cómo se relaciona con sus compañeros?",
        tipoRespuesta: "relacion",
        opciones: [
          "No tiene problema con relacionarse",
          "Regular",
          "Discute o pelea con ellos",
          "No se relaciona",
        ],
      },
      {
        texto: "¿Hace amigos con facilidad?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "Sí, sin problemas",
          "A veces si, y a veces no",
          "Le cuesta un poco",
          "Nunca",
        ],
      },
      {
        texto: "¿Cómo se relaciona con los niños de otro sexo?",
        tipoRespuesta: "relacion",
        opciones: [
          "Muy bien",
          "Raras veces se relaciona",
          "Prefiere jugar solo",
          "Tiene dificultades",
        ],
      },
      {
        texto: "¿Se mete frecuentemente en peleas?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "Nunca",
          "A veces",
          "Cuando lo molestan o insultan",
          "Con frecuencia",
        ],
      },
      {
        texto: "¿Sobre qué aspectos de la vida pregunta con mayor frecuencia?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "El futuro",
          "Lo que observa",
          "Sexualidad",
          "Familiares, Amigos, o personas",
        ],
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
        tipoRespuesta: "autonomia",
        opciones: [
          "Jugar al aire libre",
          "Mirar television o usar pantallas",
          "Dibujar, pintar o hacer manualidades",
          "Ayudar en las tareas de la casa",
        ],
      },
      {
        texto: "¿Qué actividades no le gusta realizar?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Irse a dormir temprano",
          "Recoger y ordenar sus juguetes",
          "Comer alimentos saludables (verduras, frutas)",
          "Despertarse temprano para la escuela",
        ],
      },
      {
        texto: "¿Qué tipo de deportes le gustan?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Fútbol, Básquetbol, Vóleibol, Natación o Gimnasia",
          "Taekwondo, Boxeo, Ajedrez, Skate o Patinaje ",
          "Prefiere juegos físicos libres (correr, saltar, atrapadas)",
          "No le gusta practicar ningún deporte",
        ],
      },
      {
        texto: "¿Qué programas de televisión o contenido audiovisual mira?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Dibujos animados",
          "Videos de YouTubers o Videojuegos",
          "Películas, Series de acción o documentales",
          "No ve televisión ni contenidos audiovisuales",
        ],
      },
    ],
  },

  {
    titulo: "Emociones",
    preguntas: [
      {
        texto: "¿Qué cosas hacen feliz a su hijo?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Compartir tiempo en familia (paseos, juegos, charlas)",
          "Estar en casa tranquilo",
          "Los videojuegos",
          "Destacar en la escuela, tener buenas notas",
        ],
      },
      {
        texto: "¿Qué situaciones suelen poner triste a su hijo?",
        tipoRespuesta: "estado",
        opciones: [
          "Sentirse rechazado",
          "Estar aburrido, solo o cuando le quiten las pantallas",
          "Peleas familiares",
          "No obtener buenos resultados",
        ],
      },
      {
        texto:
          "¿Qué situaciones suelen hacer que su hijo se enoje o se frustre?",
        tipoRespuesta: "autonomia",
        opciones: [
          "Cuando se le imponen límites o reglas",
          "Tener que dejar sus actividades favoritas por obligaciones",
          "El aburrimiento o no usar tecnología",
          "No poder resolver un problema, tarea o reto por sí mismo",
        ],
      },
      {
        texto: "¿Qué cosas le ocasionan miedo?",
        tipoRespuesta: "frecuencia",
        opciones: [
          "La oscuridad, tormentas, monstruos o animales",
          "Las burlas, críticas o el rechazo",
          "Separarse de su familia",
          "El entorno escolar",
        ],
      },
      {
        texto: "Cuando tiene un problema, ¿a quién busca para sentirse mejor?",
        tipoRespuesta: "relacion",
        opciones: [
          "A sus padres",
          "Hermanos o familiares",
          "A maestros",
          "A nadie, se aísla",
        ],
      },
      {
        texto: "¿Ha notado que prefiere estar solo/a más de lo habitual?",
        tipoRespuesta: "frecuencia",
        opciones: ["Nunca", "A veces", "Con regularidad", "Siempre"],
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
