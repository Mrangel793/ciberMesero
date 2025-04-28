export interface MenuItem {
    /** Identificador */
    id: number | string
    /** Nombre del platillo */
    name: string
    /** URL o path a la imagen */
    image?: string
    /** Precio anterior (opcional, para tacharlo) */
    oldPrice?: string
    /** Precio actual */
    price: string
    /** Descripción dividida en líneas */
    description: string[]
    /** Está en promoción? */
    onPromo: boolean
    /** Restaurante al que pertenece */
    restaurant: string
    /** Categoría a la que pertenece */
    category: string
  }