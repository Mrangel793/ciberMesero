import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
  type UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import type { User } from '../interfaces/user.interface';
import type { UserRole } from '@/shared/constants/roles';

export interface AuthServiceError {
  code: string;
  message: string;
}

export class AuthService {
  /**
   * Registra un nuevo usuario con email y contraseña
   */
  async register(email: string, password: string, name: string, role: UserRole = 'customer'): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar información adicional del usuario en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<{ user: FirebaseUser; role: UserRole }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await this.getUserRole(userCredential.user.uid);

      return {
        user: userCredential.user,
        role
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Obtiene el rol del usuario desde Firestore
   */
  async getUserRole(uid: string): Promise<UserRole> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const userData = userDocSnap.data();
      return userData.role as UserRole;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Obtiene los datos completos del usuario desde Firestore
   */
  async getUserData(uid: string): Promise<User> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const userData = userDocSnap.data();
      return {
        email: userData.email,
        password: '', // No retornamos la contraseña
        name: userData.name,
        role: userData.role
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Obtiene el usuario actual de Firebase Auth
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Maneja los errores de Firebase Auth y los convierte a mensajes legibles
   */
  private handleAuthError(error: any): AuthServiceError {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'El correo electrónico ya está registrado',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };

    return {
      code: error.code || 'unknown',
      message: errorMessages[error.code] || error.message || 'Error desconocido'
    };
  }
}

export const authService = new AuthService();
