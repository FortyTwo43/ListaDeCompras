import { IListaComprasRepository } from '../../domain/repositories/IListaComprasRepository';
import { ListaCompras } from '../../domain/entities/ListaCompras';
import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export class SQLiteListaComprasRepository implements IListaComprasRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(): Promise<ListaCompras[]> {
    return await this.db.getAllAsync<ListaCompras>('SELECT * FROM ListaCompras;');
  }

  async getById(id: string): Promise<ListaCompras | null> {
    const result = await this.db.getFirstAsync<ListaCompras>('SELECT * FROM ListaCompras WHERE id = ?;', [id]);
    return result || null;
  }

  async create(entity: Omit<ListaCompras, 'id'>): Promise<ListaCompras> {
    const id = Crypto.randomUUID();
    const nuevaLista: ListaCompras = { id, ...entity };

    await this.db.runAsync(
      'INSERT INTO ListaCompras (id, titulo, descripcion, progreso, icon, color) VALUES (?, ?, ?, ?, ?, ?);',
      [nuevaLista.id, nuevaLista.titulo, nuevaLista.descripcion || null, nuevaLista.progreso, nuevaLista.icon, nuevaLista.color]
    );

    return nuevaLista;
  }

  async update(id: string, entity: Partial<ListaCompras>): Promise<ListaCompras> {
    const current = await this.getById(id);
    if (!current) throw new Error(`ListaCompras con id ${id} no encontrada.`);

    const updated: ListaCompras = { ...current, ...entity };

    await this.db.runAsync(
      'UPDATE ListaCompras SET titulo = ?, descripcion = ?, progreso = ?, icon = ?, color = ? WHERE id = ?;',
      [updated.titulo, updated.descripcion || null, updated.progreso, updated.icon, updated.color, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM ListaCompras WHERE id = ?;', [id]);
  }
}
