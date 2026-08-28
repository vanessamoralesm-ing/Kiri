import { StyleSheet } from "react-native";
export const styles=StyleSheet.create({
  /* GENERAL */

  pantalla:{
    flex:1,
    backgroundColor:"#F7F8FC",
  },

  /*
    WEB:
    conserva tu diseño anterior.
  */
  scroll:{
    paddingHorizontal:20,
    paddingTop:14,
    paddingBottom:40,
  },

  /*
    MÓVIL:
    solo se aplica con width < 600.
  */
  scrollMovil:{
    paddingHorizontal:16,
    paddingTop:12,
    paddingBottom:55,
  },

  scrollHistorialMovil:{
    paddingBottom:120,
  },

  /* HEADER */

  header:{
    alignItems:"center",
    paddingHorizontal:14,
    marginBottom:24,
  },

  headerIcono:{
    width:48,
    height:48,
    borderRadius:24,
    backgroundColor:"#E9F2FF",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:12,
  },

  titulo:{
    fontSize:25,
    color:"#273448",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  subtitulo:{
    marginTop:7,
    fontSize:14.5,
    lineHeight:21,
    color:"#697589",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },

  /* RESUMEN */

  resumenCard:{
    backgroundColor:"#FFFFFF",
    borderRadius:22,
    padding:18,
    borderWidth:1,
    borderColor:"#EBF0F7",
    shadowColor:"#2D3A4E",
    shadowOffset:{
      width:0,
      height:4,
    },
    shadowOpacity:.045,
    shadowRadius:12,
    elevation:2,
  },

  resumenCardMovil:{
    padding:16,
  },

  resumenSuperior:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },

  resumenInfo:{
    flex:1,
    minWidth:0,
    marginRight:10,
  },

  resumenEtiqueta:{
    fontSize:10.5,
    letterSpacing:.7,
    color:"#7A8AA5",
    fontFamily:"Nunito-Bold",
  },

  resumenTitulo:{
    marginTop:4,
    fontSize:18,
    lineHeight:23,
    color:"#334055",
    fontFamily:"Nunito-Bold",
  },

  resumenIcono:{
    width:43,
    height:43,
    borderRadius:14,
    backgroundColor:"#EDF5FF",
    alignItems:"center",
    justifyContent:"center",
    flexShrink:0,
  },

  resumenSeparador:{
    height:1,
    backgroundColor:"#EEF2F7",
    marginVertical:16,
  },

  resumenInferior:{
    flexDirection:"row",
    alignItems:"center",
  },

  resumenDato:{
    flex:1,
    minWidth:0,
    alignItems:"center",
    paddingHorizontal:4,
  },

  resumenNumero:{
    fontSize:24,
    color:"#527FDE",
    fontFamily:"Nunito-Bold",
  },

  resumenDatoTexto:{
    marginTop:2,
    fontSize:11.5,
    lineHeight:16,
    color:"#7A8598",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },

  divisorVertical:{
    width:1,
    height:36,
    backgroundColor:"#EBEFF5",
  },

  /* SECCIÓN */

  seccionHeader:{
    marginTop:26,
    marginBottom:13,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },

  seccionInfo:{
    flex:1,
    minWidth:0,
    marginRight:10,
  },

  seccionTitulo:{
    fontSize:18,
    color:"#273448",
    fontFamily:"Nunito-Bold",
  },

  seccionTexto:{
    marginTop:2,
    fontSize:13,
    lineHeight:18,
    color:"#7A8598",
    fontFamily:"Nunito-Medium",
  },

  cantidad:{
    minWidth:30,
    height:30,
    borderRadius:15,
    backgroundColor:"#EAF2FF",
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:9,
    flexShrink:0,
  },

  cantidadTexto:{
    fontSize:13,
    color:"#6594F4",
    fontFamily:"Nunito-Bold",
  },

  /* LISTA */

  lista:{
    gap:12,
  },

  card:{
    backgroundColor:"#FFFFFF",
    borderRadius:20,
    padding:16,
    borderWidth:1,
    borderColor:"#EDF1F7",
    shadowColor:"#334055",
    shadowOffset:{
      width:0,
      height:3,
    },
    shadowOpacity:.035,
    shadowRadius:8,
    elevation:1,
  },

  cardMovil:{
    padding:14,
  },

  cardPrioridad:{
    borderColor:"#DCE8FF",
    backgroundColor:"#FCFDFF",
  },

  cardSuperior:{
    flexDirection:"row",
    alignItems:"center",
  },

  areaIcono:{
    width:45,
    height:45,
    borderRadius:15,
    backgroundColor:"#EEF5FF",
    alignItems:"center",
    justifyContent:"center",
    flexShrink:0,
  },

  areaInfo:{
    flex:1,
    minWidth:0,
    marginLeft:12,
    marginRight:8,
  },

  nombreFila:{
    flexDirection:"row",
    alignItems:"center",
    flexWrap:"wrap",
    gap:7,
  },

  areaNombre:{
    flexShrink:1,
    fontSize:15.5,
    lineHeight:20,
    color:"#334055",
    fontFamily:"Nunito-Bold",
  },

  prioridadMini:{
    backgroundColor:"#E8F1FF",
    borderRadius:8,
    paddingHorizontal:7,
    paddingVertical:3,
    flexShrink:0,
  },

  prioridadMiniTexto:{
    fontSize:9.5,
    color:"#5F87DB",
    fontFamily:"Nunito-Bold",
  },

  /* NIVEL */

  nivelFila:{
    marginTop:4,
    flexDirection:"row",
    alignItems:"center",
  },

  nivelPunto:{
    width:7,
    height:7,
    borderRadius:4,
    marginRight:6,
  },

  nivelBajo:{
    backgroundColor:"#78B99B",
  },

  nivelModerado:{
    backgroundColor:"#91A7D9",
  },

  nivelAlto:{
    backgroundColor:"#657FC8",
  },

  nivelTexto:{
    flexShrink:1,
    fontSize:12,
    color:"#7A8598",
    fontFamily:"Nunito-SemiBold",
  },

  /* PORCENTAJE */

  porcentaje:{
    flexDirection:"row",
    alignItems:"flex-start",
    minWidth:56,
    justifyContent:"flex-end",
    flexShrink:0,
  },

  porcentajeNumero:{
    fontSize:25,
    color:"#527FDE",
    fontFamily:"Nunito-Bold",
  },

  porcentajeSimbolo:{
    marginTop:3,
    fontSize:12.5,
    color:"#7189C7",
    fontFamily:"Nunito-Bold",
  },

  /* BARRA */

  barraContenedor:{
    height:7,
    backgroundColor:"#EDF2F9",
    borderRadius:8,
    overflow:"hidden",
    marginTop:15,
  },

  barra:{
    height:"100%",
    backgroundColor:"#7DA8F8",
    borderRadius:8,
  },

  cardDescripcion:{
    marginTop:10,
    fontSize:12.8,
    lineHeight:18,
    color:"#697589",
    fontFamily:"Nunito-Medium",
  },

  /* ENFOQUE */

  enfoqueCard:{
    marginTop:22,
    backgroundColor:"#EAF3FF",
    borderRadius:21,
    padding:17,
    flexDirection:"row",
    alignItems:"flex-start",
  },

  enfoqueCardMovil:{
    padding:15,
  },

  enfoqueIcono:{
    width:43,
    height:43,
    borderRadius:14,
    backgroundColor:"#6594F4",
    alignItems:"center",
    justifyContent:"center",
    marginRight:13,
    flexShrink:0,
  },

  enfoqueContenido:{
    flex:1,
    minWidth:0,
  },

  enfoqueEtiqueta:{
    fontSize:10.5,
    letterSpacing:.65,
    color:"#7189C7",
    fontFamily:"Nunito-Bold",
  },

  enfoqueTitulo:{
    marginTop:4,
    flexShrink:1,
    fontSize:16.5,
    lineHeight:21,
    color:"#334055",
    fontFamily:"Nunito-Bold",
  },

  enfoqueTexto:{
    marginTop:6,
    fontSize:13,
    lineHeight:19,
    color:"#647086",
    fontFamily:"Nunito-Medium",
  },

  /* AVISO */

  aviso:{
    marginTop:20,
    flexDirection:"row",
    alignItems:"flex-start",
    backgroundColor:"#F0F3F8",
    borderRadius:15,
    padding:14,
  },

  avisoMovil:{
    padding:13,
  },

  avisoTexto:{
    flex:1,
    minWidth:0,
    marginLeft:8,
    fontSize:12.3,
    lineHeight:18,
    color:"#71809A",
    fontFamily:"Nunito-Medium",
  },

  /* ESTABLE */

  estableCard:{
    backgroundColor:"#FFFFFF",
    borderRadius:22,
    padding:25,
    alignItems:"center",
    borderWidth:1,
    borderColor:"#EDF1F7",
  },

  estableCardMovil:{
    paddingHorizontal:18,
    paddingVertical:22,
  },

  estableIcono:{
    width:55,
    height:55,
    borderRadius:28,
    backgroundColor:"#EDF8F3",
    alignItems:"center",
    justifyContent:"center",
  },

  estableTitulo:{
    marginTop:14,
    fontSize:18,
    color:"#334055",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  estableTexto:{
    marginTop:8,
    maxWidth:310,
    fontSize:13.5,
    lineHeight:20,
    color:"#697589",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },

  /* BOTÓN */

  botonPrincipal:{
    marginTop:25,
    minHeight:55,
    borderRadius:17,
    backgroundColor:"#6594F4",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:9,
    paddingHorizontal:22,
  },

  botonPrincipalMovil:{
    width:"100%",
    paddingHorizontal:16,
  },

  botonTexto:{
    flexShrink:1,
    fontSize:16,
    color:"#FFFFFF",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  /* CARGANDO */

  cargando:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:35,
  },

  cargandoCirculo:{
    width:55,
    height:55,
    borderRadius:28,
    backgroundColor:"#E9F2FF",
    alignItems:"center",
    justifyContent:"center",
  },

  errorCirculo:{
    width:55,
    height:55,
    borderRadius:28,
    backgroundColor:"#EEF2FB",
    alignItems:"center",
    justifyContent:"center",
  },

  cargandoTitulo:{
    marginTop:16,
    fontSize:19,
    color:"#273448",
    fontFamily:"Nunito-Bold",
    textAlign:"center",
  },

  cargandoTexto:{
    marginTop:7,
    fontSize:14,
    lineHeight:20,
    color:"#697589",
    fontFamily:"Nunito-Medium",
    textAlign:"center",
  },
});