import { ListaCompras } from '../entities/ListaCompras';

export interface IListaComprasRepository {
  getAll(): Promise<ListaCompras[]>;
  getById(id: string): Promise<ListaCompras | null>;
  create(entity: Omit<ListaCompras, 'id'>): Promise<ListaCompras>;
  update(id: string, entity: Partial<ListaCompras>): Promise<ListaCompras>;
  delete(id: string): Promise<void>;
}
