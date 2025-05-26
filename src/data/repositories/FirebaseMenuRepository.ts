import { db } from '@/data/firebase/firebaseConfig';
import { doc, collection, getDocs, writeBatch, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';

const getPlatosCollectionRef = (uidRestaurante: string) => {
  return collection(db, `users/${uidRestaurante}/menu`);
};

export class FirebaseMenuRepository {
  async guardarMenu(uidRestaurante: string, platosData: Omit<MenuItem, 'id'>[]): Promise<void> {
    const platosCollection = getPlatosCollectionRef(uidRestaurante);
    const batch = writeBatch(db);

    platosData.forEach((plato) => {
      const newPlatoRef = doc(platosCollection); // Firestore genera el ID
      batch.set(newPlatoRef, plato);
    });
    await batch.commit();
  }

  async guardarPlato(uidRestaurante: string, platoData: Omit<MenuItem, 'id'>): Promise<string> {
    const platosCollection = getPlatosCollectionRef(uidRestaurante);
    const docRef = await addDoc(platosCollection, platoData);
    return docRef.id;
  }

  async obtenerMenu(uidRestaurante: string): Promise<MenuItem[]> {
    const platosCollection = getPlatosCollectionRef(uidRestaurante);
    const snapshot = await getDocs(platosCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<MenuItem, 'id'>), // El data() no incluye el id
    }));
  }

  async obtenerPlatoPorId(uidRestaurante: string, platoId: string): Promise<MenuItem | null> {
    const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);
    // O usando getPlatosCollectionRef: const platoDocRef = doc(getPlatosCollectionRef(uidRestaurante), platoId);
    const docSnap = await getDoc(platoDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<MenuItem, 'id'>) };
    } else {
      console.warn(`Plato con ID ${platoId} no encontrado para el restaurante ${uidRestaurante}`);
      return null;
    }
  }

  async actualizarPlato(uidRestaurante: string, platoId: string, datosPlato: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
    const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);
    // Asegurarse de no intentar actualizar el 'id' como un campo dentro del documento
    const dataToUpdate = { ...datosPlato };
    if ('id' in dataToUpdate) {
        delete (dataToUpdate as any).id; // No debería estar aquí si el tipo es Partial<Omit<MenuItem, 'id'>>
    }
    await updateDoc(platoDocRef, dataToUpdate);
  }

  async eliminarPlato(uidRestaurante: string, platoId: string): Promise<void> {
    const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);
    await deleteDoc(platoDocRef);
  }

    async eliminarVariosPlatos(uidRestaurante: string, platoIds: string[]): Promise<void> {
    if (platoIds.length === 0) return;

    const batch = writeBatch(db);
    platoIds.forEach(platoId => {
      const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);
      batch.delete(platoDocRef);
    });
    await batch.commit();
  }

}
