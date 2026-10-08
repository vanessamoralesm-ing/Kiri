import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AdminCard from "@/components/admin/AdminCard";
import { AdminFilterOptions } from "@/components/admin/AdminFilters";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo_izq";
import { useModal } from "@/contexts/ModalContext";
import { crearSolicitudInstitucional } from "@/services/instituciones/solicitudInstitucionService";
import { TIPOS_INSTITUCION } from "@/types/instituciones/institucion";
import type { TipoInstitucion } from "@/types/superadmin/solicitudes";
import { cn } from "@/utils/cn";
import { validateEmail } from "@/utils/validations";

const CAMPOS = [
  [
    ["nombre_institucion", "Nombre de la Institución", "Ej. Colegio José Madriz"],
    ["codigo_institucional", "Código Institucional", "Ej. MINED-0321"],
    ["departamento", "Departamento", "Ej. León"],
    ["municipio", "Municipio", "Ej. León"],
    [
      "direccion",
      "Dirección de la Institución",
      "Ej. Barrio El Sagrario, frente al parque...",
    ],
  ],
  [
    ["nombre_solicitante", "Nombre del Solicitante", "Ej. Félix Pedro"],
    ["apellido_solicitante", "Apellido del Solicitante", "Ej. López Pérez"],
    ["cedula_solicitante", "Número de Cédula", "001-123456-0001P"],
    ["cargo_solicitante", "Cargo", "Ej. Director"],
    ["correo", "Correo Institucional", "admin@institucion.edu.ni"],
    ["telefono", "Teléfono de Contacto", "8888-1234"],
    ["descripcion", "Motivo de la Solicitud", "¿Por qué desean utilizar Kiri?"],
  ],
] as const;

export default function RegistroInstitucionPantalla() {
  const router = useRouter();
  const { avisar } = useModal();
  const scrollRef = useRef<ScrollView>(null);
  const ocupado = useRef(false);

  const [paso, setPaso] = useState<1 | 2>(1);
  const [enviando, setEnviando] = useState(false);
  const [datos, setDatos] = useState({
    nombre_institucion: "",
    codigo_institucional: "",
    tipo_institucion: "" as TipoInstitucion | "",
    departamento: "",
    municipio: "",
    direccion: "",
    nombre_solicitante: "",
    apellido_solicitante: "",
    cedula_solicitante: "",
    cargo_solicitante: "",
    correo: "",
    telefono: "",
    descripcion: "",
  });

  const campos = CAMPOS[paso - 1];

  const cambiarCampo = (campo: keyof typeof datos, valor: string) =>
    setDatos((actual) => ({ ...actual, [campo]: valor }));

  const cambiarPaso = (nuevo: 1 | 2) => {
    setPaso(nuevo);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const salir = () =>
    router.canGoBack()
      ? router.back()
      : router.replace("/(auth)/welcome");

  const regresar = () => {
    if (ocupado.current) return;
    paso === 2 ? cambiarPaso(1) : salir();
  };

  const continuar = async () => {
    if (ocupado.current) return;

    if (
      !datos.tipo_institucion ||
      campos.some(([campo]) => !datos[campo].trim())
    ) {
      await avisar(
        "Campos incompletos",
        "Por favor completa todos los datos obligatorios.",
        true,
      );
      return;
    }

    if (paso === 1) {
      cambiarPaso(2);
      return;
    }

    const errorCorreo = validateEmail(datos.correo);

    if (errorCorreo) {
      await avisar("Correo inválido", errorCorreo, true);
      return;
    }

    ocupado.current = true;
    setEnviando(true);

    try {
      const resultado = await crearSolicitudInstitucional({
        ...datos,
        tipo_institucion: datos.tipo_institucion,
      });

      await avisar(
        "Solicitud registrada",
        resultado.warning ??
          "Tu solicitud ha sido enviada correctamente. El equipo de Kiri revisará la información y te notificará por correo cuando exista una resolución.",
      );

      salir();
    } catch (error) {
      await avisar(
        "No se pudo enviar la solicitud",
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo nuevamente.",
        true,
      );
    } finally {
      ocupado.current = false;
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="grow px-4 py-6 md:px-8 lg:py-10"
        >
          {/* Responsive:
              móvil usa todo el ancho;
              desde pantallas grandes se limita con max-w-4xl. */}
          <View className="w-full max-w-4xl self-center gap-5">
            <View className="flex-row items-center justify-between">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver"
                disabled={enviando}
                onPress={regresar}
                className="h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface active:opacity-70"
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  className="text-icon"
                />
              </Pressable>

              <View className="h-16 w-32 items-end justify-center">
                <Logo />
              </View>
            </View>

            <View className="items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
                <Ionicons
                  name="business-outline"
                  size={28}
                  className="text-primary"
                />
              </View>

              {/* Responsive:
                  text-2xl en móvil;
                  text-3xl desde md. */}
              <Text className="text-center font-nunito-bold text-2xl text-text md:text-3xl">
                Solicitud de Institución
              </Text>

              <Text className="max-w-2xl text-center font-nunito-medium text-base text-text-secondary">
                Únete al ecosistema de Kiri y transforma el bienestar emocional
                de tu comunidad.
              </Text>

              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
                  {paso === 2 ? (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      className="text-text-on-primary"
                    />
                  ) : (
                    <Text className="font-nunito-bold text-text-on-primary">
                      1
                    </Text>
                  )}
                </View>

                <View
                  className={cn(
                    "h-1 w-16",
                    paso === 2 ? "bg-primary" : "bg-border",
                  )}
                />

                <View
                  className={cn(
                    "h-10 w-10 items-center justify-center rounded-full",
                    paso === 2 ? "bg-primary" : "bg-surface-secondary",
                  )}
                >
                  <Text
                    className={cn(
                      "font-nunito-bold",
                      paso === 2
                        ? "text-text-on-primary"
                        : "text-text-muted",
                    )}
                  >
                    2
                  </Text>
                </View>
              </View>

              <Text className="text-center font-nunito-semibold text-sm text-text-secondary">
                {paso === 1
                  ? "Paso 1 de 2 · Información general de la institución"
                  : "Paso 2 de 2 · Datos del representante y contacto"}
              </Text>
            </View>

            <AdminCard className="gap-5 md:p-6">
              <View className="gap-2">
                <Text className="font-nunito-bold text-xl text-text">
                  {paso === 1
                    ? "Información de la institución"
                    : "Datos del representante"}
                </Text>

                <Text className="font-nunito-medium text-sm text-text-secondary">
                  {paso === 1
                    ? "Ingresa los datos generales de la organización que desea utilizar Kiri."
                    : "Proporciona los datos de la persona responsable de la solicitud institucional."}
                </Text>
              </View>

              {/* Responsive:
                  una columna en móvil;
                  desde md, dos columnas;
                  dirección y descripción ocupan toda la fila. */}
              <View className="-mx-2 flex-row flex-wrap">
                {campos.map(([campo, label, placeholder]) => {
                  const multiline =
                    campo === "direccion" || campo === "descripcion";

                  return (
                    <React.Fragment key={campo}>
                      <View
                        className={cn(
                          "w-full px-2",
                          !multiline && "md:w-1/2",
                        )}
                      >
                        <Input
                          label={`${label} *`}
                          placeholder={placeholder}
                          value={datos[campo]}
                          onChangeText={(valor) =>
                            cambiarCampo(campo, valor)
                          }
                          editable={!enviando}
                          multiline={multiline}
                          numberOfLines={multiline ? 4 : 1}
                          textAlignVertical={
                            multiline ? "top" : "center"
                          }
                          inputClassName={multiline ? "h-24" : undefined}
                          keyboardType={
                            campo === "correo"
                              ? "email-address"
                              : campo === "telefono"
                                ? "phone-pad"
                                : "default"
                          }
                          autoCapitalize={
                            campo === "correo" ? "none" : "sentences"
                          }
                        />
                      </View>

                      {campo === "codigo_institucional" && (
                        <View className="mb-5 w-full px-2">
                          <AdminFilterOptions
                            label="Tipo de Institución *"
                            value={datos.tipo_institucion}
                            options={TIPOS_INSTITUCION}
                            disabled={enviando}
                            onChange={(valor) =>
                              cambiarCampo(
                                "tipo_institucion",
                                valor as TipoInstitucion,
                              )
                            }
                          />
                        </View>
                      )}
                    </React.Fragment>
                  );
                })}
              </View>

              {paso === 2 && (
                <View className="flex-row items-start gap-3 rounded-xl bg-secondary-soft p-4">
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    className="text-secondary"
                  />

                  <Text className="flex-1 font-nunito-medium text-sm text-text-secondary">
                    La información será revisada por el equipo de Kiri antes de
                    habilitar el acceso institucional.
                  </Text>
                </View>
              )}

              {/* Responsive:
                  botones apilados en móvil;
                  desde md se muestran en fila y alineados a la derecha. */}
              <View className="gap-2 md:flex-row md:justify-end">
                {paso === 2 && (
                  <View className="md:w-36">
                    <Button
                      title="Anterior"
                      variant="secondary"
                      disabled={enviando}
                      onPress={() => cambiarPaso(1)}
                    />
                  </View>
                )}

                <View className="md:w-52">
                  <Button
                    title={paso === 1 ? "Siguiente" : "Enviar solicitud"}
                    loading={enviando}
                    onPress={continuar}
                  />
                </View>
              </View>
            </AdminCard>

            <Text className="text-center font-nunito-medium text-xs text-text-muted">
              Los campos marcados con * son obligatorios.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}