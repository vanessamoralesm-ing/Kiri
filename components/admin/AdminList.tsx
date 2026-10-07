import React, { type ReactNode } from "react";
import { View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import AdminTable, { type AdminTableProps } from "./AdminTable";

export default function AdminList<T>(
  props: AdminTableProps<T> & { renderCard: (item: T) => ReactNode },
) {
  const { esTelefono } = useResponsiveLayout();

  return esTelefono ? (
    <View className="gap-3">
      {props.items.map((item) => (
        <React.Fragment key={props.keyExtractor(item)}>{props.renderCard(item)}</React.Fragment>
      ))}
    </View>
  ) : (
    <AdminTable {...props} />
  );
}