// src/core/usecases/CreatePromotionUseCase.ts (Versión Sugerida)

import type { Promotion, PromotionDish } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

// El input se simplifica: ya no necesita datos del restaurante
export interface CreatePromotionInput {
  title: string;
  description: string;
  imageUrl?: string; // Opcional
  price: number;
  dishIds: string[]; // IDs de los platos del menú incluidos
  startDate: string;
  endDate: string;
  address?: string; // Opcional
  phone?: string; // Opcional
}

export class CreatePromotionUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly dishRepository: PlatoRepository // Ahora es más importante tenerlo
  ) {}

  // Ya no necesita `restaurantId` como parámetro, se asume que el repositorio lo manejará
  async execute(inputData: CreatePromotionInput, imageFile?: File | null): Promise<string> {

    // --- VALIDACIONES --- (Tus validaciones están excelentes, las mantenemos y adaptamos)
    if (!inputData.title?.trim()) { throw new Error("El título es obligatorio."); }
    if (!inputData.description?.trim()) { throw new Error("La descripción es obligatoria."); }
    if (inputData.price === undefined || inputData.price < 0) { throw new Error("El precio es obligatorio y debe ser positivo."); }
    if (!inputData.dishIds?.length) { throw new Error("Debe seleccionar al menos un platillo."); }

    // Validación de fechas (tu lógica es perfecta)
    const startDate = new Date(inputData.startDate);
    const endDate = new Date(inputData.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) { throw new Error("Formato de fecha inválido."); }
    if (endDate < startDate) { throw new Error("La fecha de fin no puede ser anterior a la de inicio."); }

    // --- CONSTRUCCIÓN DE DATOS ---

    // La validación de platos es crucial ahora para obtener sus nombres
    const promotionDishes: PromotionDish[] = [];
    for (const dishId of inputData.dishIds) {
      // El repositorio de platos ahora necesita un método para buscar por ID sin el UID del restaurante
      const dish = await this.dishRepository.obtenerPlatoPorId(dishId);
      if (!dish) {
        throw new Error(`El platillo con ID '${dishId}' no existe en tu menú.`);
      }
      promotionDishes.push({ id: dish.id, name: dish.name });
    }

    // Construir el objeto para guardar
    const promotionToCreate: Omit<Promotion, 'id'> = {
      title: inputData.title.trim(),
      description: inputData.description.trim(),
      imageUrl: inputData.imageUrl?.trim() || '', // Vacío si no hay URL, el repositorio la actualizará
      price: inputData.price,
      dishes: promotionDishes,
      startDate: inputData.startDate,
      endDate: inputData.endDate,
      address: inputData.address?.trim() || undefined,
      phone: inputData.phone?.trim() || undefined,
    };

    // Llamar al Repositorio para Crear, pasando el archivo de imagen
    return this.promotionRepository.create(promotionToCreate, imageFile);
  }
}
