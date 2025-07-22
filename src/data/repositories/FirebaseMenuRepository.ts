import { db, storage } from '@/data/firebase/firebaseConfig';
import { doc, collection, getDocs, writeBatch, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { menuItemConverter } from '../firebase/convertes/MenuItemConverter';

export class FirebaseMenuRepository {
  private uid: string;
  private platosCollectionRef;

  constructor(uid?: string) {
    if (!uid) {
      throw new Error("UID del restaurante es requerido para FirebaseMenuRepository.");
    }
    this.uid = uid;
    this.platosCollectionRef = collection(db, `users/${this.uid}/platos`);
  }

  async guardarMenu(platosData: Omit<MenuItem, 'id'>[]): Promise<void> {
    const batch = writeBatch(db);
    for (const plato of platosData) {
      const newDocRef = doc(this.platosCollectionRef); // Firestore genera la ref
      batch.set(newDocRef, plato);
    }
    await batch.commit();
  }


  async guardarPlato(platoData: Omit<MenuItem, 'id'>): Promise<string> {
    const platoParaGuardar: { [key: string]: any } = {};
    Object.keys(platoData).forEach(key => {
      const valor = platoData[key as keyof typeof platoData];
      if (valor !== undefined) {
        platoParaGuardar[key] = valor;
      }
    });
    const docRef = await addDoc(this.platosCollectionRef, platoParaGuardar);
    return docRef.id;
  }

  async obtenerMenu(): Promise<MenuItem[]> {
    const q = this.platosCollectionRef.withConverter(menuItemConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }

  async obtenerPlatoPorId(platoId: string): Promise<MenuItem | null> {
    const platoDocRef = doc(this.platosCollectionRef, platoId);
    const docSnap = await getDoc(platoDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<MenuItem, 'id'>) };
    } else {
      console.warn(`Plato con ID ${platoId} no encontrado.`);
      return null;
    }
  }

  async actualizarPlato(
    platoId: string,
    datosPlato: Partial<Omit<MenuItem, 'id'>>,
    imageFile: File | null
  ): Promise<void> {

    // La ruta a tu documento parece ser 'users/.../platos/...' según tu código. La mantendré.
    const platoDocRef = doc(this.platosCollectionRef, platoId);

    // 1. Prepara el objeto de actualización SIN la propiedad 'imageUrl'
    //    para evitar el error de 'undefined'.
    const { imageUrl: _imageUrl, ...otrosDatos } = datosPlato;
    const dataToUpdate: { [key: string]: any } = { ...otrosDatos };

    // 2. Si se proporcionó un nuevo archivo de imagen, lo procesamos.
    if (imageFile) {
      console.log("Se ha proporcionado una nueva imagen. Procesando...");

      // Opcional pero recomendado: Eliminar la imagen antigua para ahorrar espacio
      const platoActualSnap = await getDoc(platoDocRef);
      const platoActualData = platoActualSnap.data();
      if (platoActualData?.imageUrl) {
        try {
          const oldImageRef = ref(storage, platoActualData.imageUrl);
          await deleteObject(oldImageRef);
          console.log("Imagen antigua eliminada.");
        } catch (error: any) {
          if (error.code !== 'storage/object-not-found') {
            console.warn("No se pudo eliminar la imagen antigua, puede que ya no exista:", error);
          }
        }
      }

      // Subir la nueva imagen a Firebase Storage
      const imagePath = `users/${this.uid}/platos_images/${platoId}_${Date.now()}`;
      const storageRef = ref(storage, imagePath);
      const uploadResult = await uploadBytes(storageRef, imageFile);

      // Obtener la URL de descarga de la nueva imagen
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Añadir la nueva URL al objeto que se va a actualizar
      dataToUpdate.imageUrl = downloadURL;
      console.log("Nueva imagen subida. URL:", downloadURL);
    } else {
      console.log("No se proporcionó nueva imagen, se mantendrá la existente.");
    }

    // 3. Tu lógica original para eliminar el 'id' es una buena práctica, la mantenemos.
    //    Aunque al usar desestructuración con Partial<Omit<...>>, no debería estar.
    //    No hace daño mantenerla por seguridad.
    if ('id' in dataToUpdate) {
      delete (dataToUpdate as any).id;
    }

    // 4. Finalmente, actualiza el documento en Firestore con los datos limpios.
    //    `dataToUpdate` ahora solo contiene los campos que realmente queremos cambiar
    //    y nunca tendrá un `imageUrl: undefined`.
    console.log("Actualizando documento en Firestore con:", dataToUpdate);
    await updateDoc(platoDocRef, dataToUpdate);
  }

  async eliminarPlato(platoId: string): Promise<void> {
    const platoDocRef = doc(this.platosCollectionRef, platoId);
    await deleteDoc(platoDocRef);
  }

  async eliminarVariosPlatos(platoIds: string[]): Promise<void> {
    if (platoIds.length === 0) return;

    const batch = writeBatch(db);
    platoIds.forEach(platoId => {
      const platoDocRef = doc(this.platosCollectionRef, platoId);
      batch.delete(platoDocRef);
    });
    await batch.commit();
  }

}
