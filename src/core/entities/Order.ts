import type { OrderProduct } from "./OrderProduct"

export interface Order {
    id: number | string
    /** Restaurante que recibe el pedido */
    restaurant: string
    /** Fecha en formato DD/MM/YYYY o ISO */
    date: string
    /** Hora en formato h:mm a/p.m. */
    time: string
    /** Nombre del cliente */
    client: string
    /** Lista de productos y cantidades */
    products: OrderProduct[]
    /** Total en texto (con formato monetario) */
    total: string
    /** Estado del pago (“pago realizado” | “falta por pagar” | etc.) */
    paymentStatus: string
    /** Tipo de pago (“Efectivo” | “Tarjeta” | etc.) */
    paymentType: string
    /** Estado del pedido (“Entregado” | “En preparación” | etc.) */
    orderState: string
    /** Observaciones adicionales */
    notes: string
}