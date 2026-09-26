import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import type {
  SolicitudInstitucion,
  TipoInstitucion,
} from "@/types/superadmin/solicitudes";

import SolicitudStatusBadge from "./SolicitudStatusBadge";

interface SolicitudDetailPanelProps {
  solicitud: SolicitudInstitucion | null;
  onAprobar: () => void;
  onSolicitarAntecedentes: () => void;
  onRechazar: () => void;
}

function obtenerNombreTipo(tipo: TipoInstitucion): string {
  switch (tipo) {
    case "educacion_superior":
      return "Educación superior";

    case "escolar":
      return "Institución escolar";

    case "salud":
      return "Institución de salud";

    default:
      return "Institución";
  }
}

function obtenerIniciales(nombre: string, apellido: string): string {
  const inicialNombre = nombre?.trim().charAt(0) ?? "";

  const inicialApellido = apellido?.trim().charAt(0) ?? "";

  return `${inicialNombre}${inicialApellido}`.toUpperCase() || "US";
}

function formatearFecha(fechaIso: string) {
  const fecha = new Date(fechaIso);

  if (Number.isNaN(fecha.getTime())) {
    return {
      fecha: fechaIso,
      hora: "",
    };
  }

  return {
    fecha: fecha.toLocaleDateString("es-NI", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),

    hora: fecha.toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function SolicitudDetailPanel({
  solicitud,
  onAprobar,
  onSolicitarAntecedentes,
  onRechazar,
}: SolicitudDetailPanelProps) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

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

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingPanel = esTelefono ? 14 : 18;

  const paddingSeccion = esTelefono ? 14 : 16;

  const dosColumnas = !esTelefono;

  // ========================================================
  // SIN SOLICITUD
  // ========================================================

  if (!solicitud) {
    return (
      <View
        style={{
          width: "100%",

          minHeight: esTelefono ? 240 : 500,

          padding: 20,

          borderWidth: 1,
          borderColor,
          borderRadius: 18,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: surfaceColor,
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={40}
          color={textMutedColor}
        />

        <Text
          style={{
            marginTop: 12,

            fontFamily: "Nunito-Bold",

            fontSize: 14,

            color: textColor,
          }}
        >
          Selecciona una solicitud
        </Text>

        <Text
          style={{
            marginTop: 5,

            fontFamily: "Nunito-Medium",

            fontSize: 11,

            textAlign: "center",

            color: textMutedColor,
          }}
        >
          Aquí podrás revisar toda la información.
        </Text>
      </View>
    );
  }

  // ========================================================
  // DATOS
  // ========================================================

  const iniciales = obtenerIniciales(
    solicitud.nombre_solicitante,
    solicitud.apellido_solicitante,
  );

  const nombreSolicitante = [
    solicitud.nombre_solicitante,
    solicitud.apellido_solicitante,
  ]
    .filter(Boolean)
    .join(" ");

  const { fecha, hora } = formatearFecha(solicitud.fecha_solicitud);

  const tipoInstitucion = obtenerNombreTipo(solicitud.tipo_institucion);

  const solicitudPendiente = solicitud.estado === "pendiente";

  // ========================================================
  // CAMPO
  // ========================================================

  const renderCampo = (
    titulo: string,
    valor: string | undefined | null,
    destacado = false,
  ) => (
    <View
      style={{
        flex: dosColumnas ? 1 : undefined,

        width: dosColumnas ? undefined : "100%",

        minWidth: 0,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Medium",

          fontSize: esTelefono ? 10 : 9,

          color: textMutedColor,
        }}
      >
        {titulo}
      </Text>

      <Text
        selectable={destacado}
        style={{
          marginTop: 4,

          fontFamily: "Nunito-SemiBold",

          fontSize: esTelefono ? 13 : 11,

          lineHeight: esTelefono ? 18 : 16,

          color: destacado ? primaryColor : textColor,
        }}
      >
        {valor || "No especificado"}
      </Text>
    </View>
  );

  // ========================================================
  // CONTENIDO
  // ========================================================

  const contenido = (
    <>
      {/* DATOS INSTITUCIONALES */}

      <View
        style={{
          padding: paddingSeccion,

          borderRadius: 15,

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Ionicons name="business-outline" size={20} color={primaryColor} />

          <Text
            style={{
              marginLeft: 9,

              flex: 1,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefono ? 17 : 15,

              color: textColor,
            }}
          >
            Datos Institucionales
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,

            flexDirection: dosColumnas ? "row" : "column",

            gap: esTelefono ? 16 : 14,
          }}
        >
          {renderCampo(
            "Nombre de la Institución",
            solicitud.nombre_institucion,
          )}

          {renderCampo(
            "Código Institucional",
            solicitud.codigo_institucional,
            true,
          )}
        </View>

        <View
          style={{
            marginTop: 16,

            flexDirection: dosColumnas ? "row" : "column",

            gap: esTelefono ? 16 : 14,
          }}
        >
          {renderCampo("Tipo de Institución", tipoInstitucion)}

          {renderCampo("Departamento", solicitud.departamento)}
        </View>

        <View
          style={{
            marginTop: 16,
          }}
        >
          {renderCampo("Municipio", solicitud.municipio)}
        </View>

        <View
          style={{
            marginTop: 16,

            padding: esTelefono ? 14 : 12,

            borderRadius: 12,

            backgroundColor: surfaceColor,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" size={17} color={primaryColor} />

            <Text
              style={{
                marginLeft: 7,

                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color: textSecondaryColor,
              }}
            >
              DIRECCIÓN
            </Text>
          </View>

          <Text
            style={{
              marginTop: 9,

              fontFamily: "Nunito-Medium",

              fontSize: esTelefono ? 13 : 11,

              lineHeight: esTelefono ? 19 : 17,

              color: textColor,
            }}
          >
            {solicitud.direccion}
          </Text>
        </View>
      </View>

      {/* AUTORIDAD */}

      <View
        style={{
          padding: paddingSeccion,

          borderRadius: 15,

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Ionicons name="person-outline" size={20} color={secondaryColor} />

          <Text
            style={{
              marginLeft: 9,

              flex: 1,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefono ? 17 : 15,

              color: textColor,
            }}
          >
            Autoridad Solicitante
          </Text>
        </View>

        <View
          style={{
            marginTop: 16,

            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <View
            style={{
              width: esTelefono ? 52 : 42,

              height: esTelefono ? 52 : 42,

              borderRadius: esTelefono ? 26 : 21,

              alignItems: "center",

              justifyContent: "center",

              flexShrink: 0,

              backgroundColor: primaryColor,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esTelefono ? 15 : 13,

                color: textOnPrimaryColor,
              }}
            >
              {iniciales}
            </Text>
          </View>

          <View
            style={{
              flex: 1,

              minWidth: 0,

              marginLeft: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esTelefono ? 15 : 13,

                lineHeight: 20,

                color: textColor,
              }}
            >
              {nombreSolicitante}
            </Text>

            <Text
              style={{
                marginTop: 3,

                fontFamily: "Nunito-Medium",

                fontSize: esTelefono ? 11 : 9,

                color: textMutedColor,
              }}
            >
              {solicitud.cargo_solicitante}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 18,

            flexDirection: dosColumnas ? "row" : "column",

            gap: esTelefono ? 16 : 14,
          }}
        >
          {renderCampo("Número de Cédula", solicitud.cedula_solicitante)}

          {renderCampo("Cargo", solicitud.cargo_solicitante)}
        </View>

        <View
          style={{
            marginTop: 16,

            flexDirection: dosColumnas ? "row" : "column",

            gap: esTelefono ? 16 : 14,
          }}
        >
          {renderCampo("Correo Institucional", solicitud.correo, true)}

          {renderCampo("Teléfono de Contacto", solicitud.telefono)}
        </View>
      </View>

      {/* MOTIVO */}

      <View
        style={{
          padding: paddingSeccion,

          borderRadius: 15,

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Ionicons
            name="chatbox-ellipses-outline"
            size={19}
            color={primaryColor}
          />

          <Text
            style={{
              marginLeft: 8,

              flex: 1,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefono ? 15 : 12,

              color: textColor,
            }}
          >
            Motivo de la Solicitud
          </Text>
        </View>

        <View
          style={{
            marginTop: 12,

            padding: 14,

            borderRadius: 12,

            backgroundColor: surfaceColor,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Medium",

              fontSize: esTelefono ? 13 : 10,

              lineHeight: esTelefono ? 20 : 17,

              color: textSecondaryColor,
            }}
          >
            {solicitud.descripcion}
          </Text>
        </View>
      </View>

      {/* CONTROL */}

      <View
        style={{
          padding: paddingSeccion,

          borderRadius: 15,

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={secondaryColor}
          />

          <Text
            style={{
              marginLeft: 8,

              flex: 1,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefono ? 15 : 12,

              color: textColor,
            }}
          >
            Información de la Solicitud
          </Text>
        </View>

        <View
          style={{
            marginTop: 14,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Medium",

              fontSize: 10,

              color: textMutedColor,
            }}
          >
            ID de Solicitud
          </Text>

          <Text
            selectable
            style={{
              marginTop: 4,

              fontFamily: "Nunito-Medium",

              fontSize: esTelefono ? 11 : 9,

              lineHeight: 16,

              color: textSecondaryColor,
            }}
          >
            {solicitud.id_solicitud}
          </Text>
        </View>

        {solicitud.fecha_resolucion && (
          <View
            style={{
              marginTop: 14,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Medium",

                fontSize: 10,

                color: textMutedColor,
              }}
            >
              Fecha de Resolución
            </Text>

            <Text
              style={{
                marginTop: 4,

                fontFamily: "Nunito-SemiBold",

                fontSize: esTelefono ? 12 : 10,

                color: textColor,
              }}
            >
              {formatearFecha(solicitud.fecha_resolucion).fecha}
            </Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <View
      style={{
        width: "100%",

        minWidth: 0,

        overflow: "hidden",

        borderWidth: 1,
        borderColor,
        borderRadius: 18,

        backgroundColor: surfaceColor,
      }}
    >
      {/* ENCABEZADO */}

      <View
        style={{
          padding: esTelefono ? 18 : 20,

          borderBottomWidth: 1,

          borderBottomColor: borderColor,
        }}
      >
        <SolicitudStatusBadge estado={solicitud.estado} />

        <Text
          style={{
            marginTop: 12,

            fontFamily: "Nunito-Bold",

            fontSize: esTelefono ? 24 : 20,

            lineHeight: esTelefono ? 30 : 26,

            color: textColor,
          }}
        >
          Revisión de Afiliación
        </Text>

        <Text
          style={{
            marginTop: 5,

            fontFamily: "Nunito-SemiBold",

            fontSize: esTelefono ? 13 : 11,

            color: primaryColor,
          }}
        >
          {solicitud.codigo_institucional}
        </Text>

        <Text
          style={{
            marginTop: 8,

            fontFamily: "Nunito-Medium",

            fontSize: esTelefono ? 11 : 10,

            lineHeight: 16,

            color: textMutedColor,
          }}
        >
          Ingresada {fecha}
          {hora ? `, ${hora}` : ""}
        </Text>
      </View>

      {/* En móvil NO creamos un scroll interno */}

      {esEscritorio ? (
        <ScrollView
          style={{
            maxHeight: 580,
          }}
          contentContainerStyle={{
            padding: paddingPanel,

            gap: 14,
          }}
          showsVerticalScrollIndicator={false}
        >
          {contenido}
        </ScrollView>
      ) : (
        <View
          style={{
            padding: paddingPanel,

            gap: 14,
          }}
        >
          {contenido}
        </View>
      )}

      {/* ACCIONES */}

      <View
        style={{
          padding: esTelefono ? 14 : 16,

          borderTopWidth: 1,

          borderTopColor: borderColor,

          backgroundColor: surfaceColor,
        }}
      >
        {solicitudPendiente ? (
          <>
            <Pressable
              onPress={onAprobar}
              style={({ pressed }) => ({
                minHeight: 50,

                paddingHorizontal: 12,

                borderRadius: 12,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "center",

                opacity: pressed ? 0.85 : 1,

                backgroundColor: primaryColor,
              })}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={textOnPrimaryColor}
              />

              <Text
                style={{
                  flexShrink: 1,

                  marginLeft: 8,

                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 12 : 12,

                  textAlign: "center",

                  color: textOnPrimaryColor,
                }}
              >
                Aprobar e Incorporar a Red Kiri
              </Text>
            </Pressable>

            <View
              style={{
                marginTop: 10,

                flexDirection: esTelefono ? "column" : "row",

                gap: 10,
              }}
            >
              <Pressable
                onPress={onSolicitarAntecedentes}
                style={({ pressed }) => ({
                  flex: esTelefono ? undefined : 1,

                  width: esTelefono ? "100%" : undefined,

                  minHeight: 46,

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
                <Ionicons
                  name="document-text-outline"
                  size={17}
                  color={textSecondaryColor}
                />

                <Text
                  style={{
                    marginLeft: 7,

                    fontFamily: "Nunito-SemiBold",

                    fontSize: 11,

                    color: textSecondaryColor,
                  }}
                >
                  Solicitar información
                </Text>
              </Pressable>

              <Pressable
                onPress={onRechazar}
                style={({ pressed }) => ({
                  flex: esTelefono ? undefined : 1,

                  width: esTelefono ? "100%" : undefined,

                  minHeight: 46,

                  paddingHorizontal: 10,

                  borderRadius: 11,

                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "center",

                  opacity: pressed ? 0.75 : 1,

                  backgroundColor: "rgba(220,38,38,0.10)",
                })}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={17}
                  color={dangerColor}
                />

                <Text
                  style={{
                    marginLeft: 7,

                    fontFamily: "Nunito-SemiBold",

                    fontSize: 11,

                    color: dangerColor,
                  }}
                >
                  Rechazar Solicitud
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View
            style={{
              minHeight: 54,

              paddingHorizontal: 14,

              paddingVertical: 10,

              borderRadius: 12,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "center",

              backgroundColor:
                solicitud.estado === "aprobada"
                  ? secondarySoftColor
                  : "rgba(220,38,38,0.08)",
            }}
          >
            <Ionicons
              name={
                solicitud.estado === "aprobada"
                  ? "checkmark-circle-outline"
                  : "close-circle-outline"
              }
              size={19}
              color={
                solicitud.estado === "aprobada" ? secondaryColor : dangerColor
              }
            />

            <Text
              style={{
                flexShrink: 1,

                marginLeft: 8,

                fontFamily: "Nunito-Bold",

                fontSize: esTelefono ? 12 : 11,

                textAlign: "center",

                color:
                  solicitud.estado === "aprobada"
                    ? secondaryColor
                    : dangerColor,
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
