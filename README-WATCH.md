# 👀 Monitoreo Automático de Cambios

## Inicio Rápido

Para activar el monitoreo automático que detecta cambios y hace commit/push a GitHub:

### Opción 1: Script Simple (Recomendado)
```powershell
.\start-watch.ps1
```

### Opción 2: NPM Script
```powershell
npm run watch
```

### Opción 3: Directo
```powershell
powershell -ExecutionPolicy Bypass -File scripts/watch-changes.ps1
```

## Cómo Funciona

- **Verifica cambios cada 30 segundos** en todos los archivos del proyecto
- **Detecta modificaciones** automáticamente usando `git status`
- **Hace commit automático** con mensaje: `Auto-update: YYYY-MM-DD HH:mm:ss`
- **Hace push automático** a la rama `main` en GitHub
- **Muestra logs** en tiempo real de cada operación

## Detener el Monitoreo

Presiona **Ctrl+C** en la terminal donde está corriendo el script.

## Personalizar

Puedes cambiar el intervalo de verificación (en segundos):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/watch-changes.ps1 -IntervalSeconds 60
```

Esto verificará cambios cada 60 segundos en lugar de 30.

## Notas Importantes

- ⚠️ El monitoreo solo detecta cambios en archivos rastreados por Git
- ⚠️ Asegúrate de tener configuradas tus credenciales de Git
- ⚠️ Los commits automáticos usan mensajes con timestamp
- ⚠️ El script debe estar corriendo para detectar cambios

## Solución de Problemas

**El script no detecta cambios:**
- Verifica que los archivos modificados estén en el directorio del proyecto
- Asegúrate de que Git está configurado correctamente

**Error en push:**
- Verifica tu conexión a Internet
- Confirma que tienes permisos en el repositorio
- Revisa las credenciales de Git

**El script se detiene solo:**
- Revisa los mensajes de error en la consola
- Verifica los logs del script

