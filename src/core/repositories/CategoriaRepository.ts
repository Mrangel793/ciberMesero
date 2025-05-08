import type { Category } from "../interfaces/Category";

export interface CategoriaRepository {
  crear(uid:string, nombre: string): Promise<void>;
  obtenerTodas(uid: string): Promise<Category[]>;
}
