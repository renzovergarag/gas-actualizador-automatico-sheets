/**
 * Funciones principales para ejecutar flujos ETL específicos.
 * Cada función corresponde a un flujo independiente y puede ser configurada con triggers.
 */

/**
 * Ejecuta el flujo ETL para el reporte de gerencia.
 * Esta función puede ser seleccionada en un trigger de Google Apps Script.
 */
function actualizarReporteGerencia() {
    const configs = getConfigs();
    const config = configs.reporteGerencia;
    ejecutarFlujoETL(config);
}

// Aquí se pueden agregar más funciones para otros flujos, ej.:
/**
 * Función para otro flujo ETL.
 * Ejemplo: function actualizarOtroReporte() { ... }
 */
