import type { TeamMember } from "../entities/TeamMember";

export interface TeamRepository {
  create(uid: string, firstName: string, lastName: string, document: string, phone: string, email: string, role: string): Promise<void>;
  getAll(uid: string): Promise<TeamMember[]>;
  getById(uid: string, id: number): Promise<TeamMember | null>;
  update(uid: string, id: number, firstName: string, lastName: string, document: string, phone: string, email: string, role: string): Promise<void>;
  delete(uid: string, id: number): Promise<void>;
}
