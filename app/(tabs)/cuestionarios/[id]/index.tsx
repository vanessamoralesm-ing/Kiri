import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import OpcionRespuesta from "@/components/cuestionarios/OpcionRespuesta";
import ProgresoCuestionario from "@/components/cuestionarios/ProgresoCuestionario";
import { cuestionariosDemo } from "@/constants/cuestionarioDemo";

const PREGUNTAS_POR_PAGINA = 4;

export default function CuestionarioDetalle() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [paginaActual, setPaginaActual] = useState(0);
    const [respuestas, setRespuestas] = useState<Record<string, number>>({});

    const cuestionario = useMemo(() => cuestionariosDemo.find((item) => item.id === id), [id]);

    if (!cuestionario) {
        return (
            <View className="flex-1 bg-slate-50 items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={50} color="#B8A8F8" />
                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 20, color: "#2D3748", marginTop: 12, textAlign: "center" }}>
                    Cuestionario no encontrado
                </Text>
                <Pressable onPress={() => router.back()} className="bg-blue-500 px-6 py-3 rounded-xl mt-5">
                    <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 14, color: "#FFFFFF" }}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    const totalPaginas = Math.ceil(cuestionario.preguntas.length / PREGUNTAS_POR_PAGINA);
    const indiceInicial = paginaActual * PREGUNTAS_POR_PAGINA;
    const preguntasPagina = cuestionario.preguntas.slice(indiceInicial, indiceInicial + PREGUNTAS_POR_PAGINA);

    const seleccionarRespuesta = (preguntaId: string, valor: number) => {
        setRespuestas((anteriores) => ({ ...anteriores, [preguntaId]: valor }));
    };

    const todasRespondidasEnPagina = preguntasPagina.every((pregunta) => respuestas[pregunta.id] !== undefined);

    const avanzar = () => {
        if (!todasRespondidasEnPagina) return;
        if (paginaActual < totalPaginas - 1) {
            setPaginaActual((pagina) => pagina + 1);
            return;
        }
        router.push({ pathname: "/cuestionarios/[id]/resultado", params: { id: cuestionario.id } });
    };

    const retroceder = () => {
        if (paginaActual > 0) {
            setPaginaActual((pagina) => pagina - 1);
            return;
        }
        router.back();
    };

    const esUltimaPagina = paginaActual === totalPaginas - 1;

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
            >
                {/* Encabezado interno */}
                <View className="flex-row items-center mb-5">
                    <Pressable onPress={retroceder} className="w-10 h-10 items-center justify-center">
                        <Ionicons name="arrow-back-outline" size={24} color="#64748B" />
                    </Pressable>
                    <View className="flex-1 ml-2">
                        <Text numberOfLines={1} style={{ fontFamily: "Nunito-Bold", fontSize: 18, color: "#2D3748" }}>
                            {cuestionario.titulo}
                        </Text>
                    </View>
                </View>

                {/* Progreso */}
                <ProgresoCuestionario
                    paginaActual={paginaActual + 1}
                    totalPaginas={totalPaginas}
                    respondidas={Object.keys(respuestas).length}
                    totalPreguntas={cuestionario.preguntas.length}
                />

                {/* Instrucciones */}
                {paginaActual === 0 && (
                    <View className="bg-blue-50 rounded-2xl p-4 mb-7">
                        <View className="flex-row items-start">
                            <Ionicons name="information-circle-outline" size={22} color="#4F8EF7" />
                            <Text style={{ flex: 1, fontFamily: "Nunito-Medium", fontSize: 13, lineHeight: 19, color: "#475569", marginLeft: 8 }}>
                                {cuestionario.instrucciones}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Preguntas */}
                {preguntasPagina.map((pregunta, index) => {
                    const numeroPregunta = indiceInicial + index + 1;
                    return (
                        <View key={pregunta.id} className="mb-9">
                            <Text style={{ fontFamily: "Nunito-Bold", fontSize: 21, lineHeight: 28, color: "#2D3748" }}>
                                {numeroPregunta}. {pregunta.texto}
                            </Text>

                            {pregunta.descripcion && (
                                <Text style={{ fontFamily: "Nunito-Medium", fontSize: 13, lineHeight: 18, color: "#64748B", marginTop: 10, marginBottom: 20, textAlign: "center" }}>
                                    {pregunta.descripcion}
                                </Text>
                            )}

                            <View className="mt-5">
                                {pregunta.opciones.map((opcion) => (
                                    <OpcionRespuesta
                                        key={opcion.id}
                                        texto={opcion.texto}
                                        seleccionada={respuestas[pregunta.id] === opcion.valor}
                                        onPress={() => seleccionarRespuesta(pregunta.id, opcion.valor)}
                                    />
                                ))}
                            </View>
                        </View>
                    );
                })}

                {/* Navegación */}
                <View className="flex-row gap-4 mt-3">
                    <Pressable onPress={retroceder} className="flex-1 bg-slate-300 rounded-xl py-4 flex-row items-center justify-center">
                        <Ionicons name="arrow-back-outline" size={16} color="#64748B" />
                        <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 14, color: "#64748B", marginLeft: 5 }}>
                            Anterior
                        </Text>
                    </Pressable>

                    <Pressable
                        disabled={!todasRespondidasEnPagina}
                        onPress={avanzar}
                        className={`flex-[1.5] rounded-xl py-4 flex-row items-center justify-center ${todasRespondidasEnPagina ? "bg-blue-500" : "bg-blue-200"}`}
                    >
                        <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 14, color: "#FFFFFF" }}>
                            {esUltimaPagina ? "Finalizar" : "Siguiente"}
                        </Text>
                        <Ionicons
                            name={esUltimaPagina ? "checkmark-outline" : "arrow-forward-outline"}
                            size={16}
                            color="#FFFFFF"
                            style={{ marginLeft: 5 }}
                        />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}