# Integración de IA con Google Gemini

## Configuración de la API Key

### 1. Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API Key generada

### 2. Configurar en Vercel (Recomendado)

#### Opción A: Variables de Entorno de Vercel (Más Seguro)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a Settings → Environment Variables
4. Agrega una nueva variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Tu API Key de Gemini
   - **Environment**: Production, Preview, Development
5. Haz clic en "Save"
6. Redespliega tu aplicación

#### Opción B: Archivo .env.local (Desarrollo)

1. Crea un archivo `.env.local` en la raíz de tu proyecto
2. Agrega la línea:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Reinicia tu servidor de desarrollo

### 3. Configurar en la Aplicación

1. Inicia sesión como administrador
2. Ve a Configuración → Básico
3. En la sección "Seguridad", encuentra "API Key de Google Gemini"
4. Pega tu API Key
5. Haz clic en "Probar conexión" para verificar
6. Guarda la configuración

## Funcionalidades de IA Disponibles

### Para Operadores:
- **Asistente Conversacional**: Haz preguntas sobre tu inventario en lenguaje natural
- **Predicciones Básicas**: Ve qué productos están por agotarse
- **Acciones Rápidas**: Botones para consultas comunes

### Para Administradores (Además de lo anterior):
- **Análisis Inteligente**: Detección automática de anomalías y patrones
- **Predicciones Avanzadas**: Análisis de demanda y recomendaciones de compra
- **Generación de Documentos**: Reportes narrativos automáticos
- **Insights del Dashboard**: Widget con predicciones en tiempo real

## Ejemplos de Uso

### Preguntas al Asistente:
- "¿Cuántos cables HDMI tenemos?"
- "¿Qué productos están por agotarse?"
- "¿Quién tiene más préstamos activos?"
- "Muestra el historial de salidas de la última semana"
- "¿Cuáles son las categorías disponibles?"

### Análisis Automático:
- Detección de productos con consumo irregular
- Identificación de productos subutilizados
- Patrones de préstamos por empleado
- Recomendaciones de optimización de stock

## Seguridad

- La API Key se almacena de forma segura en Vercel
- Solo los administradores pueden configurar la API Key
- Las peticiones se procesan en el servidor, no en el navegador
- No se almacena información sensible en el cliente

## Límites y Costos

- Google Gemini tiene un tier gratuito generoso
- Límite de 15 requests por minuto en el plan gratuito
- Límite de 1 millón de tokens por día
- Para uso empresarial, considera el plan de pago

## Solución de Problemas

### Error: "API Key not configured"
- Verifica que la variable de entorno `GEMINI_API_KEY` esté configurada en Vercel
- Asegúrate de haber redesplegado la aplicación después de agregar la variable

### Error: "API Key invalid or quota exceeded"
- Verifica que tu API Key sea correcta
- Revisa si has excedido los límites del plan gratuito
- Considera actualizar a un plan de pago si necesitas más uso

### Error: "Failed to get AI response"
- Verifica tu conexión a internet
- Revisa la consola del navegador para más detalles
- Intenta nuevamente en unos minutos

## Soporte

Si tienes problemas con la integración de IA:
1. Revisa la consola del navegador para errores
2. Verifica la configuración de la API Key
3. Consulta la documentación de Google Gemini
4. Contacta al soporte técnico si persisten los problemas
