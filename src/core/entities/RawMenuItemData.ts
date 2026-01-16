

import type { MenuItem } from './MenuItem';

/**
 * Representa los datos de un plato tal como vienen de una fuente externa (como un Excel),
 * antes de ser enriquecidos con datos internos como el 'uid' del restaurante.
 * Es un MenuItem pero sin 'id' y sin 'uid'.
 */
export type RawMenuItemData = Omit<MenuItem, 'id' | 'uid'>;
