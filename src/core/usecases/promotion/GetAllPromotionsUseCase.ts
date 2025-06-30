// src/core/usecases/promotion/GetAllPromotionsUseCase.ts
import type { Promotion } from '@/core/entities/Promotion';
import type { PromotionRepository } from '@/core/repositories/PromotionRepository';


export interface GetAllPromotionsInput {
  restaurantId?: string;    // Para filtrar por un restaurante específico
  activeOnly?: boolean;     // Para obtener solo promociones activas (si tienes un campo 'isActive')
  upcomingOnly?: boolean;   // Para obtener solo promociones futuras
  currentOnly?: boolean;    // Para obtener solo promociones actuales
  sortBy?: 'startDate' | 'endDate' | 'title'; // Campo por el que ordenar
  sortOrder?: 'asc' | 'desc';                 // Orden
}

export class GetAllPromotionsUseCase {
  constructor(
    private readonly promotionRepository: PromotionRepository
  ) {}

  async execute(input?: GetAllPromotionsInput): Promise<Promotion[]> {
    // 1. Obtener las promociones del repositorio
    // El repositorio podría ya implementar algunos filtros básicos como por restaurantId.
    // Si los filtros son más complejos, podrían manejarse aquí o delegarse más al repositorio.

    let promotions: Promotion[];

    try {
      promotions = await this.promotionRepository.getAll(input?.restaurantId);
    } catch (error) {
      console.error("Error al obtener todas las promociones del repositorio:", error);
      throw new Error(`No se pudieron obtener las promociones: ${(error as Error).message}`);
    }

    if (!promotions) {
      return []; // Devuelve array vacío si el repositorio devuelve null/undefined
    }

    // 2. Aplicar filtros adicionales de negocio (si no los maneja el repositorio)
    // Estos filtros operan sobre los datos ya recuperados.
    // Es más eficiente si el repositorio puede hacer estos filtros a nivel de consulta.

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Para comparaciones de solo fecha

    if (input?.activeOnly) {
      // Asume que tienes un campo 'isActive' en la entidad Promotion,
      // o que "activa" significa que la fecha actual está entre startDate y endDate.
      promotions = promotions.filter(promo => {
        // if (promo.isActive === false) return false; // Si tienes un campo isActive
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        endDate.setHours(23, 59, 59, 999); // Considerar hasta el final del día de fin
        return startDate <= today && today <= endDate;
      });
    }

    if (input?.upcomingOnly) {
      promotions = promotions.filter(promo => new Date(promo.startDate) > today);
    }

    if (input?.currentOnly) { // Similar a activeOnly, pero puedes definir "current" diferente
        promotions = promotions.filter(promo => {
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            endDate.setHours(23, 59, 59, 999);
            return startDate <= today && today <= endDate;
        });
    }


    // 3. Aplicar ordenación (si no la maneja el repositorio o necesitas una ordenación secundaria)
    // El repositorio ya podría estar ordenando por startDate desc.
    // Esta sería una ordenación adicional en el cliente.
    if (input?.sortBy) {
      promotions.sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (input.sortBy) {
          case 'endDate':
            valA = new Date(a.endDate);
            valB = new Date(b.endDate);
            break;
          case 'title':
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
            break;
          case 'startDate': // Ya podría estar ordenado por esto desde el repo
          default:
            valA = new Date(a.startDate);
            valB = new Date(b.startDate);
            break;
        }

        if (valA < valB) {
          return input.sortOrder === 'desc' ? 1 : -1;
        }
        if (valA > valB) {
          return input.sortOrder === 'desc' ? -1 : 1;
        }
        return 0;
      });
    }


    return promotions;
  }
}
