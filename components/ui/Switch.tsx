import React from "react";
import { Platform, Switch as NativeSwitch, type SwitchProps } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function Switch(props: SwitchProps) {
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "inputBorder");
  const thumb = useThemeColor({}, "textOnPrimary");
  return (
    <NativeSwitch
      trackColor={{ false: border, true: primary }}
      thumbColor={thumb}
      {...(Platform.OS === "web" ? { activeThumbColor: props.thumbColor ?? thumb } : {})}
      {...props}
    />
  );
}
