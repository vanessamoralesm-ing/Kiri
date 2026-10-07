import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

import AdminFormScreen from "@/components/admin/AdminFormScreen";
import EditorInformacionTest from "@/components/superadmin/cuestionarios/EditorInformacionTest";
import { useModal } from "@/contexts/ModalContext";
import {
  crearTestAdmin,
  normalizarCodigoTest,
} from "@/services/superadmin/cuestionarioAdmin.service";
import type { InfoTestAdmin } from "@/types/superadmin/cuestionarios";

const INICIAL: InfoTestAdmin = {
  codigo: "",
  nombre: "",
  descripcion: null,
  instrucciones: null,
  poblacion_objetivo: null,
  tipo_aplicacion: "autoadministrado",
  tiene_subescalas: false,
  version: null,
};

const opcional = (v: string | null) => v?.trim() || null;

export default function NuevoCuestionarioScreen() {
  const router = useRouter();
  const { avisar } = useModal();
  const [form, setForm] = useState(INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const operando = useRef(false);

  const guardar = async () => {
    if (operando.current) return;

    const codigo = normalizarCodigoTest(form.codigo);
    const nombre = form.nombre.trim();
    setError(null);

    if (!codigo || !nombre) {
      setError(
        !codigo
          ? "Debes ingresar el código del cuestionario."
          : "Debes ingresar el nombre del cuestionario.",
      );
      return;
    }

    operando.current = true;

    try {
      setGuardando(true);
      const test = await crearTestAdmin({
        ...form,
        codigo,
        nombre,
        descripcion: opcional(form.descripcion),
        instrucciones: opcional(form.instrucciones),
        poblacion_objetivo: opcional(form.poblacion_objetivo),
        tipo_aplicacion: form.tipo_aplicacion || "autoadministrado",
        version: opcional(form.version),
        estado: false,
      });

      router.replace(`/superadmin/cuestionarios/${test.id_test}` as never);
    } catch (e) {
      const mensaje =
        e instanceof Error
          ? e.message
          : "No se pudo registrar el cuestionario.";

      setError(mensaje);
      await avisar("Error al registrar", mensaje, true);
    } finally {
      operando.current = false;
      setGuardando(false);
    }
  };

  return (
    <AdminFormScreen
      title="Registrar nuevo test"
      subtitle="Completa los datos generales. Posteriormente podrás configurar las subescalas, preguntas y baremos."
      cargando={false}
      guardando={guardando}
      error={error}
      submitLabel="Guardar y continuar"
      onGuardar={guardar}
      onVolver={() => router.replace("/superadmin/cuestionarios" as never)}
      contentClassName="gap-5"
    >
      <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Text className="font-nunito-bold text-text-on-primary">1</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="font-nunito-bold text-sm text-text">
            Información general
          </Text>
          <Text className="font-nunito-medium text-xs text-text-secondary">
            Primer paso: crear el registro del test.
          </Text>
        </View>
      </View>

      <EditorInformacionTest
        value={form}
        onChange={setForm}
        disabled={guardando}
      />
    </AdminFormScreen>
  );
}