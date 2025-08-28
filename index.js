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
const DESTINATARIO_CORREO = "rvergara@cmvalparaiso.cl";
//* ASUNTO_CORREO del correo
const ASUNTO_CORREO = "Confirmación de actualización de reporte";
//* Cuerpo del correo
const MENSAJE_CORREO = "La información ha sido replicada exitosamente en el archivo de destino.";

/**
 * Flujo principal: convierte, copia datos, notifica y elimina el archivo convertido.
 * Ajusta los parámetros según tus necesidades.
 */
function actualizarReporteGerencia() {
    // 1. Obtener archivo xlsx
    var archivo = obtenerArchivoPorNombre(FOLDER_ID, FILE_NAME);
    if (!archivo) {
        Logger.log("Archivo no encontrado en la carpeta.");
        return;
    }

    // 2. Convertir a Google Sheets
    var convertidoId = convertirXlsxAGoogleSheet(archivo.getId(), NUEVO_NOMBRE);
    if (!convertidoId) {
        Logger.log("Error en la conversión del archivo. Proceso cancelado.");
        return;
    }

    // Verificar que el archivo convertido es accesible
    try {
        SpreadsheetApp.openById(convertidoId);
    } catch (e) {
        Logger.log("El archivo convertido no es accesible como Google Sheet: " + e);
        return;
    }

    // 3. Copiar datos al archivo destino
    copiarDatosEntreArchivos(convertidoId, HOJA_ORIGEN, RANGO_DATOS_ORIGEN, DESTINO_ID, HOJA_DESTINO, CELDA_INICIO);

    // 4. Enviar correo de confirmación
    enviarCorreoConfirmacion(DESTINATARIO_CORREO, ASUNTO_CORREO, MENSAJE_CORREO);

    // 5. Eliminar archivo convertido
    eliminarArchivoPorId(convertidoId);

    Logger.log("Proceso completado correctamente.");
}

/**
 * Obtiene el archivo xlsx a convertir desde una carpeta específica por nombre.
 * @param {string} FOLDER_ID - ID de la carpeta en Google Drive.
 * @param {string} FILE_NAME - Nombre exacto del archivo a buscar.
 * @returns {GoogleAppsScript.Drive.File|null} El archivo encontrado o null si no existe.
 */
function obtenerArchivoPorNombre(FOLDER_ID, FILE_NAME) {
    var carpeta = DriveApp.getFolderById(FOLDER_ID);
    var archivos = carpeta.getFilesByName(FILE_NAME);
    return archivos.hasNext() ? archivos.next() : null;
}

/**
 * Convierte un archivo xlsx a Google Sheets usando solo métodos nativos de Apps Script.
 * @param {string} fileId - ID del archivo xlsx a convertir.
 * @param {string} NUEVO_NOMBRE - Nombre para el archivo convertido.
 * @returns {string|null} ID del archivo convertido a Google Sheets, o null si falla.
 */
function convertirXlsxAGoogleSheet(fileId, NUEVO_NOMBRE) {
    try {
        var archivoXlsx = DriveApp.getFileById(fileId);
        var blob = archivoXlsx.getBlob();

        // Crear el archivo como Google Sheets usando Drive API avanzado
        var resource = {
            title: NUEVO_NOMBRE,
            mimeType: "application/vnd.google-apps.spreadsheet",
        };

        var nuevoArchivo = Drive.Files.insert(resource, blob);
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
 * @param {string} HOJA_ORIGEN - Nombre de la hoja origen.
 * @param {string} RANGO_DATOS_ORIGEN - RANGO_DATOS_ORIGEN en notación A1 (ej: "A1:F20").
 * @param {string} DESTINO_ID - ID del archivo Google Sheets destino.
 * @param {string} HOJA_DESTINO - Nombre de la hoja destino.
 * @param {string} CELDA_INICIO - Celda de inicio en la hoja destino (ej: "A1").
 */
function copiarDatosEntreArchivos(origenId, HOJA_ORIGEN, RANGO_DATOS_ORIGEN, DESTINO_ID, HOJA_DESTINO, CELDA_INICIO) {
    try {
        var ssOrigen = SpreadsheetApp.openById(origenId);
        var hojaOrig = ssOrigen.getSheetByName(HOJA_ORIGEN);
        if (!hojaOrig) {
            Logger.log("Hoja origen '" + HOJA_ORIGEN + "' no encontrada");
            return;
        }
        var datos = hojaOrig.getRange(RANGO_DATOS_ORIGEN).getValues();

        var ssDestino = SpreadsheetApp.openById(DESTINO_ID);
        var hojaDest = ssDestino.getSheetByName(HOJA_DESTINO);
        if (!hojaDest) {
            Logger.log("Hoja destino '" + HOJA_DESTINO + "' no encontrada");
            return;
        }

        // Usar offset para calcular el RANGO_DATOS_ORIGEN destino de manera más confiable
        var celdaInicial = hojaDest.getRange(CELDA_INICIO);
        celdaInicial.offset(0, 0, datos.length, datos[0].length).setValues(datos);
        Logger.log("Datos copiados exitosamente");
    } catch (e) {
        Logger.log("Error al copiar datos: " + e);
    }
}

/**
 * Envía un correo de confirmación usando GmailApp.
 * @param {string} DESTINATARIO_CORREO - Correo electrónico del DESTINATARIO_CORREO.
 * @param {string} ASUNTO_CORREO - ASUNTO_CORREO del correo.
 * @param {string} MENSAJE_CORREO - Cuerpo del correo.
 */
function enviarCorreoConfirmacion(DESTINATARIO_CORREO, ASUNTO_CORREO, MENSAJE_CORREO) {
    GmailApp.sendEmail(DESTINATARIO_CORREO, ASUNTO_CORREO, MENSAJE_CORREO);
}

/**
 * Elimina un archivo de Google Drive por su ID.
 * @param {string} fileId - ID del archivo a eliminar.
 */
function eliminarArchivoPorId(fileId) {
    var archivo = DriveApp.getFileById(fileId);
    archivo.setTrashed(true);
}
