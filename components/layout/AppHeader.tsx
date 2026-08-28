import React,{useState} from "react";
import {Pressable,Text,View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import Logo from "@/components/ui/Logo_izq";
import {useAuth} from "@/services/authProvider";
import {confirmarCerrarSesion} from "@/utils/cerrarSesion";
import LogoutModal from "@/components/ui/LogoutModal";

export default function AppHeader(){
  const router=useRouter();
  const {signOut}=useAuth();
  const [menuAbierto,setMenuAbierto]=useState(false);
  const [mostrarLogout,setMostrarLogout]=useState(false);

  function irPerfil(){
    setMenuAbierto(false);
    router.push("/(tabs)/perfil");
  }



function salir(){
  setMenuAbierto(false);
  setMostrarLogout(true);
}

  return(
    <View className="relative z-50 w-full flex-row items-center justify-between border-b border-gray-200 bg-[#F8FAFC] px-5 py-2">
      <Logo/>
      <View className="relative">
        <Pressable onPress={()=>setMenuAbierto(!menuAbierto)} className="h-12 w-12 items-center justify-center rounded-full border border-[#B8A8F8] bg-[#F8FAFC]">
          <Ionicons name="person-outline" size={23} color="#2D3748"/>
        </Pressable>
        {menuAbierto&&(
          <View className="absolute right-0 top-14 z-50 w-48 rounded-2xl border border-[#B8A8F8] bg-[#F8FAFC] py-1 shadow-lg">
            <Pressable onPress={irPerfil} className="flex-row items-center gap-3 px-4 py-3">
              <Ionicons name="person-outline" size={20} color="#4F8EF7"/>
              <Text className="font-[Nunito-Bold] text-sm text-[#2D3748]">Mi perfil</Text>
            </Pressable>
            <View className="mx-3 h-px bg-[#B8A8F8] opacity-30"/>
            <Pressable onPress={salir} className="flex-row items-center gap-3 px-4 py-3">
              <Ionicons name="log-out-outline" size={20} color="#2D3748"/>
              <Text className="font-[Nunito-Bold] text-sm text-[#2D3748]">Cerrar sesión</Text>
            </Pressable>
          </View>
        )}
      </View>
      <LogoutModal visible={mostrarLogout} onClose={()=>setMostrarLogout(false)}/>
    </View>
  );
}