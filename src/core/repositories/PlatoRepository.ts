import type { MenuItem } from "../entities/MenuItem";

export interface PlatoRepository {

  guardarPlato(uidRestaurante: string, plato: Omit<MenuItem, 'id'>): Promise<string>;
  guardarMenu(uidRestaurante: string, platos: Omit<MenuItem, 'id'>[]): Promise<void>;
  obtenerMenu(uidRestaurante: string): Promise<MenuItem[]>;
  obtenerPlatoPorId(uidRestaurante: string, platoId: string): Promise<MenuItem | null>;
  actualizarPlato(uidRestaurante: string, platoId: string, datosPlato: Partial<Omit<MenuItem, 'id'>>): Promise<void>;
  eliminarPlato(uidRestaurante: string, platoId: string): Promise<void>;
  eliminarVariosPlatos?(uidRestaurante: string, platoIds: string[]): Promise<void>;
}
