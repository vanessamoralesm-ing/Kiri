import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import ResumenDiario from "@/components/diario/ResumenDiario";
import TarjetaBienvenidaDiario from "@/components/diario/TarjetaBienvenidaDiario";
import TarjetaEntradaDiario from "@/components/diario/TarjetaEntradaDiario";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

export default function DiarioScreen() {
  // ======================================================
  // USUARIO AUTENTICADO
  // ======================================================

  const { profile } = useAuth();

  const nombreUsuario =
    profile?.nombre_preferido?.trim() || profile?.nombres?.trim() || "Usuario";

  // ======================================================
  // DATOS VISUALES DE PRUEBA
  // ======================================================

  const diasRacha = 5;
  const totalEntradas = 24;

  // ======================================================
  // TEMA
  // ======================================================

  const backgroundColor = useThemeColor({}, "background");

  const textColor = useThemeColor({}, "text");

  const primaryColor = useThemeColor({}, "primary");

  // ======================================================
  // ACCIONES
  // ======================================================

  const irANuevoRegistro = () => {
    router.push({
      pathname: "/diario/nuevo" as never,
      params: {
        origen: "diario",
      },
    });
  };

  const verTodasLasEntradas = () => {
    console.log("Ver todas las entradas");
  };

  const abrirEntrada = () => {
    console.log("Abrir entrada");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
          }}
        >
          {/* ==================================================
                        BIENVENIDA
                    ================================================== */}

          <TarjetaBienvenidaDiario
            nombre={nombreUsuario}
            onNuevoRegistro={irANuevoRegistro}
          />

          {/* ==================================================
                        RESUMEN
                    ================================================== */}

          <ResumenDiario diasRacha={diasRacha} totalEntradas={totalEntradas} />

          {/* ==================================================
                        ENTRADAS RECIENTES
                    ================================================== */}

          <View
            style={{
              marginTop: 28,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 20,
                color: textColor,
              }}
            >
              Entradas Recientes
            </Text>

            <Pressable
              onPress={verTodasLasEntradas}
              hitSlop={8}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-SemiBold",
                  fontSize: 13,
                  color: primaryColor,
                }}
              >
                Ver todas
              </Text>

              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </Pressable>
          </View>

          {/* ==================================================
                        REGISTRO RECIENTE
                    ================================================== */}

          <TarjetaEntradaDiario
            fecha="Hoy, 14 Oct · Tarde"
            titulo="Reflexiones de tarde"
            contenido="Hoy logré terminar el proyecto que tanto me estresaba. Me siento aliviada y con ganas de descansar. El paseo me ayudó a sentirme mejor."
            emociones={["Paz", "Logro"]}
            onPress={abrirEntrada}
          />
        </View>
      </ScrollView>
    </View>
  );
}
