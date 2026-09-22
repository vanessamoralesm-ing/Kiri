import React from "react";

import { Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import type { EstadoSolicitud } from "@/types/superadmin/solicitudes";

interface SolicitudStatusBadgeProps {
    estado: EstadoSolicitud;
}

export default function SolicitudStatusBadge({
    estado,
}: SolicitudStatusBadgeProps) {
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const secondaryColor = useThemeColor({}, "secondary");

    const secondarySoftColor = useThemeColor({}, "secondarySoft");

    const accentColor = useThemeColor({}, "accent");

    const accentSoftColor = useThemeColor({}, "accentSoft");

    const dangerColor = useThemeColor({}, "danger");

    const configuracion = {
        pendiente: {
            texto: "Pendiente de Validación",
            color: accentColor,
            fondo: accentSoftColor,
        },

        aprobada: {
            texto: "Solicitud Aprobada",
            color: secondaryColor,
            fondo: secondarySoftColor,
        },

        rechazada: {
            texto: "Solicitud Rechazada",
            color: dangerColor,
            fondo: surfaceSecondaryColor,
        },
    }[estado];

    return (
        <View
            style={{
                alignSelf: "flex-start",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: configuracion.fondo,
            }}
        >
            <Text
                style={{
                    fontFamily: "Nunito-Bold",
                    fontSize: 9,
                    color: configuracion.color,
                }}
            >
                ● {configuracion.texto}
            </Text>
        </View>
    );
}
