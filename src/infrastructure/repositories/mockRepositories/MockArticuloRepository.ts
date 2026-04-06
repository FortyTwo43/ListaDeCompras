import { IArticuloRepository } from '../../../domain/repositories/IArticuloRepository';
import { Articulo } from '../../../domain/entities/Articulo';
import * as Crypto from 'expo-crypto';

export const MOCK_UUID_ART_ZAPATOS = 'a0d8e8b6-aae9-42c2-8064-0b1eebef9b51';
export const MOCK_UUID_ART_ZANAHORIA = 'dcf7eb02-f81d-400d-9b0c-45731fcab2b1';
export const MOCK_UUID_ART_PAPAS = '2d2dfcc4-1065-4f01-aba6-2b47dc2e08e6';
export const MOCK_UUID_ART_LECHE = '91206d4e-b816-4148-af7e-3c7d6c63b4f9';
export const MOCK_UUID_ART_TOMATES = 'a3f2a9e4-e0b4-423d-9ab4-bfac01a9a688';
export const MOCK_UUID_ART_PAN = 'ed94b06f-4c70-404f-9ce4-05368a89cac7';
export const MOCK_UUID_ART_CARNE = '9f569b5b-fa5e-4096-bba9-b64c88a0f230';
export const MOCK_UUID_ART_POLLO = '031a0c9e-e3fc-4d39-a8cd-5dce85bdb786';
export const MOCK_UUID_ART_GALLETAS = 'e13274d5-57ac-416d-a002-66d741974586';
export const MOCK_UUID_ART_ATUN = '2fefd78c-a15b-40e3-90b5-ecf4152072d6';
export const MOCK_UUID_ART_YOGURT = 'bb1cd065-c7ab-4b0b-8ef1-502c8d713213';
export const MOCK_UUID_ART_ARROZ = '33d94726-718d-4ef1-8cec-39491eb6c278';
export const MOCK_UUID_ART_HUEVOS = '8a321814-5236-456b-b3b4-03f70f42f995';
export const MOCK_UUID_ART_JABON = '9da49354-724e-4557-9ded-aa60f6c073ff';
export const MOCK_UUID_ART_LAPIZ = '2bda7fae-8bf9-41a5-a969-f183f316e8df';
export const MOCK_UUID_ART_CUADERNO = 'f7e9fd0c-6893-460c-8920-b3d19881e77e';

export class MockArticuloRepository implements IArticuloRepository {
  private fakeDatabase: Articulo[] = [
    { id: MOCK_UUID_ART_ZAPATOS, nombre: 'Zapatos' },
    { id: MOCK_UUID_ART_ZANAHORIA, nombre: 'Zanahorias' },
    { id: MOCK_UUID_ART_PAPAS, nombre: 'Papas' },
    { id: MOCK_UUID_ART_LECHE, nombre: 'Leche' },
    { id: MOCK_UUID_ART_TOMATES, nombre: 'Tomates' },
    { id: MOCK_UUID_ART_PAN, nombre: 'Pan' },
    { id: MOCK_UUID_ART_CARNE, nombre: 'Carne' },
    { id: MOCK_UUID_ART_POLLO, nombre: 'Pollo' },
    { id: MOCK_UUID_ART_GALLETAS, nombre: 'Galletas' },
    { id: MOCK_UUID_ART_ATUN, nombre: 'Atún' },
    { id: MOCK_UUID_ART_YOGURT, nombre: 'Yogurt' },
    { id: MOCK_UUID_ART_ARROZ, nombre: 'Arroz' },
    { id: MOCK_UUID_ART_HUEVOS, nombre: 'Huevos' },
    { id: MOCK_UUID_ART_JABON, nombre: 'Jabón' },
    { id: MOCK_UUID_ART_LAPIZ, nombre: 'Lápiz' },
    { id: MOCK_UUID_ART_CUADERNO, nombre: 'Cuaderno' },
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
