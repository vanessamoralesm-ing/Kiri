import {Alert,Platform} from "react-native";
import type {Router} from "expo-router";

export function confirmarCerrarSesion(signOut:()=>Promise<void>,router:Router){
  const salir=async()=>{
    try{
      await signOut();
      router.replace("/(auth)/login");
    }catch(error){
      console.error("Error cerrando sesión:",error);
      Alert.alert("Error","No se pudo cerrar la sesión.");
    }
  };
  if(Platform.OS==="web"){
    if(window.confirm("¿Deseas cerrar tu sesión en Kiri?")) salir();
    return;
  }
  Alert.alert("Cerrar sesión","¿Deseas cerrar tu sesión en Kiri?",[
    {text:"Cancelar",style:"cancel"},
    {text:"Cerrar sesión",style:"destructive",onPress:salir}
  ]);
}