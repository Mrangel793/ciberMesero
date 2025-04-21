import type { User } from '@/core/interfaces/User';
import type { UserRepository } from '@/core/usecases/UserRepository';
import { auth, db } from '@/data/firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export class FirebaseUserRepository implements UserRepository {
  async register(user: Omit<User, 'uid' | 'createdAt'>, password: string): Promise<void> {
    // Crear en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
    const firebaseUser = userCredential.user;

    // Enviar correo de verificación
    await sendEmailVerification(firebaseUser);

    // Armar objeto completo con uid y fecha
    const newUser: User = {
      ...user,
      uid: firebaseUser.uid,
      createdAt: new Date()
    };

    // Guardar en Firestore
    await setDoc(doc(db, 'users', newUser.uid), JSON.parse(JSON.stringify(newUser)));

  }
}
