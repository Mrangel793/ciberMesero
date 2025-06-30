import { db, storage } from '@/data/firebase/firebaseConfig';
import { doc, collection, getDocs, writeBatch, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { MenuItem } from '@/core/entities/MenuItem';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { menuItemConverter } from '../firebase/convertes/MenuItemConverter';


const getPlatosCollectionRef = (uidRestaurante: string) => {
  return collection(db, `users/${uidRestaurante}/platos`);
};

export class FirebaseMenuRepository {


  async guardarMenu(uidRestaurante: string, platosData: Omit<MenuItem, 'id'>[]): Promise<void> {
    console.log(`[guardarMenu] UID del restaurante para esta operación: ${uidRestaurante}`);
    const platosCollectionRef = collection(db, 'users', uidRestaurante, 'platos');
    const batch = writeBatch(db);

    for (const platoOriginal of platosData) {
      const newPlatoRef = doc(platosCollectionRef);

      // --- ¡ESTA ES LA LÍNEA CLAVE QUE FALTA EN TU LÓGICA ACTUAL! ---
      // Añade el UID del dueño a cada objeto de plato.
      const platoConDueño = {
        ...platoOriginal,
        uid: uidRestaurante
      };
      // -----------------------------------------------------------

      // Ahora, limpia el objeto `platoConDueño` de valores undefined
      const platoParaGuardar: { [key: string]: any } = {};
      Object.keys(platoConDueño).forEach(key => {
        const valor = platoConDueño[key as keyof typeof platoConDueño];
        if (valor !== undefined) {
          platoParaGuardar[key] = valor;
        }
      });

      console.log(`[guardarMenu] Objeto FINAL para batch.set (con UID):`, JSON.stringify(platoParaGuardar));

      // Ahora, cuando se ejecute la regla, `request.resource.data.uid` existirá y será correcto.
      batch.set(newPlatoRef, platoParaGuardar);
    }

    try {
      console.log(`[guardarMenu] Intentando commit de un batch con ${platosData.length} operaciones.`);
      await batch.commit();
      console.log("[guardarMenu] Batch commit exitoso. ¡FELICIDADES!");
    } catch (e) {
      console.error("[guardarMenu] Error durante batch.commit():", e);
      throw e;
    }
  }


  async guardarPlato(uidRestaurante: string, platoDataOriginal: Omit<MenuItem, 'id'>): Promise<string> {
    const platosCollection = getPlatosCollectionRef(uidRestaurante);

    // --- INICIO DE LA LÓGICA PARA OMITIR CAMPOS UNDEFINED ---
    const platoParaGuardar: { [key: string]: any } = {};
    (Object.keys(platoDataOriginal) as Array<keyof typeof platoDataOriginal>).forEach(key => {
      const valor = platoDataOriginal[key];
      if (valor !== undefined) {
        platoParaGuardar[key] = valor;
      }
    });


    console.log("[FirebasePlatoRepository.guardarPlato] Objeto a guardar:", platoParaGuardar); // DEBUG
    const docRef = await addDoc(platosCollection, platoParaGuardar); // Usa el objeto limpio
    return docRef.id;
  }

  async obtenerMenu(uidRestaurante: string): Promise<MenuItem[]> {
    // 1. Obtén la referencia a la colección como antes
    const platosCollection = getPlatosCollectionRef(uidRestaurante);

    // 2. Aplica el converter a la referencia
    const platosCollectionWithConverter = platosCollection.withConverter(menuItemConverter);

    // 3. Realiza la consulta
    const snapshot = await getDocs(platosCollectionWithConverter);

    // 4. Mapea los resultados. ¡Ahora cada 'doc.data()' ya es un objeto MenuItem tipado!
    // No se necesita casting ni desestructuración manual.
    return snapshot.docs.map(doc => doc.data());
  }

  async obtenerPlatoPorId(uidRestaurante: string, platoId: string): Promise<MenuItem | null> {
    const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);
    const docSnap = await getDoc(platoDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<MenuItem, 'id'>) };
    } else {
      console.warn(`Plato con ID ${platoId} no encontrado para el restaurante ${uidRestaurante}`);
      return null;
    }
  }

  async actualizarPlato(
    uidRestaurante: string,
    platoId: string,
    datosPlato: Partial<Omit<MenuItem, 'id'>>,
    imageFile: File | null
  ): Promise<void> {

    // La ruta a tu documento parece ser 'users/.../platos/...' según tu código. La mantendré.
    const platoDocRef = doc(db, `users/${uidRestaurante}/platos/${platoId}`);

    // --- LÓGICA MEJORADA ---

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
      const imagePath = `users/${uidRestaurante}/platos_images/${platoId}_${Date.now()}`;
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
