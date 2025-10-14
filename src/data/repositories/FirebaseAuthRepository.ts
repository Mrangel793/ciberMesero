import type { AuthRepository } from '@/core/repositories/AuthRepository';
import type { AuthenticatedUser } from '@/core/entities/AuthenticatedUser';
import { auth, db } from '@/data/firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserMapper } from '@/data/mappers';
import { UnauthorizedError, NotFoundError, RepositoryError, ValidationError } from '@/core/errors';

/**
 * Implementación de AuthRepository usando Firebase
 */
export class FirebaseAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<AuthenticatedUser> {
    try {
      // Validar inputs
      if (!email || !password) {
        throw new ValidationError('Email y contraseña son requeridos', 'email/password');
      }

      // Intentar login con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Verificar que el correo esté verificado
      if (!firebaseUser.emailVerified) {
        throw new UnauthorizedError('El correo no está verificado. Por favor verifica tu email.');
      }

      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new NotFoundError('Usuario', firebaseUser.uid);
      }

      // Usar mapper para convertir datos de Firestore a AuthenticatedUser
      return UserMapper.toAuthenticatedUser(userDoc.data(), firebaseUser.uid);

    } catch (error: any) {
      // Re-lanzar errores de dominio
      if (error instanceof UnauthorizedError ||
          error instanceof NotFoundError ||
          error instanceof ValidationError) {
        throw error;
      }

      // Mapear errores de Firebase a errores de dominio
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new UnauthorizedError('Credenciales inválidas');
      }
      if (error.code === 'auth/invalid-email') {
        throw new ValidationError('Email inválido', 'email');
      }
      if (error.code === 'auth/user-disabled') {
        throw new UnauthorizedError('Esta cuenta ha sido deshabilitada');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new UnauthorizedError('Demasiados intentos fallidos. Intenta más tarde');
      }

      // Error genérico de repositorio
      throw new RepositoryError(
        'Error al iniciar sesión',
        'login',
        error
      );
    }
  }
}
