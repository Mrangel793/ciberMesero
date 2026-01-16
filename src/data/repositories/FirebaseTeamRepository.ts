import type { TeamMember } from '@/core/entities/TeamMember'
import type { TeamRepository } from '@/core/repositories/teamRepository'
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/data/firebase/firebaseConfig'

const TEAM_COLLECTION = 'team';

export class FirebaseTeamRepository implements TeamRepository {
  async getAll(): Promise<TeamMember[]> {
    const teamCollection = collection(db, TEAM_COLLECTION);
    const teamSnapshot = await getDocs(teamCollection);
    const teamList = teamSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<TeamMember, 'id'>),
    }));
    return teamList;
  }

   async getById(id: string): Promise<TeamMember | null> {
    const docRef = doc(db, TEAM_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<TeamMember, 'id'>) };
    } else {
      console.warn(`No team member found with ID: ${id}`);
      return null;
    }
  }

  async create(memberData: Omit<TeamMember, 'id'>): Promise<string> {
    const teamCollection = collection(db, TEAM_COLLECTION);
    // Firestore generará el ID automáticamente
    const docRef = await addDoc(teamCollection, memberData);
    return docRef.id; // Devolvemos el ID generado
  }

  async update(id: string, memberData: Partial<TeamMember>): Promise<void> {
    const memberDocRef = doc(db, TEAM_COLLECTION, id);
    // Asegúrate de no intentar actualizar el 'id' como un campo dentro del documento
    const dataToUpdate = { ...memberData };
    if ('id' in dataToUpdate) {
      delete (dataToUpdate as any).id;
    }
    await updateDoc(memberDocRef, dataToUpdate);
  }

  async delete(id: string): Promise<void> {
    const memberDocRef = doc(db, TEAM_COLLECTION, id);
    await deleteDoc(memberDocRef);
  }
}
