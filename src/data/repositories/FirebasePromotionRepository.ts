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
  orderBy, // Opcional, para ordenar
} from 'firebase/firestore';
import { db } from '@/data/firebase/firebaseConfig';
import { ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/data/firebase/firebaseConfig';



export class FirebasePromotionRepository implements PromotionRepository {
  private uid: string;
  private collectionRef;

  constructor(uid?: string) {
    if (!uid) {
      throw new Error("Se requiere un UID de restaurante para inicializar PromotionRepository.");
    }
    this.uid = uid;
    // Definimos la referencia a la colección una vez en el constructor
    this.collectionRef = collection(db, `users/${this.uid}/promotions`);
  }

  private cleanUndefinedFields(data: Record<string, any>): Record<string, any> {
    const cleanedData: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
        cleanedData[key] = data[key];
      }
    }
    return cleanedData;
  }

  async create(promotionData: Omit<Promotion, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collectionRef, promotionData);
    return docRef.id;
  }

  async getAll(): Promise<Promotion[]> {
    const q = query(this.collectionRef, orderBy('startDate', 'desc')); // Ordenar por fecha de inicio descendente

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Promotion, 'id'>),
    }));
  }

  async getById(promotionId: string): Promise<Promotion | null> {
    const promoDocRef = doc(this.collectionRef, promotionId);
    const docSnap = await getDoc(promoDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Promotion, 'id'>) };
    }
    return null;
  }

  async update(promotionId: string, promotionData: Partial<Omit<Promotion, 'id'>>, imageFile: File | null): Promise<void> {
    const promoDocRef = doc(this.collectionRef, promotionId);

    // Usamos tu función de limpieza para los datos que vienen del formulario
    const dataToUpdate = this.cleanUndefinedFields(promotionData);

    // --- LÓGICA PARA MANEJAR LA ACTUALIZACIÓN DE LA IMAGEN ---
    if (imageFile) {
      console.log("Actualizando imagen de la promoción...");

      // 1. Obtener el documento actual para saber si hay una imagen antigua que borrar
      const docSnap = await getDoc(promoDocRef);
      if (docSnap.exists()) {
        const currentPromoData = docSnap.data() as Promotion;
        if (currentPromoData.imageUrl) {
          try {
            // Crea una referencia a partir de la URL de la imagen antigua y la borra
            const oldImageRef = storageRef(storage, currentPromoData.imageUrl);
            await deleteObject(oldImageRef);
            console.log("Imagen antigua de la promoción eliminada de Storage.");
          } catch (error: any) {
            // Si la imagen no se encuentra (ya fue borrada, o la URL es incorrecta), no detengas la operación
            if (error.code !== 'storage/object-not-found') {
              console.error("Error al eliminar la imagen antigua de la promoción:", error);
            }
          }
        }
      }

      // 2. Subir la nueva imagen a Firebase Storage
      // Usamos una ruta consistente para las imágenes de las promociones
      const imagePath = `users/${this.uid}/promotions_images/${promotionId}_${Date.now()}`;
      const newImageRef = storageRef(storage, imagePath);
      await uploadBytes(newImageRef, imageFile);

      // 3. Obtener la URL de descarga de la nueva imagen
      const newImageUrl = await getDownloadURL(newImageRef);

      // 4. Añadir la nueva URL al objeto de datos que se va a actualizar
      dataToUpdate.imageUrl = newImageUrl;
      console.log("Nueva imagen de promoción subida. URL:", newImageUrl);
    }

    // Solo actualiza si hay algo que cambiar
    if (Object.keys(dataToUpdate).length > 0) {
      await updateDoc(promoDocRef, dataToUpdate);
      console.log("Documento de la promoción actualizado en Firestore.");
    } else {
      console.log("No hay datos que actualizar en Firestore.");
    }
  }

  async delete(promotionId: string): Promise<void> {
    const promoDocRef = doc(this.collectionRef, promotionId);

    // Opcional pero muy recomendado: borrar la imagen de la promoción de Storage
    const docSnap = await getDoc(promoDocRef);
    if (docSnap.exists()) {
      const promoData = docSnap.data() as Promotion;
      if (promoData.imageUrl) {
        try {
          const imageRef = storageRef(storage, promoData.imageUrl);
          await deleteObject(imageRef);
          console.log(`Imagen de la promoción ${promotionId} eliminada de Storage.`);
        } catch (error: any) {
          if (error.code !== 'storage/object-not-found') {
            console.error("Error al eliminar la imagen de la promoción de Storage:", error);
          }
        }
      }
    }

    await deleteDoc(promoDocRef);
  }
}
