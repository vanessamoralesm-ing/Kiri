import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import type { SolicitudInstitucion, TipoInstitucion } from "@/types/superadmin/solicitudes";
import SolicitudStatusBadge from "./SolicitudStatusBadge";

interface SolicitudDetailPanelProps {
  solicitud: SolicitudInstitucion | null;
  onAprobar: () => void;
  onSolicitarAntecedentes: () => void;
  onRechazar: () => void;
}

function obtenerNombreTipo(tipo: TipoInstitucion): string {
  switch (tipo) {
    case "educacion_superior": return "Educación superior";
    case "escolar": return "Institución escolar";
    case "salud": return "Institución de salud";
    default: return "Institución";
  }
}

function obtenerIniciales(nombre: string, apellido: string): string {
  const inicialNombre = nombre?.trim().charAt(0) ?? "";
  const inicialApellido = apellido?.trim().charAt(0) ?? "";
  return `${inicialNombre}${inicialApellido}`.toUpperCase() || "US";
}

function formatearFecha(fechaIso: string) {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return { fecha: fechaIso, hora: "" };

  return {
    fecha: fecha.toLocaleDateString("es-NI", { day: "2-digit", month: "long", year: "numeric" }),
    hora: fecha.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function SolicitudDetailPanel({
  solicitud,
  onAprobar,
  onSolicitarAntecedentes,
  onRechazar,
}: SolicitudDetailPanelProps) {
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const secondaryColor = useThemeColor({}, "secondary");
  const secondarySoftColor = useThemeColor({}, "secondarySoft");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");
  const dangerColor = useThemeColor({}, "danger");

  if (!solicitud) {
    return (
      <View
        style={{
          width: 390,
          minWidth: 390,
          minHeight: 500,
          borderWidth: 1,
          borderColor,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: surfaceColor,
        }}
      >
        <Ionicons name="document-text-outline" size={40} color={textMutedColor} />
        <Text style={{ marginTop: 12, fontFamily: "Nunito-Bold", fontSize: 14, color: textColor }}>
          Selecciona una solicitud
        </Text>
        <Text style={{ marginTop: 5, fontFamily: "Nunito-Medium", fontSize: 11, color: textMutedColor }}>
          Aquí podrás revisar toda la información.
        </Text>
      </View>
    );
  }

  const iniciales = obtenerIniciales(solicitud.nombre_solicitante, solicitud.apellido_solicitante);
  const nombreSolicitante = [solicitud.nombre_solicitante, solicitud.apellido_solicitante].filter(Boolean).join(" ");
  const { fecha, hora } = formatearFecha(solicitud.fecha_solicitud);
  const tipoInstitucion = obtenerNombreTipo(solicitud.tipo_institucion);
  const solicitudPendiente = solicitud.estado === "pendiente";

  return (
    <View
      style={{
        width: 390,
        minWidth: 390,
        overflow: "hidden",
        borderWidth: 1,
        borderColor,
        borderRadius: 18,
        backgroundColor: surfaceColor,
      }}
    >
      {/* ENCABEZADO */}
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: borderColor }}>
        <SolicitudStatusBadge estado={solicitud.estado} />
        <Text style={{ marginTop: 10, fontFamily: "Nunito-Bold", fontSize: 20, lineHeight: 26, color: textColor }}>
          Revisión de Afiliación
        </Text>
        <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: primaryColor }}>
          {solicitud.codigo_institucional}
        </Text>
        <Text style={{ marginTop: 6, fontFamily: "Nunito-Medium", fontSize: 10, color: textMutedColor }}>
          Ingresada {fecha}{hora ? `, ${hora}` : ""}
        </Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={{ maxHeight: 580 }}
        contentContainerStyle={{ padding: 18, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {/* DATOS INSTITUCIONALES */}
        <View style={{ padding: 16, borderRadius: 15, backgroundColor: surfaceSecondaryColor }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="business-outline" size={19} color={primaryColor} />
            <Text style={{ marginLeft: 9, fontFamily: "Nunito-Bold", fontSize: 15, color: textColor }}>
              Datos Institucionales
            </Text>
          </View>

          <View style={{ marginTop: 16, flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Nombre de la Institución
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: textColor }}>
                {solicitud.nombre_institucion}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Código Institucional
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: primaryColor }}>
                {solicitud.codigo_institucional}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 14, flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Tipo de Institución
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: textColor }}>
                {tipoInstitucion}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Departamento
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: textColor }}>
                {solicitud.departamento}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
              Municipio
            </Text>
            <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 11, color: textColor }}>
              {solicitud.municipio}
            </Text>
          </View>

          <View style={{ marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: surfaceColor }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={15} color={primaryColor} />
              <Text style={{ marginLeft: 6, fontFamily: "Nunito-Bold", fontSize: 9, color: textSecondaryColor }}>
                DIRECCIÓN
              </Text>
            </View>
            <Text style={{ marginTop: 7, fontFamily: "Nunito-Medium", fontSize: 10, lineHeight: 16, color: textColor }}>
              {solicitud.direccion}
            </Text>
          </View>
        </View>

        {/* AUTORIDAD SOLICITANTE */}
        <View style={{ padding: 16, borderRadius: 15, backgroundColor: surfaceSecondaryColor }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person-outline" size={19} color={secondaryColor} />
            <Text style={{ marginLeft: 9, fontFamily: "Nunito-Bold", fontSize: 15, color: textColor }}>
              Autoridad Solicitante
            </Text>
          </View>

          <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: primaryColor,
              }}
            >
              <Text style={{ fontFamily: "Nunito-Bold", fontSize: 13, color: textOnPrimaryColor }}>
                {iniciales}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 11 }}>
              <Text style={{ fontFamily: "Nunito-Bold", fontSize: 13, color: textColor }}>
                {nombreSolicitante}
              </Text>
              <Text style={{ marginTop: 2, fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                {solicitud.cargo_solicitante}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 15, flexDirection: "row", gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Número de Cédula
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 10, color: textColor }}>
                {solicitud.cedula_solicitante}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Cargo
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 10, color: textColor }}>
                {solicitud.cargo_solicitante}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 15, flexDirection: "row", gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Correo Institucional
              </Text>
              <Text numberOfLines={2} style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 10, color: primaryColor }}>
                {solicitud.correo}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Teléfono de Contacto
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 10, color: textColor }}>
                {solicitud.telefono}
              </Text>
            </View>
          </View>
        </View>

        {/* MOTIVO DE LA SOLICITUD */}
        <View style={{ padding: 15, borderRadius: 15, backgroundColor: surfaceSecondaryColor }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chatbox-ellipses-outline" size={18} color={primaryColor} />
            <Text style={{ marginLeft: 8, fontFamily: "Nunito-Bold", fontSize: 12, color: textColor }}>
              Motivo de la Solicitud
            </Text>
          </View>

          <View style={{ marginTop: 12, padding: 13, borderRadius: 12, backgroundColor: surfaceColor }}>
            <Text style={{ fontFamily: "Nunito-Medium", fontSize: 10, lineHeight: 17, color: textSecondaryColor }}>
              {solicitud.descripcion}
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN DE CONTROL */}
        <View style={{ padding: 15, borderRadius: 15, backgroundColor: surfaceSecondaryColor }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="information-circle-outline" size={18} color={secondaryColor} />
            <Text style={{ marginLeft: 8, fontFamily: "Nunito-Bold", fontSize: 12, color: textColor }}>
              Información de la Solicitud
            </Text>
          </View>

          <View style={{ marginTop: 13 }}>
            <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
              ID de Solicitud
            </Text>
            <Text selectable numberOfLines={1} style={{ marginTop: 3, fontFamily: "Nunito-Medium", fontSize: 9, color: textSecondaryColor }}>
              {solicitud.id_solicitud}
            </Text>
          </View>

          {solicitud.fecha_resolucion && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: "Nunito-Medium", fontSize: 9, color: textMutedColor }}>
                Fecha de Resolución
              </Text>
              <Text style={{ marginTop: 3, fontFamily: "Nunito-SemiBold", fontSize: 10, color: textColor }}>
                {formatearFecha(solicitud.fecha_resolucion).fecha}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ACCIONES */}
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: surfaceColor }}>
        {solicitudPendiente ? (
          <>
            <Pressable
              onPress={onAprobar}
              style={({ pressed }) => ({
                height: 46,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
                backgroundColor: primaryColor,
              })}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color={textOnPrimaryColor} />
              <Text style={{ marginLeft: 8, fontFamily: "Nunito-Bold", fontSize: 12, color: textOnPrimaryColor }}>
                Aprobar e Incorporar a Red Kiri
              </Text>
            </Pressable>

            <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={onSolicitarAntecedentes}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 42,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor,
                  borderRadius: 11,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.75 : 1,
                  backgroundColor: surfaceColor,
                })}
              >
                <Ionicons name="document-text-outline" size={16} color={textSecondaryColor} />
                <Text style={{ marginLeft: 6, fontFamily: "Nunito-SemiBold", fontSize: 10, color: textSecondaryColor }}>
                  Solicitar información
                </Text>
              </Pressable>

              <Pressable
                onPress={onRechazar}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 42,
                  paddingHorizontal: 10,
                  borderRadius: 11,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.75 : 1,
                  backgroundColor: "rgba(220, 38, 38, 0.10)",
                })}
              >
                <Ionicons name="close-circle-outline" size={16} color={dangerColor} />
                <Text style={{ marginLeft: 6, fontFamily: "Nunito-SemiBold", fontSize: 10, color: dangerColor }}>
                  Rechazar Solicitud
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View
            style={{
              minHeight: 50,
              paddingHorizontal: 14,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                solicitud.estado === "aprobada" ? secondarySoftColor : "rgba(220, 38, 38, 0.08)",
            }}
          >
            <Ionicons
              name={solicitud.estado === "aprobada" ? "checkmark-circle-outline" : "close-circle-outline"}
              size={18}
              color={solicitud.estado === "aprobada" ? secondaryColor : dangerColor}
            />
            <Text
              style={{
                marginLeft: 8,
                fontFamily: "Nunito-Bold",
                fontSize: 11,
                color: solicitud.estado === "aprobada" ? secondaryColor : dangerColor,
              }}
            >
              {solicitud.estado === "aprobada"
                ? "Esta solicitud ya fue aprobada"
                : "Esta solicitud fue rechazada"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}