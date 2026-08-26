export type TipoPregunta =
    | "opcion_unica"
    | "verdadero_falso"
    | "escala";

export interface OpcionCuestionario {
    id: string;
    texto: string;
    valor: number;
}

export interface PreguntaCuestionario {
    id: string;
    texto: string;
    descripcion?: string;
    opciones: OpcionCuestionario[];
}

export interface Cuestionario {
    id: string;
    titulo: string;
    descripcion: string;
    instrucciones: string;
    tipo: TipoPregunta;
    preguntas: PreguntaCuestionario[];
}