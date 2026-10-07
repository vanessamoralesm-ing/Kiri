import React, { useState } from "react";
import { Image, Text, View } from "react-native";
interface Props {
  nombre: string;
  detalle: string;
  iniciales?: string;
  imagen?: string | null;
}
export default function AdminIdentity({
  nombre,
  detalle,
  iniciales = nombre.charAt(0).toUpperCase(),
  imagen,
}: Props) {
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary-soft">
        {imagen && imagen !== imagenFallida ? (
          <Image
            source={{ uri: imagen }}
            onError={() => setImagenFallida(imagen)}
            accessibilityLabel={`Imagen de ${nombre}`}
            className="h-11 w-11"
            resizeMode="contain"
          />
        ) : (
          <Text className="font-nunito-bold text-sm text-primary">
            {iniciales}
          </Text>
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-nunito-bold text-sm text-text">{nombre}</Text>
        <Text selectable className="font-nunito-medium text-xs text-text-muted">
          {detalle}
        </Text>
      </View>
    </View>
  );
}
