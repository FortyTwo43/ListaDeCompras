import { Articulo } from '../entities/Articulo';

export interface IArticuloRepository {
  getAll(): Promise<Articulo[]>;
  getById(id: string): Promise<Articulo | null>;
  create(entity: Omit<Articulo, 'id'>): Promise<Articulo>;
  update(id: string, entity: Partial<Articulo>): Promise<Articulo>;
  delete(id: string): Promise<void>;
}
