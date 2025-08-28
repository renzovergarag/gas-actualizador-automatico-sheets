function myFunction() {
    let carpeta = DriveApp.getFolderById("1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2");
    let archivos = carpeta.getFiles();
    console.log(archivos);
}
function listarArchivosDeCarpeta() {
    // Accede a la carpeta usando su ID
    let carpeta = DriveApp.getFolderById("1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2");

    // Obtiene el iterador de archivos de esa carpeta
    let archivos = carpeta.getFiles();

    // Bucle para recorrer cada archivo del iterador
    while (archivos.hasNext()) {
        // Obtiene el siguiente archivo en el iterador
        let archivo = archivos.next();

        // Muestra el nombre del archivo en el registro de Apps Script
        Logger.log(archivo.getId() + archivo.getName());
    }
}

function convertirYAbrirExcel() {
    // 1. Reemplaza 'ID_DEL_ARCHIVO_EXCEL' con el ID real de tu archivo .xlsx
    const fileId = "1X4TGA52sscSNouf7NAIi6WvRSglGCkkY";

    // 2. Define el tipo MIME para la conversión a Google Sheets
    const sheetMimeType = MimeType.GOOGLE_SHEETS;

    // 3. Usa el servicio avanzado de Drive para copiar el archivo .xlsx y convertirlo
    const convertedFile = Drive.Files.copy(
        {
            title: "Copia Convertida - " + new Date().toLocaleDateString(),
            mimeType: sheetMimeType,
        },
        fileId
    );

    // 4. Obtiene el ID del nuevo archivo convertido
    const convertedFileId = convertedFile.id;

    // 5. Abre el nuevo archivo de Google Sheets usando SpreadsheetApp.openById
    const sheet = SpreadsheetApp.openById(convertedFileId);

    // Ejemplo de lo que puedes hacer ahora que el archivo está abierto
    const firstSheet = sheet.getSheets()[0];
    Logger.log("Archivo convertido abierto: " + sheet.getName());
    Logger.log("Nombre de la primera hoja: " + firstSheet.getName());

    // Puedes devolver el objeto de la hoja de cálculo si lo necesitas
    return sheet;
}
