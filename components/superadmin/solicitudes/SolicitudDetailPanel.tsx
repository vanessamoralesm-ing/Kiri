import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminIdentity from "@/components/admin/AdminIdentity";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { nombreTipoInstitucion } from "@/types/instituciones/institucion";
import type { SolicitudInstitucion } from "@/types/superadmin/solicitudes";

type Props = {
  solicitud: SolicitudInstitucion | null;
  onAprobar: () => void;
  onSolicitarAntecedentes: () => void;
  onRechazar: () => void;
  procesando?: boolean;
};

const fecha = (iso: string) => {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return iso;
  return `${f.toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}, ${f.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" })}`;
};

const Campo = ({
  titulo,
  valor,
  destacado,
}: {
  titulo: string;
  valor?: string | null;
  destacado?: boolean;
}) => (
  <View className="min-w-0 flex-1 gap-1">
    <Text className="font-nunito-medium text-xs text-text-muted">{titulo}</Text>
    <Text
      selectable={destacado}
      className={`font-nunito-semibold text-sm ${destacado ? "text-primary" : "text-text"}`}
    >
      {valor || "No especificado"}
    </Text>
  </View>
);

const Titulo = ({
  texto,
  icono,
  secundario,
}: {
  texto: string;
  icono: keyof typeof Ionicons.glyphMap;
  secundario?: boolean;
}) => (
  <View className="flex-row items-center gap-2">
    <Ionicons
      name={icono}
      size={20}
      className={secundario ? "text-secondary" : "text-primary"}
    />
    <Text className="font-nunito-bold text-base text-text">{texto}</Text>
  </View>
);

export default function SolicitudDetailPanel({
  solicitud,
  onAprobar,
  onSolicitarAntecedentes,
  onRechazar,
  procesando = false,
}: Props) {
  const { esEscritorio } = useResponsiveLayout();

  if (!solicitud)
    return (
      <AdminCard>
        <AdminEmptyState
          icono="document-text-outline"
          mensaje="Selecciona una solicitud. Aquí podrás revisar toda la información."
        />
      </AdminCard>
    );

  const nombre = [solicitud.nombre_solicitante, solicitud.apellido_solicitante]
    .filter(Boolean)
    .join(" ");
  const iniciales =
    `${solicitud.nombre_solicitante?.trim()[0] ?? ""}${solicitud.apellido_solicitante?.trim()[0] ?? ""}`.toUpperCase() ||
    "US";

  const contenido = (
    <View className="gap-5">
      <View className="gap-4 rounded-xl bg-surface-secondary p-4">
        <Titulo texto="Datos Institucionales" icono="business-outline" />
        <View className="gap-4 md:flex-row">
          <Campo titulo="Nombre de la Institución" valor={solicitud.nombre_institucion} />
          <Campo titulo="Código Institucional" valor={solicitud.codigo_institucional} destacado />
        </View>
        <View className="gap-4 md:flex-row">
          <Campo
            titulo="Tipo de Institución"
            valor={nombreTipoInstitucion(solicitud.tipo_institucion)}
          />
          <Campo titulo="Departamento" valor={solicitud.departamento} />
        </View>
        <Campo titulo="Municipio" valor={solicitud.municipio} />
        <Campo titulo="Dirección" valor={solicitud.direccion} />
      </View>

      <View className="gap-4 rounded-xl bg-surface-secondary p-4">
        <Titulo texto="Autoridad Solicitante" icono="person-outline" secundario />
        <AdminIdentity
          nombre={nombre}
          detalle={solicitud.cargo_solicitante}
          iniciales={iniciales}
        />
        <View className="gap-4 md:flex-row">
          <Campo titulo="Número de Cédula" valor={solicitud.cedula_solicitante} />
          <Campo titulo="Cargo" valor={solicitud.cargo_solicitante} />
        </View>
        <Campo titulo="Correo Institucional" valor={solicitud.correo} destacado />
        <Campo titulo="Teléfono de Contacto" valor={solicitud.telefono} />
      </View>

      <View className="gap-4 rounded-xl bg-surface-secondary p-4">
        <Titulo texto="Motivo de la Solicitud" icono="chatbox-ellipses-outline" />
        <Text className="font-nunito-medium text-sm leading-6 text-text-secondary">
          {solicitud.descripcion}
        </Text>
      </View>

      <View className="gap-4 rounded-xl bg-surface-secondary p-4">
        <Titulo
          texto="Información de la Solicitud"
          icono="information-circle-outline"
          secundario
        />
        <Campo titulo="ID de Solicitud" valor={solicitud.id_solicitud} destacado />
        {!!solicitud.fecha_resolucion && (
          <Campo
            titulo="Fecha de Resolución"
            valor={fecha(solicitud.fecha_resolucion)}
          />
        )}
      </View>
    </View>
  );

  return (
    <AdminCard>
      <AdminStatusBadge estado={solicitud.estado} />

      <View className="gap-1">
        <Text className="font-nunito-bold text-xl text-text">Revisión de Afiliación</Text>
        <Text className="font-nunito-semibold text-sm text-primary">
          {solicitud.codigo_institucional}
        </Text>
        <Text className="font-nunito-medium text-xs text-text-muted">
          Ingresada {fecha(solicitud.fecha_solicitud)}
        </Text>
      </View>

      {esEscritorio ? (
        <ScrollView className="max-h-screen" showsVerticalScrollIndicator={false}>
          {contenido}
        </ScrollView>
      ) : (
        contenido
      )}

      <View className="border-t border-border pt-3">
        {solicitud.estado === "pendiente" ? (
          <View className="gap-2">
            <Button
              title={procesando ? "Aprobando..." : "Aprobar e Incorporar a Red Kiri"}
              icon="checkmark-circle-outline"
              loading={procesando}
              disabled={procesando}
              onPress={onAprobar}
              className="my-0"
              textClassName="text-sm"
            />
            <Button
              title="Solicitar información"
              icon="document-text-outline"
              variant="secondary"
              disabled={procesando}
              onPress={onSolicitarAntecedentes}
              className="my-0"
              textClassName="text-sm"
            />
            <Button
              title="Rechazar Solicitud"
              icon="close-circle-outline"
              iconClassName="text-danger"
              variant="secondary"
              disabled={procesando}
              onPress={onRechazar}
              className="my-0 border-danger"
              textClassName="text-sm text-danger"
            />
          </View>
        ) : (
          <Text
            className={`font-nunito-semibold text-sm ${
              solicitud.estado === "aprobada" ? "text-secondary" : "text-danger"
            }`}
          >
            {solicitud.estado === "aprobada"
              ? "Esta solicitud ya fue aprobada"
              : "Esta solicitud fue rechazada"}
          </Text>
        )}
      </View>
    </AdminCard>
  );
}