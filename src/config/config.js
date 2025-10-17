/**
 * Configuraciones globales para los flujos ETL de actualización de reportes.
 * Cada propiedad representa un flujo independiente con sus parámetros específicos.
 */
const CONFIGS = {
    /**
     * Configuración para el reporte de selección de demanda vs morbilidad.
     */
    reporteSeleccionDemandaVsMorbilidad: {
        // Nombre del flujo para identificacion
        name: "Reporte de Selección de Demanda vs Morbilidad",
        // ID de la carpeta donde está el archivo Excel
        folderId: "1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2",
        // Nombre del archivo Excel a convertir
        fileName: "Consolidado Seleccion Demanda vs Oferta Morb vs A Morb vs A Sapu.xlsx",
        // Nombre de la hoja de origen en el Excel
        sourceSheetName: "Resumen Seleccion|O Morb|A Morb",
        // Rango de datos a copiar (ej. "A1:D")
        dataRange: "A1:D",
        // ID del archivo Google Sheets de destino
        destinationSpreadsheetId: "1HNXra6NKMI32YV9hI0yfebpVRd9DlxHZ5BSLpCd_uUo",
        // Nombre de la hoja de destino
        destinationSheetName: "Resumen",
        // Celda de inicio para pegar los datos
        startCell: "A1",
        // Correos para notificación de éxito
        notificationEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de confirmación
        emailSubject: "Confirmación de actualización de reporte de selección de demanda vs morbilidad",
        // Cuerpo del correo de confirmación
        emailBody: "La información ha sido replicada exitosamente en el archivo de destino.",
        // Correos para notificación de errores
        errorEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de error
        errorSubject: "Error en actualización de reporte de selección de demanda vs morbilidad",
        // Cuerpo base del correo de error
        errorBodyBase: "Ha ocurrido un error durante la actualización del reporte. Detalles: ",
    },
    reporteCuposBloqueados: {
        // Nombre del flujo para identificacion
        name: "Reporte de Cupos Bloqueados",
        // ID de la carpeta donde está el archivo Excel
        folderId: "1I2HRX-aWSzcgESJNYGPZN07kNh3gY5jg",
        // Nombre del archivo Excel a convertir
        fileName: "Consolidado Estado de Cupos con analisis de bloqueo.xlsx",
        // Nombre de la hoja de origen en el Excel
        sourceSheetName: "Estado de cupos por CESFAM",
        // Rango de datos a copiar (ej. "A1:D")
        dataRange: "A1:L",
        // ID del archivo Google Sheets de destino
        destinationSpreadsheetId: "1qs0HEwr4gul1mQZMfsmavJgMxeqVNl_Rw6vZUSbF8Vg",
        // Nombre de la hoja de destino
        destinationSheetName: "Reporte de bloqueos",
        // Celda de inicio para pegar los datos
        startCell: "A1",
        // Correos para notificación de éxito
        notificationEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de confirmación
        emailSubject: "Confirmación de actualización de reporte de cupos bloqueados",
        // Cuerpo del correo de confirmación
        emailBody: "La información ha sido replicada exitosamente en el archivo de destino.",
        // Correos para notificación de errores
        errorEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de error
        errorSubject: "Error en actualización de reporte de cupos bloqueados",
        // Cuerpo base del correo de error
        errorBodyBase: "Ha ocurrido un error durante la actualización del reporte. Detalles: ",
    },
    reporteCuposNSP: {
        // Nombre del flujo para identificacion
        name: "Reporte de NSP",
        // ID de la carpeta donde está el archivo Excel
        folderId: "1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2",
        // Nombre del archivo Excel a convertir
        fileName: "Consolidado NSP v2.xlsx",
        // Nombre de la hoja de origen en el Excel
        sourceSheetName: "Agrupacion NSP",
        // Rango de datos a copiar (ej. "A1:D")
        dataRange: "A1:I",
        // ID del archivo Google Sheets de destino
        destinationSpreadsheetId: "1tng6eYzwUH1HgZ5sVCAjMuIu9Bj3rPEAUIpz-UQDlts",
        // Nombre de la hoja de destino
        destinationSheetName: "Resumen",
        // Celda de inicio para pegar los datos
        startCell: "A1",
        // Correos para notificación de éxito
        notificationEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de confirmación
        emailSubject: "Confirmación de actualización de reporte de NSP",
        // Cuerpo del correo de confirmación
        emailBody: "La información ha sido replicada exitosamente en el archivo de destino.",
        // Correos para notificación de errores
        errorEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de error
        errorSubject: "Error en actualización de reporte de NSP",
        // Cuerpo base del correo de error
        errorBodyBase: "Ha ocurrido un error durante la actualización del reporte. Detalles: ",
    },
    reporteAnalisisMorbilidades: {
        // Nombre del flujo para identificacion
        name: "Reporte de Morbilidades",
        // ID de la carpeta donde está el archivo Excel
        folderId: "1ssQn8khMrQZCW5WoxFm4yRzYk02heTt2",
        // Nombre del archivo Excel a convertir
        fileName: "Analisis de morbilidades 2025.xlsx",
        // Nombre de la hoja de origen en el Excel
        sourceSheetName: "Oferta de morbilidad 2025",
        // Rango de datos a copiar (ej. "A1:D")
        dataRange: "A1:G",
        // ID del archivo Google Sheets de destino
        destinationSpreadsheetId: "1tng6eYzwUH1HgZ5sVCAjMuIu9Bj3rPEAUIpz-UQDlts",
        // Nombre de la hoja de destino
        destinationSheetName: "Resumen",
        // Celda de inicio para pegar los datos
        startCell: "A1",
        // Correos para notificación de éxito
        notificationEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de confirmación
        emailSubject: "Confirmación de actualización de reporte de NSP",
        // Cuerpo del correo de confirmación
        emailBody: "La información ha sido replicada exitosamente en el archivo de destino.",
        // Correos para notificación de errores
        errorEmails: ["rvergara@cmvalparaiso.cl", "sordonez@cmvalparaiso.cl"],
        // Asunto del correo de error
        errorSubject: "Error en actualización de reporte de NSP",
        // Cuerpo base del correo de error
        errorBodyBase: "Ha ocurrido un error durante la actualización del reporte. Detalles: ",
    },
    // Aquí se pueden agregar más configuraciones para otros flujos, ej.:
    // otroFlujo: { ... }
};

/**
 * Exporta las configuraciones para uso en otros archivos.
 */
function getConfigs() {
    return CONFIGS;
}
