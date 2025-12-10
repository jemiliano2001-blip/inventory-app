# Configuración de Variables de Entorno

Este proyecto usa variables de entorno para la configuración de Firebase. Sigue estos pasos para configurarlo:

## 1. Configuración Local

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y completa los valores de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aqui
   VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
   VITE_FIREBASE_APP_ID=tu_app_id_aqui
   VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id_aqui
   ```

## 2. Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable con el prefijo `VITE_`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
4. Selecciona los ambientes donde aplicar (Production, Preview, Development)
5. Haz clic en **Save**

## 3. Obtener las Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️)
4. En la sección **Your apps**, selecciona tu app web
5. Copia los valores de configuración a tu archivo `.env.local`

## Nota Importante

- **NUNCA** hagas commit del archivo `.env.local` a git
- El archivo `.env.local` ya está en `.gitignore`
- Si no configuras las variables de entorno, el código usará valores por defecto (solo para compatibilidad durante la migración)

