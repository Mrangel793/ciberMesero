export interface RawMenuItem {
  id?: string | number;
  ID?: string | number;

  nombre?: string;
  Nombre?: string;

  descripcion?: string;
  Descripción?: string;

  precio?: string | number;
  Precio?: string | number;

  oldPrice?: string;
  PrecioAnterior?: string;

  image?: string;
  Imagen?: string;

  onPromo?: boolean | string;
  EnPromocion?: boolean | string;

  category?: string;
  Categoría?: string;
}
