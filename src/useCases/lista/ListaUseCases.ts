import { IListaComprasRepository, ListaCompras } from '../../domain';

export class ListaUseCases {
  constructor(private listaRepository: IListaComprasRepository) {}

  async crearLista(data: Omit<ListaCompras, 'id' | 'progreso'>): Promise<ListaCompras> {
    return await this.listaRepository.create({
      ...data,
      progreso: 0,
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
