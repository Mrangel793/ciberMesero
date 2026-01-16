import type { MenuItem } from "../entities/MenuItem";

export interface PlatoRepository {
  guardarPlato(plato: Omit<MenuItem, 'id'>): Promise<string>;
  guardarMenu(platos: Omit<MenuItem, 'id'>[]): Promise<void>;
  obtenerMenu(): Promise<MenuItem[]>;
  obtenerPlatoPorId(platoId: string): Promise<MenuItem | null>;
  actualizarPlato(platoId: string, datosPlato: Partial<Omit<MenuItem, 'id'>>, imageFile: File | null): Promise<void>;
  eliminarPlato(platoId: string): Promise<void>;
  eliminarVariosPlatos?(platoIds: string[]): Promise<void>;
}
