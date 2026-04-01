import { IMedidaRepository } from '../../../domain/repositories/IMedidaRepository';
import { Medida } from '../../../domain/entities/Medida';
import * as Crypto from 'expo-crypto';

export const MOCK_UUID_MED_LIBRAS = '118314ba-f542-4b2a-abe5-a7bbf599426f';
export const MOCK_UUID_MED_GRAMOS = 'feacf5b7-7e61-4fa3-ae3c-b26a11e1f148';
export const MOCK_UUID_MED_UNIDADES = 'bb958d51-41fb-4f24-9b2f-76ee6fb73d82';
export const MOCK_UUID_MED_LITROS = 'e6f9a0c7-e5cf-4299-81cb-639a0319df6b';

export class MockMedidaRepository implements IMedidaRepository {
  private fakeDatabase: Medida[] = [
    { id: MOCK_UUID_MED_LIBRAS, nombre: 'Libras' },
    { id: MOCK_UUID_MED_GRAMOS, nombre: 'Gramos' },
    { id: MOCK_UUID_MED_UNIDADES, nombre: 'Unidades' },
    { id: MOCK_UUID_MED_LITROS, nombre: 'Litros' },
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
      id: Crypto.randomUUID(),
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
