import React from "react";
import {ImageBackground,Platform,StyleSheet,View} from "react-native";
import {Stack} from "expo-router";

export default function JovenesAdultosLayout(){
  return(
    <View style={styles.pantalla}>
      <ImageBackground
        source={require("@/assets/images/fondo_kiri2.jpeg")}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
      <Stack
        screenOptions={{
          headerShown:false,
          animation:Platform.OS==="web"?"none":"slide_from_right",
          contentStyle:{
            backgroundColor:"transparent",
          },
        }}
      />
    </View>
  );
}

const styles=StyleSheet.create({
  pantalla:{
    flex:1,
  },
});