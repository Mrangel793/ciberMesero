export interface Promotion {
    /** Identificador único */
    id: number | string
    /** Título */
    title: string
    /** Descripción breve */
    description: string
    /** URL o path al logo/imagen */
    logo: string
    /** Precio en texto (formato monetario) */
    price: string
    /** Dirección del restaurante */
    address: string
    /** Teléfono de contacto */
    phone: string
    /** Fecha de expiración en ISO (YYYY-MM-DD) */
    expiryIso: string
    /** Restaurante al que aplica */
    restaurant: string
  }