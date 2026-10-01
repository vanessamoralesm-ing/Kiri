import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AdminBottomNav from "@/components/superadmin/layout/AdminBottomNav";
import AdminHeader from "@/components/superadmin/layout/AdminHeader";
import AdminSidebar from "@/components/superadmin/layout/AdminSidebar";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// LAYOUT SUPERADMIN
// ==========================================================

export default function SuperAdminLayout() {
    const { esEscritorio } = useResponsiveLayout();

    // ========================================================
    // TEMA
    // ========================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    // ========================================================
    // ESCRITORIO
    // ========================================================

    if (esEscritorio) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor,
                }}
            >
                <AdminSidebar />

                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                        backgroundColor,
                    }}
                >
                    <AdminHeader />

                    <View
                        style={{
                            flex: 1,
                            minWidth: 0,
                            minHeight: 0,
                            backgroundColor: surfaceColor,
                        }}
                    >
                        <Slot />
                    </View>
                </View>
            </View>
        );
    }

    // ========================================================
    // TABLET / MÓVIL
    // ========================================================

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <View
                style={{
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor,
                }}
            >
                <AdminHeader />

                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        backgroundColor: surfaceColor,
                    }}
                >
                    <Slot />
                </View>

                <AdminBottomNav />
            </View>
        </SafeAreaView>
    );
}
