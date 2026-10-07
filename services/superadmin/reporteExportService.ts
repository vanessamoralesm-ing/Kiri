import { Colors } from "@/constants/theme";
import type { FormatoReporte, ReporteGlobal, UsoReporte } from "@/types/superadmin/reportes";
import { exportarArchivo } from "@/utils/exportarArchivo";
import type { PDFFont } from "pdf-lib";

type Celda = string | number;
interface Seccion {
  titulo: string;
  columnas: string[];
  anchos: number[];
  filas: Celda[][];
  error?: string | null;
  ranking?: UsoReporte[];
}
const colores = Colors.light;
const fecha = (valor: string) => new Date(valor).toLocaleString("es-GT", { timeZone: "America/Guatemala" });
const contexto = (reporte: ReporteGlobal, institucion: string) => [
  `Institución: ${institucion}`,
  `Período: ${reporte.desde ? `${fecha(reporte.desde)} hasta ${fecha(reporte.hasta)} (fin exclusivo)` : "Todos los registros, sin filtro de fecha"}`,
  `Generado: ${fecha(reporte.generadoEn)} · Zona horaria: Guatemala`,
  "Actividad: tests y técnicas completados y entradas de diario guardadas en el período, agrupados por la institución actual del usuario. Estados actuales. Con filtro de institución, las solicitudes incluyen solo las vinculadas.",
];

function secciones(reporte: ReporteGlobal): Seccion[] {
  const resumen = ["Instituciones registradas", "Usuarios registrados"].map((nombre, i) => {
    const datos = i === 0 ? reporte.instituciones : reporte.usuarios;
    return [nombre, datos.total, datos.activos, datos.inactivos];
  });
  const uso = (["tests", "tecnicas", "diarios"] as const).map((clave, i) => ({
    titulo: ["Tests más usados", "Técnicas más usadas", "Diarios más usados"][i],
    columnas: ["Nombre", "Usos"],
    anchos: [5, 1],
    filas: reporte.uso[clave].items.map(({ nombre, total }) => [nombre, total]),
    error: reporte.uso[clave].error,
    ranking: reporte.uso[clave].items,
  }));
  return [
    {
      titulo: "Resumen",
      columnas: ["Indicador", "Total", "Activos", "Inactivos"],
      anchos: [4, 1, 1, 1],
      filas: resumen,
    },
    {
      titulo: "Instituciones",
      columnas: ["Institución", "Código", "Estado actual", "Usuarios", "Activos", "Inactivos"],
      anchos: [4, 1.6, 1.2, 1, 1, 1],
      filas: reporte.porInstitucion.map((item) => [
        item.nombre,
        item.codigo,
        item.estado ?? "Sin institución",
        item.total,
        item.activos,
        item.inactivos,
      ]),
    },
    {
      titulo: "Roles",
      columnas: ["Rol", "Total", "Activos", "Inactivos"],
      anchos: [4, 1, 1, 1],
      filas: reporte.porRol.map((item) => [item.nombre, item.total, item.activos, item.inactivos]),
    },
    {
      titulo: "Solicitudes",
      columnas: ["Estado", "Cantidad"],
      anchos: [5, 1],
      filas: [
        ["Total", reporte.solicitudes.total],
        ["Pendientes", reporte.solicitudes.pendientes],
        ["Aprobadas", reporte.solicitudes.aprobadas],
        ["Rechazadas", reporte.solicitudes.rechazadas],
      ],
    },
    ...uso,
  ];
}

export async function crearExcel(reporte: ReporteGlobal, institucion: string): Promise<Uint8Array> {
  const { default: ExcelJS } = await import("exceljs");
  const libro = new ExcelJS.Workbook();
  libro.creator = "Kiri";
  libro.created = new Date(reporte.generadoEn);
  const encabezado = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: `FF${colores.primary.slice(1)}` },
  };
  for (const seccion of secciones(reporte)) {
    const hoja = libro.addWorksheet(seccion.titulo, {
      pageSetup: {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });
    hoja.columns = seccion.anchos.map((ancho) => ({
      width: Math.max(15, ancho * 12),
    }));
    const agregarNota = (linea: string) => {
      const fila = hoja.addRow([linea]);
      hoja.mergeCells(fila.number, 1, fila.number, seccion.columnas.length);
      fila.height = Math.min(
        409,
        Math.max(30, Math.ceil(linea.length / (seccion.anchos.reduce((a, b) => a + b, 0) * 12)) * 15),
      );
    };
    agregarNota("Kiri · Reportes globales");
    contexto(reporte, institucion).forEach(agregarNota);
    if (seccion.error) agregarNota(`No disponible: ${seccion.error}`);
    const filaEncabezado = hoja.addRow(seccion.columnas);
    filaEncabezado.eachCell((celda) => {
      celda.fill = encabezado;
      celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    });
    hoja.views = [{ state: "frozen", ySplit: filaEncabezado.number }];
    hoja.autoFilter = {
      from: { row: filaEncabezado.number, column: 1 },
      to: { row: filaEncabezado.number, column: seccion.columnas.length },
    };
    const filas = seccion.filas.length
      ? seccion.filas
      : [[seccion.error ? "Datos no disponibles" : "Sin registros en este período"]];
    filas.forEach((valores) => {
      const fila = hoja.addRow(valores);
      fila.height = Math.min(
        409,
        Math.max(
          22,
          ...valores.map(
            (valor, i) => Math.ceil(String(valor).length / (hoja.getColumn(i + 1).width ?? 15)) * 15,
          ),
        ),
      );
      fila.eachCell((celda) => {
        celda.numFmt = typeof celda.value === "number" ? "#,##0" : "@";
      });
    });
    hoja.eachRow((fila) =>
      fila.eachCell((celda) => {
        celda.alignment = {
          ...celda.alignment,
          vertical: "middle",
          wrapText: true,
        };
      }),
    );
    hoja.getRow(1).font = {
      bold: true,
      size: 16,
      color: { argb: `FF${colores.text.slice(1)}` },
    };
    hoja.pageSetup.printTitlesRow = `${filaEncabezado.number}:${filaEncabezado.number}`;
  }
  return new Uint8Array(await libro.xlsx.writeBuffer());
}

function textoPdf(valor: Celda, fuente: PDFFont): string {
  return Array.from(String(valor).normalize("NFC").replace(/\r\n?/g, "\n"), (letra) => {
    if (letra === "\n") return letra;
    try {
      fuente.encodeText(letra);
      return letra;
    } catch {
      return "?";
    }
  }).join("");
}

function envolver(valor: Celda, ancho: number, fuente: PDFFont, tamano: number): string[] {
  const lineas: string[] = [];
  for (const parrafo of textoPdf(valor, fuente).split("\n")) {
    let linea = "";
    for (const palabra of parrafo.split(/\s+/)) {
      if (fuente.widthOfTextAtSize(`${linea} ${palabra}`.trim(), tamano) <= ancho) {
        linea = `${linea} ${palabra}`.trim();
        continue;
      }
      if (linea) lineas.push(linea);
      linea = "";
      for (const letra of palabra) {
        if (fuente.widthOfTextAtSize(linea + letra, tamano) > ancho && linea) {
          lineas.push(linea);
          linea = "";
        }
        linea += letra;
      }
    }
    lineas.push(linea);
  }
  return lineas;
}

export async function crearPdf(reporte: ReporteGlobal, institucion: string): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib/dist/pdf-lib.min.js");
  const documento = await PDFDocument.create();
  const fuente = await documento.embedFont(StandardFonts.Helvetica);
  const negrita = await documento.embedFont(StandardFonts.HelveticaBold);
  const color = (hex: string) =>
    rgb(
      ...([1, 3, 5].map((posicion) => parseInt(hex.slice(posicion, posicion + 2), 16) / 255) as [
        number,
        number,
        number,
      ]),
    );
  const margen = 40,
    ancho = 515,
    limite = 48,
    alturaLinea = 12;
  let pagina = documento.addPage([595, 842]),
    y = 800;
  const dibujarTexto = (texto: string, x: number, posicion: number, tamano = 9, bold = false) =>
    pagina.drawText(textoPdf(texto, fuente), {
      x,
      y: posicion,
      size: tamano,
      font: bold ? negrita : fuente,
      color: color(colores.text),
    });
  const nuevaPagina = () => {
    pagina = documento.addPage([595, 842]);
    y = 800;
    dibujarTexto("Kiri · Reportes globales", margen, y, 10, true);
    y -= 24;
  };
  const parrafo = (texto: string, tamano = 9, bold = false) => {
    for (const linea of envolver(texto, ancho, bold ? negrita : fuente, tamano)) {
      if (y < limite + tamano + 4) nuevaPagina();
      dibujarTexto(linea, margen, y, tamano, bold);
      y -= tamano + 5;
    }
  };
  documento.setTitle("Kiri · Reportes globales");
  documento.setAuthor("Kiri");
  documento.setCreationDate(new Date(reporte.generadoEn));
  parrafo("Reportes globales", 20, true);
  contexto(reporte, institucion).forEach((linea) => parrafo(linea));
  y -= 12;
  for (const seccion of secciones(reporte)) {
    if (y < limite + 90) nuevaPagina();
    parrafo(seccion.titulo, 14, true);
    if (seccion.error) parrafo(`No disponible: ${seccion.error}`);
    const totalAncho = seccion.anchos.reduce((a, b) => a + b, 0);
    const anchos = seccion.anchos.map((valor) => (ancho * valor) / totalAncho);
    const cabecera = () => {
      const lineas = seccion.columnas.map((valor, i) => envolver(valor, anchos[i] - 12, negrita, 9));
      const alto = Math.max(...lineas.map((valor) => valor.length)) * alturaLinea + 12;
      if (y - alto < limite) nuevaPagina();
      pagina.drawRectangle({
        x: margen,
        y: y - alto,
        width: ancho,
        height: alto,
        color: color(colores.primarySoft),
      });
      let x = margen;
      lineas.forEach((columna, i) => {
        columna.forEach((linea, j) => dibujarTexto(linea, x + 6, y - 14 - j * alturaLinea, 9, true));
        x += anchos[i];
      });
      y -= alto;
    };
    cabecera();
    const filas = seccion.filas.length
      ? seccion.filas
      : [[seccion.error ? "Datos no disponibles" : "Sin registros en este período"]];
    filas.forEach((fila, indice) => {
      const lineas = fila.map((valor, i) => envolver(valor, anchos[i] - 12, fuente, 9));
      const cantidad = Math.max(...lineas.map((valor) => valor.length));
      let inicio = 0;
      while (inicio < cantidad) {
        if (y < limite + alturaLinea + 12) {
          nuevaPagina();
          parrafo(`${seccion.titulo} (continuación)`, 12, true);
          cabecera();
        }
        const visibles = Math.min(cantidad - inicio, Math.floor((y - limite - 12) / alturaLinea));
        const alto = visibles * alturaLinea + 12;
        if (indice % 2 === 0)
          pagina.drawRectangle({
            x: margen,
            y: y - alto,
            width: ancho,
            height: alto,
            color: color(colores.surfaceSecondary),
          });
        let x = margen;
        lineas.forEach((columna, i) => {
          columna
            .slice(inicio, inicio + visibles)
            .forEach((linea, j) => dibujarTexto(linea, x + 6, y - 14 - j * alturaLinea));
          x += anchos[i];
        });
        y -= alto;
        inicio += visibles;
      }
    });
    y -= 18;
    if (seccion.ranking?.length) {
      parrafo("Gráfico de los 5 más usados", 11, true);
      const top = [...seccion.ranking].sort((a, b) => b.total - a.total).slice(0, 5);
      const maximo = Math.max(1, ...top.map((item) => item.total));
      for (const item of top) {
        const nombreLineas = envolver(item.nombre, 220, fuente, 9);
        const lineas = nombreLineas.slice(0, 2);
        if (nombreLineas.length > 2) lineas[1] = `${lineas[1].slice(0, -3)}...`;
        const alto = Math.max(28, lineas.length * alturaLinea + 8);
        if (y - alto < limite) nuevaPagina();
        lineas.forEach((linea, i) => dibujarTexto(linea, margen, y - 12 - i * alturaLinea));
        pagina.drawRectangle({
          x: margen + 232,
          y: y - 18,
          width: (235 * item.total) / maximo,
          height: 12,
          color: color(colores.primary),
        });
        dibujarTexto(String(item.total), margen + 475, y - 16);
        y -= alto;
      }
      y -= 16;
    }
  }
  const paginas = documento.getPages();
  paginas.forEach((hoja, indice) =>
    hoja.drawText(`Página ${indice + 1} de ${paginas.length}`, {
      x: margen,
      y: 25,
      size: 8,
      font: fuente,
      color: color(colores.textSecondary),
    }),
  );
  return documento.save();
}

export async function exportarReporte(
  reporte: ReporteGlobal,
  institucion: string,
  formato: FormatoReporte,
): Promise<void> {
  const extension = formato === "excel" ? "xlsx" : "pdf";
  const mime =
    formato === "excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";
  const contenido = await (formato === "excel" ? crearExcel : crearPdf)(reporte, institucion);
  await exportarArchivo(`kiri-reportes-${reporte.generadoEn.slice(0, 10)}.${extension}`, contenido, mime);
}
