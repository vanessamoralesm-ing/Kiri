import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },

  scrollMovil: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 55,
  },

  scrollHistorialMovil: {
    paddingBottom: 120,
  },

  header: {
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 24,
  },

  headerIcono: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E9F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  titulo: {
    fontSize: 25,
    color: "#273448",
    fontFamily: "Nunito-Bold",
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 7,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#697589",
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  objetivoCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DCE8FA",
  },

  objetivoCardMovil: {
    padding: 16,
  },

  objetivoSuperior: {
    flexDirection: "row",
    alignItems: "center",
  },

  objetivoIcono: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#6594F4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  objetivoInfo: {
    marginLeft: 12,
    flex: 1,
    minWidth: 0,
  },

  objetivoEtiqueta: {
    fontSize: 10.5,
    letterSpacing: 0.7,
    color: "#7189C7",
    fontFamily: "Nunito-Bold",
  },

  objetivoTitulo: {
    marginTop: 2,
    fontSize: 17,
    color: "#334055",
    fontFamily: "Nunito-Bold",
  },

  objetivoTexto: {
    marginTop: 15,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#536076",
    fontFamily: "Nunito-Medium",
  },

  seccion: {
    marginTop: 27,
    marginBottom: 14,
  },

  seccionTitulo: {
    fontSize: 18,
    color: "#273448",
    fontFamily: "Nunito-Bold",
  },

  seccionTexto: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#7A8598",
    fontFamily: "Nunito-Medium",
  },

  lista: {
    gap: 12,
  },

  actividadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EDF1F7",
    shadowColor: "#334055",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 1,
  },

  actividadCardMovil: {
    padding: 14,
  },

  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDF5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    marginTop: 1,
    flexShrink: 0,
  },

  numeroTexto: {
    fontSize: 12,
    color: "#4F8EF7",
    fontFamily: "Nunito-Bold",
  },

  actividadContenido: {
    flex: 1,
    minWidth: 0,
  },

  actividadTituloFila: {
    flexDirection: "row",
    alignItems: "center",
  },

  actividadIcono: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#F0F6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    flexShrink: 0,
  },

  actividadTitulo: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#334055",
    fontFamily: "Nunito-Bold",
  },

  actividadDescripcion: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#697589",
    fontFamily: "Nunito-Medium",
  },

  sinActividades: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDF1F7",
  },

  sinActividadesIcono: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  sinActividadesTexto: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#697589",
    fontFamily: "Nunito-Medium",
  },

  recordatorio: {
    marginTop: 22,
    backgroundColor: "#F0F8F4",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  recordatorioMovil: {
    padding: 14,
  },

  recordatorioIcono: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#E4F3EB",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  recordatorioContenido: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  recordatorioTitulo: {
    fontSize: 14,
    color: "#496759",
    fontFamily: "Nunito-Bold",
  },

  recordatorioTexto: {
    marginTop: 3,
    fontSize: 12.8,
    lineHeight: 19,
    color: "#64786E",
    fontFamily: "Nunito-Medium",
  },

  aviso: {
    marginTop: 13,
    backgroundColor: "#F0F3F8",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avisoMovil: {
    padding: 13,
  },

  avisoTexto: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
    fontSize: 12.2,
    lineHeight: 18,
    color: "#71809A",
    fontFamily: "Nunito-Medium",
  },

  errorFinal: {
    marginTop: 13,
    backgroundColor: "#EEF2FB",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  errorFinalTexto: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#647086",
    fontFamily: "Nunito-SemiBold",
  },

  boton: {
    marginTop: 25,
    minHeight: 55,
    borderRadius: 17,
    backgroundColor: "#4F8EF7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 22,
  },

  botonMovil: {
    width: "100%",
    paddingHorizontal: 16,
  },

  botonDeshabilitado: {
    opacity: 0.65,
  },

  botonTexto: {
    flexShrink: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    textAlign: "center",
  },

  textoFinal: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    color: "#94A3B8",
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  cargando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  cargandoIcono: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#E9F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  errorIcono: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#EEF2FB",
    alignItems: "center",
    justifyContent: "center",
  },

  cargandoTitulo: {
    marginTop: 16,
    fontSize: 19,
    color: "#273448",
    fontFamily: "Nunito-Bold",
    textAlign: "center",
  },

  cargandoTexto: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: "#697589",
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },
});