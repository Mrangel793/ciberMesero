import type { Promotion, PromotionDish } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';
import type { PlatoRepository } from '@/core/repositories/PlatoRepository';

export interface CreatePromotionInput {
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  dishIds: string[];
  startDate: string;
  endDate: string;
  address?: string;
  phone?: string;
}

export class CreatePromotionUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly dishRepository?: PlatoRepository // Sigue siendo opcional, pero útil
  ) {}

  async execute(
    restaurantId: string, // Este será el UID del usuario/restaurante
    inputData: CreatePromotionInput
  ): Promise<string> {

    // 1. Validación de Campos Obligatorios Básicos
    if (!restaurantId) {
      throw new Error("El ID del restaurante (UID del usuario) es obligatorio.");
    }
    if (!inputData.title || inputData.title.trim() === '') {
      throw new Error("El título de la promoción es obligatorio.");
    }
    if (!inputData.description || inputData.description.trim() === '') {
      throw new Error("La descripción de la promoción es obligatoria.");
    }
    if (!inputData.startDate) {
      throw new Error("La fecha de inicio es obligatoria.");
    }
    if (!inputData.endDate) {
      throw new Error("La fecha de fin es obligatoria.");
    }
    if (!inputData.dishIds || inputData.dishIds.length === 0) {
      throw new Error("Se debe seleccionar al menos un platillo para la promoción.");
    }

    // 2. Validación de Formato y Lógica de Fechas
    const startDate = new Date(inputData.startDate);
    const endDate = new Date(inputData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Las fechas de inicio o fin no tienen un formato válido.");
    }
    // Puedes decidir si permites fechas pasadas o no.
    if (startDate < today && inputData.startDate !== today.toISOString().split('T')[0]) {
       throw new Error("La fecha de inicio no puede ser en el pasado.");
    }
    if (endDate < startDate) {
      throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
    }

    // 3. Validación de Formato de Campos Opcionales
    if (inputData.price !== undefined && (typeof inputData.price !== 'number' || inputData.price < 0)) {
      throw new Error("El precio debe ser un número positivo si se proporciona.");
    }
    if (inputData.imageUrl !== undefined && inputData.imageUrl.trim() !== '') {
      try {
        new URL(inputData.imageUrl);
      } catch {
        console.warn("La URL de la imagen proporcionada podría no ser válida:", inputData.imageUrl);
      }
    }

    // 4. Validación de Existencia de Platillos (Si se proporciona DishRepository)
    const promotionDishes: PromotionDish[] = [];
    if (this.dishRepository) {
      for (const dishId of inputData.dishIds) {
        const dish = await this.dishRepository.obtenerPlatoPorId(restaurantId, dishId);
        if (!dish) {
          throw new Error(`El platillo con ID '${dishId}' no existe o no pertenece a tu menú.`);
        }
        promotionDishes.push({ id: dish.id, name: dish.name });
      }
    } else {
      inputData.dishIds.forEach(id => promotionDishes.push({ id, name: `Platillo ${id}` }));
      console.warn("DishRepository no proporcionado. Se usarán nombres genéricos para los platillos en la promoción. Considera pasar nombres desde la UI si son necesarios.");
    }

    // 5. Construir el objeto Promotion para guardar
    const promotionToCreate: Omit<Promotion, 'id' | 'restaurantName'> = {
      title: inputData.title.trim(),
      description: inputData.description.trim(),
      imageUrl: inputData.imageUrl?.trim() || undefined,
      restaurantId: restaurantId, // UID del usuario/restaurante
      price: inputData.price,
      dishes: promotionDishes,
      startDate: inputData.startDate,
      endDate: inputData.endDate,
      address: inputData.address?.trim() || undefined,
      phone: inputData.phone?.trim() || undefined,
    };

    // 6. Llamar al Repositorio para Crear
    try {
      const newPromotionId = await this.promotionRepository.create(restaurantId, promotionToCreate);
      return newPromotionId;
    } catch (error) {
      console.error("Error al crear la promoción en el repositorio:", error);
      throw new Error(`No se pudo crear la promoción: ${(error as Error).message}`);
    }
  }
}
