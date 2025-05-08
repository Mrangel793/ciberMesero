import type { PlatoExcelImporter } from '@/core/repositories/PlatoExcelImporter';
import type { PlatoRepository } from '../repositories/PlatoRepository';
import type { MenuItem } from '@/core/interfaces/MenuItem';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase/firebaseConfig';

export class ImportarPlatosUseCase {
  constructor(
    private readonly platoRepo: PlatoExcelImporter,
    private readonly menuRepo: PlatoRepository
  ) {}

  private async existeCategoria(uid: string, nombre: string): Promise<boolean> {
    const snapshot = await getDocs(collection(db, `users/${uid}/categorias`))
    return snapshot.docs.some(doc => doc.data().name.toLowerCase() === nombre.toLowerCase())
  }

  private async crearCategoria(uid: string, nombre: string): Promise<void> {
    await addDoc(collection(db, `users/${uid}/categorias`), { name: nombre })
  }

  public async execute(file: File, uid: string): Promise<MenuItem[]> {
    const platos = await this.platoRepo.importarDesdeExcel(file)

    for (const plato of platos) {
      const categoria = plato.category.trim()
      const existe = await this.existeCategoria(uid, categoria)
      if (!existe) await this.crearCategoria(uid, categoria)
    }

    await this.menuRepo.guardarMenu(uid, platos)
    return platos
  }
}
