import { DomainError } from './DomainError';

/**
 * Error de validación de datos
 * Se lanza cuando los datos no cumplen con las reglas de negocio
 */
export class ValidationError extends DomainError {
  public readonly field?: string;
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    field?: string,
    validationErrors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
    this.validationErrors = validationErrors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      validationErrors: this.validationErrors,
    };
  }
}
