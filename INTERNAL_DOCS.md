# Sistema de Gestión de Inventario - Documentación Interna

## 🔒 Acceso Restringido

Este documento es de uso exclusivo interno de la empresa. Contiene información confidencial sobre el sistema de gestión de inventario.

## 📋 Información del Sistema

- **Nombre**: Sistema de Gestión de Inventario Empresarial
- **Versión**: 1.0.0
- **Tipo**: Progressive Web App (PWA)
- **Acceso**: Solo personal autorizado
- **Despliegue**: Vercel (privado)

## 🚀 Instalación y Configuración

### Requisitos del Sistema
- Node.js 22.x
- Python 3.x (para servidor local)
- Navegador moderno con soporte PWA

### Configuración de Variables de Entorno
```bash
GEMINI_API_KEY=clave_de_api_de_gemini
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo con Vercel
npm run serve        # Servidor Python local
npm run serve:win    # Servidor Windows batch
npm run audit        # Auditoría de seguridad
npm run deploy       # Despliegue a producción
```

## 🔐 Seguridad

- Repositorio privado en GitHub
- API keys como variables de entorno
- Datos almacenados localmente en IndexedDB
- Sin transmisión de datos sensibles

## 📞 Soporte

Para soporte técnico interno, contactar al equipo de desarrollo.

---
**CONFIDENCIAL** - Solo para uso interno de la empresa
