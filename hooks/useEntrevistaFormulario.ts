import { useState, useCallback } from "react";
import { Alert } from "react-native";
import {
  MapaRespuestas,
  PreguntaEntrevista,
  RespuestaEntrevistaGuardada,
} from "@/types/entrevista";
import {
  eliminarRespuesta,
  guardarRespuesta,
} from "@/services/entrevista/respuestaService";

interface Props {
  idEntrevista: string;
  preguntaActual?: PreguntaEntrevista;
  mapaRespuestas: MapaRespuestas;
  setMapaRespuestas: React.Dispatch<React.SetStateAction<MapaRespuestas>>;
  onRespuestaGuardada?: (
    pregunta: PreguntaEntrevista,
    respuesta: RespuestaEntrevistaGuardada,
    nuevoMapa: MapaRespuestas
  ) => Promise<void> | void;
}

export function useEntrevistaFormulario({
  idEntrevista,
  preguntaActual,
  mapaRespuestas,
  setMapaRespuestas,
  onRespuestaGuardada,
}: Props) {
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<string[]>([]);
  const [textoRespuesta, setTextoRespuesta] = useState("");
  const [numeroRespuesta, setNumeroRespuesta] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarRespuestaEnFormulario = useCallback((respuesta?: RespuestaEntrevistaGuardada) => {
    setOpcionesSeleccionadas(respuesta?.opcionesSeleccionadas ?? []);
    setTextoRespuesta(respuesta?.texto_respuesta ?? "");
    setNumeroRespuesta(
      respuesta?.valor_numerico !== null && respuesta?.valor_numerico !== undefined
        ? String(respuesta.valor_numerico)
        : ""
    );
  }, []);

  const seleccionarOpcion = useCallback(
    (idOpcion: string) => {
      if (!preguntaActual || guardando) return;
      if (preguntaActual.tipo_pregunta === "opcion_multiple") {
        setOpcionesSeleccionadas((actuales) =>
          actuales.includes(idOpcion)
            ? actuales.filter((id) => id !== idOpcion)
            : [...actuales, idOpcion]
        );
        return;
      }
      setOpcionesSeleccionadas([idOpcion]);
    },
    [preguntaActual, guardando]
  );

  const tieneRespuestaActual = useCallback((): boolean => {
    if (!preguntaActual) return false;
    switch (preguntaActual.tipo_pregunta) {
      case "opcion_unica":
      case "opcion_multiple":
      case "escala":
        return opcionesSeleccionadas.length > 0;
      case "texto":
        return textoRespuesta.trim().length > 0;
      case "numero": {
        const texto = numeroRespuesta.trim();
        return texto.length > 0 && Number.isFinite(Number(texto));
      }
      default:
        return false;
    }
  }, [preguntaActual, opcionesSeleccionadas, textoRespuesta, numeroRespuesta]);

  const respuestaActualValida = useCallback((): boolean => {
    if (!preguntaActual) return false;
    if (!preguntaActual.obligatoria) return true;
    return tieneRespuestaActual();
  }, [preguntaActual, tieneRespuestaActual]);

  const guardarActual = async (): Promise<RespuestaEntrevistaGuardada | null> => {
    if (!preguntaActual || !idEntrevista) return null;
    switch (preguntaActual.tipo_pregunta) {
      case "opcion_unica":
      case "opcion_multiple":
      case "escala":
        return guardarRespuesta({
          idEntrevista,
          idPregunta: preguntaActual.id_pregunta,
          tipoPregunta: preguntaActual.tipo_pregunta,
          idOpciones: opcionesSeleccionadas,
        });
      case "texto":
        return guardarRespuesta({
          idEntrevista,
          idPregunta: preguntaActual.id_pregunta,
          tipoPregunta: "texto",
          texto: textoRespuesta.trim(),
        });
      case "numero":
        return guardarRespuesta({
          idEntrevista,
          idPregunta: preguntaActual.id_pregunta,
          tipoPregunta: "numero",
          valorNumerico: Number(numeroRespuesta),
        });
      default:
        throw new Error(`Tipo no compatible: ${preguntaActual.tipo_pregunta}`);
    }
  };

  const ejecutarGuardado = async (): Promise<MapaRespuestas | null> => {
    if (!preguntaActual || !idEntrevista || guardando) return null;
    if (!respuestaActualValida()) {
      Alert.alert("Completa la respuesta", "Responde esta pregunta antes de continuar.");
      return null;
    }

    try {
      setGuardando(true);
      const nuevoMapa: MapaRespuestas = { ...mapaRespuestas };

      if (tieneRespuestaActual()) {
        const respuesta = await guardarActual();
        if (respuesta) {
          nuevoMapa[preguntaActual.id_pregunta] = respuesta;
          if (onRespuestaGuardada) {
            await onRespuestaGuardada(preguntaActual, respuesta, nuevoMapa);
          }
        }
      } else if (nuevoMapa[preguntaActual.id_pregunta]) {
        await eliminarRespuesta(idEntrevista, preguntaActual.id_pregunta);
        delete nuevoMapa[preguntaActual.id_pregunta];
      }

      setMapaRespuestas(nuevoMapa);
      return nuevoMapa;
    } catch (error) {
      console.error("Error al guardar respuesta:", error);
      Alert.alert(
        "No se pudo guardar",
        error instanceof Error ? error.message : "Ocurrió un error al guardar tu respuesta."
      );
      return null;
    } finally {
      setGuardando(false);
    }
  };

  return {
    opcionesSeleccionadas,
    textoRespuesta,
    numeroRespuesta,
    setTextoRespuesta,
    setNumeroRespuesta,
    guardando,
    seleccionarOpcion,
    cargarRespuestaEnFormulario,
    respuestaActualValida,
    ejecutarGuardado,
  };
}