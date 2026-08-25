import React, { useState } from "react";

import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// COMPONENTES REUTILIZABLES
import SearchBar from "@/components/ui/SearchBar";

// Categorías disponibles
const categorias = [
    "Todos",
    "Ansiedad",
    "Depresión",
    "Personalidad",
    "Estrés",
];

// Configuración visual de las categorías
const configuracionCategorias = {
    Ansiedad: {
        icono: "pulse-outline",
        color: "#4F8EF7",
        fondo: "bg-blue-100",
    },

    Depresión: {
        icono: "cloud-outline",
        color: "#B8A8F8",
        fondo: "bg-purple-100",
    },

    Personalidad: {
        icono: "person-outline",
        color: "#7BBF9A",
        fondo: "bg-emerald-100",
    },

    Estrés: {
        icono: "flash-outline",
        color: "#F59E0B",
        fondo: "bg-amber-100",
    },
};

// Datos temporales
// Más adelante estos datos vendrán desde Supabase
const cuestionarios = [
    {
        id: "1",
        titulo: "Test de Ansiedad",
        categoria: "Ansiedad",
        descripcion:
            "Explora señales relacionadas con preocupación, tensión y nerviosismo.",
        duracion: "10 min",
    },

    {
        id: "2",
        titulo: "Test de Depresión",
        categoria: "Depresión",
        descripcion:
            "Reflexiona sobre aspectos relacionados con tu estado de ánimo y bienestar emocional.",
        duracion: "10 min",
    },

    {
        id: "3",
        titulo: "Test de Personalidad",
        categoria: "Personalidad",
        descripcion:
            "Conoce características relacionadas con tu forma de pensar, sentir y actuar.",
        duracion: "10 min",
    },

    {
        id: "4",
        titulo: "Test de Estrés",
        categoria: "Estrés",
        descripcion:
            "Identifica señales relacionadas con el estrés y cómo pueden afectar tu bienestar.",
        duracion: "10 min",
    },

    {
        id: "5",
        titulo: "Test de Ansiedad General",
        categoria: "Ansiedad",
        descripcion:
            "Evalúa de forma orientativa algunas señales frecuentes asociadas a la ansiedad.",
        duracion: "8 min",
    },
];

export default function CuestionariosPantalla() {
    const router = useRouter();

    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] =
        useState("Todos");

    // Filtrado por búsqueda y categoría
    const cuestionariosFiltrados = cuestionarios.filter((cuestionario) => {
        const coincideCategoria =
            categoriaSeleccionada === "Todos" ||
            cuestionario.categoria === categoriaSeleccionada;

        const textoBusqueda = busqueda.trim().toLowerCase();

        const coincideBusqueda =
            textoBusqueda === "" ||
            cuestionario.titulo.toLowerCase().includes(textoBusqueda) ||
            cuestionario.descripcion.toLowerCase().includes(textoBusqueda) ||
            cuestionario.categoria.toLowerCase().includes(textoBusqueda);

        return coincideCategoria && coincideBusqueda;
    });

    // Ir al cuestionario seleccionado
    const irACuestionario = (id: string) => {
        /*router.push({
            pathname: "/cuestionarios/[id]",
            params: { id },
        });*/
    };

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
            >
                {/* Presentación */}
                <View className="mb-5">
                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 26,
                            fontWeight: "700",
                            color: "#2D3748",
                        }}
                    >
                        Explora tu bienestar
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 16,
                            lineHeight: 22,
                            color: "#475569",
                            marginTop: 8,
                        }}
                    >
                        Evaluaciones validadas por profesionales para ayudarte a entender
                        mejor tu salud mental en un entorno seguro y privado.
                    </Text>
                </View>

                {/* Barra de búsqueda */}
                <SearchBar
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="¿Qué tema te gustaría explorar hoy?"
                    style={{
                        marginBottom: 22,
                    }}
                />

                {/* Categorías */}
                <ScrollView
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: 10,
                        paddingRight: 16,
                    }}
                    style={{
                        marginBottom: 22,
                    }}
                >
                    {categorias.map((categoria) => {
                        const seleccionada =
                            categoriaSeleccionada === categoria;

                        return (
                            <Pressable
                                key={categoria}
                                onPress={() =>
                                    setCategoriaSeleccionada(categoria)
                                }
                                className={`px-4 py-2 rounded-full ${seleccionada
                                        ? "bg-blue-500"
                                        : "bg-slate-200"
                                    }`}
                            >
                                <Text
                                    style={{
                                        fontFamily: seleccionada
                                            ? "Nunito-Bold"
                                            : "Nunito-Medium",
                                        fontSize: 14,
                                        color: seleccionada
                                            ? "#FFFFFF"
                                            : "#475569",
                                    }}
                                >
                                    {categoria}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Lista de cuestionarios */}
                <View className="gap-5">
                    {cuestionariosFiltrados.map((cuestionario) => {
                        const configuracion =
                            configuracionCategorias[
                            cuestionario.categoria as keyof typeof configuracionCategorias
                            ];

                        return (
                            <Pressable
                                key={cuestionario.id}
                                onPress={() =>
                                    irACuestionario(cuestionario.id)
                                }
                                className="bg-white rounded-3xl p-5 shadow-md"
                            >
                                {/* Parte superior */}
                                <View className="flex-row justify-between items-start mb-3">
                                    {/* Icono por categoría */}
                                    <View
                                        className={`w-12 h-12 rounded-2xl items-center justify-center ${configuracion.fondo}`}
                                    >
                                        <Ionicons
                                            name={configuracion.icono as any}
                                            size={28}
                                            color={configuracion.color}
                                        />
                                    </View>

                                    {/* Duración */}
                                    <View className="flex-row items-center bg-blue-100 px-3 py-1.5 rounded-full">
                                        <Ionicons
                                            name="time-outline"
                                            size={13}
                                            color="#4F8EF7"
                                        />

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",
                                                fontSize: 12,
                                                color: "#4F8EF7",
                                                marginLeft: 4,
                                            }}
                                        >
                                            {cuestionario.duracion}
                                        </Text>
                                    </View>
                                </View>

                                {/* Título */}
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 20,
                                        fontWeight: "700",
                                        color: "#2D3748",
                                    }}
                                >
                                    {cuestionario.titulo}
                                </Text>

                                {/* Descripción */}
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 14,
                                        lineHeight: 20,
                                        color: "#64748B",
                                        marginTop: 5,
                                        marginBottom: 16,
                                    }}
                                >
                                    {cuestionario.descripcion}
                                </Text>

                                {/* Parte inferior */}
                                <View className="flex-row justify-between items-center">
                                    {/* Validación */}
                                    <View className="flex-row items-center bg-emerald-100 px-3 py-1.5 rounded-full">
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={14}
                                            color="#10B981"
                                        />

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",
                                                fontSize: 11,
                                                color: "#059669",
                                                marginLeft: 4,
                                            }}
                                        >
                                            Clínicamente validado
                                        </Text>
                                    </View>

                                    {/* Botón iniciar */}
                                    <TouchableTest
                                        onPress={() =>
                                            irACuestionario(cuestionario.id)
                                        }
                                    />
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Sin resultados */}
                {cuestionariosFiltrados.length === 0 && (
                    <View className="items-center py-12 px-6">
                        <Ionicons
                            name="search-outline"
                            size={42}
                            color="#B8A8F8"
                        />

                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 18,
                                color: "#2D3748",
                                marginTop: 12,
                            }}
                        >
                            No encontramos cuestionarios
                        </Text>

                        <Text
                            style={{
                                fontFamily: "Nunito-Medium",
                                fontSize: 14,
                                lineHeight: 20,
                                color: "#64748B",
                                textAlign: "center",
                                marginTop: 5,
                            }}
                        >
                            Intenta buscar otro tema o seleccionar una categoría diferente.
                        </Text>
                    </View>
                )}

                {/* Privacidad */}
                <View className="bg-blue-500 rounded-3xl p-5 mt-6">
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={28}
                        color="#FFFFFF"
                    />

                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 22,
                            fontWeight: "700",
                            color: "#FFFFFF",
                            marginTop: 10,
                        }}
                    >
                        Privacidad garantizada
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#DBEAFE",
                            marginTop: 8,
                        }}
                    >
                        Tus resultados son privados y están protegidos. Solo tú decides si
                        deseas compartirlos con un profesional de la salud.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

// Componente simple para el acceso al cuestionario
function TouchableTest({
    onPress,
}: {
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-2 py-2"
        >
            <Text
                style={{
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 13,
                    color: "#4F8EF7",
                }}
            >
                Iniciar test
            </Text>

            <Ionicons
                name="chevron-forward"
                size={18}
                color="#4F8EF7"
            />
        </Pressable>
    );
}