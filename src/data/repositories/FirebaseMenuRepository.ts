import { db } from '@/data/firebase/firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import type { MenuItem } from '@/core/interfaces/MenuItem';

export class FirebaseMenuRepository {
  async guardarMenu(uidRestaurante: string, menuItems: MenuItem[]): Promise<void> {
    const batchPromises = menuItems.map(item => {

      const sanitizedItem = {
        ...item,
        oldPrice: item.oldPrice ?? null,
        image: item.image ?? '',
      };

      const docRef = doc(collection(db, 'users', uidRestaurante, 'menu'), String(item.id));
      return setDoc(docRef, sanitizedItem);
    });

    await Promise.all(batchPromises);
  }

  async guardarPlato(uidRestaurante: string, plato: MenuItem): Promise<void> {
    const docRef = doc(collection(db, 'users', uidRestaurante, 'menu'), String(plato.id))
    await setDoc(docRef, {
      ...plato,
      oldPrice: plato.oldPrice ?? null,
      image: plato.image ?? ''
    })
  }

}
