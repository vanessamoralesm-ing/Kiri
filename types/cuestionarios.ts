export interface Test {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    instrucciones: string | null;
    poblacion_objetivo: string | null;
    tipo_aplicacion: "autoadministrado" | "profesional";
    tiene_subescalas: boolean;
    version: string | null;
    estado: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export type TipoPregunta =
    | "opcion_unica"
    | "opcion_multiple"
    | "texto"
    | "numero"
    | "escala";

export interface PreguntaTest {
    id_pregunta: string;
    id_test: string;
    id_subescala: string | null;
    codigo: string;
    enunciado: string;
    descripcion_apoyo: string | null;
    tipo_pregunta: TipoPregunta;
    orden: number;
    obligatoria: boolean;
    puntua: boolean;
    es_observacional: boolean;
    permite_comentario: boolean;
    estado: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
}