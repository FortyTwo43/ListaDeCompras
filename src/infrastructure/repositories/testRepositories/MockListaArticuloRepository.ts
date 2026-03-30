import { IListaArticuloRepository } from '../../../domain/repositories/IListaArticuloRepository';
import { ListaArticulo, EstadoArticulo } from '../../../domain/entities/ListaArticulo';

export class MockListaArticuloRepository implements IListaArticuloRepository {
  private fakeDatabase: ListaArticulo[] = [
    {
      id: 'la1',
      estado: 'pendiente',
      cantidad: 1,
      id_articulo: 'a1', // Zapatos
      id_lista: '1',     // Supermercado
      id_medida: 'm3'    // Unidades (o par)
    },
    {
      id: 'la2',
      estado: 'comprado',
      cantidad: 50,
      id_articulo: 'a2', // Zanahorias
      id_lista: '1',
      id_medida: 'm2'    // Gramos/Centavos
    },
    {
      id: 'la3',
      estado: 'cancelado',
      cantidad: 30,
      id_articulo: 'a3', // Papas
      id_lista: '1',
      id_medida: 'm3'
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
      id: Math.random().toString(36).substring(7),
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
