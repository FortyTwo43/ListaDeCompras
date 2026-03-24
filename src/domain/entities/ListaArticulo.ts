export type EstadoArticulo = 'pendiente' | 'comprado' | 'cancelado';

export interface ListaArticulo {
  id: string;
  estado: EstadoArticulo;
  cantidad: number;
  id_articulo: string;
  id_lista: string;
  id_medida: string;
}
