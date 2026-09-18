import React, { useState } from "react";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo_izq";

export default function InstitucionCodigoPantalla() {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");

  const regresar = () => {
    router.back();
  };

  const escanearQR = () => {
    console.log("Activar camara para encaneo QR");
  };

  const verificarCodigo = () => {
    if (!codigo.trim()) {
      alert("Por favor, ingrese el codigo de tu institucion.");
      return;
    }

    console.log("Codigo a verificar:", codigo);

    // Aqui se hara la validacion la base de datos que conectaremos
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        {/* CABECERA */}

        <View style={styles.cabecera}>
          <Logo />

          <TouchableOpacity onPress={regresar} activeOpacity={0.7}>
            <Text style={styles.botonCerrar}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* TITULO */}

        <Text style={styles.titulo}>Acceso Institucional</Text>

        <Text style={styles.subtitulo}>
          Vincula tu cuenta con tu centro educativo para recibir ayuda
          personalizada
        </Text>

        {/* TARJETA QR */}

        <View style={styles.tarjetaQR}>
          <View style={styles.cuadroCamara} />

          <Button
            title="Escanear un Codigo QR"
            variant="primary"
            onPress={escanearQR}
            style={styles.botonEscanear}
          />

          <Text style={styles.textoIndicacion}>
            Coloca el código QR frente a tu cámara
          </Text>
        </View>

        {/* SEPARADOR */}

        <View style={styles.divisorContenedor}>
          <View style={styles.linea} />

          <Text style={styles.textoDivisor}>O INGRESA EL CÓDIGO</Text>

          <View style={styles.linea} />
        </View>

        {/* INPUT */}

        <Input
          label="Código de Institución"
          placeholder="EJ: KIRI-2026-EDU"
          value={codigo}
          onChangeText={setCodigo}
          autoCapitalize="characters"
          estiloContenedor={styles.bloqueInput}
        />

        {/* BOTON */}

        <Button
          title="Verificar Institución"
          variant="primary"
          onPress={verificarCodigo}
          style={styles.botonVerificar}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
  },

  contenedor: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 30,
  },

  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -25,
  },

  botonCerrar: {
    fontSize: 25,
    color: "#64748B",
    fontWeight: "bold",
    padding: 5,
    marginTop: 20,
  },

  titulo: {
    fontSize: 35,
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    color: "#4F8EF7",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    fontWeight: "400",
    color: "#2D3748",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 13,
  },

  tarjetaQR: {
    backgroundColor: "#f5f8fd",
    borderRadius: 40,
    padding: 5,
    alignItems: "center",
    borderWidth: 10,
    borderColor: "#f2f6fa",

    ...Platform.select({
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
      },

      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },

      android: {
        elevation: 6,
      },
    }),
  },

  cuadroCamara: {
    width: "90%",
    height: 300,
    backgroundColor: "#dae0e7",
    borderRadius: 20,
    marginBottom: 15,
  },

  botonEscanear: {
    width: "100%",
    marginBottom: 15,
  },

  textoIndicacion: {
    fontSize: 16,
    fontWeight: "300",
    fontFamily: "Nunito-Medium",
    color: "#2D3748",
    textAlign: "center",
  },

  divisorContenedor: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    marginTop: 15,
    width: "100%",
  },

  linea: {
    flex: 1,
    height: 1,
    backgroundColor: "#2D3748",
  },

  textoDivisor: {
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: "Nunito-Medium",
    color: "#2D3748",
    letterSpacing: 0.5,
  },

  botonVerificar: {
    marginTop: -10,
    backgroundColor: "#7BBF9A",
  },

  bloqueInput: {
    marginTop: -15,
  },
});
