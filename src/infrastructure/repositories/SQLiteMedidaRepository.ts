import { IMedidaRepository } from '../../domain/repositories/IMedidaRepository';
import { Medida } from '../../domain/entities/Medida';
import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export class SQLiteMedidaRepository implements IMedidaRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(): Promise<Medida[]> {
    return await this.db.getAllAsync<Medida>('SELECT * FROM Medidas;');
  }

  async getById(id: string): Promise<Medida | null> {
    const result = await this.db.getFirstAsync<Medida>('SELECT * FROM Medidas WHERE id = ?;', [id]);
    return result || null;
  }

  async create(entity: Omit<Medida, 'id'>): Promise<Medida> {
    const id = Crypto.randomUUID();
    const nuevaMedida: Medida = { id, ...entity };

    await this.db.runAsync(
      'INSERT INTO Medidas (id, nombre) VALUES (?, ?);',
      [nuevaMedida.id, nuevaMedida.nombre]
    );

    return nuevaMedida;
  }

  async update(id: string, entity: Partial<Medida>): Promise<Medida> {
    const current = await this.getById(id);
    if (!current) throw new Error(`Medida con id ${id} no encontrada.`);

    const updated: Medida = { ...current, ...entity };

    await this.db.runAsync(
      'UPDATE Medidas SET nombre = ? WHERE id = ?;',
      [updated.nombre, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM Medidas WHERE id = ?;', [id]);
  }
}
