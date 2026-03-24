import { IListaComprasRepository, ListaCompras } from '../../domain';

export class ListaUseCases {
  constructor(private listaRepository: IListaComprasRepository) {}

  async crearLista(titulo: string, descripcion: string | null, icon: string): Promise<ListaCompras> {
    return await this.listaRepository.create({
      titulo,
      descripcion,
      progreso: 0,
      icon,
    });
  }

  async obtenerListas(): Promise<ListaCompras[]> {
    return await this.listaRepository.getAll();
  }

  async actualizarLista(id: string, data: Partial<ListaCompras>): Promise<ListaCompras> {
    return await this.listaRepository.update(id, data);
  }

  async eliminarLista(id: string): Promise<void> {
    return await this.listaRepository.delete(id);
  }
}
