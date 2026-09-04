import { useThemeColor } from "@/hooks/use-theme-color";
import React, { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
    children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");

    return (
        <View style={{ flex: 1, flexDirection: "row", backgroundColor }}>
            <AdminSidebar />

            <View style={{ flex: 1, backgroundColor }}>
                <AdminHeader />

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: 24,
                        backgroundColor,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            backgroundColor,
                            minHeight: "100%",
                        }}
                    >
                        {children}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
