import { IListaArticuloRepository } from '../../../domain/repositories/IListaArticuloRepository';
import { ListaArticulo, EstadoArticulo } from '../../../domain/entities/ListaArticulo';
import * as Crypto from 'expo-crypto';

// Importamos las IDs de nuestros otros mocks para garantizar la concordancia perfecta
import { MOCK_UUID_LISTA_1 } from './MockListaComprasRepository';
import { 
  MOCK_UUID_ART_ZAPATOS, 
  MOCK_UUID_ART_ZANAHORIA, 
  MOCK_UUID_ART_PAPAS,
  MOCK_UUID_ART_LECHE,
  MOCK_UUID_ART_TOMATES,
  MOCK_UUID_ART_PAN,
  MOCK_UUID_ART_CARNE,
  MOCK_UUID_ART_POLLO,
  MOCK_UUID_ART_GALLETAS,
  MOCK_UUID_ART_ATUN,
  MOCK_UUID_ART_YOGURT,
  MOCK_UUID_ART_ARROZ
} from './MockArticuloRepository';
import { 
  MOCK_UUID_MED_UNIDADES, 
  MOCK_UUID_MED_GRAMOS,
  MOCK_UUID_MED_LITROS,
  MOCK_UUID_MED_KILOS,
  MOCK_UUID_MED_METROS,
  MOCK_UUID_MED_CENTIMETROS,
  MOCK_UUID_MED_MILILITROS,
  MOCK_UUID_MED_KILOGRAMOS,
  MOCK_UUID_MED_GALONES,
  MOCK_UUID_MED_SACOS,
  MOCK_UUID_MED_PAQUETES,
  MOCK_UUID_MED_BOLSAS
} from './MockMedidaRepository';

export class MockListaArticuloRepository implements IListaArticuloRepository {
  private fakeDatabase: ListaArticulo[] = [
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_ZAPATOS, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES 
    },
    {
      id: Crypto.randomUUID(),
      estado: 'comprado',
      cantidad: 50,
      id_articulo: MOCK_UUID_ART_ZANAHORIA, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_GRAMOS 
    },
    {
      id: Crypto.randomUUID(),
      estado: 'cancelado',
      cantidad: 30,
      id_articulo: MOCK_UUID_ART_PAPAS, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 2,
      id_articulo: MOCK_UUID_ART_LECHE, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_LITROS
    },
    {
      id: Crypto.randomUUID(),
      estado: 'comprado',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_TOMATES, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_PAN, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'comprado',
      cantidad: 500,
      id_articulo: MOCK_UUID_ART_CARNE, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_GRAMOS
    },
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_POLLO, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_KILOS
    },
    {
      id: Crypto.randomUUID(),
      estado: 'comprado',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_GALLETAS, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_PAQUETES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 2,
      id_articulo: MOCK_UUID_ART_ATUN, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'comprado',
      cantidad: 4,
      id_articulo: MOCK_UUID_ART_YOGURT, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_UNIDADES
    },
    {
      id: Crypto.randomUUID(),
      estado: 'pendiente',
      cantidad: 1,
      id_articulo: MOCK_UUID_ART_ARROZ, 
      id_lista: MOCK_UUID_LISTA_1,
      id_medida: MOCK_UUID_MED_KILOGRAMOS
    }
  ];

  async getAll(): Promise<ListaArticulo[]> {
    return Promise.resolve([...this.fakeDatabase]);
  }

  async getByListaId(id_lista: string): Promise<ListaArticulo[]> {
    const filtrados = this.fakeDatabase.filter(x => x.id_lista === id_lista);
    return Promise.resolve(filtrados);
  }

  async getById(id: string): Promise<ListaArticulo | null> {
    const found = this.fakeDatabase.find(x => x.id === id);
    return Promise.resolve(found || null);
  }

  async create(entity: Omit<ListaArticulo, 'id'>): Promise<ListaArticulo> {
    const nuevo: ListaArticulo = {
      id: Crypto.randomUUID(),
      ...entity
    };
    this.fakeDatabase.push(nuevo);
    return Promise.resolve(nuevo);
  }

  async update(id: string, entity: Partial<ListaArticulo>): Promise<ListaArticulo> {
    const idx = this.fakeDatabase.findIndex(x => x.id === id);
    if (idx === -1) throw new Error('No encontrado');
    
    this.fakeDatabase[idx] = { ...this.fakeDatabase[idx], ...entity };
    return Promise.resolve(this.fakeDatabase[idx]);
  }

  async updateEstado(id: string, estado: EstadoArticulo): Promise<ListaArticulo> {
    return this.update(id, { estado });
  }

  async delete(id: string): Promise<void> {
    this.fakeDatabase = this.fakeDatabase.filter(x => x.id !== id);
    return Promise.resolve();
  }
}
