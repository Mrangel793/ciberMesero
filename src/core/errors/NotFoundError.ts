import { DomainError } from './DomainError';

/**
 * Error cuando un recurso no es encontrado
 * Útil para operaciones de búsqueda, actualización o eliminación
 */
export class NotFoundError extends DomainError {
  public readonly entityName: string;
  public readonly entityId?: string;

  constructor(entityName: string, entityId?: string) {
    const message = entityId
      ? `${entityName} con ID '${entityId}' no encontrado`
      : `${entityName} no encontrado`;

    super(message, 'NOT_FOUND');
    this.entityName = entityName;
    this.entityId = entityId;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      entityName: this.entityName,
      entityId: this.entityId,
    };
  }
}
