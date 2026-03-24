import { ListaArticulo } from '../entities/ListaArticulo';

export interface IListaArticuloRepository {
  getAll(): Promise<ListaArticulo[]>;
  getById(id: string): Promise<ListaArticulo | null>;
  create(entity: Omit<ListaArticulo, 'id'>): Promise<ListaArticulo>;
  update(id: string, entity: Partial<ListaArticulo>): Promise<ListaArticulo>;
  delete(id: string): Promise<void>;
}
