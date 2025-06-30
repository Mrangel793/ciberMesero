// src/data/repositories/FirebasePromotionRepository.ts
import type { Promotion } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy, // Opcional, para ordenar
} from 'firebase/firestore';
import { db } from '@/data/firebase/firebaseConfig';

const PROMOTIONS_COLLECTION = 'promotions';

export class FirebasePromotionRepository implements PromotionRepository {
  private cleanUndefinedFields(data: Record<string, any>): Record<string, any> {
    const cleanedData: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
        cleanedData[key] = data[key];
      }
    }
    return cleanedData;
  }

  async create(uidRestaurante: string, promotionData: Omit<Promotion, 'id' | 'restaurantName'>): Promise<string> {
    const dataToSave = this.cleanUndefinedFields({
      ...promotionData,
      restaurantId: uidRestaurante, // Asegura que el restaurantId se guarde
      // restaurantName podrías obtenerlo aquí si tienes una función para ello, o en el UseCase
    });
    const promotionsCollection = collection(db, PROMOTIONS_COLLECTION);
    const docRef = await addDoc(promotionsCollection, dataToSave);
    return docRef.id;
  }

  async getAll(uidRestaurante?: string): Promise<Promotion[]> {
    const promotionsCollection = collection(db, PROMOTIONS_COLLECTION);
    let q = query(promotionsCollection, orderBy('startDate', 'desc')); // Ejemplo de ordenación

    if (uidRestaurante) {
      q = query(promotionsCollection, where('restaurantId', '==', uidRestaurante), orderBy('startDate', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Promotion, 'id'>),
    }));
  }

  async getById(promotionId: string): Promise<Promotion | null> {
    const promoDocRef = doc(db, PROMOTIONS_COLLECTION, promotionId);
    const docSnap = await getDoc(promoDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Promotion, 'id'>) };
    }
    return null;
  }

  async update(promotionId: string, promotionData: Partial<Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName'>>): Promise<void> {
    const promoDocRef = doc(db, PROMOTIONS_COLLECTION, promotionId);
    const dataToUpdate = this.cleanUndefinedFields(promotionData);
    if (Object.keys(dataToUpdate).length > 0) { // Solo actualiza si hay algo que cambiar
        await updateDoc(promoDocRef, dataToUpdate);
    }
  }

  async delete(promotionId: string): Promise<void> {
    const promoDocRef = doc(db, PROMOTIONS_COLLECTION, promotionId);
    await deleteDoc(promoDocRef);
  }
}
