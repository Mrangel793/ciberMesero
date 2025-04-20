export interface UserFirestore {
    uid: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    restaurantInfo?: {
      plan: string;
      pruebaActiva: boolean;
      estadoPlan: string;
      fechaInicio: Date;
    };
    clientInfo?: {
      preferencias: string[];
      favoritos: string[];
    };
  }
  