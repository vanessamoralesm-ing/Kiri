import { Slot } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";

import AdminHeader from "@/components/superadmin/layout/AdminHeader";
import AdminSidebar from "@/components/superadmin/layout/AdminSidebar";

import { useThemeColor } from "@/hooks/use-theme-color";


// ==========================================================
// LAYOUT SUPERADMIN
// ==========================================================

export default function SuperAdminLayout() {

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");
    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");


    // ======================================================
    // SOLO WEB
    // ======================================================

    if (Platform.OS !== "web") {
        return (
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor,
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 20,
                        color: textColor,
                        textAlign: "center",
                    }}
                >
                    Panel de superadministrador
                </Text>

                <Text
                    style={{
                        marginTop: 8,
                        maxWidth: 420,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                        lineHeight: 21,
                        color: textSecondaryColor,
                        textAlign: "center",
                    }}
                >
                    Este módulo está disponible únicamente desde la versión web de Kiri.
                </Text>
            </View>
        );
    }


    // ======================================================
    // UI WEB
    // ======================================================

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