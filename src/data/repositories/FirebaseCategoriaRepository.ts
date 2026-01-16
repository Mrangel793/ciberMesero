import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import type { CategoriaRepository } from "@/core/repositories/CategoriaRepository";
import type { Category } from "@/core/entities/Category";

export class FirebaseCategoriaRepository implements CategoriaRepository {
  async crear(uidRestaurante: string, nombre: string): Promise<void> {
    const ref = collection(db, "users", uidRestaurante, "categorias");
    await addDoc(ref, { name: nombre });
  }

  async obtenerTodas(uidRestaurante: string): Promise<Category[]> {
    const ref = collection(db, "users", uidRestaurante, "categorias");
    const snap = await getDocs(ref);
    return snap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
  }
}
