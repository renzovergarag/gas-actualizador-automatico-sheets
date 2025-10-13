/**
 * Funciones principales para ejecutar flujos ETL específicos.
 * Cada función corresponde a un flujo independiente y puede ser configurada con triggers.
 */

/**
 * Ejecuta el flujo ETL para el reporte de selección de demanda vs morbilidad.
 * Esta función puede ser seleccionada en un trigger de Google Apps Script.
 */
function actualizarReporteSeleccionDemandaVsMorbilidad() {
    const configs = getConfigs();
    const config = configs.reporteSeleccionDemandaVsMorbilidad;
    ejecutarFlujoETL(config);
}

/**
 * Ejecuta el flujo ETL para el reporte de cupos bloqueados.
 * Esta función puede ser seleccionada en un trigger de Google Apps Script.
 */
function actualizarReporteCuposBloqueados() {
    const configs = getConfigs();
    const config = configs.reporteCuposBloqueados;
    ejecutarFlujoETL(config);
}
