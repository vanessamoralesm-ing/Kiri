import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ResultadoCuestionario() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const resultado = {
        porcentaje: 72,
        nivel: "Nivel de bienestar: Balanceado",
        descripcion: "Tus respuestas reflejan recursos personales favorables para afrontar distintas situaciones. Continúa fortaleciendo tus estrategias de autocuidado.",
        indicadores: [
            { id: "1", titulo: "Claridad mental", porcentaje: 85, descripcion: "Capacidad para identificar pensamientos y tomar decisiones conscientes.", icono: "bulb-outline" as const },
            { id: "2", titulo: "Energía vital", porcentaje: 62, descripcion: "Percepción de vitalidad y motivación intrínseca.", icono: "flash-outline" as const },
            { id: "3", titulo: "Gestión emocional", porcentaje: 48, descripcion: "Regulación de impulsos y reconocimiento de emociones.", icono: "heart-outline" as const },
            { id: "4", titulo: "Calidad de descanso", porcentaje: 92, descripcion: "Percepción del descanso y recuperación física.", icono: "moon-outline" as const },
        ],
    };

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                {/* Volver */}
                <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="arrow-back-outline" size={25} color="#64748B" />
                </Pressable>

                {/* Título */}
                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 28, color: "#2D3748" }}>Tus Resultados</Text>
                <Text style={{ fontFamily: "Nunito-Medium", fontSize: 15, lineHeight: 20, color: "#64748B", marginTop: 8, marginBottom: 24 }}>
                    Hemos analizado tus respuestas. Estos datos son una guía para apoyar tu proceso de autoconocimiento.
                </Text>

                {/* Resultado principal */}
                <View className="bg-white rounded-3xl p-5 shadow-md mb-5 items-center">
                    <View className="w-28 h-28 rounded-full bg-blue-50 items-center justify-center mb-4">
                        <Text style={{ fontFamily: "Nunito-Bold", fontSize: 30, color: "#4F8EF7" }}>{resultado.porcentaje}%</Text>
                    </View>
                    <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 13, color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>
                        Resultado orientativo
                    </Text>
                    <Text style={{ fontFamily: "Nunito-Bold", fontSize: 21, color: "#2D3748", textAlign: "center" }}>{resultado.nivel}</Text>
                    <Text style={{ fontFamily: "Nunito-Medium", fontSize: 15, lineHeight: 21, color: "#475569", marginTop: 14, textAlign: "center" }}>
                        {resultado.descripcion}
                    </Text>
                </View>

                {/* Reporte */}
                <View className="bg-blue-500 rounded-3xl p-5 mb-6">
                    <View className="flex-row items-center mb-3">
                        <View className="w-11 h-11 bg-white/20 rounded-xl items-center justify-center">
                            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={{ fontFamily: "Nunito-Bold", fontSize: 20, color: "#FFFFFF", marginLeft: 12 }}>Compartir reporte</Text>
                    </View>
                    <Text style={{ fontFamily: "Nunito-Medium", fontSize: 14, lineHeight: 20, color: "#DBEAFE" }}>
                        Descarga un informe detallado para conservarlo o compartirlo con un profesional de la salud.
                    </Text>
                    <Pressable className="bg-white rounded-xl py-3 mt-5 items-center">
                        <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 14, color: "#2D3748" }}>Exportar a PDF</Text>
                    </Pressable>
                </View>

                {/* Indicadores */}
                <View className="gap-5">
                    {resultado.indicadores.map((indicador) => (
                        <View key={indicador.id} className="bg-white rounded-3xl p-5 shadow-md">
                            <View className="flex-row justify-between items-start">
                                <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">
                                    <Ionicons name={indicador.icono} size={23} color="#4F8EF7" />
                                </View>
                                <Text style={{ fontFamily: "Nunito-Bold", fontSize: 14, color: "#4F8EF7" }}>{indicador.porcentaje}%</Text>
                            </View>
                            <Text style={{ fontFamily: "Nunito-Bold", fontSize: 18, color: "#2D3748", marginTop: 13 }}>{indicador.titulo}</Text>
                            <View className="h-2 bg-slate-300 rounded-full mt-4 overflow-hidden">
                                <View className="h-full bg-blue-500 rounded-full" style={{ width: `${indicador.porcentaje}%` }} />
                            </View>
                            <Text style={{ fontFamily: "Nunito-Medium", fontSize: 14, lineHeight: 19, color: "#64748B", marginTop: 10 }}>
                                {indicador.descripcion}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Aviso */}
                <View className="bg-blue-100 rounded-3xl p-5 mt-6 flex-row items-start">
                    <Ionicons name="information-circle-outline" size={28} color="#4F8EF7" />
                    <View className="flex-1 ml-3">
                        <Text style={{ fontFamily: "Nunito-Bold", fontSize: 15, color: "#64748B" }}>AVISO IMPORTANTE</Text>
                        <Text style={{ fontFamily: "Nunito-Medium", fontSize: 14, lineHeight: 20, color: "#475569", marginTop: 7 }}>
                            Esta autoevaluación tiene fines orientativos y educativos. Sus resultados no constituyen un diagnóstico médico o psicológico y no sustituyen la valoración de un profesional.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}