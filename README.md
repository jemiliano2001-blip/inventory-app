# 📦 Gestión Central de Inventario

Una aplicación web moderna de gestión de inventario con integración de IA, diseñada como Progressive Web App (PWA) para uso tanto en escritorio como móvil.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)
![AI](https://img.shields.io/badge/AI-Gemini-orange.svg)

## ✨ Características

- 🚀 **Progressive Web App (PWA)** - Instalable en dispositivos móviles y escritorio
- 🤖 **Integración con IA** - Análisis inteligente usando Google Gemini
- 📱 **Diseño Responsivo** - Optimizado para todos los dispositivos
- 🔄 **Sincronización Offline** - Funciona sin conexión a internet
- 📊 **Dashboard Interactivo** - Gráficos y estadísticas en tiempo real
- 📋 **Gestión Completa** - CRUD completo para productos, categorías y proveedores
- 📄 **Exportación de Datos** - PDF y Excel con un clic
- 🎨 **Interfaz Moderna** - Diseño limpio con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Lucide Icons
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS
- **AI Integration**: Google Gemini API
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: Vercel

## 🚀 Instalación y Uso

### Opción 1: Desarrollo Local (Recomendado)

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/jemiliano2001-blip/inventory-app.git
   cd inventory-app
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor local**:
   ```bash
   # Windows
   start_server.bat
   
   # O manualmente con Python
   python -m http.server 8000
   
   # O con Node.js
   npm run dev
   ```

4. **Abre en el navegador**: `http://localhost:8000`

### Opción 2: Despliegue en Vercel

1. **Conecta tu repositorio** a Vercel
2. **Configura las variables de entorno**:
   - `GEMINI_API_KEY`: Tu clave de API de Google Gemini
3. **Despliega automáticamente** con cada push

### Opción 3: Uso Directo

Puedes usar la aplicación directamente desde GitHub Pages o cualquier servidor web estático.

## 🔧 Configuración

### Variables de Entorno

Para usar la funcionalidad de IA, necesitas configurar:

```bash
# En tu archivo .env o variables de entorno de Vercel
GEMINI_API_KEY=tu_clave_de_api_aqui
```

### Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Configúrala en tu entorno de desarrollo o producción

## 📱 Instalación como PWA

1. Abre la aplicación en Chrome/Edge
2. Haz clic en el ícono de instalación en la barra de direcciones
3. O ve al menú → "Instalar aplicación"
4. ¡Disfruta de la experiencia nativa!

## 🎯 Funcionalidades Principales

### 📦 Gestión de Inventario
- Agregar, editar y eliminar productos
- Categorización automática con IA
- Control de stock y alertas de bajo inventario
- Búsqueda avanzada y filtros

### 📊 Dashboard Inteligente
- Gráficos de tendencias de inventario
- Análisis de productos más vendidos
- Estadísticas de categorías
- Alertas y notificaciones

### 🛒 Lista de Compras
- Generación automática basada en stock bajo
- Categorización inteligente
- Exportación a PDF/Excel

### 🤖 Análisis con IA
- Sugerencias de precios
- Predicción de demanda
- Optimización de inventario
- Análisis de tendencias

## 📁 Estructura del Proyecto

```
inventory-app/
├── api/
│   └── gemini.js          # Integración con Gemini AI
├── index.html             # Aplicación principal
├── manifest.json          # Configuración PWA
├── service-worker.js      # Service Worker para offline
├── package.json           # Dependencias y scripts
├── vercel.json           # Configuración de despliegue
├── start_server.bat      # Script de servidor local
└── README.md             # Documentación
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia aplicación
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reportar Problemas

Si encuentras algún problema, por favor:

1. Verifica que no esté ya reportado en [Issues](https://github.com/jemiliano2001-blip/inventory-app/issues)
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Capturas de pantalla si es necesario
   - Información del navegador/dispositivo

## 🎉 Agradecimientos

- [Google Gemini](https://ai.google.dev/) por la API de IA
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
- [Chart.js](https://www.chartjs.org/) por las librerías de gráficos
- [Vercel](https://vercel.com/) por el hosting

## 📞 Contacto

**Emiliano** - [@jemiliano2001-blip](https://github.com/jemiliano2001-blip)

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
