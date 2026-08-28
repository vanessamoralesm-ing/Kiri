import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { confirmarCerrarSesion } from "@/utils/cerrarSesion";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/services/authProvider";
import LogoutModal from "@/components/ui/LogoutModal";

type Props = {
  onBack: () => void;
};

export default function EntrevistaHeader({ onBack }: Props) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarLogout, setMostrarLogout] = useState(false);

  function irPerfil() {
    setMenuAbierto(false);
    router.push("/(tabs)/perfil");
  }

  function cerrarSesion() {
    setMenuAbierto(false);
    setMostrarLogout(true);
  }

  return (
    <View style={styles.header}>
      {/* VOLVER */}
      <Pressable onPress={onBack} style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
        <Ionicons name="arrow-back" size={23} color="#2D3748" />
      </Pressable>

      {/* PERFIL */}
      <View style={styles.perfilContenedor}>
        <Pressable onPress={() => setMenuAbierto((actual) => !actual)} style={({ pressed }) => [styles.avatar, pressed && styles.presionado]}>
          <Ionicons name="person-outline" size={22} color="#2D3748" />
        </Pressable>

        {/* MENÚ */}
        {menuAbierto && (
          <View style={styles.menu}>
            <Pressable onPress={irPerfil} style={({ pressed }) => [styles.opcionMenu, pressed && styles.opcionPresionada]}>
              <Ionicons name="person-outline" size={20} color="#4F8EF7" />
              <Text style={styles.textoMenu}>Mi perfil</Text>
            </Pressable>

            <View style={styles.separador} />

            <Pressable onPress={cerrarSesion} style={({ pressed }) => [styles.opcionMenu, pressed && styles.opcionPresionada]}>
              <Ionicons name="log-out-outline" size={20} color="#2D3748" />
              <Text style={styles.textoMenu}>Cerrar sesión</Text>
            </Pressable>
          </View>
        )}
      </View>

      <LogoutModal visible={mostrarLogout} onClose={() => setMostrarLogout(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, zIndex: 100 },
  boton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" },
  perfilContenedor: { position: "relative", zIndex: 200 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" },
  menu: { position: "absolute", top: 52, right: 0, width: 185, borderRadius: 16, backgroundColor: "#F8FAFC", paddingVertical: 6, shadowColor: "#2D3748", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8, zIndex: 300 },
  opcionMenu: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  textoMenu: { fontSize: 14, fontWeight: "600", color: "#2D3748" },
  separador: { height: 1, backgroundColor: "#B8A8F8", opacity: 0.25, marginHorizontal: 12 },
  presionado: { opacity: 0.65 },
  opcionPresionada: { opacity: 0.6 },
});