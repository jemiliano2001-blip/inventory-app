# 🔄 Auto-Commit y Push Automático a GitHub

Este proyecto está configurado para hacer commits y push automáticos a GitHub cada vez que se realizan cambios.

## ✅ Configuración Completada

Se han configurado los siguientes elementos:

### 1. **Git Hook Post-Commit** (Automático)
   - Archivo: `.git/hooks/post-commit.bat`
   - **Funcionamiento**: Cada vez que hagas un commit manual, automáticamente se hará push a GitHub
   - **No requiere acción**: Funciona automáticamente después de cada `git commit`

### 2. **Script de Commit Rápido**
   - Archivo: `commit-and-push.ps1`
   - **Uso rápido**:
     ```powershell
     .\commit-and-push.ps1 "Mensaje del commit"
     ```
   - O sin mensaje (usa timestamp automático):
     ```powershell
     .\commit-and-push.ps1
     ```

### 3. **Script Avanzado de Auto-Commit**
   - Archivo: `scripts/auto-commit.ps1`
   - **Uso**:
     ```powershell
     npm run auto-commit
     ```
   - O directamente:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/auto-commit.ps1
     ```

### 4. **Monitor de Cambios en Tiempo Real**
   - Archivo: `scripts/watch-changes.ps1`
   - **Uso**: Monitorea cambios cada 30 segundos y hace commit automático
     ```powershell
     npm run watch
     ```
   - O directamente:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/watch-changes.ps1
     ```

## 🚀 Formas de Usar

### Opción 1: Commit Manual con Push Automático (Recomendado)
```powershell
git add .
git commit -m "Tu mensaje"
# El push se hace automáticamente gracias al hook post-commit
```

### Opción 2: Script Rápido
```powershell
.\commit-and-push.ps1 "Descripción de los cambios"
```

### Opción 3: NPM Scripts
```powershell
npm run commit
```

### Opción 4: Monitoreo Continuo
```powershell
npm run watch
# Detecta cambios cada 30 segundos y hace commit/push automático
```

## ⚙️ Configuración de Git

Asegúrate de tener configurado tu usuario de Git:
```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## 📝 Notas

- El hook **post-commit** funciona solo con commits manuales (`git commit`)
- Los scripts verifican que haya cambios antes de hacer commit
- Los mensajes de commit automáticos incluyen timestamp
- Si hay errores en el push, se mostrará un mensaje de advertencia

## 🔧 Solución de Problemas

Si el push automático falla:
1. Verifica tu conexión a Internet
2. Confirma que tienes permisos en el repositorio
3. Revisa las credenciales de Git:
   ```powershell
   git config --list
   ```

Si necesitas deshabilitar el push automático temporalmente:
```powershell
mv .git/hooks/post-commit.bat .git/hooks/post-commit.bat.disabled
```

