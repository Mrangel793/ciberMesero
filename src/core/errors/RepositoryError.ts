import { DomainError } from './DomainError';

/**
 * Error en la capa de persistencia/repositorio
 * Se lanza cuando hay problemas con la base de datos o servicios externos
 */
export class RepositoryError extends DomainError {
  public readonly operation: string;
  public readonly originalError?: Error;

  constructor(message: string, operation: string, originalError?: Error) {
    super(message, 'REPOSITORY_ERROR');
    this.operation = operation;
    this.originalError = originalError;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      operation: this.operation,
      originalError: this.originalError?.message,
    };
  }
}
