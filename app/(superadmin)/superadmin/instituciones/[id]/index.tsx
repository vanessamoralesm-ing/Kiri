import React from "react";
import { useLocalSearchParams } from "expo-router";

import AdminFormScreen from "@/components/admin/AdminFormScreen";
import InstitucionForm from "@/components/instituciones/InstitucionForm";
import { useInstitucionForm } from "@/hooks/instituciones/useInstitucionForm";
export default function InstitucionScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const form = useInstitucionForm({
    modo: "editar",
    idInstitucion: Array.isArray(id) ? id[0] : id,
  });
  return (
    <AdminFormScreen
      submitLabel="Guardar institución"
      title="Editar institución"
      subtitle="Información y contacto institucional."
      {...form}
      onGuardar={form.guardar}
      onVolver={form.volver}
    >
      <InstitucionForm form={form} />
    </AdminFormScreen>
  );
}
