// src/data/firebase/converters/MenuItemConverter.ts (o un nombre similar)

import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions
} from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';

export const menuItemConverter = {
  /**
   * Convierte un objeto MenuItem a un documento plano para Firestore.
   * (No lo usaremos ahora, pero es bueno tenerlo para crear/actualizar)
   */
  toFirestore(menuItem: MenuItem): DocumentData {
    return {
      name: menuItem.name,
      price: menuItem.price,
      // ... etc.
     };
  },

  /**
   * Convierte un documento de Firestore a un objeto MenuItem.
   * Aquí es donde ocurre la magia de la validación y tipado.
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): MenuItem {
    const data = snapshot.data(options);

    // Validamos y asignamos valores por defecto para campos opcionales
    return {
      id: snapshot.id,
      name: data.name || 'Sin nombre', // Valor por defecto si falta el nombre
      price: typeof data.price === 'number' ? data.price : 0, // Asegura que el precio sea un número
      category: data.category || 'Sin categoría',
      description: Array.isArray(data.description) ? data.description : [], // Asegura que sea un array
      imageUrl: data.imageUrl || undefined,
      onPromo: data.onPromo ?? false, // Usa ?? para manejar `undefined` y `null`
      oldPrice: data.oldPrice || undefined,
      available: data.available ?? true, // Asume disponible si no se especifica
      uid: data.uid || '', // Asigna el UID
    };
  }
};
