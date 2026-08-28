import React from "react";
import {Platform} from "react-native";
import {Stack} from "expo-router";

export default function EntrevistaLayout(){
  return(
    <Stack
      screenOptions={{
        headerShown:false,
        animation:Platform.OS==="web"?"none":"slide_from_right",
        contentStyle:{
          backgroundColor:"transparent",
        },
      }}
    />
  );
}