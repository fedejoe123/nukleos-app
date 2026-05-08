# Núkleos Quiropraxia — App

Aplicación de gestión de sesiones para tablet.

## Estructura

```
nukleos-app/
├── index.html      ← entrada principal
├── App.jsx         ← toda la lógica de la app
├── manifest.json   ← configuración PWA
├── sw.js           ← service worker (offline)
└── README.md
```

## Cómo subir a GitHub Pages

1. Crear repositorio en GitHub llamado `nukleos-app`
2. Subir todos estos archivos
3. Ir a Settings → Pages → Source: `main` branch, carpeta `/root`
4. La app queda en: `https://TU-USUARIO.github.io/nukleos-app`

## Instalación en tablet

**iPad:**
1. Abrir Safari → ir a la URL
2. Botón compartir → "Añadir a pantalla de inicio"

**Android:**
1. Abrir Chrome → ir a la URL
2. Tres puntos → "Añadir a pantalla de inicio"

## Credenciales Google

- Client ID OAuth configurado en App.jsx
- Sheet ID configurado en App.jsx
- Cuenta autorizada: nukleos.quiropraxia@gmail.com
- Colaborador: federico.vivori@gmail.com

## Google Cloud Console

Asegurarse de tener estos URIs autorizados:
- Orígenes JS: `https://TU-USUARIO.github.io`
- Redirect URIs: `https://TU-USUARIO.github.io/nukleos-app`
