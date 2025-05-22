import type { TeamMember } from "../entities/TeamMember";

export interface TeamRepository {
  create(member: Omit<TeamMember, 'id'>): Promise<string>;
  getAll(uid: string): Promise<TeamMember[]>;
  getById(uid: string): Promise<TeamMember | null>;
  update(id:string, member:Partial<TeamMember>): Promise<void>;
  delete(id: string): Promise<void>;
}
