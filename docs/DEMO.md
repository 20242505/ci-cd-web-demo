# Guion de presentación, demostración y entrega

La consigna permite presentar un vídeo de YouTube **o** una presentación PowerPoint que explique el proceso paso a paso. Se entrega la [presentación PowerPoint](Presentacion-CI-CD-Enfoque.pptx); el guion siguiente también permite grabar un vídeo si se prefiere esa opción.

## Preparación

Antes de grabar, instala dependencias con `npm ci`, verifica `npm run check`, publica el repositorio y activa GitHub Pages. Ten abiertas la aplicación publicada, el repositorio, la pestaña Actions, el workflow y este informe. Oculta información privada y comprueba que el micrófono se escucha.

La demostración completa puede durar entre 4 y 6 minutos. Se puede pausar la grabación mientras termina una ejecución, indicando el tiempo de espera real.

## Guion del vídeo

| Tiempo aproximado | Mostrar | Explicar |
| --- | --- | --- |
| 0:00–0:30 | Portada y repositorio | Nombre, matrícula, objetivo y tecnologías. |
| 0:30–1:10 | Aplicación publicada | Crear una tarea, completarla, filtrar, recargar y eliminarla. |
| 1:10–1:50 | Estructura y pruebas | Separación de lógica/interfaz, ejemplo unitario y ejemplo de integración. |
| 1:50–2:25 | Terminal y cobertura | Ejecutar `npm run check`; mostrar resultados reales y reporte HTML. |
| 2:25–3:15 | Workflow y Actions | Explicar eventos, jobs `test → build → deploy`, dependencia y publicación solo desde `main`. |
| 3:15–4:20 | Pull request de demostración | Mostrar una prueba fallida que bloquea el build y la corrección que deja CI en verde. |
| 4:20–5:10 | Ejecución de `main` y Pages | Mostrar commit, las tres etapas correctas y abrir la URL desplegada. |
| 5:10–5:40 | Documentación y cierre | Mostrar guías, límites de persistencia y enlaces de entrega. |

Frase sugerida para explicar CI: «Cada cambio se comprueba automáticamente. Si una prueba falla o la cobertura baja del mínimo, las etapas dependientes no continúan».

Frase sugerida para explicar CD: «Cuando la revisión de main supera pruebas y build, GitHub Actions publica los archivos generados en GitHub Pages».

## Demostrar un fallo y su corrección

Realiza este ejercicio en una rama independiente. No lo hagas directamente en `main`.

```bash
git switch main
git pull --ff-only
git switch -c demo/fallo-controlado
```

1. Elige una aserción de una prueba unitaria existente y cambia temporalmente el resultado esperado por uno incorrecto. Por ejemplo, si una tarea se crea como pendiente, espera que esté completada.
2. Ejecuta `npm test` y muestra el fallo local.
3. Guarda el cambio, envía la rama y abre un pull request hacia `main`.

```bash
git add tests
git commit -m "Demuestra detección de una prueba fallida"
git push -u origin demo/fallo-controlado
```

4. Abre Actions. Muestra la prueba fallida, el build omitido y la ausencia de despliegue. Copia la URL de la ejecución como evidencia.
5. Restaura la aserción correcta, ejecuta `npm run check`, crea otro commit y envíalo a la misma rama.

```bash
git add tests
git commit -m "Restaura la aserción correcta"
git push
```

6. Muestra la nueva ejecución aprobada del pull request. El despliegue sigue omitido porque es una solicitud de incorporación.
7. Cierra el pull request de demostración si no contiene una mejora que deba integrarse. Para mostrar publicación, utiliza una ejecución correcta de `main` o integra una mejora real revisada; nunca integres el fallo intencional.

No desactives pruebas ni reduzcas los umbrales para lograr una ejecución correcta. Conserva los enlaces de ambos intentos en el informe.

## Lista de entrega

- [ ] Añadir autor o integrantes, matrícula y sección al informe.
- [x] Confirmar que el repositorio es público.
- [x] Confirmar que README y guías reflejan los comandos reales.
- [x] Adjuntar la URL del repositorio de GitHub.
- [x] Adjuntar una ejecución correcta de `main`, con pruebas, build y deploy.
- [x] Adjuntar la URL de GitHub Pages y comprobarla en un navegador.
- [x] Registrar resultados y porcentajes reales en el informe.
- [x] Conservar evidencia del fallo y recuperación del pipeline.
- [x] Preparar y revisar la presentación PowerPoint paso a paso, con capturas reales y notas de exposición.
- [ ] Solo si se elige vídeo: subirlo a YouTube con visibilidad que permita al docente verlo y comprobar el enlace desde otra sesión.
- [ ] Entregar la presentación o el enlace del vídeo, junto con la documentación Markdown.

## Enlaces para completar antes de entregar

| Entregable | Enlace comprobado |
| --- | --- |
| Repositorio GitHub | [20242505/ci-cd-web-demo](https://github.com/20242505/ci-cd-web-demo) |
| Aplicación publicada | [Enfoque en GitHub Pages](https://20242505.github.io/ci-cd-web-demo/) |
| Ejecución correcta | [Main: pruebas, build y deploy aprobados](https://github.com/20242505/ci-cd-web-demo/actions/runs/42506979620) |
| Ejecución fallida controlada | [PR #2: prueba fallida; build y deploy omitidos](https://github.com/20242505/ci-cd-web-demo/actions/runs/42507060493) |
| Ejecución corregida | [PR #2: 31 pruebas y build correctos; deploy omitido](https://github.com/20242505/ci-cd-web-demo/actions/runs/42507202230) |
| Presentación PowerPoint | [Presentación CI/CD Enfoque](Presentacion-CI-CD-Enfoque.pptx) |
| Vídeo de YouTube, opcional | Pendiente solo si se elige esta alternativa. |
