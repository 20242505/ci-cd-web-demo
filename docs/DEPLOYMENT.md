# Guía de despliegue

## 1. Comprobar la copia local

Desde la raíz del proyecto:

```bash
npm ci
npm run check
npm run preview
```

Abre la dirección indicada por Vite y comprueba crear, completar, filtrar y eliminar tareas. Recarga la página para confirmar que se conservan. Cierra el servidor con `Ctrl+C` al terminar.

## 2. Crear el repositorio de GitHub

En GitHub crea un repositorio llamado `ci-cd-web-demo` bajo la cuenta que realizará la entrega. Selecciona **Public** para utilizar Pages con GitHub Free. Si publicarás desde la copia local, créalo vacío, sin generar otro README, licencia o `.gitignore`.

Los ejemplos siguientes usan `20242505`. Sustituye ese usuario y el nombre del repositorio si eliges otros. No ejecutes `git init` si tu copia ya es un repositorio.

```bash
git init -b main
git add .
git commit -m "Implementa aplicación y pipeline CI/CD"
git remote add origin https://github.com/20242505/ci-cd-web-demo.git
git push -u origin main
```

Si `origin` ya existe, comprueba su destino con `git remote -v` antes de cambiarlo. Para autenticarte, utiliza el acceso de GitHub configurado en tu equipo. No incluyas credenciales en la dirección remota.

## 3. Activar GitHub Pages

1. Abre **Settings → Pages** en el repositorio.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Abre la pestaña **Actions** y selecciona el workflow del proyecto.
4. Si el primer intento ocurrió antes de activar Pages, ejecuta **Run workflow** sobre `main` o vuelve a ejecutar el intento fallido.
5. Espera a que `test`, `build` y `deploy` terminen correctamente.

El entorno de despliegue se llama `github-pages`. Si existen reglas de aprobación o restricciones de ramas, autoriza `main` o cumple la regla correspondiente. No añadas secretos personales: las acciones de Pages utilizan la autorización temporal proporcionada por GitHub.

## 4. Verificar la publicación

La URL prevista con los nombres de ejemplo es:

```text
https://20242505.github.io/ci-cd-web-demo/
```

La dirección definitiva aparece en la etapa de despliegue y en **Settings → Pages**. Abre esa URL, comprueba las interacciones de la aplicación y recarga. Si solo aparece el HTML sin estilos o hay errores 404 en los recursos, revisa las rutas de build y la opción `base` de Vite. Este proyecto utiliza `base: './'`, con recursos relativos para admitir la subcarpeta del repositorio.

Guarda en el [informe](IMPLEMENTATION_REPORT.md#evidencias) la URL del repositorio, la ejecución terminada, el commit comprobado y la URL publicada. Una ejecución local satisfactoria no demuestra que GitHub Pages haya publicado el sitio.

## 5. Publicar cambios posteriores

Trabaja en una rama, abre un pull request y comprueba que el workflow finaliza correctamente. Después de integrar en `main`, GitHub Actions vuelve a validar y publica la nueva versión. El resultado de un pull request no se publica en Pages.

## Recuperar una versión anterior

Si una versión publicada contiene un error funcional, identifica el commit que lo introdujo y crea un commit de reversión:

```bash
git switch main
git pull --ff-only
git revert SHA_DEL_COMMIT
git push origin main
```

Sustituye `SHA_DEL_COMMIT` por el identificador real. Si `main` está protegida, realiza la reversión en una rama y abre un pull request. El pipeline validará y publicará la reversión. Evita reescribir el historial para esta recuperación.

## Problemas frecuentes

| Síntoma | Comprobación |
| --- | --- |
| `npm ci` falla | Confirmar versión de Node y que `package.json` coincide con `package-lock.json`. |
| Coverage no alcanza el mínimo | Revisar `coverage/index.html` y cubrir comportamientos faltantes. |
| Pages no está habilitado | Seleccionar GitHub Actions en Settings → Pages. |
| Error de permisos en deploy | Revisar `pages: write`, `id-token: write` y reglas del entorno. |
| Deploy aparece omitido | Confirmar evento y rama: solo se publica desde `main`. |
| URL devuelve 404 | Esperar a la primera publicación correcta y comprobar usuario, repositorio y URL de la ejecución. |
| Faltan estilos o scripts | Revisar las rutas generadas y `base` de Vite. |

## Referencias

- [Configurar workflows de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vite y GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
