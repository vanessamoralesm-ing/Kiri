import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import type {
  SolicitudInstitucion,
  TipoInstitucion,
} from "@/types/superadmin/solicitudes";

interface SolicitudesTableProps {
  solicitudes: SolicitudInstitucion[];
  solicitudSeleccionada: SolicitudInstitucion | null;
  pagina: number;
  totalPaginas: number;
  totalFiltradas: number;
  onSeleccionar: (solicitud: SolicitudInstitucion) => void;
  onCambiarPagina: (pagina: number) => void;
}

function obtenerNombreTipo(tipo: TipoInstitucion) {
  switch (tipo) {
    case "educacion_superior":
      return "Ed. Superior";

    case "escolar":
      return "Escolar K-12";

    case "salud":
      return "Red de Salud";

    default:
      return "Institución";
  }
}

function obtenerIniciales(nombre: string) {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);

  if (palabras.length === 0) {
    return "IN";
  }

  if (palabras.length === 1) {
    return palabras[0].slice(0, 2).toUpperCase();
  }

  return palabras
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0))
    .join("")
    .toUpperCase();
}

function obtenerUbicacion(solicitud: SolicitudInstitucion) {
  const ubicacion = [solicitud.municipio, solicitud.departamento]
    .filter(Boolean)
    .join(", ");

  return ubicacion || solicitud.direccion || "Ubicación no especificada";
}

export default function SolicitudesTable({
  solicitudes,
  solicitudSeleccionada,
  pagina,
  totalPaginas,
  totalFiltradas,
  onSeleccionar,
  onCambiarPagina,
}: SolicitudesTableProps) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  function obtenerColoresTipo(tipo: TipoInstitucion) {
    if (tipo === "salud") {
      return {
        fondo: secondarySoftColor,
        color: secondaryColor,
      };
    }

    if (tipo === "escolar") {
      return {
        fondo: accentSoftColor,
        color: accentColor,
      };
    }

    return {
      fondo: primarySoftColor,
      color: primaryColor,
    };
  }

  // ========================================================
  // PAGINACIÓN
  // ========================================================

  const renderPaginacion = () => (
    <View
      style={{
        minHeight: esTelefono ? 72 : 62,

        paddingHorizontal: esTelefono ? 12 : 18,

        paddingVertical: esTelefono ? 10 : 0,

        borderTopWidth: 1,

        borderTopColor: borderColor,

        flexDirection: esTelefono ? "column" : "row",

        alignItems: esTelefono ? "stretch" : "center",

        gap: esTelefono ? 8 : 0,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Medium",

          fontSize: 10,

          textAlign: esTelefono ? "center" : "left",

          color: textMutedColor,
        }}
      >
        Mostrando {solicitudes.length} de {totalFiltradas} solicitudes
      </Text>

      {!esTelefono && (
        <View
          style={{
            flex: 1,
          }}
        />
      )}

      <View
        style={{
          flexDirection: "row",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Pressable
          disabled={pagina === 1}
          onPress={() => onCambiarPagina(Math.max(1, pagina - 1))}
          style={{
            width: 32,
            height: 32,

            alignItems: "center",

            justifyContent: "center",

            opacity: pagina === 1 ? 0.35 : 1,
          }}
        >
          <Ionicons name="chevron-back" size={17} color={textSecondaryColor} />
        </Pressable>

        {Array.from(
          {
            length: totalPaginas,
          },
          (_, indice) => indice + 1,
        ).map((numero) => (
          <Pressable
            key={numero}
            onPress={() => onCambiarPagina(numero)}
            style={{
              width: 32,
              height: 32,

              marginHorizontal: 2,

              borderRadius: 8,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: pagina === numero ? primaryColor : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color:
                  pagina === numero ? textOnPrimaryColor : textSecondaryColor,
              }}
            >
              {numero}
            </Text>
          </Pressable>
        ))}

        <Pressable
          disabled={pagina === totalPaginas}
          onPress={() => onCambiarPagina(Math.min(totalPaginas, pagina + 1))}
          style={{
            width: 32,
            height: 32,

            alignItems: "center",

            justifyContent: "center",

            opacity: pagina === totalPaginas ? 0.35 : 1,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={17}
            color={textSecondaryColor}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View
      style={{
        width: "100%",

        flex: esEscritorio ? 1.45 : undefined,

        minWidth: 0,

        minHeight: esEscritorio ? 710 : undefined,

        overflow: "hidden",

        borderWidth: 1,
        borderColor,
        borderRadius: 18,

        backgroundColor: surfaceColor,
      }}
    >
      {/* CABECERA */}

      <View
        style={{
          minHeight: esTelefono ? 68 : 58,

          paddingHorizontal: esTelefono ? 14 : 18,

          paddingVertical: esTelefono ? 12 : 0,

          flexDirection: "row",

          alignItems: "center",

          borderBottomWidth: 1,

          borderBottomColor: borderColor,
        }}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esTelefono ? 18 : 16,

              color: textColor,
            }}
          >
            Registro de Peticiones
          </Text>

          {esTelefono && (
            <Text
              style={{
                marginTop: 3,

                fontFamily: "Nunito-Medium",

                fontSize: 10,

                color: textMutedColor,
              }}
            >
              {solicitudes.length} de {totalFiltradas} solicitudes
            </Text>
          )}
        </View>

        {!esTelefono && (
          <>
            <View
              style={{
                marginLeft: 10,

                paddingHorizontal: 9,

                paddingVertical: 4,

                borderRadius: 999,

                backgroundColor: primarySoftColor,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: 9,

                  color: primaryColor,
                }}
              >
                {solicitudes.length} mostradas
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            />

            <Pressable
              style={{
                flexDirection: "row",

                alignItems: "center",
              }}
            >
              <Ionicons name="options-outline" size={16} color={primaryColor} />

              <Text
                style={{
                  marginLeft: 6,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 11,

                  color: primaryColor,
                }}
              >
                Ajustar columnas
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* ====================================================
          MÓVIL - TARJETAS
      ==================================================== */}

      {esTelefono ? (
        <View
          style={{
            padding: 12,

            gap: 10,
          }}
        >
          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => {
              const seleccionada =
                solicitudSeleccionada?.id_solicitud === solicitud.id_solicitud;

              const colores = obtenerColoresTipo(solicitud.tipo_institucion);

              const iniciales = obtenerIniciales(solicitud.nombre_institucion);

              const nombreSolicitante = [
                solicitud.nombre_solicitante,
                solicitud.apellido_solicitante,
              ]
                .filter(Boolean)
                .join(" ");

              const ubicacion = obtenerUbicacion(solicitud);

              return (
                <Pressable
                  key={solicitud.id_solicitud}
                  onPress={() => onSeleccionar(solicitud)}
                  style={({ pressed }) => ({
                    width: "100%",

                    padding: 14,

                    borderWidth: 1,

                    borderColor: seleccionada ? primaryColor : borderColor,

                    borderRadius: 16,

                    opacity: pressed ? 0.85 : 1,

                    backgroundColor: seleccionada
                      ? primarySoftColor
                      : surfaceSecondaryColor,
                  })}
                >
                  {/* INSTITUCIÓN */}

                  <View
                    style={{
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 46,

                        height: 46,

                        borderRadius: 13,

                        flexShrink: 0,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: colores.fondo,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 14,

                          color: colores.color,
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

                          fontSize: 14,

                          lineHeight: 19,

                          color: textColor,
                        }}
                      >
                        {solicitud.nombre_institucion}
                      </Text>

                      <Text
                        style={{
                          marginTop: 3,

                          fontFamily: "Nunito-Medium",

                          fontSize: 11,

                          color: textMutedColor,
                        }}
                      >
                        {ubicacion}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={textMutedColor}
                    />
                  </View>

                  {/* SOLICITANTE */}

                  <View
                    style={{
                      marginTop: 14,

                      paddingTop: 12,

                      borderTopWidth: 1,

                      borderTopColor: borderColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Medium",

                        fontSize: 9,

                        color: textMutedColor,
                      }}
                    >
                      SOLICITANTE
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,

                        fontFamily: "Nunito-SemiBold",

                        fontSize: 12,

                        color: textColor,
                      }}
                    >
                      {nombreSolicitante}
                    </Text>

                    <Text
                      style={{
                        marginTop: 2,

                        fontFamily: "Nunito-Medium",

                        fontSize: 10,

                        color: textMutedColor,
                      }}
                    >
                      {solicitud.cargo_solicitante}
                    </Text>
                  </View>

                  {/* TIPO */}

                  <View
                    style={{
                      marginTop: 12,

                      alignSelf: "flex-start",

                      paddingHorizontal: 10,

                      paddingVertical: 5,

                      borderRadius: 999,

                      backgroundColor: colores.fondo,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",

                        fontSize: 10,

                        color: colores.color,
                      }}
                    >
                      {obtenerNombreTipo(solicitud.tipo_institucion)}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View
              style={{
                minHeight: 260,

                alignItems: "center",

                justifyContent: "center",

                padding: 20,
              }}
            >
              <Ionicons
                name="search-outline"
                size={36}
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
                No encontramos solicitudes
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  textAlign: "center",

                  color: textMutedColor,
                }}
              >
                Prueba cambiando los filtros de búsqueda.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {/* ==================================================
              TABLET / ESCRITORIO - TABLA
          ================================================== */}

          <View
            style={{
              minHeight: 42,

              paddingHorizontal: 14,

              flexDirection: "row",

              alignItems: "center",

              backgroundColor: surfaceSecondaryColor,
            }}
          >
            <Text
              style={{
                flex: 1.55,

                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color: textSecondaryColor,
              }}
            >
              INSTITUCIÓN
            </Text>

            <Text
              style={{
                flex: 0.75,

                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color: textSecondaryColor,
              }}
            >
              SOLICITANTE
            </Text>

            <Text
              style={{
                width: 105,

                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color: textSecondaryColor,
              }}
            >
              TIPO
            </Text>
          </View>

          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => {
              const seleccionada =
                solicitudSeleccionada?.id_solicitud === solicitud.id_solicitud;

              const colores = obtenerColoresTipo(solicitud.tipo_institucion);

              const iniciales = obtenerIniciales(solicitud.nombre_institucion);

              const nombreSolicitante = [
                solicitud.nombre_solicitante,
                solicitud.apellido_solicitante,
              ]
                .filter(Boolean)
                .join(" ");

              const ubicacion = obtenerUbicacion(solicitud);

              return (
                <Pressable
                  key={solicitud.id_solicitud}
                  onPress={() => onSeleccionar(solicitud)}
                  style={({ pressed }) => ({
                    minHeight: 86,

                    paddingHorizontal: 14,

                    paddingVertical: 12,

                    borderBottomWidth: 1,

                    borderBottomColor: borderColor,

                    flexDirection: "row",

                    alignItems: "center",

                    opacity: pressed ? 0.85 : 1,

                    backgroundColor: seleccionada
                      ? primarySoftColor
                      : surfaceColor,
                  })}
                >
                  <View
                    style={{
                      flex: 1.55,

                      flexDirection: "row",

                      alignItems: "center",

                      minWidth: 0,
                    }}
                  >
                    <View
                      style={{
                        width: 40,

                        height: 40,

                        borderRadius: 11,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: colores.fondo,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 14,

                          color: colores.color,
                        }}
                      >
                        {iniciales}
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 1,

                        marginLeft: 11,

                        minWidth: 0,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 12,

                          color: textColor,
                        }}
                      >
                        {solicitud.nombre_institucion}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{
                          marginTop: 3,

                          fontFamily: "Nunito-Medium",

                          fontSize: 10,

                          color: textMutedColor,
                        }}
                      >
                        {ubicacion}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 0.75,

                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: "Nunito-SemiBold",

                        fontSize: 11,

                        color: textColor,
                      }}
                    >
                      {nombreSolicitante}
                    </Text>

                    <Text
                      numberOfLines={2}
                      style={{
                        marginTop: 2,

                        fontFamily: "Nunito-Medium",

                        fontSize: 9,

                        color: textMutedColor,
                      }}
                    >
                      {solicitud.cargo_solicitante}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 105,

                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 8,

                        paddingVertical: 4,

                        borderRadius: 999,

                        backgroundColor: colores.fondo,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: 9,

                          color: colores.color,
                        }}
                      >
                        {obtenerNombreTipo(solicitud.tipo_institucion)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View
              style={{
                flex: 1,

                minHeight: 350,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <Ionicons
                name="search-outline"
                size={36}
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
                No encontramos solicitudes
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  fontFamily: "Nunito-Medium",

                  fontSize: 12,

                  color: textMutedColor,
                }}
              >
                Prueba cambiando los filtros de búsqueda.
              </Text>
            </View>
          )}

          {esEscritorio && (
            <View
              style={{
                flex: 1,
              }}
            />
          )}
        </>
      )}

      {renderPaginacion()}
    </View>
  );
}
