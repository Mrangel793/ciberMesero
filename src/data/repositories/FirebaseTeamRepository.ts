import type { TeamMember } from '@/core/entities/TeamMember'
import type { TeamRepository } from '@/core/repositories/teamRepository'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/data/firebase/firebaseConfig'

export class FirebaseTeamRepository implements TeamRepository {
  async getAll(): Promise<TeamMember[]> {
    // ya lo tienes
    return []
  }

  async create(member: TeamMember): Promise<void> {
    const ref = collection(db, 'team')
    await addDoc(ref, member)
  }
}
