import { IArticuloRepository } from '../../../domain/repositories/IArticuloRepository';
import { Articulo } from '../../../domain/entities/Articulo';

export class MockArticuloRepository implements IArticuloRepository {
  private fakeDatabase: Articulo[] = [
    { id: 'a1', nombre: 'Zapatos' },
    { id: 'a2', nombre: 'Zanahorias' },
    { id: 'a3', nombre: 'Papas' },
    { id: 'a4', nombre: 'Leche' },
    { id: 'a5', nombre: 'Tomates' },
  ];

  async getAll(): Promise<Articulo[]> {
    return Promise.resolve([...this.fakeDatabase]);
  }

  async getById(id: string): Promise<Articulo | null> {
    const found = this.fakeDatabase.find(x => x.id === id);
    return Promise.resolve(found || null);
  }

  async create(entity: Omit<Articulo, 'id'>): Promise<Articulo> {
    const nuevo: Articulo = {
      id: Math.random().toString(36).substring(7),
      ...entity
    };
    this.fakeDatabase.push(nuevo);
    return Promise.resolve(nuevo);
  }

  async update(id: string, entity: Partial<Articulo>): Promise<Articulo> {
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
