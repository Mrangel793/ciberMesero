
import type { AuthRepository } from '@/core/repositories/AuthRepository';
import type { AuthenticatedUser } from '@/core/entities/AuthenticatedUser';
import { auth, db } from '@/data/firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export class FirebaseAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser.emailVerified) {
      throw new Error('El correo no está verificado.');
    }

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado en base de datos.');
    }

    const data = userDoc.data();

    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      role: data.role
    };
  }
}
