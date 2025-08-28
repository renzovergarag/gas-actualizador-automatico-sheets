/**
 * Obtiene el archivo xlsx a convertir desde una carpeta específica por nombre.
 * @param {string} folderId - ID de la carpeta en Google Drive.
 * @param {string} fileName - Nombre exacto del archivo a buscar.
 * @returns {GoogleAppsScript.Drive.File|null} El archivo encontrado o null si no existe.
 */
function obtenerArchivoPorNombre(folderId, fileName) {
    var carpeta = DriveApp.getFolderById(folderId);
    var archivos = carpeta.getFilesByName(fileName);
    return archivos.hasNext() ? archivos.next() : null;
}

/**
 * Convierte un archivo xlsx a Google Sheets usando el servicio avanzado de Drive.
 * @param {string} fileId - ID del archivo xlsx a convertir.
 * @param {string} nuevoNombre - Nombre para el archivo convertido.
 * @returns {string} ID del archivo convertido a Google Sheets.
 */
function convertirXlsxAGoogleSheet(fileId, nuevoNombre) {
    var sheetMimeType = MimeType.GOOGLE_SHEETS;
    var convertedFile = Drive.Files.copy(
        {
            title: nuevoNombre,
            mimeType: sheetMimeType,
        },
        fileId
    );
    return convertedFile.id;
}

/**
 * Copia un rango de datos de una hoja origen a una hoja destino.
 * @param {string} origenId - ID del archivo Google Sheets origen.
 * @param {string} hojaOrigen - Nombre de la hoja origen.
 * @param {string} rango - Rango en notación A1 (ej: "A1:F20").
 * @param {string} destinoId - ID del archivo Google Sheets destino.
 * @param {string} hojaDestino - Nombre de la hoja destino.
 * @param {string} celdaInicio - Celda de inicio en la hoja destino (ej: "A1").
 */
function copiarDatosEntreArchivos(origenId, hojaOrigen, rango, destinoId, hojaDestino, celdaInicio) {
    var ssOrigen = SpreadsheetApp.openById(origenId);
    var datos = ssOrigen.getSheetByName(hojaOrigen).getRange(rango).getValues();
    var ssDestino = SpreadsheetApp.openById(destinoId);
    var hojaDest = ssDestino.getSheetByName(hojaDestino);
    hojaDest.getRange(celdaInicio + ":" + String.fromCharCode(celdaInicio.charCodeAt(0) + datos[0].length - 1) + (parseInt(celdaInicio.replace(/\D/g, "")) + datos.length - 1)).setValues(datos);
}

/**
 * Envía un correo de confirmación usando GmailApp.
 * @param {string} destinatario - Correo electrónico del destinatario.
 * @param {string} asunto - Asunto del correo.
 * @param {string} mensaje - Cuerpo del correo.
 */
function enviarCorreoConfirmacion(destinatario, asunto, mensaje) {
    GmailApp.sendEmail(destinatario, asunto, mensaje);
}

/**
 * Elimina un archivo de Google Drive por su ID.
 * @param {string} fileId - ID del archivo a eliminar.
 */
function eliminarArchivoPorId(fileId) {
    var archivo = DriveApp.getFileById(fileId);
    archivo.setTrashed(true);
}

/**
 * Flujo principal: convierte, copia datos, notifica y elimina el archivo convertido.
 * Ajusta los parámetros según tus necesidades.
 */
function actualizarReporteGerencia() {
    // Parámetros configurables
    var folderId = "1X4TGA52sscSNouf7NAIi6WvRSglGCkkY";
    var fileName = "Consolidado Seleccion Demanda vs Oferta Morb vs A Morb vs A Sapu - copia";
    var nuevoNombre = "Reporte Gerencia Convertido - " + new Date().toLocaleDateString();
    var hojaOrigen = "Hoja1"; // Cambia por el nombre real de la hoja
    var rango = "A1:F20"; // Cambia por el rango real a copiar
    var destinoId = "ID_DEL_DESTINO"; // Reemplaza por el ID real del archivo destino
    var hojaDestino = "HojaDestino"; // Cambia por el nombre real de la hoja destino
    var celdaInicio = "A1";
    var destinatario = "correo@ejemplo.com"; // Cambia por el correo real
    var asunto = "Confirmación de actualización de reporte";
    var mensaje = "La información ha sido replicada exitosamente en el archivo de destino.";

    // 1. Obtener archivo xlsx
    var archivo = obtenerArchivoPorNombre(folderId, fileName);
    if (!archivo) {
        Logger.log("Archivo no encontrado en la carpeta.");
        return;
    }

    // 2. Convertir a Google Sheets
    var convertidoId = convertirXlsxAGoogleSheet(archivo.getId(), nuevoNombre);

    // 3. Copiar datos al archivo destino
    copiarDatosEntreArchivos(convertidoId, hojaOrigen, rango, destinoId, hojaDestino, celdaInicio);

    // 4. Enviar correo de confirmación
    enviarCorreoConfirmacion(destinatario, asunto, mensaje);

    // 5. Eliminar archivo convertido
    eliminarArchivoPorId(convertidoId);

    Logger.log("Proceso completado correctamente.");
}
