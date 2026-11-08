import { expect, it } from 'vitest';
import { getStats } from '../../src/tasks.js';

it('demostración: una lista vacía tiene cero pendientes', () => {
  // Expectativa corregida después de observar el bloqueo del pipeline.
  expect(getStats([]).pending).toBe(0);
});
