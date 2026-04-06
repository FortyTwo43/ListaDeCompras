import { IMedidaRepository } from '../../../domain/repositories/IMedidaRepository';
import { Medida } from '../../../domain/entities/Medida';
import * as Crypto from 'expo-crypto';

export const MOCK_UUID_MED_LIBRAS = '118314ba-f542-4b2a-abe5-a7bbf599426f';
export const MOCK_UUID_MED_GRAMOS = 'feacf5b7-7e61-4fa3-ae3c-b26a11e1f148';
export const MOCK_UUID_MED_UNIDADES = 'bb958d51-41fb-4f24-9b2f-76ee6fb73d82';
export const MOCK_UUID_MED_LITROS = 'e6f9a0c7-e5cf-4299-81cb-639a0319df6b';
export const MOCK_UUID_MED_KILOS = 'e4ab5d05-f530-49f2-8104-202a1f08b269';
export const MOCK_UUID_MED_METROS = 'bb9b2d80-d5ce-49ee-b729-4075dfdffe8a';
export const MOCK_UUID_MED_CENTIMETROS = 'fdedfb3d-1de7-40ed-a15b-4794a74d2326';
export const MOCK_UUID_MED_MILILITROS = '07b43ab9-73a4-4ebd-8aad-2a69e149bcef';
export const MOCK_UUID_MED_KILOGRAMOS = 'e2d599ed-cf27-4472-a17e-289e2aae67b6';
export const MOCK_UUID_MED_GALONES = '30555556-9f2c-4119-a63c-2fe7db9590ec';
export const MOCK_UUID_MED_SACOS = 'cba54d7e-d1ff-4aed-893f-cfaf70a2da59';
export const MOCK_UUID_MED_PAQUETES = 'e0eb0d01-fc28-4f27-a19f-3d54483f1525';
export const MOCK_UUID_MED_BOLSAS = '7c098e6c-987f-4afe-85bc-4d83a49cf3a2';


export class MockMedidaRepository implements IMedidaRepository {
  private fakeDatabase: Medida[] = [
    { id: MOCK_UUID_MED_LIBRAS, nombre: 'Libras' },
    { id: MOCK_UUID_MED_GRAMOS, nombre: 'Gramos' },
    { id: MOCK_UUID_MED_UNIDADES, nombre: 'Unidades' },
    { id: MOCK_UUID_MED_LITROS, nombre: 'Litros' },
    { id: MOCK_UUID_MED_KILOS, nombre: 'Kilos' },
    { id: MOCK_UUID_MED_METROS, nombre: 'Metros' },
    { id: MOCK_UUID_MED_CENTIMETROS, nombre: 'Centimetros' },
    { id: MOCK_UUID_MED_MILILITROS, nombre: 'Mililitros' },
    { id: MOCK_UUID_MED_KILOGRAMOS, nombre: 'Kilogramos' },
    { id: MOCK_UUID_MED_GALONES, nombre: 'Galones' },
    { id: MOCK_UUID_MED_SACOS, nombre: 'Sacos' },
    { id: MOCK_UUID_MED_PAQUETES, nombre: 'Paquetes' },
    { id: MOCK_UUID_MED_BOLSAS, nombre: 'Bolsas' },
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
