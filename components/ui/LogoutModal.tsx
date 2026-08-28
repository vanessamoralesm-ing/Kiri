import React,{useState}from"react";
import{
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
}from"react-native";
import{Ionicons}from"@expo/vector-icons";
import{useRouter}from"expo-router";
import{useAuth}from"@/services/authProvider";

type Props={
  visible:boolean;
  onClose:()=>void;
};

export default function LogoutModal({
  visible,
  onClose
}:Props){
  const router=useRouter();
  const{signOut}=useAuth();

  const[cerrando,setCerrando]=
    useState(false);

  async function confirmar(){
    if(cerrando){
      return;
    }

    try{
      setCerrando(true);

      await signOut();

      onClose();

      router.replace(
        "/(auth)/welcome"
      );
    }catch(error){
      console.error(
        "Error cerrando sesión:",
        error
      );
    }finally{
      setCerrando(false);
    }
  }

  function cancelar(){
    if(cerrando){
      return;
    }

    onClose();
  }

  return(
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={cancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.contenedor}>

          {/* ICONO */}

          <View style={styles.icono}>
            <Ionicons
              name="log-out-outline"
              size={35}
              color="#4F8EF7"
            />
          </View>

          {/* TITULO */}

          <Text style={styles.titulo}>
            ¿Cerrar sesión?
          </Text>

          {/* DESCRIPCIÓN */}

          <Text style={styles.descripcion}>
            Podrás volver a ingresar a Kiri cuando quieras.
          </Text>

          {/* BOTONES */}

          <View style={styles.acciones}>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={cancelar}
              disabled={cerrando}
              style={styles.botonCancelar}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={confirmar}
              disabled={cerrando}
              style={[
                styles.botonCerrar,
                cerrando&&
                  styles.deshabilitado
              ]}
            >
              {cerrando?(
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ):(
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.textoCerrar}>
                {cerrando
                  ?"Cerrando..."
                  :"Cerrar sesión"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles=StyleSheet.create({
  overlay:{
    flex:1,
    backgroundColor:
      "rgba(45,55,72,0.42)",
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:24,
  },

  contenedor:{
    width:"100%",
    maxWidth:430,
    backgroundColor:"#F8FAFC",
    borderRadius:26,
    borderWidth:1,
    borderColor:"#B8A8F8",
    paddingHorizontal:24,
    paddingTop:32,
    paddingBottom:24,

    shadowColor:"#000000",
    shadowOffset:{
      width:0,
      height:8,
    },
    shadowOpacity:.18,
    shadowRadius:20,

    elevation:12,
  },

  icono:{
    width:74,
    height:74,
    borderRadius:37,
    backgroundColor:"#EAF2FF",
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"center",
  },

  titulo:{
    marginTop:22,
    fontSize:25,
    lineHeight:31,
    fontFamily:"Nunito-Bold",
    fontWeight:"700",
    color:"#2D3748",
    textAlign:"center",
  },

  descripcion:{
    marginTop:10,
    fontSize:15,
    lineHeight:22,
    fontFamily:"Nunito-Medium",
    color:"#718096",
    textAlign:"center",
    paddingHorizontal:4,
  },

  acciones:{
  width:"100%",
  marginTop:28,
  flexDirection:"row",
  gap:10,
},

botonCancelar:{
  flex:1,
  minHeight:51,
  borderRadius:15,
  borderWidth:1,
  borderColor:"#D8E0EC",
  backgroundColor:"#FFFFFF",
  alignItems:"center",
  justifyContent:"center",
  paddingHorizontal:12,
},

textoCancelar:{
  fontSize:14,
  fontFamily:"Nunito-Bold",
  fontWeight:"700",
  color:"#2D3748",
},

botonCerrar:{
  flex:1,
  minHeight:51,
  borderRadius:15,
  backgroundColor:"#4F8EF7",
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"center",
  gap:6,
  paddingHorizontal:10,
  elevation:2,
},

textoCerrar:{
  fontSize:14,
  fontFamily:"Nunito-Bold",
  fontWeight:"700",
  color:"#FFFFFF",
  textAlign:"center",
},

deshabilitado:{
  opacity:.65,
},
});