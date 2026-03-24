import { IArticuloRepository } from '../../domain/repositories/IArticuloRepository';
import { Articulo } from '../../domain/entities/Articulo';
import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export class SQLiteArticuloRepository implements IArticuloRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(): Promise<Articulo[]> {
    return await this.db.getAllAsync<Articulo>('SELECT * FROM Articulo;');
  }

  async getById(id: string): Promise<Articulo | null> {
    const result = await this.db.getFirstAsync<Articulo>('SELECT * FROM Articulo WHERE id = ?;', [id]);
    return result || null;
  }

  async create(entity: Omit<Articulo, 'id'>): Promise<Articulo> {
    const id = Crypto.randomUUID();
    const nuevoArticulo: Articulo = { id, ...entity };

    await this.db.runAsync(
      'INSERT INTO Articulo (id, nombre) VALUES (?, ?);',
      [nuevoArticulo.id, nuevoArticulo.nombre]
    );

    return nuevoArticulo;
  }

  async update(id: string, entity: Partial<Articulo>): Promise<Articulo> {
    const current = await this.getById(id);
    if (!current) throw new Error(`Articulo con id ${id} no encontrado.`);

    const updated: Articulo = { ...current, ...entity };

    await this.db.runAsync(
      'UPDATE Articulo SET nombre = ? WHERE id = ?;',
      [updated.nombre, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM Articulo WHERE id = ?;', [id]);
  }
}
