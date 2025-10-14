import { DomainError } from './DomainError';

/**
 * Error cuando se viola una regla de negocio
 * Diferente a ValidationError: este es para lógica de negocio compleja
 */
export class BusinessRuleError extends DomainError {
  public readonly rule: string;

  constructor(message: string, rule: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
    this.rule = rule;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      rule: this.rule,
    };
  }
}
