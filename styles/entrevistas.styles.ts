import{StyleSheet}from"react-native";

export const COLORES={
  azul:"#4F8EF7",
  verde:"#7BBF9A",
  morado:"#B8A8F8",
  fondo:"#F8FAFC",
  texto:"#2D3748",
};

const borde={
  borderWidth:1,
  borderColor:COLORES.morado,
};

const fila={
  flexDirection:"row" as const,
  alignItems:"center" as const,
};

export const styles=StyleSheet.create({
  pantalla:{
    flex:1,
    backgroundColor:COLORES.fondo,
  },

  scroll:{
    paddingHorizontal:20,
    paddingTop:12,
    paddingBottom:110,
  },

  scrollMovil:{
    paddingHorizontal:16,
    paddingBottom:120,
  },

  header:{
    flexDirection:"row",
    alignItems:"flex-start",
    marginBottom:22,
  },

  volver:{
    ...borde,
    width:42,
    height:42,
    borderRadius:21,
    alignItems:"center",
    justifyContent:"center",
    marginRight:12,
  },

  headerInfo:{
    flex:1,
    minWidth:0,
  },

  titulo:{
    fontFamily:"Nunito-Bold",
    fontSize:23,
    color:COLORES.texto,
  },

  subtitulo:{
    marginTop:4,
    fontFamily:"Nunito-Medium",
    fontSize:13,
    lineHeight:19,
    color:COLORES.texto,
  },

  nuevaCard:{
    ...fila,
    backgroundColor:COLORES.azul,
    borderRadius:22,
    padding:17,
    marginBottom:27,
  },

  nuevaCardMovil:{
    paddingHorizontal:15,
    paddingVertical:14,
    minHeight:80,
  },

  nuevaIcono:{
    width:45,
    height:45,
    borderRadius:23,
    backgroundColor:COLORES.fondo,
    alignItems:"center",
    justifyContent:"center",
  },

  nuevaInfo:{
    flex:1,
    minWidth:0,
    marginHorizontal:12,
  },

  nuevaTitulo:{
    fontFamily:"Nunito-Bold",
    fontSize:16,
    color:COLORES.fondo,
  },

  nuevaTexto:{
    marginTop:2,
    fontFamily:"Nunito-Medium",
    fontSize:12,
    lineHeight:17,
    color:COLORES.fondo,
  },

  deshabilitado:{
    opacity:.7,
  },

  centro:{
    paddingVertical:55,
    alignItems:"center",
  },

  centroTexto:{
    marginTop:10,
    fontFamily:"Nunito-Medium",
    fontSize:13,
    color:COLORES.texto,
  },

  vacio:{
    ...borde,
    borderRadius:22,
    padding:24,
    alignItems:"center",
  },

  vacioMovil:{
    paddingHorizontal:18,
    paddingVertical:22,
  },

  vacioIcono:{
    ...borde,
    width:56,
    height:56,
    borderRadius:28,
    alignItems:"center",
    justifyContent:"center",
  },

  vacioTitulo:{
    marginTop:13,
    fontFamily:"Nunito-Bold",
    fontSize:17,
    color:COLORES.texto,
    textAlign:"center",
  },

  vacioTexto:{
    marginTop:7,
    fontFamily:"Nunito-Medium",
    fontSize:13,
    lineHeight:19,
    color:COLORES.texto,
    textAlign:"center",
  },

  botonPrincipal:{
    ...fila,
    marginTop:18,
    backgroundColor:COLORES.azul,
    borderRadius:15,
    paddingHorizontal:18,
    paddingVertical:12,
    justifyContent:"center",
    gap:8,
  },

  botonPrincipalTexto:{
    color:COLORES.fondo,
    fontFamily:"Nunito-Bold",
    fontSize:13,
  },

  seccionTitulo:{
    marginBottom:12,
    fontFamily:"Nunito-Bold",
    fontSize:17,
    color:COLORES.texto,
  },

  ultimaCard:{
    ...borde,
    borderRadius:22,
    padding:17,
  },

  ultimaCardMovil:{
    padding:15,
  },

  fechaFila:fila,

  fechaIcono:{
    ...borde,
    width:40,
    height:40,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"center",
    marginRight:10,
  },

  fechaInfo:{
    flex:1,
    minWidth:0,
    marginRight:8,
  },

  fechaLabel:{
    fontFamily:"Nunito-Medium",
    fontSize:11,
    color:COLORES.texto,
  },

  fecha:{
    marginTop:1,
    fontFamily:"Nunito-Bold",
    fontSize:14,
    lineHeight:19,
    color:COLORES.texto,
  },

  completada:{
    backgroundColor:COLORES.verde,
    borderRadius:12,
    paddingHorizontal:9,
    paddingVertical:5,
  },

  completadaTexto:{
    fontFamily:"Nunito-Bold",
    fontSize:10,
    color:COLORES.fondo,
  },

  area:{
    marginTop:15,
    paddingTop:14,
    borderTopWidth:1,
    borderTopColor:COLORES.morado,
  },

  areaLabel:{
    fontFamily:"Nunito-Medium",
    fontSize:11,
    color:COLORES.texto,
  },

  areaFila:{
    flexDirection:"row",
    alignItems:"flex-start",
    marginTop:4,
    gap:10,
  },

  areaNombre:{
    flex:1,
    minWidth:0,
    fontFamily:"Nunito-Bold",
    fontSize:15,
    lineHeight:21,
    color:COLORES.texto,
  },

  porcentaje:{
    fontFamily:"Nunito-Bold",
    fontSize:20,
    color:COLORES.azul,
  },

  acciones:{
    flexDirection:"row",
    gap:10,
    marginTop:16,
  },

  accionesMovil:{
    flexWrap:"wrap",
  },

  accion:{
    ...fila,
    flex:1,
    minWidth:130,
    minHeight:42,
    borderWidth:1,
    borderColor:COLORES.azul,
    borderRadius:14,
    justifyContent:"center",
    gap:6,
    paddingHorizontal:8,
  },

  accionTexto:{
    fontFamily:"Nunito-Bold",
    fontSize:12,
    color:COLORES.azul,
  },

  historialTitulo:{
    marginTop:26,
  },

  lista:{
    gap:10,
  },

  historialCard:{
    ...borde,
    ...fila,
    borderRadius:18,
    padding:14,
  },

  historialCardMovil:{
    paddingHorizontal:12,
    paddingVertical:13,
  },

  historialIcono:{
    ...borde,
    width:39,
    height:39,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"center",
    marginRight:10,
  },

  historialInfo:{
    flex:1,
    minWidth:0,
    marginRight:8,
  },

  historialFecha:{
    fontFamily:"Nunito-Bold",
    fontSize:13,
    lineHeight:18,
    color:COLORES.texto,
  },

  historialArea:{
    marginTop:2,
    fontFamily:"Nunito-Medium",
    fontSize:11,
    lineHeight:16,
    color:COLORES.texto,
  },

  historialDerecha:{
    ...fila,
    gap:5,
  },

  historialPorcentaje:{
    fontFamily:"Nunito-Bold",
    fontSize:15,
    color:COLORES.azul,
  },
});