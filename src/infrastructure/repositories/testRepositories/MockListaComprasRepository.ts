import { IListaComprasRepository } from '../../../domain/repositories/IListaComprasRepository';
import { ListaCompras } from '../../../domain/entities/ListaCompras';

export class MockListaComprasRepository implements IListaComprasRepository {
  private fakeDatabase: ListaCompras[] = [
    {
      id: '1',
      titulo: 'Supermercado',
      descripcion: 'Lista de compras para el día domingo en el supermercado',
      progreso: 35,
      icon: 'basket', // Icono de vector icons compatible (MaterialCommunityIcons)
    },
    {
      id: '2',
      titulo: 'Verdulería',
      descripcion: 'Comprar sólo verduras frescas',
      progreso: 0,
      icon: 'leaf',
    }
  ];

  async getAll(): Promise<ListaCompras[]> {
    return Promise.resolve([...this.fakeDatabase]);
  }

  async getById(id: string): Promise<ListaCompras | null> {
    const found = this.fakeDatabase.find(x => x.id === id);
    return Promise.resolve(found || null);
  }

  async create(entity: Omit<ListaCompras, 'id'>): Promise<ListaCompras> {
    const nueva: ListaCompras = {
      id: Math.random().toString(36).substring(7),
      ...entity
    };
    this.fakeDatabase.push(nueva);
    return Promise.resolve(nueva);
  }

  async update(id: string, entity: Partial<ListaCompras>): Promise<ListaCompras> {
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
