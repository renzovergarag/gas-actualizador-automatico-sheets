// Parámetros para actualizacion de informacion
//* Id de la carpeta donde esta el archivo
const FOLDER_ID = "1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2";
//* Nombre del archivo a convertir
const FILE_NAME = "Consolidado Seleccion Demanda vs Oferta Morb vs A Morb vs A Sapu.xlsx";
//* Nombre para el archivo convertido
const NUEVO_NOMBRE = "Reporte Gerencia Convertido - " + new Date().toLocaleDateString();
//* Nombre de la hoja de origen
const HOJA_ORIGEN = "Resumen Seleccion|O Morb|A Morb";
//* RANGO_DATOS_ORIGEN de datos a copiar
const RANGO_DATOS_ORIGEN = "A1:D";
//* Id del archivo destino
const DESTINO_ID = "1HNXra6NKMI32YV9hI0yfebpVRd9DlxHZ5BSLpCd_uUo";
//* Nombre de la hoja destino
const HOJA_DESTINO = "Resumen";
//* Celda de inicio para pegar los datos
const CELDA_INICIO = "A1";

// Parámetros para la notificación por correo
//* Correo del DESTINATARIO_CORREO
const DESTINATARIO_CORREO = ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"];
//* ASUNTO_CORREO del correo
const ASUNTO_CORREO = "Confirmación de actualización de reporte de gerencia";
//* Cuerpo del correo
const MENSAJE_CORREO = "La información ha sido replicada exitosamente en el archivo de destino.";

//* Correos para notificación de errores
const DESTINATARIOS_ERROR = ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"];
//* ASUNTO_CORREO para errores
const ASUNTO_ERROR = "Error en actualización de reporte de gerencia";
//* Cuerpo base del correo de error
const MENSAJE_ERROR_BASE = "Ha ocurrido un error durante la actualización del reporte. Detalles: ";

/**
 * Flujo principal: convierte, copia datos, notifica y elimina el archivo convertido.
 * Ajusta los parámetros según tus necesidades.
 */
function actualizarReporteGerencia() {
    let errorOcurrido = false;
    let mensajeError = "";

    // 1. Obtener archivo xlsx
    let archivo = obtenerArchivoPorNombreOld();
    // 1.1 Verificar que el archivo existe
    if (!archivo) {
        mensajeError = "Archivo no encontrado en la carpeta.";
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        return;
    }

    // 2. Convertir a Google Sheets
    let convertidoId = convertirXlsxAGoogleSheetOld(archivo.getId());
    if (!convertidoId) {
        mensajeError = "Error en la conversión del archivo. Proceso cancelado.";
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        return;
    }

    // Verificar que el archivo convertido es accesible
    try {
        SpreadsheetApp.openById(convertidoId);
    } catch (e) {
        mensajeError = "El archivo convertido no es accesible como Google Sheet: " + e;
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        return;
    }

    // 3. Copiar datos al archivo destino
    try {
        copiarDatosEntreArchivosOld(convertidoId);
    } catch (e) {
        mensajeError = "Error al copiar datos: " + e;
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        eliminarArchivoPorIdOld(convertidoId); // Limpiar archivo convertido
        return;
    }

    // 4. Enviar correo de confirmación
    try {
        enviarCorreoConfirmacionOld();
    } catch (e) {
        mensajeError = "Error al enviar correo de confirmación: " + e;
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        eliminarArchivoPorIdOld(convertidoId); // Limpiar archivo convertido
        return;
    }

    // 5. Eliminar archivo convertido
    try {
        eliminarArchivoPorIdOld(convertidoId);
    } catch (e) {
        mensajeError = "Error al eliminar archivo convertido: " + e;
        Logger.log(mensajeError);
        enviarCorreoErrorOld(mensajeError);
        return;
    }

    Logger.log("Proceso completado correctamente.");
}

/**
 * Obtiene el archivo xlsx a convertir desde una carpeta específica por nombre.
 * @returns {GoogleAppsScript.Drive.File|null} El archivo encontrado o null si no existe.
 */
function obtenerArchivoPorNombreOld() {
    let carpeta = DriveApp.getFolderById(FOLDER_ID);
    let archivos = carpeta.getFilesByName(FILE_NAME);
    return archivos.hasNext() ? archivos.next() : null;
}

/**
 * Convierte un archivo xlsx a Google Sheets usando solo métodos nativos de Apps Script.
 * @param {string} fileId - ID del archivo xlsx a convertir.
 * @returns {string|null} ID del archivo convertido a Google Sheets, o null si falla.
 */
function convertirXlsxAGoogleSheetOld(fileId) {
    try {
        let archivoXlsx = DriveApp.getFileById(fileId);
        let blob = archivoXlsx.getBlob();

        // Crear el archivo como Google Sheets usando Drive API avanzado
        let resource = {
            title: NUEVO_NOMBRE,
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
 * Copia un RANGO_DATOS_ORIGEN de datos de una hoja origen a una hoja destino.
 * @param {string} origenId - ID del archivo Google Sheets origen.
 */
function copiarDatosEntreArchivosOld(origenId) {
    try {
        let ssOrigen = SpreadsheetApp.openById(origenId);
        let hojaOrig = ssOrigen.getSheetByName(HOJA_ORIGEN);
        if (!hojaOrig) {
            Logger.log("Hoja origen '" + HOJA_ORIGEN + "' no encontrada");
            return;
        }
        let datos = hojaOrig.getRange(RANGO_DATOS_ORIGEN).getValues();

        let ssDestino = SpreadsheetApp.openById(DESTINO_ID);
        let hojaDest = ssDestino.getSheetByName(HOJA_DESTINO);
        if (!hojaDest) {
            Logger.log("Hoja destino '" + HOJA_DESTINO + "' no encontrada");
            return;
        }

        // Usar offset para calcular el RANGO_DATOS_ORIGEN destino de manera más confiable
        let celdaInicial = hojaDest.getRange(CELDA_INICIO);
        celdaInicial.offset(0, 0, datos.length, datos[0].length).setValues(datos);
        Logger.log("Datos copiados exitosamente");
    } catch (e) {
        Logger.log("Error al copiar datos: " + e);
    }
}

/**
 * Envía un correo de confirmación usando GmailApp.
 */
function enviarCorreoConfirmacionOld() {
    try {
        GmailApp.sendEmail(DESTINATARIO_CORREO, ASUNTO_CORREO, MENSAJE_CORREO);
    } catch (e) {
        Logger.log("Error al enviar correo de confirmación: " + e);
        throw e; // Re-lanzar para que sea capturado en la función principal
    }
}

/**
 * Envía un correo de error a múltiples destinatarios.
 * @param {string} mensajeError - Detalles del error ocurrido.
 */
function enviarCorreoErrorOld(mensajeError) {
    try {
        let mensajeCompleto = MENSAJE_ERROR_BASE + mensajeError;
        GmailApp.sendEmail(DESTINATARIOS_ERROR.join(","), ASUNTO_ERROR, mensajeCompleto);
    } catch (e) {
        Logger.log("Error al enviar correo de error: " + e);
        // No re-lanzar aquí, ya que estamos en modo de error
    }
}

/**
 * Elimina un archivo de Google Drive por su ID.
 * @param {string} fileId - ID del archivo a eliminar.
 */
function eliminarArchivoPorIdOld(fileId) {
    try {
        let archivo = DriveApp.getFileById(fileId);
        archivo.setTrashed(true);
    } catch (e) {
        Logger.log("Error al eliminar archivo: " + e);
        throw e; // Re-lanzar para que sea capturado en la función principal
    }
}
