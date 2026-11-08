# Guía de contribución

## Preparar el entorno

1. Instala Node.js 22.19 o posterior, npm y Git. Para reproducir el entorno del pipeline, utiliza la versión 22.
2. Clona el repositorio o crea un fork si no tienes permiso de escritura.
3. Ejecuta `npm ci` y `npm run dev`.

No edites `dist/`, `coverage/` ni `node_modules/`: son archivos generados y están excluidos de Git.

## Trabajar en una rama

```bash
git switch main
git pull --ff-only
git switch -c mejora/descripcion-breve
```

Mantén cada cambio enfocado en un objetivo. Separa la lógica de tareas del acceso al DOM y evita modificar los arreglos o tareas recibidos por las funciones de lógica. Para mostrar texto introducido por el usuario utiliza `textContent`, evitando insertarlo como HTML.

## Comprobar los cambios

```bash
npm run check
```

Añade o actualiza pruebas cuando cambies un comportamiento. La cobertura debe mantenerse en al menos 90 % en las cuatro métricas configuradas. Comprueba también el resultado de producción con `npm run preview`, incluyendo móvil, teclado, filtros y persistencia después de recargar.

Si cambias dependencias, utiliza npm y entrega también `package-lock.json`. No añadas claves, contraseñas, tokens ni archivos `.env` con datos privados.

## Abrir una solicitud de incorporación

```bash
git add .
git commit -m "Describe el cambio realizado"
git push -u origin mejora/descripcion-breve
```

Abre un pull request hacia `main`. Explica el comportamiento modificado, la razón y cómo lo comprobaste. Adjunta una captura si cambia la interfaz. El workflow ejecutará pruebas, cobertura y build sin publicar el contenido de la rama.

Antes de integrar, revisa que el workflow esté en verde y que la documentación refleje el cambio. Cuando se integre en `main`, el pipeline publicará la nueva versión si todas las etapas terminan correctamente. La protección de rama es una configuración opcional del repositorio: el archivo del workflow por sí solo no impide que una persona integre una solicitud con comprobaciones fallidas.

## Comunicar un problema

Incluye los pasos para reproducirlo, el resultado esperado, el resultado obtenido y la versión de Node o navegador utilizada. Para problemas del pipeline añade la URL de la ejecución y el nombre de la etapa fallida; nunca publiques credenciales en los registros.
