import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";

import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import SolicitudDetailPanel from "@/components/superadmin/solicitudes/SolicitudDetailPanel";
import SolicitudesTable from "@/components/superadmin/solicitudes/SolicitudesTable";
import SolicitudesToolbar from "@/components/superadmin/solicitudes/SolicitudesToolbar";
import SolicitudKpiCard from "@/components/superadmin/solicitudes/SolicitudKpiCard";

import type {
    FiltroEstado,
    FiltroTipo,
    SolicitudInstitucion,
} from "@/types/superadmin/solicitudes";

// ==========================================================
// DATOS MOCK
// ==========================================================

// Pega aquí el mismo SOLICITUDES_MOCK que ya tienes.
// Posteriormente lo moveremos al service o a constants.

const SOLICITUDES_MOCK: SolicitudInstitucion[] = [
    // ...
];

// ==========================================================
// COMPONENTE
// ==========================================================

export default function SolicitudesSuperAdminScreen() {
    const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");

    const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");

    const [busqueda, setBusqueda] = useState("");

    const [pagina, setPagina] = useState(1);

    const [solicitudSeleccionada, setSolicitudSeleccionada] =
        useState<SolicitudInstitucion | null>(SOLICITUDES_MOCK[0] ?? null);

    const registrosPorPagina = 5;

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const secondaryColor = useThemeColor({}, "secondary");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    // ======================================================
    // ESTADÍSTICAS
    // ======================================================

    const totalSolicitudes = SOLICITUDES_MOCK.length;

    const solicitudesPendientes = useMemo(
        () =>
            SOLICITUDES_MOCK.filter((solicitud) => solicitud.estado === "pendiente")
                .length,
        [],
    );

    const solicitudesAprobadas = useMemo(
        () =>
            SOLICITUDES_MOCK.filter((solicitud) => solicitud.estado === "aprobada")
                .length,
        [],
    );

    const tasaAprobacion =
        totalSolicitudes > 0 ? (solicitudesAprobadas / totalSolicitudes) * 100 : 0;

    // ======================================================
    // FILTRADO
    // ======================================================

    const solicitudesFiltradas = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();

        return SOLICITUDES_MOCK.filter((solicitud) => {
            const coincideEstado =
                filtroEstado === "todas" || solicitud.estado === filtroEstado;

            const coincideTipo =
                filtroTipo === "todos" || solicitud.institucion.tipo === filtroTipo;

            const coincideBusqueda =
                !termino ||
                solicitud.institucion.nombre.toLowerCase().includes(termino) ||
                solicitud.solicitante.nombre.toLowerCase().includes(termino) ||
                solicitud.institucion.rut.toLowerCase().includes(termino) ||
                solicitud.codigo.toLowerCase().includes(termino);

            return coincideEstado && coincideTipo && coincideBusqueda;
        });
    }, [filtroEstado, filtroTipo, busqueda]);

    // ======================================================
    // PAGINACIÓN
    // ======================================================

    const totalPaginas = Math.max(
        1,
        Math.ceil(solicitudesFiltradas.length / registrosPorPagina),
    );

    const solicitudesPagina = useMemo(() => {
        const inicio = (pagina - 1) * registrosPorPagina;

        return solicitudesFiltradas.slice(inicio, inicio + registrosPorPagina);
    }, [solicitudesFiltradas, pagina]);

    // ======================================================
    // FILTROS
    // ======================================================

    function cambiarFiltroEstado(estado: FiltroEstado) {
        setFiltroEstado(estado);
        setPagina(1);
    }

    function cambiarFiltroTipo() {
        setPagina(1);

        setFiltroTipo((actual) => {
            if (actual === "todos") {
                return "educacion_superior";
            }

            if (actual === "educacion_superior") {
                return "escolar";
            }

            if (actual === "escolar") {
                return "salud";
            }

            return "todos";
        });
    }

    function cambiarBusqueda(valor: string) {
        setBusqueda(valor);
        setPagina(1);
    }

    // ======================================================
    // ACCIONES
    // ======================================================

    function aprobarSolicitud() {
        if (!solicitudSeleccionada) {
            return;
        }

        console.log("Aprobar solicitud:", solicitudSeleccionada.codigo);
    }

    function solicitarAntecedentes() {
        if (!solicitudSeleccionada) {
            return;
        }

        console.log("Solicitar antecedentes:", solicitudSeleccionada.codigo);
    }

    function rechazarSolicitud() {
        if (!solicitudSeleccionada) {
            return;
        }

        console.log("Rechazar solicitud:", solicitudSeleccionada.codigo);
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor,
            }}
            contentContainerStyle={{
                paddingHorizontal: 28,
                paddingTop: 24,
                paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* ==================================================
                BREADCRUMB
            ================================================== */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 12,
                        color: textMutedColor,
                    }}
                >
                    Kiri Superadmin
                </Text>

                <Ionicons name="chevron-forward" size={13} color={textMutedColor} />

                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 12,
                        color: textMutedColor,
                    }}
                >
                    Convenios
                </Text>

                <Ionicons name="chevron-forward" size={13} color={textMutedColor} />

                <Text
                    style={{
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 12,
                        color: primaryColor,
                    }}
                >
                    Solicitudes de Afiliación
                </Text>
            </View>

            {/* ==================================================
                ENCABEZADO
            ================================================== */}

            <View
                style={{
                    marginTop: 18,
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            alignSelf: "flex-start",
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                            borderRadius: 999,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: primarySoftColor,
                        }}
                    >
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                marginRight: 7,
                                borderRadius: 3,
                                backgroundColor: primaryColor,
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 10,
                                color: primaryColor,
                            }}
                        >
                            PORTAL DE AUDITORÍA Y RED
                        </Text>
                    </View>

                    <Text
                        style={{
                            marginTop: 11,
                            fontFamily: "Nunito-Bold",
                            fontSize: 29,
                            color: textColor,
                        }}
                    >
                        Solicitudes de Instituciones
                    </Text>

                    <Text
                        style={{
                            maxWidth: 720,
                            marginTop: 5,
                            fontFamily: "Nunito-Medium",
                            fontSize: 14,
                            lineHeight: 21,
                            color: textSecondaryColor,
                        }}
                    >
                        Gestiona, audita y valida solicitudes de incorporación de colegios,
                        universidades y centros clínicos a la red Kiri para acceso a salud
                        mental preventiva.
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <Pressable
                        onPress={() => console.log("Descargar registro")}
                        style={({ pressed }) => ({
                            minHeight: 50,
                            paddingHorizontal: 18,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed ? 0.8 : 1,
                            backgroundColor: surfaceColor,
                        })}
                    >
                        <Ionicons
                            name="download-outline"
                            size={18}
                            color={textSecondaryColor}
                        />

                        <Text
                            style={{
                                marginLeft: 9,
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 13,
                                color: textColor,
                            }}
                        >
                            Descargar registro
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => console.log("Alta manual")}
                        style={({ pressed }) => ({
                            minHeight: 50,
                            paddingHorizontal: 20,
                            borderRadius: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed ? 0.85 : 1,
                            backgroundColor: primaryColor,
                            boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.12)",
                        })}
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={19}
                            color={textOnPrimaryColor}
                        />

                        <Text
                            style={{
                                marginLeft: 8,
                                fontFamily: "Nunito-Bold",
                                fontSize: 13,
                                color: textOnPrimaryColor,
                            }}
                        >
                            Alta manual
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* ==================================================
                KPI
            ================================================== */}

            <View
                style={{
                    marginTop: 28,
                    flexDirection: "row",
                    gap: 16,
                }}
            >
                <SolicitudKpiCard
                    titulo="SOLICITUDES POR VALIDAR"
                    valor={solicitudesPendientes}
                    sufijo="en espera"
                    descripcion="Promedio de respuesta actual: 24 hrs"
                    icono="clipboard-outline"
                    variante="primary"
                />

                <SolicitudKpiCard
                    titulo="APROBADAS ESTE MES"
                    valor={solicitudesAprobadas}
                    sufijo="entidades"
                    descripcion="+12,500 estudiantes e integrantes beneficiados"
                    icono="checkmark-circle-outline"
                    variante="secondary"
                    descripcionDestacada
                />

                <SolicitudKpiCard
                    titulo="TASA DE APROBACIÓN"
                    valor={`${tasaAprobacion.toFixed(1)}%`}
                    descripcion="Cumplimiento de estándares de validación"
                    icono="shield-checkmark-outline"
                    variante="accent"
                />
            </View>

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <View
                style={{
                    marginTop: 24,
                }}
            >
                <SolicitudesToolbar
                    filtroEstado={filtroEstado}
                    filtroTipo={filtroTipo}
                    busqueda={busqueda}
                    totalSolicitudes={totalSolicitudes}
                    solicitudesPendientes={solicitudesPendientes}
                    solicitudesAprobadas={solicitudesAprobadas}
                    onCambiarEstado={cambiarFiltroEstado}
                    onCambiarTipo={cambiarFiltroTipo}
                    onBusquedaChange={cambiarBusqueda}
                />
            </View>

            {/* ==================================================
                TABLA + DETALLE
            ================================================== */}

            <View
                style={{
                    marginTop: 18,
                    flexDirection: "row",
                    alignItems: "stretch",
                    gap: 18,
                }}
            >
                <SolicitudesTable
                    solicitudes={solicitudesPagina}
                    solicitudSeleccionada={solicitudSeleccionada}
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    totalFiltradas={solicitudesFiltradas.length}
                    onSeleccionar={setSolicitudSeleccionada}
                    onCambiarPagina={setPagina}
                />

                <SolicitudDetailPanel
                    solicitud={solicitudSeleccionada}
                    onAprobar={aprobarSolicitud}
                    onSolicitarAntecedentes={solicitarAntecedentes}
                    onRechazar={rechazarSolicitud}
                />
            </View>
        </ScrollView>
    );
}
