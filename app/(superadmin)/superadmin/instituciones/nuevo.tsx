import React from "react";

import AdminFormScreen from "@/components/admin/AdminFormScreen";
import InstitucionForm from "@/components/instituciones/InstitucionForm";
import { useInstitucionForm } from "@/hooks/instituciones/useInstitucionForm";
export default function InstitucionScreen() {
  const form = useInstitucionForm({ modo: "crear" });
  return (
    <AdminFormScreen
      submitLabel="Guardar institución"
      title="Nueva institución"
      subtitle="Información y contacto institucional."
      {...form}
      onGuardar={form.guardar}
      onVolver={form.volver}
    >
      <InstitucionForm form={form} />
    </AdminFormScreen>
  );
}
