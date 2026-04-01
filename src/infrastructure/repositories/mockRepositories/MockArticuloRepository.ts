import { IArticuloRepository } from '../../../domain/repositories/IArticuloRepository';
import { Articulo } from '../../../domain/entities/Articulo';
import * as Crypto from 'expo-crypto';

export const MOCK_UUID_ART_ZAPATOS = 'a0d8e8b6-aae9-42c2-8064-0b1eebef9b51';
export const MOCK_UUID_ART_ZANAHORIA = 'dcf7eb02-f81d-400d-9b0c-45731fcab2b1';
export const MOCK_UUID_ART_PAPAS = '2d2dfcc4-1065-4f01-aba6-2b47dc2e08e6';
export const MOCK_UUID_ART_LECHE = '91206d4e-b816-4148-af7e-3c7d6c63b4f9';
export const MOCK_UUID_ART_TOMATES = '433af192-3c13-4ed4-a134-2e2db1bcfde7';

export class MockArticuloRepository implements IArticuloRepository {
  private fakeDatabase: Articulo[] = [
    { id: MOCK_UUID_ART_ZAPATOS, nombre: 'Zapatos' },
    { id: MOCK_UUID_ART_ZANAHORIA, nombre: 'Zanahorias' },
    { id: MOCK_UUID_ART_PAPAS, nombre: 'Papas' },
    { id: MOCK_UUID_ART_LECHE, nombre: 'Leche' },
    { id: MOCK_UUID_ART_TOMATES, nombre: 'Tomates' },
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
      id: Crypto.randomUUID(),
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
