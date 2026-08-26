import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

export default function BienvenidaEntrevista() {
  const router = useRouter();

  const continuar = () => {
    router.push("/(entrevista)/rango_edad");
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contenedor}>
          <View style={styles.cabecera}>
            <Logo />
          </View>

          <View style={styles.contenido}>
            <View style={styles.tarjeta}>
              <Image
                source={require("@/assets/images/mascota.png")}
                style={styles.mascota}
                resizeMode="contain"
              />

              <View style={styles.etiqueta}>
                <Text style={styles.textoEtiqueta}>Tu espacio de bienestar</Text>
              </View>

              <Text style={styles.titulo}>
                Tu bienestar emocional comienza con un pequeño paso.
              </Text>

              <Text style={styles.descripcion}>
                Nos alegra que hayas decidido dedicar un momento para cuidar de ti.
                En Kiri encontrarás un espacio seguro donde podrás comprender mejor
                tus emociones, fortalecer hábitos saludables y descubrir herramientas
                que te acompañen en tu bienestar.
              </Text>

              <Text style={styles.descripcion}>
                Antes de comenzar, queremos conocerte un poco más para ofrecerte una
                experiencia adaptada a tu etapa de vida.
              </Text>

              <View style={styles.informacion}>
                <Text style={styles.iconoInformacion}>💙</Text>

                <Text style={styles.textoInformacion}>
                  <Text style={styles.negrita}>Recuerda: </Text>
                  no buscamos juzgarte ni diagnosticarte; queremos acompañarte en el
                  camino hacia un mayor bienestar.
                </Text>
              </View>

              <View style={styles.privacidad}>
                <Text style={styles.privacidadTitulo}>Tu información es importante</Text>
                <Text style={styles.privacidadTexto}>
                  Responde con tranquilidad y de la manera más sincera posible.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.zonaBoton}>
            <Button
              title="Continuar  ➔"
              variant="primary"
              onPress={continuar}
              style={styles.boton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "transparent" },
  scroll: { flexGrow: 1 },
  contenedor: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30 },
  cabecera: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  contenido: { flex: 1, justifyContent: "center" },

  tarjeta: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 26,
    paddingHorizontal: 25,
    paddingTop: 34,
    paddingBottom: 26,
    borderWidth: 1,
    borderColor: "#E9EDF3",
    position: "relative",
    shadowColor: "#6F7C91",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  mascota: { position: "absolute", width: 100, height: 130, right: 4, top: -50 },

  etiqueta: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 17,
  },

  textoEtiqueta: { color: "#4F8EF7", fontSize: 13, fontFamily: "Nunito-Bold" },

  titulo: {
    maxWidth: "85%",
    fontSize: 27,
    lineHeight: 34,
    fontFamily: "Nunito-Bold",
    color: "#273448",
    marginBottom: 20,
  },

  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Nunito-Medium",
    color: "#566277",
    marginBottom: 14,
  },

  informacion: {
    flexDirection: "row",
    backgroundColor: "#F2F6FF",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 8,
  },

  iconoInformacion: { fontSize: 18, marginRight: 10 },
  textoInformacion: { flex: 1, fontSize: 14, lineHeight: 21, fontFamily: "Nunito-Medium", color: "#536076" },
  negrita: { fontFamily: "Nunito-Bold", color: "#334155" },

  privacidad: {
    borderTopWidth: 1,
    borderTopColor: "#EDF0F4",
    marginTop: 20,
    paddingTop: 17,
  },

  privacidadTitulo: { fontSize: 14, fontFamily: "Nunito-Bold", color: "#445065", marginBottom: 4 },
  privacidadTexto: { fontSize: 13, lineHeight: 19, fontFamily: "Nunito-Medium", color: "#7B8495" },

  zonaBoton: { marginTop: 25 },
  boton: { height: 56, borderRadius: 16 },
});