import type { MenuItem } from "../../core/interfaces/MenuItem";

export interface PlatoRepository {

  guardarPlato(uidRestaurante: string, plato: MenuItem): Promise<void>;
  guardarMenu(uid: string, items: MenuItem[]): Promise<void>
  obtenerMenu(uidRestaurante: string): Promise<MenuItem[]>;
}
