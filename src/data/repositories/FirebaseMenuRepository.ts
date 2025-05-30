import { db } from '@/data/firebase/firebaseConfig';
import { doc, collection, getDocs, writeBatch, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';

const getPlatosCollectionRef = (uidRestaurante: string) => {
  return collection(db, `users/${uidRestaurante}/menu`);
};

export class FirebaseMenuRepository {
  async guardarMenu(uidRestaurante: string, platosData: Omit<MenuItem, 'id'>[]): Promise<void> {
    console.log("[guardarMenu] Iniciando. Número de platos a procesar:", platosData.length);
    const platosCollection = getPlatosCollectionRef(uidRestaurante);
    const batch = writeBatch(db);

    platosData.forEach((platoOriginal, index) => {
      const newPlatoRef = doc(platosCollection); // Firestore genera el ID
      console.log(`[guardarMenu] Procesando platoOriginal ${index + 1}:`, JSON.stringify(platoOriginal)); // Log del objeto original

      const platoParaGuardar: { [key: string]: any } = {};
      (Object.keys(platoOriginal) as Array<keyof typeof platoOriginal>).forEach(key => {
        const valor = platoOriginal[key];
        if (valor !== undefined) {
          platoParaGuardar[key] = valor;
        } else {
          // Log si se omite un campo undefined
          console.log(`[guardarMenu] Plato ${index + 1}: Omitiendo campo '${key}' porque es undefined.`);
        }
      });

      // --- LOG CRUCIAL ANTES DEL SET ---
      console.log(`[guardarMenu] Objeto FINAL para batch.set() para plato ${index + 1} (doc ID ${newPlatoRef.id}):`, JSON.stringify(platoParaGuardar));
      // También puedes loguear directamente el objeto si la consola lo expande bien:
      // console.log(`[guardarMenu] Objeto FINAL para batch.set() para plato ${index + 1}:`, platoParaGuardar);

      // VERIFICA SI 'imageUrl' ESTÁ PRESENTE Y ES UNDEFINED EN EL LOG ANTERIOR
      if (platoParaGuardar.imageUrl === undefined && Object.prototype.hasOwnProperty.call(platoParaGuardar, 'imageUrl')) {
          console.error(`[guardarMenu] ¡ALERTA! imageUrl es undefined en platoParaGuardar para el plato ${index + 1} pero la propiedad existe.`);
      }


      try {
        batch.set(newPlatoRef, platoParaGuardar);
      } catch (e) {
        console.error("[guardarMenu] Error DENTRO de batch.set() (esto no debería pasar si la limpieza funciona):", e);
        console.error("[guardarMenu] Objeto que causó error en batch.set:", JSON.stringify(platoParaGuardar));
        throw e; // Re-lanza para que el catch general lo maneje
      }
    });

    try {
      console.log("[guardarMenu] Intentando batch.commit()...");
      await batch.commit();
      console.log("[guardarMenu] Batch commit exitoso.");
    } catch (e) {
      console.error("[guardarMenu] Error durante batch.commit():", e);
      throw e; // Re-lanza
    }
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
