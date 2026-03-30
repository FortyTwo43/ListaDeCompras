import { IMedidaRepository } from '../../../domain/repositories/IMedidaRepository';
import { Medida } from '../../../domain/entities/Medida';

export class MockMedidaRepository implements IMedidaRepository {
  private fakeDatabase: Medida[] = [
    { id: 'm1', nombre: 'Libras' },
    { id: 'm2', nombre: 'Gramos' },
    { id: 'm3', nombre: 'Unidades' },
    { id: 'm4', nombre: 'Litros' },
  ];

  async getAll(): Promise<Medida[]> {
    return Promise.resolve([...this.fakeDatabase]);
  }

  async getById(id: string): Promise<Medida | null> {
    const found = this.fakeDatabase.find(x => x.id === id);
    return Promise.resolve(found || null);
  }

  async create(entity: Omit<Medida, 'id'>): Promise<Medida> {
    const nuevo: Medida = {
      id: Math.random().toString(36).substring(7),
      ...entity
    };
    this.fakeDatabase.push(nuevo);
    return Promise.resolve(nuevo);
  }

  async update(id: string, entity: Partial<Medida>): Promise<Medida> {
    const idx = this.fakeDatabase.findIndex(x => x.id === id);
    if (idx === -1) throw new Error('No encontrado');
    
    this.fakeDatabase[idx] = { ...this.fakeDatabase[idx], ...entity };
    return Promise.resolve(this.fakeDatabase[idx]);
  }

  async delete(id: string): Promise<void> {
    this.fakeDatabase = this.fakeDatabase.filter(x => x.id !== id);
    return Promise.resolve();
  }
}
