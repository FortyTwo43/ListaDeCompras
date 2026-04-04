import { IArticuloRepository, Articulo } from '../../domain';

export class ArticuloUseCases {
  constructor(private articuloRepository: IArticuloRepository) {}

  async crearArticulo(data: Omit<Articulo, 'id'>): Promise<Articulo> {
    // Evitar duplicados (filtramos porque repository solo tiene getAll)
    const existentes = await this.articuloRepository.getAll();
    const existe = existentes.find(a => a.nombre.toLowerCase() === data.nombre.toLowerCase());
    if (existe) return existe;

    return await this.articuloRepository.create(data);
  }

  async obtenerTodosLosArticulos(): Promise<Articulo[]> {
    return await this.articuloRepository.getAll();
  }

  async buscarArticulosPorNombre(nombre: string): Promise<Articulo[]> {
    const todos = await this.articuloRepository.getAll();
    return todos.filter(a => a.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }

  async actualizarArticulo(id: string, data: Partial<Articulo>): Promise<Articulo> {
    return await this.articuloRepository.update(id, data);
  }

  async eliminarArticulo(id: string): Promise<void> {
    return await this.articuloRepository.delete(id);
  }
}
