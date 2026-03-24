import { IArticuloRepository, Articulo } from '../../domain';

export class ArticuloUseCases {
  constructor(private articuloRepository: IArticuloRepository) {}

  async crearArticulo(nombre: string): Promise<Articulo> {
    // Evitar duplicados (filtramos porque repository solo tiene getAll)
    const existentes = await this.articuloRepository.getAll();
    const existe = existentes.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) return existe;

    return await this.articuloRepository.create({ nombre });
  }

  async obtenerTodosLosArticulos(): Promise<Articulo[]> {
    return await this.articuloRepository.getAll();
  }

  async buscarArticulosPorNombre(nombre: string): Promise<Articulo[]> {
    const todos = await this.articuloRepository.getAll();
    return todos.filter(a => a.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }

  async obtenerArticulosFrecuentes(): Promise<Articulo[]> {
    // Al solo tener CRUD, simulamos la frecuencia o delegamos. 
    // De momento, devolvemos los 5 primeros (podría requerir un conteo en ListaArticulo en un caso real más avanzado)
    const todos = await this.articuloRepository.getAll();
    return todos.slice(0, 5); 
  }
}
