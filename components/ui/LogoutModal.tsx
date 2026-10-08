import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import ActionModal from "@/components/ui/ActionModal";
import { useAuth } from "@/services/authProvider";

export default function LogoutModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ocupado = useRef(false);
  async function confirmar() {
    if (ocupado.current) return;
    ocupado.current = true;
    setCerrando(true);
    setError(null);
    try {
      await signOut();
      onClose();
      router.replace("/(auth)/welcome");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible cerrar sesión.");
    } finally {
      ocupado.current = false;
      setCerrando(false);
    }
  }
  const cancelar = () => {
    if (ocupado.current) return;
    setError(null);
    onClose();
  };
  return <ActionModal visible={visible} titulo="¿Cerrar sesión?"
    mensaje="Podrás volver a ingresar a Kiri cuando quieras." icono="log-out-outline"
    textoConfirmar="Cerrar sesión" onClose={cancelar} onConfirm={confirmar}
    cargando={cerrando} error={error} />;
}
