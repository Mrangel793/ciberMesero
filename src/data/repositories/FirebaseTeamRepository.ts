import type { TeamMember } from '@/core/entities/TeamMember'
import type { TeamRepository } from '@/core/repositories/teamRepository'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/data/firebase/firebaseConfig'

export class FirebaseTeamRepository implements TeamRepository {
  async getAll(): Promise<TeamMember[]> {
    const snapshot = await getDocs(collection(db, 'team'))
    return snapshot.docs.map(doc => doc.data() as TeamMember)
  }

  async create(member: TeamMember): Promise<void> {
    const ref = collection(db, 'team')
    await addDoc(ref, member)
  }
}
