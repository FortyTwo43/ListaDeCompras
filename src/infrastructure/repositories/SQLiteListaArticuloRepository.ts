import { IListaArticuloRepository } from '../../domain/repositories/IListaArticuloRepository';
import { ListaArticulo } from '../../domain/entities/ListaArticulo';
import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export class SQLiteListaArticuloRepository implements IListaArticuloRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(): Promise<ListaArticulo[]> {
    return await this.db.getAllAsync<ListaArticulo>('SELECT * FROM ListaArticulo;');
  }

  async getById(id: string): Promise<ListaArticulo | null> {
    const result = await this.db.getFirstAsync<ListaArticulo>('SELECT * FROM ListaArticulo WHERE id = ?;', [id]);
    return result || null;
  }

  async create(entity: Omit<ListaArticulo, 'id'>): Promise<ListaArticulo> {
    const id = Crypto.randomUUID();
    const nuevaListaArticulo: ListaArticulo = { id, ...entity };

    await this.db.runAsync(
      'INSERT INTO ListaArticulo (id, estado, cantidad, id_articulo, id_lista, id_medida) VALUES (?, ?, ?, ?, ?, ?);',
      [
        nuevaListaArticulo.id,
        nuevaListaArticulo.estado,
        nuevaListaArticulo.cantidad,
        nuevaListaArticulo.id_articulo,
        nuevaListaArticulo.id_lista,
        nuevaListaArticulo.id_medida
      ]
    );

    return nuevaListaArticulo;
  }

  async update(id: string, entity: Partial<ListaArticulo>): Promise<ListaArticulo> {
    const current = await this.getById(id);
    if (!current) throw new Error(`ListaArticulo con id ${id} no encontrada.`);

    const updated: ListaArticulo = { ...current, ...entity };

    await this.db.runAsync(
      'UPDATE ListaArticulo SET estado = ?, cantidad = ?, id_articulo = ?, id_lista = ?, id_medida = ? WHERE id = ?;',
      [
        updated.estado,
        updated.cantidad,
        updated.id_articulo,
        updated.id_lista,
        updated.id_medida,
        id
      ]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM ListaArticulo WHERE id = ?;', [id]);
  }
}
