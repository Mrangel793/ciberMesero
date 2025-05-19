import type { TeamMember } from "../entities/TeamMember";

export interface TeamRepository {
  create(member: TeamMember): Promise<void>;
  getAll(): Promise<TeamMember[]>;
  // getById(uid: string, id: number): Promise<TeamMember | null>;
  // update(member:TeamMember): Promise<void>;
  // delete(uid: string, id: number): Promise<void>;
}
