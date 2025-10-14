import { db, storage } from '@/data/firebase/firebaseConfig';
import { doc, collection, getDocs, writeBatch, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { menuItemConverter } from '../firebase/convertes/MenuItemConverter';
import { MenuItemMapper } from '@/data/mappers';
import { NotFoundError, RepositoryError, ValidationError } from '@/core/errors';

export class FirebaseMenuRepository {
  private uid: string;
  private platosCollectionRef;

  constructor(uid?: string) {
    if (!uid) {
      throw new ValidationError("UID del restaurante es requerido para FirebaseMenuRepository.", 'uid');
    }
    this.uid = uid;
    this.platosCollectionRef = collection(db, `users/${this.uid}/platos`);
  }

  async guardarMenu(platosData: Omit<MenuItem, 'id'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const plato of platosData) {
        const newDocRef = doc(this.platosCollectionRef);
        // Usar mapper para convertir a formato Firestore
        const firestoreData = MenuItemMapper.toFirestore({ ...plato, id: '' } as MenuItem);
        batch.set(newDocRef, firestoreData);
      }
      await batch.commit();
    } catch (error) {
      throw new RepositoryError(
        'Error al guardar menú en batch',
        'guardarMenu',
        error as Error
      );
    }
  }


  async guardarPlato(platoData: Omit<MenuItem, 'id'>): Promise<string> {
    try {
      // Usar mapper para convertir a formato Firestore (filtra undefined automáticamente)
      const firestoreData = MenuItemMapper.toFirestore({ ...platoData, id: '' } as MenuItem);
      const docRef = await addDoc(this.platosCollectionRef, firestoreData);
      return docRef.id;
    } catch (error) {
      throw new RepositoryError(
        'Error al guardar plato',
        'guardarPlato',
        error as Error
      );
    }
  }

  async obtenerMenu(): Promise<MenuItem[]> {
    try {
      const snapshot = await getDocs(this.platosCollectionRef);
      // Usar mapper para convertir documentos de Firestore a entidades
      return snapshot.docs.map(doc => MenuItemMapper.fromFirestore(doc.data(), doc.id));
    } catch (error) {
      throw new RepositoryError(
        'Error al obtener menú',
        'obtenerMenu',
        error as Error
      );
    }
  }

  async obtenerPlatoPorId(platoId: string): Promise<MenuItem | null> {
    try {
      const platoDocRef = doc(this.platosCollectionRef, platoId);
      const docSnap = await getDoc(platoDocRef);

      if (docSnap.exists()) {
        // Usar mapper para convertir documento de Firestore a entidad
        return MenuItemMapper.fromFirestore(docSnap.data(), docSnap.id);
      } else {
        throw new NotFoundError('MenuItem', platoId);
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError(
        `Error al obtener plato con ID ${platoId}`,
        'obtenerPlatoPorId',
        error as Error
      );
    }
  }

  async actualizarPlato(
    platoId: string,
    datosPlato: Partial<Omit<MenuItem, 'id'>>,
    imageFile: File | null
  ): Promise<void> {
    try {
      const platoDocRef = doc(this.platosCollectionRef, platoId);

      // Verificar que el plato existe
      const platoActualSnap = await getDoc(platoDocRef);
      if (!platoActualSnap.exists()) {
        throw new NotFoundError('MenuItem', platoId);
      }

      // Usar mapper para convertir datos de actualización a formato Firestore
      const dataToUpdate: { [key: string]: any } = {};
      Object.keys(datosPlato).forEach(key => {
        const valor = datosPlato[key as keyof typeof datosPlato];
        if (valor !== undefined && key !== 'imageUrl') {
          dataToUpdate[key] = valor;
        }
      });

      // Procesar imagen si se proporcionó
      if (imageFile) {
        console.log("Procesando nueva imagen...");

        // Eliminar imagen antigua si existe
        const platoActualData = platoActualSnap.data();
        if (platoActualData?.imageUrl) {
          try {
            const oldImageRef = ref(storage, platoActualData.imageUrl);
            await deleteObject(oldImageRef);
            console.log("Imagen antigua eliminada");
          } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
              console.warn("No se pudo eliminar imagen antigua:", error);
            }
          }
        }

        // Subir nueva imagen
        const imagePath = `users/${this.uid}/platos_images/${platoId}_${Date.now()}`;
        const storageRef = ref(storage, imagePath);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(uploadResult.ref);

        dataToUpdate.imageUrl = downloadURL;
        console.log("Nueva imagen subida. URL:", downloadURL);
      }

      // Eliminar campo 'id' si está presente
      if ('id' in dataToUpdate) {
        delete (dataToUpdate as any).id;
      }

      console.log("Actualizando documento:", dataToUpdate);
      await updateDoc(platoDocRef, dataToUpdate);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError(
        `Error al actualizar plato con ID ${platoId}`,
        'actualizarPlato',
        error as Error
      );
    }
  }

  async eliminarPlato(platoId: string): Promise<void> {
    try {
      const platoDocRef = doc(this.platosCollectionRef, platoId);

      // Verificar que existe antes de eliminar
      const docSnap = await getDoc(platoDocRef);
      if (!docSnap.exists()) {
        throw new NotFoundError('MenuItem', platoId);
      }

      await deleteDoc(platoDocRef);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError(
        `Error al eliminar plato con ID ${platoId}`,
        'eliminarPlato',
        error as Error
      );
    }
  }

  async eliminarVariosPlatos(platoIds: string[]): Promise<void> {
    if (platoIds.length === 0) return;

    try {
      const batch = writeBatch(db);
      platoIds.forEach(platoId => {
        const platoDocRef = doc(this.platosCollectionRef, platoId);
        batch.delete(platoDocRef);
      });
      await batch.commit();
    } catch (error) {
      throw new RepositoryError(
        'Error al eliminar múltiples platos',
        'eliminarVariosPlatos',
        error as Error
      );
    }
  }

}
