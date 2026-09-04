export interface EmocionAutorregistro {
  id_emocion: string;
  nombre: string;
  descripcion: string | null;
  estado: "activa" | "inactiva";
}

export interface GuardarDiarioEmocionalParams {
  idUsuario: string;
  idEmocion: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}

export interface EntradaDiarioResumen {
  id_registro: string;
  fecha_inicio: string;
  plantilla_nombre: string;
  emociones: string[];
  respuesta_corta: string;
}

export interface DetalleRegistroDiario {
  id_registro: string;
  fecha_inicio: string;
  plantilla_nombre: string;
  emocionNombre: string;
  motivo: string;
  reaccion: string;
  ideaUtil: string;
}