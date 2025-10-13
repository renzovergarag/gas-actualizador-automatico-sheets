/**
 * Servicio ETL para procesamiento de archivos Excel a Google Sheets.
 * Contiene funciones reutilizables para obtener, convertir, copiar datos y notificar.
 */

/**
 * Obtiene un archivo de Google Drive por nombre desde una carpeta específica.
 * @param {string} folderId - ID de la carpeta donde buscar el archivo.
 * @param {string} fileName - Nombre del archivo a buscar.
 * @returns {GoogleAppsScript.Drive.File|null} El archivo encontrado o null si no existe.
 */
function obtenerArchivoPorNombre(folderId, fileName) {
    try {
        let carpeta = DriveApp.getFolderById(folderId);
        let archivos = carpeta.getFilesByName(fileName);
        return archivos.hasNext() ? archivos.next() : null;
    } catch (e) {
        Logger.log("Error al obtener archivo: " + e);
        return null;
    }
}

/**
 * Convierte un archivo XLSX a Google Sheets usando Drive API.
 * @param {string} fileId - ID del archivo XLSX a convertir.
 * @param {string} newName - Nombre para el archivo convertido.
 * @returns {string|null} ID del archivo convertido o null si falla.
 */
function convertirXlsxAGoogleSheet(fileId, newName) {
    try {
        let archivoXlsx = DriveApp.getFileById(fileId);
        let blob = archivoXlsx.getBlob();

        let resource = {
            title: newName,
            mimeType: "application/vnd.google-apps.spreadsheet",
        };

        let nuevoArchivo = Drive.Files.insert(resource, blob);
        Logger.log("Archivo convertido exitosamente. ID: " + nuevoArchivo.id);
        return nuevoArchivo.id;
    } catch (e) {
        Logger.log("No se pudo convertir el archivo a Google Sheets: " + e);
        return null;
    }
}

/**
 * Copia datos de una hoja origen a una hoja destino.
 * @param {string} sourceSpreadsheetId - ID del spreadsheet origen.
 * @param {string} sourceSheetName - Nombre de la hoja origen.
 * @param {string} dataRange - Rango de datos a copiar (ej. "A1:D").
 * @param {string} destSpreadsheetId - ID del spreadsheet destino.
 * @param {string} destSheetName - Nombre de la hoja destino.
 * @param {string} startCell - Celda de inicio para pegar (ej. "A1").
 */
function copiarDatosEntreArchivos(sourceSpreadsheetId, sourceSheetName, dataRange, destSpreadsheetId, destSheetName, startCell) {
    try {
        let ssOrigen = SpreadsheetApp.openById(sourceSpreadsheetId);
        let hojaOrig = ssOrigen.getSheetByName(sourceSheetName);
        if (!hojaOrig) {
            throw new Error("Hoja origen '" + sourceSheetName + "' no encontrada");
        }
        let datos = hojaOrig.getRange(dataRange).getValues();

        let ssDestino = SpreadsheetApp.openById(destSpreadsheetId);
        let hojaDest = ssDestino.getSheetByName(destSheetName);
        if (!hojaDest) {
            throw new Error("Hoja destino '" + destSheetName + "' no encontrada");
        }

        let celdaInicial = hojaDest.getRange(startCell);
        celdaInicial.offset(0, 0, datos.length, datos[0].length).setValues(datos);
        Logger.log("Datos copiados exitosamente");
    } catch (e) {
        Logger.log("Error al copiar datos: " + e);
        throw e;
    }
}

/**
 * Envía un correo de confirmación.
 * @param {string[]} emails - Lista de correos destinatarios.
 * @param {string} subject - Asunto del correo.
 * @param {string} body - Cuerpo del correo.
 */
function enviarCorreoConfirmacion(emails, subject, body) {
    try {
        GmailApp.sendEmail(emails.join(","), subject, body);
        Logger.log("Correo de confirmación enviado");
    } catch (e) {
        Logger.log("Error al enviar correo de confirmación: " + e);
        throw e;
    }
}

/**
 * Envía un correo de error.
 * @param {string[]} emails - Lista de correos destinatarios.
 * @param {string} subject - Asunto del correo.
 * @param {string} baseMessage - Mensaje base del error.
 * @param {string} errorDetails - Detalles del error.
 */
function enviarCorreoError(emails, subject, baseMessage, errorDetails) {
    try {
        let mensajeCompleto = baseMessage + errorDetails;
        GmailApp.sendEmail(emails.join(","), subject, mensajeCompleto);
        Logger.log("Correo de error enviado");
    } catch (e) {
        Logger.log("Error al enviar correo de error: " + e);
    }
}

/**
 * Elimina un archivo de Google Drive por su ID.
 * @param {string} fileId - ID del archivo a eliminar.
 */
function eliminarArchivoPorId(fileId) {
    try {
        let archivo = DriveApp.getFileById(fileId);
        archivo.setTrashed(true);
        Logger.log("Archivo eliminado exitosamente");
    } catch (e) {
        Logger.log("Error al eliminar archivo: " + e);
        throw e;
    }
}

/**
 * Ejecuta el flujo ETL completo para un conjunto de parámetros.
 * @param {Object} config - Objeto de configuración con todos los parámetros necesarios.
 */
function ejecutarFlujoETL(config) {
    let errorOcurrido = false;
    let mensajeError = "";

    // 1. Obtener archivo XLSX
    let archivo = obtenerArchivoPorNombre(config.folderId, config.fileName);
    if (!archivo) {
        mensajeError = "Archivo no encontrado en la carpeta.";
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        return;
    }

    // 2. Convertir a Google Sheets
    let nuevoNombre = "Reporte Convertido - " + new Date().toLocaleDateString();
    let convertidoId = convertirXlsxAGoogleSheet(archivo.getId(), nuevoNombre);
    if (!convertidoId) {
        mensajeError = "Error en la conversión del archivo. Proceso cancelado.";
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        return;
    }

    // Verificar accesibilidad
    try {
        SpreadsheetApp.openById(convertidoId);
    } catch (e) {
        mensajeError = "El archivo convertido no es accesible como Google Sheet: " + e;
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        return;
    }

    // 3. Copiar datos
    try {
        copiarDatosEntreArchivos(convertidoId, config.sourceSheetName, config.dataRange, config.destinationSpreadsheetId, config.destinationSheetName, config.startCell);
    } catch (e) {
        mensajeError = "Error al copiar datos: " + e;
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        eliminarArchivoPorId(convertidoId);
        return;
    }

    // 4. Enviar correo de confirmación
    try {
        enviarCorreoConfirmacion(config.notificationEmails, config.emailSubject, config.emailBody);
    } catch (e) {
        mensajeError = "Error al enviar correo de confirmación: " + e;
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        eliminarArchivoPorId(convertidoId);
        return;
    }

    // 5. Eliminar archivo convertido
    try {
        eliminarArchivoPorId(convertidoId);
    } catch (e) {
        mensajeError = "Error al eliminar archivo convertido: " + e;
        Logger.log(mensajeError);
        enviarCorreoError(config.errorEmails, config.errorSubject, config.errorBodyBase, mensajeError);
        return;
    }

    Logger.log("Proceso completado correctamente.");
}
