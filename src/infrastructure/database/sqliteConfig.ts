import * as SQLite from 'expo-sqlite';

// Abre la base de datos de manera sincrónica (crea el archivo persistente si no existe)
export const db = SQLite.openDatabaseSync('lista_de_compras.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS ListaCompras (
      id TEXT PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      progreso INTEGER NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS Medida (
      id TEXT PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS Articulo (
      id TEXT PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS ListaArticulo (
      id TEXT PRIMARY KEY NOT NULL,
      id_lista TEXT NOT NULL,
      id_articulo TEXT NOT NULL,
      id_medida TEXT NOT NULL,
      cantidad REAL NOT NULL,
      estado TEXT NOT NULL,
      FOREIGN KEY(id_lista) REFERENCES ListaCompras(id) ON DELETE CASCADE,
      FOREIGN KEY(id_articulo) REFERENCES Articulo(id) ON DELETE CASCADE,
      FOREIGN KEY(id_medida) REFERENCES Medida(id) ON DELETE CASCADE
    );
  `);

  // Insertar medidas por defecto (idempotente: no falla si ya existen)
  db.execSync(`
    INSERT OR IGNORE INTO Medida (id, nombre) VALUES 
      ('283e9324-ed48-4637-9fa5-566441ccb524', 'Unidad(es)'),
      ('63faef11-4536-468d-ae13-134279cd82a5', 'Kilogramos'),
      ('242e55b3-1e04-46a8-a502-310fb68debc8', 'Litros'),
      ('ad4ee63d-dad9-4c25-b302-4ff2fd07466c', 'Paquetes');
  `);
}
