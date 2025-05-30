export interface MenuItem {
    /** Identificador */
    id: string
    /** Nombre del platillo */
    name: string
    /** URL o path a la imagen */
    imageUrl?: string
    /** Precio anterior (opcional, para tacharlo) */
    oldPrice?: string
    /** Precio actual */
    price: number
    /** Descripción dividida en líneas */
    description?: string[]
    /** Está en promoción? */
    onPromo?: boolean
    /** Categoría a la que pertenece */
    category: string
  }
