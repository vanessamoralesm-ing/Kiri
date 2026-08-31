import { Stack } from "expo-router";
import React from "react";

export default function ForoLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />

            <Stack.Screen
                name="crear"
                options={{
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
}