import { DomainError } from './DomainError';

/**
 * Error de autenticación o autorización
 * Se lanza cuando el usuario no tiene permisos o no está autenticado
 */
export class UnauthorizedError extends DomainError {
  public readonly requiredRole?: string;

  constructor(message: string = 'No autorizado', requiredRole?: string) {
    super(message, 'UNAUTHORIZED');
    this.requiredRole = requiredRole;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      requiredRole: this.requiredRole,
    };
  }
}
