import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AdminBottomNav from "@/components/superadmin/layout/AdminBottomNav";
import AdminHeader from "@/components/superadmin/layout/AdminHeader";
import AdminSidebar from "@/components/superadmin/layout/AdminSidebar";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function SuperAdminLayout() {
  const { esEscritorio } = useResponsiveLayout();

  if (esEscritorio)
    return (
      <View className="flex-1 flex-row bg-background">
        <AdminSidebar />
        <View className="min-w-0 flex-1 bg-background">
          <AdminHeader />
          <View className="min-h-0 min-w-0 flex-1 bg-surface">
            <Slot />
          </View>
        </View>
      </View>
    );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="relative flex-1 overflow-hidden bg-background">
        <AdminHeader />
        <View className="min-h-0 min-w-0 flex-1 bg-surface">
          <Slot />
        </View>
        <AdminBottomNav />
      </View>
    </SafeAreaView>
  );
}