# Instrucciones para Ejecutar la Aplicación de Inventario

## 🚀 Opciones de Ejecución

### Opción 1: Servidor Local (Recomendado para desarrollo)

1. **Abrir terminal en la carpeta del proyecto:**
   ```bash
   cd "C:\Users\emili\OneDrive\Escritorio\proyectos_code\my-inventory-app"
   ```

2. **Ejecutar servidor Python:**
   ```bash
   python -m http.server 8000
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:8000
   ```

### Opción 2: Servidor Node.js (Alternativa)

1. **Instalar http-server globalmente:**
   ```bash
   npm install -g http-server
   ```

2. **Ejecutar servidor:**
   ```bash
   http-server -p 8000
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:8000
   ```

### Opción 3: Vercel (Para producción con IA)

1. **Desplegar en Vercel:**
   - Conectar repositorio GitHub a Vercel
   - Configurar variable de entorno `GEMINI_API_KEY`
   - Desplegar automáticamente

## ⚠️ Problemas Comunes

### Error: "Failed to fetch"
**Causa:** Ejecutar `index.html` directamente desde el explorador de archivos (file://)

**Solución:** Usar un servidor web local (ver Opción 1 o 2)

### Error: "AI features are not available when running locally"
**Causa:** Las funciones de IA requieren un servidor web

**Solución:** 
- Para desarrollo: Usar servidor local (las funciones básicas funcionan)
- Para IA completa: Desplegar en Vercel con API Key configurada

## 🔧 Funcionalidades Disponibles

### Con Servidor Local:
- ✅ Gestión completa de inventario
- ✅ Transacciones y préstamos
- ✅ Reportes y análisis básicos
- ✅ Configuración de usuario
- ❌ Funciones de IA (requiere Vercel)

### Con Vercel + API Key:
- ✅ Todas las funciones locales
- ✅ Análisis inteligente con IA
- ✅ Asistente conversacional
- ✅ Predicciones y optimizaciones

## 📝 Notas Importantes

1. **Firebase:** La aplicación requiere configuración de Firebase para funcionar
2. **IA:** Las funciones de IA solo están disponibles en Vercel con API Key configurada
3. **Puerto:** El puerto 8000 es el recomendado, pero puedes usar cualquier puerto disponible
4. **HTTPS:** Para funciones avanzadas, se recomienda HTTPS en producción

## 🆘 Solución de Problemas

### Si el servidor no inicia:
```bash
# Verificar si Python está instalado
python --version

# O usar Python 3 específicamente
python3 -m http.server 8000
```

### Si el puerto está ocupado:
```bash
# Usar otro puerto
python -m http.server 8080
```

### Si hay errores de CORS:
- Asegúrate de usar `http://localhost:8000` (no `file://`)
- Verifica que el servidor esté ejecutándose correctamente
