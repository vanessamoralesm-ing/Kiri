import React, { type ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/utils/cn";
export default function AdminCard({
  children,
  actions,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("gap-3 rounded-2xl border border-border bg-surface p-4", className)}>
      {children}
      {actions && <View className="items-end border-t border-border pt-2">{actions}</View>}
    </View>
  );
}
