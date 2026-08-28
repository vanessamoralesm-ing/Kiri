import{StyleSheet}from"react-native";

export const COLORES={
  azul:"#4F8EF7",
  verde:"#7BBF9A",
  morado:"#B8A8F8",
  fondo:"#F8FAFC",
  texto:"#2D3748",
};

const bordeMorado={
  borderWidth:1,
  borderColor:COLORES.morado,
};

const fila={
  flexDirection:"row" as const,
  alignItems:"center" as const,
};

const centro={
  alignItems:"center" as const,
  justifyContent:"center" as const,
};

export const styles=StyleSheet.create({
  pantalla:{
    flex:1,
    backgroundColor:COLORES.fondo,
  },

  centro:{
    flex:1,
    ...centro,
    gap:14,
  },

  textoCargando:{
    fontSize:14,
    color:COLORES.texto,
  },

  scroll:{
    paddingHorizontal:20,
    paddingTop:8,
    paddingBottom:45,
  },

  header:{
    alignItems:"center",
    marginBottom:22,
  },

  titulo:{
    fontSize:27,
    fontFamily:"Nunito-Bold",
    color:COLORES.texto,
  },

  subtitulo:{
    fontSize:14,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
    marginTop:4,
    textAlign:"center",
  },

  fotoZona:{
    alignItems:"center",
    marginBottom:28,
  },

  avatar:{
    width:104,
    height:104,
    borderRadius:52,
    borderWidth:3,
    borderColor:COLORES.verde,
    backgroundColor:COLORES.fondo,
    ...centro,
    overflow:"hidden",
  },

  foto:{
    width:"100%",
    height:"100%",
  },

  camara:{
    width:36,
    height:36,
    borderRadius:18,
    backgroundColor:COLORES.azul,
    ...centro,
    marginTop:-29,
    marginLeft:72,
    borderWidth:2,
    borderColor:COLORES.fondo,
  },

  cambiarFoto:{
    marginTop:12,
    fontSize:12,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  seccionTitulo:{
    fontSize:12,
    fontFamily:"Nunito-Bold",
    color:COLORES.azul,
    letterSpacing:.7,
    marginTop:12,
    marginBottom:12,
  },

  label:{
    fontSize:13,
    fontFamily:"Nunito-SemiBold",
    color:COLORES.texto,
    marginBottom:6,
  },

  input:{
    ...bordeMorado,
    ...fila,
    minHeight:52,
    borderRadius:14,
    paddingHorizontal:14,
    marginBottom:16,
    backgroundColor:COLORES.fondo,
    gap:10,
  },

  textInput:{
    flex:1,
    minWidth:0,
    fontSize:14,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  inputTexto:{
    flex:1,
    minWidth:0,
    fontSize:14,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  bloqueado:{
    opacity:.7,
  },

  listaGenero:{
    ...bordeMorado,
    borderRadius:14,
    marginTop:-10,
    marginBottom:16,
    overflow:"hidden",
    backgroundColor:COLORES.fondo,
  },

  opcionGenero:{
    ...fila,
    minHeight:48,
    paddingHorizontal:14,
    justifyContent:"space-between",
  },

  textoGenero:{
    fontSize:14,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  tarjetaCuenta:{
    ...bordeMorado,
    borderRadius:16,
    padding:15,
    marginBottom:15,
    backgroundColor:COLORES.fondo,
  },

  filaCuenta:{
    ...fila,
    gap:12,
  },

  iconoCuenta:{
    ...bordeMorado,
    width:42,
    height:42,
    borderRadius:21,
    backgroundColor:COLORES.fondo,
    ...centro,
    flexShrink:0,
  },

  labelCuenta:{
    fontSize:12,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  valorCuenta:{
    marginTop:2,
    fontSize:15,
    fontFamily:"Nunito-Bold",
    color:COLORES.texto,
  },

  separador:{
    height:1,
    backgroundColor:COLORES.morado,
    marginVertical:14,
  },

  flex:{
    flex:1,
    minWidth:0,
  },

  opcionSeguridad:{
    ...bordeMorado,
    ...fila,
    minHeight:66,
    borderRadius:16,
    paddingHorizontal:14,
    gap:12,
    backgroundColor:COLORES.fondo,
    marginBottom:12,
  },

  passwordCard:{
    ...bordeMorado,
    borderRadius:16,
    padding:14,
    marginBottom:14,
    backgroundColor:COLORES.fondo,
  },

  botonPassword:{
    ...fila,
    width:"100%",
    minHeight:48,
    borderRadius:14,
    backgroundColor:COLORES.azul,
    justifyContent:"center",
    gap:8,
    paddingHorizontal:16,
  },

  privacidad:{
    ...bordeMorado,
    flexDirection:"row",
    gap:12,
    borderRadius:16,
    padding:16,
    marginBottom:18,
    backgroundColor:COLORES.fondo,
  },

  privacidadIcono:{
    width:42,
    height:42,
    borderRadius:21,
    borderWidth:1,
    borderColor:COLORES.verde,
    ...centro,
    flexShrink:0,
  },

  privacidadTitulo:{
    fontSize:15,
    fontFamily:"Nunito-Bold",
    color:COLORES.texto,
  },

  privacidadTexto:{
    marginTop:4,
    fontSize:12,
    lineHeight:18,
    fontFamily:"Nunito-Medium",
    color:COLORES.texto,
  },

  botonGuardar:{
    ...fila,
    width:"100%",
    minHeight:52,
    borderRadius:14,
    backgroundColor:COLORES.azul,
    justifyContent:"center",
    gap:9,
    paddingHorizontal:16,
    marginTop:4,
  },

  textoBotonPrincipal:{
    fontSize:15,
    fontFamily:"Nunito-Bold",
    color:COLORES.fondo,
  },

  botonSalir:{
    ...bordeMorado,
    ...fila,
    width:"100%",
    minHeight:52,
    borderRadius:14,
    backgroundColor:COLORES.fondo,
    justifyContent:"center",
    gap:9,
    paddingHorizontal:16,
    marginTop:12,
  },

  textoSalir:{
    fontSize:15,
    fontFamily:"Nunito-Bold",
    color:COLORES.texto,
  },

  deshabilitado:{
    opacity:.65,
  },
});