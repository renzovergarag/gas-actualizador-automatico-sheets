# gas-actualizacion-reporte-gerencia

## Descripción

Esta es una aplicación de Google Apps Script diseñada para automatizar la actualización de reportes de gerencia en Google Workspace. El script realiza las siguientes tareas de manera secuencial:

1. **Conversión de archivos**: Convierte un archivo Excel (.xlsx) ubicado en una carpeta específica de Google Drive a un Google Sheets nativo.
2. **Extracción y copia de datos**: Lee datos de una hoja y rango específicos del archivo convertido, y los copia a otro archivo de Google Sheets de destino.
3. **Notificación**: Envía un correo electrónico de confirmación cuando el proceso se completa exitosamente, o un correo de error si ocurre algún problema.
4. **Limpieza**: Elimina el archivo convertido temporalmente para mantener el espacio de almacenamiento organizado.

Esta automatización es útil para mantener reportes actualizados sin intervención manual, integrándose perfectamente con herramientas de Google como Drive, Sheets y Gmail.

## Requerimientos

La aplicación debe cumplir con los siguientes requerimientos funcionales:

1. **Conversión automática**: Implementar una funcionalidad que localice y convierta un archivo Excel (.xlsx) específico, almacenado en una carpeta designada de Google Drive, a un formato de Google Sheets nativo utilizando las APIs de Google.
2. **Extracción y transferencia de datos**: Acceder al archivo convertido, extraer información desde una hoja y rango de celdas predefinidos, y transferir estos datos a un archivo de destino en Google Sheets, colocándolos en la hoja y celda de inicio especificadas.
3. **Confirmación y limpieza**: Una vez verificada la correcta replicación de los datos en el archivo destino, enviar un correo electrónico de confirmación a los destinatarios designados y proceder a eliminar el archivo temporal convertido para optimizar el uso del almacenamiento.

## Funcionalidades Adicionales

-   **Manejo robusto de errores**: El script incluye manejo de excepciones en cada paso del proceso. Si ocurre un error en cualquier etapa (conversión, copia, envío de correo o eliminación), se envía automáticamente un correo de notificación de error con detalles específicos a múltiples destinatarios.
-   **Configuración centralizada**: Todos los parámetros (IDs de archivos, nombres de hojas, rangos, correos electrónicos) se definen como constantes globales al inicio del script, facilitando la personalización y mantenimiento.
-   **Logging detallado**: Registra cada paso del proceso en los logs de Google Apps Script para facilitar la depuración y monitoreo.

## Configuración

Antes de ejecutar el script, asegúrate de configurar las siguientes constantes en el archivo `index.js`:

-   `FOLDER_ID`: ID de la carpeta de Google Drive donde se encuentra el archivo Excel origen.
-   `FILE_NAME`: Nombre exacto del archivo Excel a convertir.
-   `NUEVO_NOMBRE`: Nombre base para el archivo convertido (se agrega la fecha automáticamente).
-   `HOJA_ORIGEN`: Nombre de la hoja en el archivo origen (puede incluir múltiples hojas separadas por `|`).
-   `RANGO_DATOS_ORIGEN`: Rango de celdas a copiar (ej: "A1:D").
-   `DESTINO_ID`: ID del archivo Google Sheets de destino.
-   `HOJA_DESTINO`: Nombre de la hoja en el archivo destino.
-   `CELDA_INICIO`: Celda de inicio para pegar los datos (ej: "A1").
-   `DESTINATARIO_CORREO`: Array de correos para notificaciones de éxito.
-   `ASUNTO_CORREO` y `MENSAJE_CORREO`: Asunto y cuerpo del correo de confirmación.
-   `DESTINATARIOS_ERROR`: Array de correos para notificaciones de error.
-   `ASUNTO_ERROR` y `MENSAJE_ERROR_BASE`: Asunto y cuerpo base del correo de error.

## Uso

1. **Despliegue**: Sube el archivo `index.js` a un proyecto de Google Apps Script en Google Drive.
2. **Permisos**: Asegúrate de que el script tenga los permisos necesarios para acceder a Drive, Sheets y Gmail (configura los scopes en `appsscript.json` si es necesario).
3. **Ejecución**: Llama a la función `actualizarReporteGerencia()` desde el editor de Apps Script o configúrala como un trigger automático (ej: diario).
4. **Monitoreo**: Revisa los logs en el editor de Apps Script para verificar el progreso y cualquier error.

## Notas Técnicas

-   Utiliza las APIs avanzadas de Google Drive para la conversión de archivos.
-   Compatible con múltiples hojas en el archivo origen (procesa la primera coincidencia).
-   Incluye validaciones para asegurar la accesibilidad de archivos y hojas antes de proceder con la copia de datos.
-   En caso de error, el script intenta limpiar archivos temporales y notifica inmediatamente.
