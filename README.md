# Veloxiam Widget

Script del widget de chat Amelie para embeber en cualquier web (CDN).

## Archivo

- `amelie-webchat.js` — script autocontenido (sin dependencias). Publicar en tu CDN o servidor estático bajo la ruta que uses (ej. `https://cdn.tudominio.com/veloxiam-widget/amelie-webchat.js`).

## Uso

```html
<script src="https://cdn.tudominio.com/veloxiam-widget/amelie-webchat.js"></script>
<script>
  AmelieWebchat.init({
    botId: 'uuid-del-bot',
    token: 'virtualKey-del-bot',
    apiUrl: 'https://api.tudominio.com/api/v1',
    position: 'bottom-right',
    title: 'Chat',
    placeholder: 'Escribe un mensaje...'
  });
</script>
```

## Opciones

| Parámetro    | Requerido | Descripción                                      |
|-------------|-----------|--------------------------------------------------|
| `botId`     | Sí        | UUID del bot                                     |
| `token`     | Sí        | virtualKey del bot (token de webchat)            |
| `apiUrl`    | Sí        | Base de la API (ej. `https://api.tudominio.com/api/v1`) |
| `position`  | No        | `bottom-right`, `bottom-left`, `top-left`, `top-right` (default: `bottom-right`) |
| `title`     | No        | Título del panel de chat                         |
| `placeholder` | No     | Placeholder del input                            |

## API

- `AmelieWebchat.init(config)` — Inicializa el widget. Devuelve `{ open, close, destroy }` o `null` si faltan botId/token.
- `AmelieWebchat.destroy()` — Elimina el widget de la página.
