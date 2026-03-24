import { Medida } from '../entities/Medida';

export interface IMedidaRepository {
  getAll(): Promise<Medida[]>;
  getById(id: string): Promise<Medida | null>;
  create(entity: Omit<Medida, 'id'>): Promise<Medida>;
  update(id: string, entity: Partial<Medida>): Promise<Medida>;
  delete(id: string): Promise<void>;
}
