import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import type { FiltroEstado, FiltroTipo } from "@/types/superadmin/solicitudes";

interface SolicitudesToolbarProps {
  filtroEstado: FiltroEstado;
  filtroTipo: FiltroTipo;
  busqueda: string;
  totalSolicitudes: number;
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  onCambiarEstado: (estado: FiltroEstado) => void;
  onCambiarTipo: () => void;
  onBusquedaChange: (value: string) => void;
}

export default function SolicitudesToolbar({
  filtroEstado,
  filtroTipo,
  busqueda,
  totalSolicitudes,
  solicitudesPendientes,
  solicitudesAprobadas,
  onCambiarEstado,
  onCambiarTipo,
  onBusquedaChange,
}: SolicitudesToolbarProps) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const filtros = [
    {
      value: "todas" as FiltroEstado,

      label: "Todas",

      total: totalSolicitudes,
    },

    {
      value: "pendiente" as FiltroEstado,

      label: "Pendientes",

      total: solicitudesPendientes,
    },

    {
      value: "aprobada" as FiltroEstado,

      label: "Aprobadas",

      total: solicitudesAprobadas,
    },
  ];

  const nombreFiltroTipo =
    filtroTipo === "todos"
      ? "Tipo de Entidad: Todos"
      : filtroTipo === "educacion_superior"
        ? "Educación superior"
        : filtroTipo === "escolar"
          ? "Escolar"
          : "Salud";

  const filtrosEstado = (
    <>
      {filtros.map((filtro) => {
        const activo = filtroEstado === filtro.value;

        return (
          <Pressable
            key={filtro.value}
            onPress={() => onCambiarEstado(filtro.value)}
            style={{
              height: 42,

              paddingHorizontal: esTelefono ? 14 : 15,

              borderRadius: 11,

              flexDirection: "row",

              alignItems: "center",

              backgroundColor: activo ? primaryColor : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: activo ? "Nunito-Bold" : "Nunito-Medium",

                fontSize: esTelefono ? 12 : 12,

                color: activo ? textOnPrimaryColor : textSecondaryColor,
              }}
            >
              {filtro.label}
            </Text>

            <View
              style={{
                minWidth: 22,

                height: 22,

                marginLeft: 7,

                paddingHorizontal: 5,

                borderRadius: 11,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: activo ? surfaceColor : surfaceSecondaryColor,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: 9,

                  color: activo ? primaryColor : textMutedColor,
                }}
              >
                {filtro.total}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </>
  );

  return (
    <View
      style={{
        width: "100%",

        padding: esTelefono ? 10 : 14,

        borderWidth: 1,

        borderColor,

        borderRadius: 18,

        backgroundColor: surfaceColor,

        gap: esTelefono ? 10 : 10,

        flexDirection: esEscritorio ? "row" : "column",

        alignItems: esEscritorio ? "center" : "stretch",
      }}
    >
      {/* FILTROS ESTADO */}

      {esTelefono ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 6,

            paddingRight: 8,
          }}
        >
          {filtrosEstado}
        </ScrollView>
      ) : (
        <View
          style={{
            flexDirection: "row",

            gap: 6,
          }}
        >
          {filtrosEstado}
        </View>
      )}

      {esEscritorio && (
        <View
          style={{
            flex: 1,
          }}
        />
      )}

      {/* BÚSQUEDA */}

      <View
        style={{
          width: esEscritorio ? 300 : "100%",

          height: 44,

          paddingHorizontal: 13,

          borderWidth: 1,

          borderColor: inputBorderColor,

          borderRadius: 12,

          flexDirection: "row",

          alignItems: "center",

          backgroundColor: inputBackgroundColor,
        }}
      >
        <Ionicons name="search-outline" size={18} color={textMutedColor} />

        <TextInput
          value={busqueda}
          onChangeText={onBusquedaChange}
          placeholder={
            esTelefono
              ? "Buscar solicitudes..."
              : "Buscar por institución, solicitante, código o cédula..."
          }
          placeholderTextColor={placeholderColor}
          style={{
            flex: 1,

            minWidth: 0,

            marginLeft: 8,

            fontFamily: "Nunito-Medium",

            fontSize: 12,

            color: textColor,
          }}
        />
      </View>

      {/* TIPO */}

      <Pressable
        onPress={onCambiarTipo}
        style={{
          width: esEscritorio ? undefined : "100%",

          minWidth: esEscritorio ? 180 : 0,

          height: 44,

          paddingHorizontal: 14,

          borderWidth: 1,

          borderColor,

          borderRadius: 12,

          flexDirection: "row",

          alignItems: "center",

          justifyContent: "space-between",

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,

            fontFamily: "Nunito-SemiBold",

            fontSize: 11,

            color: textSecondaryColor,
          }}
        >
          {nombreFiltroTipo}
        </Text>

        <Ionicons name="chevron-down" size={15} color={textMutedColor} />
      </Pressable>
    </View>
  );
}
