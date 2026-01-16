import type { PlatoExcelImporter } from '@/core/repositories/PlatoExcelImporter';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';
import type { MenuItem } from '@/core/entities/MenuItem';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase/firebaseConfig';

export class ImportarPlatosUseCase {
   private uid: string;
  constructor(
    uid: string,
    private readonly platoRepo: PlatoExcelImporter,
    private readonly menuRepo: PlatoRepository
  ) {
    this.uid = uid;
  }

  private async existeCategoria( nombre: string): Promise<boolean> {
    const snapshot = await getDocs(collection(db, `users/${this.uid}/categorias`))
    return snapshot.docs.some(doc => doc.data().name.toLowerCase() === nombre.toLowerCase())
  }

  private async crearCategoria(nombre: string): Promise<void> {
    await addDoc(collection(db, `users/${this.uid}/categorias`), { name: nombre })
  }

  public async execute(file: File): Promise<Omit<MenuItem, "id">[]> {
    const platos = await this.platoRepo.importarDesdeExcel(file)

    for (const plato of platos) {
      const categoria = plato.category.trim()
      const existe = await this.existeCategoria( categoria)
      if (!existe) await this.crearCategoria(categoria)
    }

    await this.menuRepo.guardarMenu( platos)
    return platos
  }
}
