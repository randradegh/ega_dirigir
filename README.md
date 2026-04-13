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

## Despliegue (Vercel)

La **producción** está en **[Vercel](https://vercel.com)** (sitio estático, sin paso de build). URL del proyecto:

**[https://egadirigircurso.vercel.app/](https://egadirigircurso.vercel.app/)**

**Repositorio que despliega Vercel (GitHub, privado):**  
[https://github.com/randradegh/ega_dirigir_curso](https://github.com/randradegh/ega_dirigir_curso)

Cada push a la rama configurada en Vercel (p. ej. `main`) suele disparar un nuevo despliegue.

### Repositorio vs. archivos en producción

Vercel solo publica lo que hay **en ese repo**. La landing completa necesita en la raíz (entre otros) `dirigir-inteligencias-landing.html`, `styles.css`, `main.js`, `form-config.js`, `index.html` y `expgrowai_logo_01.png`. Si el repositorio solo contiene parte de esos archivos, el sitio en **egadirigircurso.vercel.app** se verá incompleto (sin estilos, sin JS, etc.).

Puede haber **otro repositorio** usado solo para desarrollo o copia; lo importante es que el árbol de archivos que quieras en producción termine en **`ega_dirigir_curso`** (por ejemplo haciendo `git push` de esa carpeta al remoto correcto, o unificando en un solo remoto).

**Sincronizar este clon hacia el repo de Vercel** (ajusta si tu remoto ya se llama distinto):

```bash
git remote add vercel-prod https://github.com/randradegh/ega_dirigir_curso.git   # solo si aún no existe
git push vercel-prod main
```

La primera vez puede hacer falta **forzar alineación** si los historiales divergen (`git pull` con estrategia o, con cuidado, `git push --force-with-lease`); mejor pedir ayuda si no estás seguro de perder commits en el otro repo.

**Dominio propio:** si además usas un dominio personalizado (p. ej. **expgrowai.mx**), configúralo en Vercel → *Settings* → *Domains*.

**Ajustes típicos del proyecto en Vercel:**

- **Framework preset:** Other / sin framework.
- **Build command:** vacío (no hay compilación).
- **Root directory:** la raíz del repo (donde están `index.html` y el resto de archivos).

Los assets usan **rutas relativas** (`./styles.css`, `./main.js`, etc.); mantenlos en la misma estructura respecto a los HTML.

## Licencia

MIT — ver [LICENSE](LICENSE).
