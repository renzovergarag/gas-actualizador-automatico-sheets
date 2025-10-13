/**
 * Servicio de envío de correos electrónicos.
 * Contiene funciones para enviar correos de confirmación y error con plantillas uniformes.
 */

/**
 * Plantilla base para el cuerpo de los correos.
 * Incluye metadatos del proceso para uniformidad.
 * @param {string} tipo - Tipo de correo ('confirmacion' o 'error').
 * @param {string} flujoNombre - Nombre del flujo ETL.
 * @param {string} mensajePersonalizado - Mensaje específico del correo.
 * @param {Object} metadatos - Objeto con metadatos adicionales (opcional).
 * @returns {string} Cuerpo del correo formateado.
 */
function generarCuerpoCorreo(tipo, flujoNombre, mensajePersonalizado, metadatos = {}) {
    const fecha = new Date().toLocaleString("es-ES", {
        timeZone: "America/Santiago",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    let cuerpo = `Fecha de ejecución: ${fecha}\n`;
    cuerpo += `Flujo: ${flujoNombre}\n`;

    if (metadatos.archivoProcesado) {
        cuerpo += `Archivo procesado: ${metadatos.archivoProcesado}\n`;
    }
    if (metadatos.idDestino) {
        cuerpo += `ID destino: ${metadatos.idDestino}\n`;
    }
    if (metadatos.rangoDatos) {
        cuerpo += `Rango de datos: ${metadatos.rangoDatos}\n`;
    }

    cuerpo += `\n`;

    if (tipo === "confirmacion") {
        cuerpo += `✅ Confirmación de proceso\n\n`;
        cuerpo += `${mensajePersonalizado}\n\n`;
        cuerpo += `El proceso ETL se completó exitosamente.`;
    } else if (tipo === "error") {
        cuerpo += `❌ Error en el proceso\n\n`;
        cuerpo += `${mensajePersonalizado}\n\n`;
        cuerpo += `Por favor, revise los logs para más detalles.`;
    }

    cuerpo += `\n\n--\nSistema Automático de ETL\nGoogle Apps Script`;

    return cuerpo;
}

/**
 * Envía un correo de confirmación con plantilla uniforme.
 * @param {string[]} emails - Lista de correos destinatarios.
 * @param {string} subject - Asunto del correo.
 * @param {string} flujoNombre - Nombre del flujo ETL.
 * @param {string} mensajePersonalizado - Mensaje específico de confirmación.
 * @param {Object} metadatos - Metadatos del proceso (opcional).
 */
function enviarCorreoConfirmacion(emails, subject, flujoNombre, mensajePersonalizado, metadatos = {}) {
    try {
        const body = generarCuerpoCorreo("confirmacion", flujoNombre, mensajePersonalizado, metadatos);
        GmailApp.sendEmail(emails.join(","), subject, body);
        Logger.log("Correo de confirmación enviado a: " + emails.join(", "));
    } catch (e) {
        Logger.log("Error al enviar correo de confirmación: " + e);
        throw e;
    }
}

/**
 * Envía un correo de error con plantilla uniforme.
 * @param {string[]} emails - Lista de correos destinatarios.
 * @param {string} subject - Asunto del correo.
 * @param {string} flujoNombre - Nombre del flujo ETL.
 * @param {string} mensajePersonalizado - Mensaje específico del error.
 * @param {Object} metadatos - Metadatos del proceso (opcional).
 */
function enviarCorreoError(emails, subject, flujoNombre, mensajePersonalizado, metadatos = {}) {
    try {
        const body = generarCuerpoCorreo("error", flujoNombre, mensajePersonalizado, metadatos);
        GmailApp.sendEmail(emails.join(","), subject, body);
        Logger.log("Correo de error enviado a: " + emails.join(", "));
    } catch (e) {
        Logger.log("Error al enviar correo de error: " + e);
    }
}
