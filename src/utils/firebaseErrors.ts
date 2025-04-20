/**
 * Retorna un mensaje de error personalizado según el código de error de Firebase Auth.
 * @param errorCode - Código de error de Firebase
 * @returns Mensaje legible para el usuario final
 */
export function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'El correo electrónico ya está en uso.',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/weak-password': 'La contraseña es demasiado débil. Usa al menos 6 caracteres.',
      'auth/missing-email': 'Debes ingresar un correo electrónico.',
      'auth/missing-password': 'Debes ingresar una contraseña.',
      'auth/internal-error': 'Error interno. Intenta nuevamente.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/invalid-credential': 'Credenciales inválidas.',
    };
  
    return errorMessages[errorCode] || 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
  