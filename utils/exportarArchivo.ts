import { Platform } from "react-native";

export async function exportarArchivo(
  nombre: string,
  contenido: Uint8Array,
  mimeType: string,
): Promise<void> {
  const archivoNombre =
    nombre
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
      .trim()
      .replace(/^\.+$/, "reporte") || "reporte";
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(new Blob([new Uint8Array(contenido).buffer], { type: mimeType }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = archivoNombre;
    document.body.appendChild(enlace);
    try {
      enlace.click();
    } finally {
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return;
  }
  const [{ File, Paths }, compartir] = await Promise.all([
    import("expo-file-system"),
    import("expo-sharing"),
  ]);
  if (!(await compartir.isAvailableAsync()))
    throw new Error("Este dispositivo no permite compartir archivos.");
  const archivo = new File(Paths.cache, archivoNombre);
  archivo.create({ overwrite: true });
  archivo.write(contenido);
  await compartir.shareAsync(archivo.uri, {
    mimeType,
    UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : "org.openxmlformats.spreadsheetml.sheet",
    dialogTitle: "Guardar o compartir reporte",
  });
}
