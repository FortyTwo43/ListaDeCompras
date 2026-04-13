import { db } from '../infrastructure/database/sqliteConfig';
import { SQLiteListaComprasRepository } from '../infrastructure/repositories/SQLiteListaComprasRepository';
import { SQLiteArticuloRepository } from '../infrastructure/repositories/SQLiteArticuloRepository';
import { SQLiteMedidaRepository } from '../infrastructure/repositories/SQLiteMedidaRepository';
import { SQLiteListaArticuloRepository } from '../infrastructure/repositories/SQLiteListaArticuloRepository';

import { 
  ListaUseCases, 
  ListaArticuloUseCases, 
  ArticuloUseCases, 
  MedidaUseCases 
} from '../useCases';

// 1. Instanciamos los Repositorios de SQLite usando la DB configurada
const listaComprasRepo = new SQLiteListaComprasRepository(db);
const articuloRepo = new SQLiteArticuloRepository(db);
const medidaRepo = new SQLiteMedidaRepository(db);
const listaArticuloRepo = new SQLiteListaArticuloRepository(db);

// 2. Instanciamos los Casos de Uso pasándoles los repositorios
export const listaUseCases = new ListaUseCases(listaComprasRepo);
export const articuloUseCases = new ArticuloUseCases(articuloRepo);
export const medidaUseCases = new MedidaUseCases(medidaRepo);
export const listaArticuloUseCases = new ListaArticuloUseCases(listaArticuloRepo, listaComprasRepo);
