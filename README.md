# gas-actualizacion-reporte-gerencia

## Descripción

Esta es una aplicación de Google Apps Script diseñada para automatizar la actualización de reportes de gerencia en Google Workspace. El script realiza las siguientes tareas de manera secuencial:

1. **Conversión de archivos**: Convierte un archivo Excel (.xlsx) ubicado en una carpeta específica de Google Drive a un Google Sheets nativo.
2. **Extracción y copia de datos**: Lee datos de una hoja y rango específicos del archivo convertido, y los copia a otro archivo de Google Sheets de destino.
3. **Notificación**: Envía un correo electrónico de confirmación cuando el proceso se completa exitosamente, o un correo de error si ocurre algún problema.
4. **Limpieza**: Elimina el archivo convertido temporalmente para mantener el espacio de almacenamiento organizado.

Esta automatización es útil para mantener reportes actualizados sin intervención manual, integrándose perfectamente con herramientas de Google como Drive, Sheets y Gmail.

## Arquitectura Modular

El proyecto ha sido refactorizado para ser modular y reutilizable, permitiendo agregar fácilmente nuevos flujos ETL sin duplicar código.

### Estructura de Archivos

```
/
├── config/
│   └── config.js          # Configuraciones globales para todos los flujos
├── services/
│   └── etlService.js      # Funciones reutilizables del servicio ETL
├── main/
│   └── main.js            # Funciones principales para ejecutar flujos específicos
├── appsscript.json        # Configuración de Google Apps Script
├── package.json           # Dependencias del proyecto
└── README.md              # Esta documentación
```

### Componentes Principales

-   **config/config.js**: Contiene el objeto `CONFIGS` con subobjetos para cada flujo. Cada configuración incluye todos los parámetros necesarios (IDs, nombres, correos, etc.).
-   **services/etlService.js**: Servicio con funciones reutilizables como `obtenerArchivoPorNombre`, `convertirXlsxAGoogleSheet`, `copiarDatosEntreArchivos`, etc. Incluye la función `ejecutarFlujoETL` que orquesta el proceso completo.
-   **main/main.js**: Contiene funciones específicas para cada flujo (ej: `actualizarReporteGerencia`), que pueden ser seleccionadas en triggers de Apps Script para ejecuciones programadas independientes.

## Requerimientos

La aplicación debe cumplir con los siguientes requerimientos funcionales:

1. **Conversión automática**: Implementar una funcionalidad que localice y convierta un archivo Excel (.xlsx) específico, almacenado en una carpeta designada de Google Drive, a un formato de Google Sheets nativo utilizando las APIs de Google.
2. **Extracción y transferencia de datos**: Acceder al archivo convertido, extraer información desde una hoja y rango de celdas predefinidos, y transferir estos datos a un archivo de destino en Google Sheets, colocándolos en la hoja y celda de inicio especificadas.
3. **Confirmación y limpieza**: Una vez verificada la correcta replicación de los datos en el archivo destino, enviar un correo electrónico de confirmación a los destinatarios designados y proceder a eliminar el archivo temporal convertido para optimizar el uso del almacenamiento.

## Funcionalidades Adicionales

-   **Manejo robusto de errores**: El script incluye manejo de excepciones en cada paso del proceso. Si ocurre un error en cualquier etapa (conversión, copia, envío de correo o eliminación), se envía automáticamente un correo de notificación de error con detalles específicos a múltiples destinatarios.
-   **Configuración centralizada**: Todos los parámetros se definen en el objeto `CONFIGS`, facilitando la personalización y mantenimiento.
-   **Logging detallado**: Registra cada paso del proceso en los logs de Google Apps Script para facilitar la depuración y monitoreo.
-   **Reutilizable**: Fácil agregar nuevos flujos agregando configuraciones y funciones en `main.js`.

## Configuración

### Agregar un Nuevo Flujo

1. **Agregar configuración en `config/config.js`**:

    ```javascript
    const CONFIGS = {
      // Flujo existente
      reporteGerencia: { ... },

      // Nuevo flujo
      nuevoFlujo: {
        folderId: "ID_DE_LA_CARPETA",
        fileName: "NombreDelArchivo.xlsx",
        sourceSheetName: "NombreHojaOrigen",
        dataRange: "A1:D",
        destinationSpreadsheetId: "ID_DESTINO",
        destinationSheetName: "HojaDestino",
        startCell: "A1",
        notificationEmails: ["correo1@ejemplo.com", "correo2@ejemplo.com"],
        emailSubject: "Asunto del correo",
        emailBody: "Cuerpo del correo",
        errorEmails: ["error1@ejemplo.com"],
        errorSubject: "Asunto error",
        errorBodyBase: "Mensaje base de error: "
      }
    };
    ```

2. **Agregar función en `main/main.js`**:

    ```javascript
    function actualizarNuevoFlujo() {
        const configs = getConfigs();
        const config = configs.nuevoFlujo;
        ejecutarFlujoETL(config);
    }
    ```

3. **Configurar trigger**: En Google Apps Script, crea un trigger para `actualizarNuevoFlujo` con la frecuencia deseada.

## Uso

1. **Despliegue**: Sube los archivos a un proyecto de Google Apps Script en Google Drive.
2. **Permisos**: Asegúrate de que el script tenga los permisos necesarios para acceder a Drive, Sheets y Gmail (configura los scopes en `appsscript.json` si es necesario).
3. **Ejecución**: Llama a las funciones específicas (ej: `actualizarReporteGerencia()`) desde el editor de Apps Script o configúralas como triggers automáticos.
4. **Monitoreo**: Revisa los logs en el editor de Apps Script para verificar el progreso y cualquier error.

## API del Servicio ETL

### ejecutarFlujoETL(config)

Ejecuta el flujo ETL completo basado en la configuración proporcionada.

**Parámetros:**

-   `config` (Object): Objeto con la configuración del flujo.

**Funciones Auxiliares:**

-   `obtenerArchivoPorNombre(folderId, fileName)`: Obtiene un archivo por nombre desde una carpeta.
-   `convertirXlsxAGoogleSheet(fileId, newName)`: Convierte XLSX a Google Sheets.
-   `copiarDatosEntreArchivos(sourceId, sourceSheet, range, destId, destSheet, startCell)`: Copia datos entre spreadsheets.
-   `enviarCorreoConfirmacion(emails, subject, body)`: Envía correo de éxito.
-   `enviarCorreoError(emails, subject, baseMessage, details)`: Envía correo de error.
-   `eliminarArchivoPorId(fileId)`: Elimina un archivo por ID.

## Notas Técnicas

-   Utiliza las APIs avanzadas de Google Drive para la conversión de archivos.
-   Compatible con múltiples hojas en el archivo origen (procesa la primera coincidencia).
-   Incluye validaciones para asegurar la accesibilidad de archivos y hojas antes de proceder con la copia de datos.
-   En caso de error, el script intenta limpiar archivos temporales y notifica inmediatamente.
