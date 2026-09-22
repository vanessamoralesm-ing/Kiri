import React, {
  useState,
} from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import Logo from "@/components/ui/Logo_izq";

import LogoutModal from "@/components/ui/LogoutModal";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


export default function AppHeader() {

  const router =
    useRouter();

  const [
    menuAbierto,
    setMenuAbierto,
  ] =
    useState(false);

  const [
    mostrarLogout,
    setMostrarLogout,
  ] =
    useState(false);


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
    );

  const textColor =
    useThemeColor(
      {},
      "text"
    );

  const iconColor =
    useThemeColor(
      {},
      "icon"
    );

  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );

  const accentColor =
    useThemeColor(
      {},
      "accent"
    );

  const dividerColor =
    useThemeColor(
      {},
      "divider"
    );


  // ========================================================
  // ACCIONES
  // ========================================================

  function irPerfil() {

    setMenuAbierto(false);

    router.push(
      "/(tabs)/perfil"
    );
  }


  function salir() {

    setMenuAbierto(false);

    setMostrarLogout(true);
  }


  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      className="
        relative
        z-50
        w-full
        flex-row
        items-center
        justify-between
        px-5
        py-2
      "
      style={{
        backgroundColor:
          surfaceColor,

        borderBottomWidth:
          1,

        borderBottomColor:
          borderColor,
      }}
    >

      {/* Logo */}

      <Logo />


      {/* Usuario */}

      <View className="relative">

        <Pressable
          onPress={() =>
            setMenuAbierto(
              !menuAbierto
            )
          }

          className="
            h-12
            w-12
            items-center
            justify-center
            rounded-full
          "

          style={{
            backgroundColor:
              backgroundColor,

            borderWidth:
              1,

            borderColor:
              accentColor,
          }}
        >

          <Ionicons
            name="person-outline"
            size={23}
            color={
              iconColor
            }
          />

        </Pressable>


        {/* Menú desplegable */}

        {menuAbierto && (

          <View
            className="
              absolute
              right-0
              top-14
              z-50
              w-48
              rounded-2xl
              py-1
            "

            style={{
              backgroundColor:
                surfaceColor,

              borderWidth:
                1,

              borderColor:
                accentColor,

              shadowColor:
                "#000000",

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity:
                0.15,

              shadowRadius:
                8,

              elevation:
                8,
            }}
          >

            {/* Mi perfil */}

            <Pressable
              onPress={
                irPerfil
              }

              className="
                flex-row
                items-center
                gap-3
                px-4
                py-3
              "
            >

              <Ionicons
                name="person-outline"
                size={20}
                color={
                  primaryColor
                }
              />

              <Text
                style={{
                  fontFamily:
                    "Nunito-Bold",

                  fontSize:
                    14,

                  color:
                    textColor,
                }}
              >
                Mi perfil
              </Text>

            </Pressable>


            {/* Separador */}

            <View
              className="
                mx-3
                h-px
              "
              style={{
                backgroundColor:
                  dividerColor,
              }}
            />


            {/* Cerrar sesión */}

            <Pressable
              onPress={
                salir
              }

              className="
                flex-row
                items-center
                gap-3
                px-4
                py-3
              "
            >

              <Ionicons
                name="log-out-outline"
                size={20}
                color={
                  iconColor
                }
              />

              <Text
                style={{
                  fontFamily:
                    "Nunito-Bold",

                  fontSize:
                    14,

                  color:
                    textColor,
                }}
              >
                Cerrar sesión
              </Text>

            </Pressable>

          </View>
        )}

      </View>


      <LogoutModal
        visible={
          mostrarLogout
        }

        onClose={() =>
          setMostrarLogout(
            false
          )
        }
      />

    </View>
  );
}