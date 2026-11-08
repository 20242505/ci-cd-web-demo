import { expect, it } from 'vitest';
import { getStats } from '../../src/tasks.js';

it('demostración: el pipeline detecta una expectativa incorrecta', () => {
  // Fallo intencional de la demostración, aislado de main.
  expect(getStats([]).pending).toBe(1);
});
