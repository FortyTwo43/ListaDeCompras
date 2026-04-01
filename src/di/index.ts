import { MockListaComprasRepository } from '../infrastructure/repositories/mockRepositories/MockListaComprasRepository';
import { MockArticuloRepository } from '../infrastructure/repositories/mockRepositories/MockArticuloRepository';
import { MockMedidaRepository } from '../infrastructure/repositories/mockRepositories/MockMedidaRepository';
import { MockListaArticuloRepository } from '../infrastructure/repositories/mockRepositories/MockListaArticuloRepository';

import { 
  ListaUseCases, 
  ListaArticuloUseCases, 
  ArticuloUseCases, 
  MedidaUseCases 
} from '../useCases';

// 1. Instanciamos los Repositorios (Aquí es donde decidimos si usar SQLite o Mocks)
const listaComprasRepo = new MockListaComprasRepository();
const articuloRepo = new MockArticuloRepository();
const medidaRepo = new MockMedidaRepository();
const listaArticuloRepo = new MockListaArticuloRepository();

// 2. Instanciamos los Casos de Uso pasándoles los repositorios
export const listaUseCases = new ListaUseCases(listaComprasRepo);
export const articuloUseCases = new ArticuloUseCases(articuloRepo);
export const medidaUseCases = new MedidaUseCases(medidaRepo);
export const listaArticuloUseCases = new ListaArticuloUseCases(listaArticuloRepo, listaComprasRepo);
