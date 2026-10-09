import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import ThemeScope from "@/components/theme-scope";
import Button, { ButtonSizeContext } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export interface ModalOptions {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoAceptar?: string;
  peligro?: boolean;
  icono?: keyof typeof Ionicons.glyphMap;
}
interface Props extends ModalOptions {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  cargando?: boolean;
  error?: string | null;
}
export default function ActionModal({
  visible,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoAceptar = "Aceptar",
  peligro,
  icono = "help-circle-outline",
  onClose,
  onConfirm,
  cargando,
  error,
}: Props) {
  const compact = useContext(ButtonSizeContext) === "sm";
  const buttonClassName = cn("my-0 px-3 py-2", compact ? "min-h-10" : "min-h-12");
  const cerrar = () => {
    if (!cargando) onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={cerrar}
    >
      <ThemeScope className="bg-overlay px-6">
        <ScrollView
          contentContainerClassName="grow items-center justify-center py-6"
          showsVerticalScrollIndicator={false}
        >
          <View
            accessibilityViewIsModal
            className="w-full max-w-md rounded-3xl border border-border bg-surface p-6"
          >
            <View className="h-16 w-16 self-center items-center justify-center rounded-full bg-primary-soft">
              <Ionicons
                name={icono}
                size={32}
                className={peligro ? "text-danger" : "text-primary"}
              />
            </View>
            <Text
              accessibilityRole="header"
              className="mt-5 text-center font-nunito-bold text-2xl text-text"
            >
              {titulo}
            </Text>
            <Text className="mt-3 text-center font-nunito-medium text-sm leading-6 text-text-secondary">
              {mensaje}
            </Text>
            {!!error && (
              <Text
                accessibilityRole="alert"
                className="mt-3 text-center font-nunito-semibold text-sm text-danger"
              >
                {error}
              </Text>
            )}
            <View className="mt-6 flex-row gap-3">
              {onConfirm && (
                <View className="flex-1">
                  <Button
                    title="Cancelar"
                    variant="secondary"
                    onPress={cerrar}
                    disabled={cargando}
                    className={buttonClassName}
                    textClassName="text-sm"
                  />
                </View>
              )}
              <View className="flex-1">
                <Button
                  title={cargando ? "Procesando..." : onConfirm ? textoConfirmar : textoAceptar}
                  onPress={onConfirm ?? cerrar}
                  disabled={cargando}
                  className={cn(buttonClassName, peligro && onConfirm ? "bg-danger" : "")}
                  textClassName="text-sm"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemeScope>
    </Modal>
  );
}
