# 📦 Sistema de Gestión de Inventario Empresarial

Sistema interno de gestión de inventario con integración de IA para uso exclusivo de la empresa.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Private](https://img.shields.io/badge/access-private-red.svg)
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

## 🚀 Instalación y Uso Interno

### Desarrollo Local

1. **Clona el repositorio**:
   ```bash
   git clone [URL_PRIVADA_DEL_REPOSITORIO]
   cd inventory-app
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   ```bash
   # Crear archivo .env
   GEMINI_API_KEY=tu_clave_de_api_aqui
   ```

4. **Inicia el servidor local**:
   ```bash
   # Windows
   start_server.bat
   
   # O manualmente con Python
   python -m http.server 8000
   
   # O con Node.js
   npm run dev
   ```

5. **Abre en el navegador**: `http://localhost:8000`

### Despliegue en Producción

El sistema está configurado para desplegarse automáticamente en Vercel cuando se hace push a la rama principal.

## 🔧 Configuración Interna

### Variables de Entorno Requeridas

```bash
GEMINI_API_KEY=tu_clave_de_api_de_gemini
```

### Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Configúrala en Vercel o en tu archivo .env local

## 📱 Instalación como PWA

1. Abre la aplicación en Chrome/Edge
2. Haz clic en el ícono de instalación en la barra de direcciones
3. O ve al menú → "Instalar aplicación"
4. ¡Disfruta de la experiencia nativa!

## 🎯 Funcionalidades del Sistema

### 📦 Gestión de Inventario
- Agregar, editar y eliminar productos
- Categorización automática con IA
- Control de stock y alertas de bajo inventario
- Búsqueda avanzada y filtros

### 📊 Dashboard Empresarial
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
npm run serve        # Servidor Python local
npm run serve:node   # Servidor Node.js local
npm run serve:win    # Servidor Windows batch
npm run deploy       # Despliega a producción
```

## 🔒 Seguridad y Acceso

- **Repositorio Privado**: Solo accesible para miembros autorizados de la empresa
- **API Keys**: Configuradas como variables de entorno seguras
- **PWA**: Funciona offline sin comprometer datos sensibles
- **Datos Locales**: Almacenados en IndexedDB del navegador

## 📞 Soporte Interno

Para soporte técnico o reportar problemas, contactar al equipo de desarrollo interno.

---

**⚠️ CONFIDENCIAL**: Este sistema es de uso exclusivo interno de la empresa.
