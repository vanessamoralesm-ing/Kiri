import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface SolicitudExitoModalProps {
  visible: boolean;
  onCerrar: () => void;
}

export default function SolicitudExitoModal({ visible, onCerrar }: SolicitudExitoModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCerrar}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* ICONO */}
          <View style={styles.iconoContenedor}>
            <View style={styles.iconoCirculo}>
              <Text style={styles.icono}>✓</Text>
            </View>
          </View>

          {/* TÍTULO Y DESCRIPCIÓN */}
          <Text style={styles.titulo}>¡Solicitud enviada!</Text>
          <Text style={styles.descripcion}>
            Hemos recibido correctamente tu solicitud de afiliación a Kiri.
          </Text>

          {/* ESTADO */}
          <View style={styles.estadoContenedor}>
            <View style={styles.estadoPunto} />
            <Text style={styles.estadoTexto}>Solicitud en revisión</Text>
          </View>

          {/* MENSAJE */}
          <View style={styles.mensajeContenedor}>
            <Text style={styles.mensaje}>
              Nuestro equipo revisará la información proporcionada.
            </Text>
            <Text style={styles.mensajeSecundario}>
              Te notificaremos cuando exista una resolución sobre tu solicitud.
            </Text>
          </View>

          {/* AVISO */}
          <View style={styles.aviso}>
            <Text style={styles.avisoIcono}>✉</Text>
            <Text style={styles.avisoTexto}>
              También hemos generado una notificación para el correo proporcionado.
            </Text>
          </View>

          {/* BOTÓN */}
          <Pressable
            onPress={onCerrar}
            style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
          >
            <Text style={styles.botonTexto}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  modal: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
  },
  iconoContenedor: {
    marginBottom: 18,
  },
  iconoCirculo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    borderWidth: 1,
    borderColor: "#D2EDDE",
  },
  icono: {
    fontSize: 38,
    fontFamily: "Nunito-Bold",
    color: "#5B9F7A",
  },
  titulo: {
    fontSize: 26,
    fontFamily: "Nunito-Bold",
    color: "#4F8EF7",
    textAlign: "center",
  },
  descripcion: {
    marginTop: 8,
    paddingHorizontal: 6,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Nunito-Medium",
    color: "#64748B",
    textAlign: "center",
  },
  estadoContenedor: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  estadoPunto: {
    width: 8,
    height: 8,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  estadoTexto: {
    fontSize: 13,
    fontFamily: "Nunito-SemiBold",
    color: "#B45309",
  },
  mensajeContenedor: {
    width: "100%",
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },
  mensaje: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Nunito-SemiBold",
    color: "#475569",
    textAlign: "center",
  },
  mensajeSecundario: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Nunito-Regular",
    color: "#64748B",
    textAlign: "center",
  },
  aviso: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
  },
  avisoIcono: {
    marginRight: 10,
    fontSize: 20,
    color: "#4F8EF7",
  },
  avisoTexto: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Nunito-Medium",
    color: "#4F6F9F",
  },
  boton: {
    width: "100%",
    minHeight: 52,
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#7BBF9A",
  },
  botonPresionado: {
    opacity: 0.85,
  },
  botonTexto: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#FFFFFF",
  },
});