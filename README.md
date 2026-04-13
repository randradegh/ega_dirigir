# Dirigir Inteligencias — landing (Exponential Grow AI)

Sitio estático de la landing del programa **Dirigir Inteligencias** (Exponential Grow AI). Incluye la ficha del curso, el programa por sesiones y un formulario de contacto que envía mensajes mediante [Web3Forms](https://web3forms.com).

## Contenido del repositorio

| Archivo | Descripción |
|--------|-------------|
| `index.html` | Redirección canónica a la landing principal. |
| `dirigir-inteligencias-landing.html` | Página principal del sitio. |
| `styles.css` | Estilos globales. |
| `main.js` | Acordeón de sesiones, animaciones al scroll y envío del formulario. |
| `form-config.js` | Clave pública de Web3Forms (`WEB3FORMS_ACCESS_KEY`). |
| `expgrowai_logo_01.png` | Logo (referenciado en la landing). |

## Vista previa local

Sirve la carpeta con cualquier servidor estático. Por ejemplo:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080/dirigir-inteligencias-landing.html` (o `http://localhost:8080/` si el índice redirige correctamente).

## Formulario de contacto (Web3Forms)

1. Crea una access key en [web3forms.com](https://web3forms.com) asociada al correo donde quieres recibir los envíos.
2. Edita `form-config.js` y asigna la clave a `window.WEB3FORMS_ACCESS_KEY`.

La clave es pública (pensada para el cliente); no obstante, conviene no compartir commits con claves de entornos que ya no uses.

## Despliegue

Cualquier hosting de archivos estáticos sirve (GitHub Pages, Netlify, Vercel, S3, etc.). Asegúrate de que la ruta de la landing sea la que uses como entrada pública y de que `form-config.js` y el resto de assets carguen con rutas relativas como en el proyecto.

## Licencia

MIT — ver [LICENSE](LICENSE).
