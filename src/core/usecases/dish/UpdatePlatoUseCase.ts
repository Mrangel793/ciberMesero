import type { MenuItem } from '@/core/entities/MenuItem';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export class UpdatePlatoUseCase {
  constructor(private readonly platoRepository: PlatoRepository) { }

  async execute(
    platoId: string,
    datosPlato: Partial<Omit<MenuItem, 'id'>>,
    imageFile: File | null
  ): Promise<void> {

    // La validación de negocio se mantiene aquí, en el caso de uso. ¡Perfecto!
    if (datosPlato.price !== undefined && datosPlato.price < 0) {
      throw new Error("El precio del plato no puede ser negativo.");
    }

    // Ahora pasamos todos los argumentos, incluido el imageFile, al repositorio.
    // El repositorio se encargará de la lógica de subida y actualización de la URL.
    return this.platoRepository.actualizarPlato(
      platoId,
      datosPlato,
      imageFile // <-- Pasando el nuevo argumento
    );
  }
}
