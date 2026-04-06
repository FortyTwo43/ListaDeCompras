import { IListaArticuloRepository, IListaComprasRepository, ListaArticulo, EstadoArticulo } from '../../domain';

export class ListaArticuloUseCases {
  constructor(
    private listaArticuloRepository: IListaArticuloRepository,
    private listaComprasRepository: IListaComprasRepository
  ) {}

  async agregarArticuloALista(data: Omit<ListaArticulo, 'id'>): Promise<ListaArticulo> {
    const nuevo = await this.listaArticuloRepository.create(data);
    // Actualizar progreso
    await this.calcularProgresoLista(data.id_lista);
    return nuevo;
  }

  // Ya que en los repositorios solo permitiste getAll y getById, debemos filtrar getAll (o podrías añadir un método específico en el futuro)
  async obtenerArticulosDeLista(id_lista: string): Promise<ListaArticulo[]> {
    const todos = await this.listaArticuloRepository.getAll();
    return todos.filter(a => a.id_lista === id_lista);
  }

  async eliminarArticuloDeLista(id: string, id_lista: string): Promise<void> {
    await this.listaArticuloRepository.delete(id);
    await this.calcularProgresoLista(id_lista);
  }

  async actualizarArticuloDeLista(id: string, data: Partial<ListaArticulo>, id_lista: string): Promise<ListaArticulo> {
    const actualizado = await this.listaArticuloRepository.update(id, data);
    await this.calcularProgresoLista(id_lista);
    return actualizado;
  }

  async cambiarEstadoArticulo(id: string, nuevoEstado: EstadoArticulo, id_lista: string): Promise<ListaArticulo> {
    const actualizado = await this.listaArticuloRepository.update(id, { estado: nuevoEstado });
    await this.calcularProgresoLista(id_lista);
    return actualizado;
  }

  async calcularProgresoLista(id_lista: string): Promise<number> {
    const todosEnLista = await this.obtenerArticulosDeLista(id_lista);
    
    // Ignorar los artículos cancelados del cálculo
    const articulosRelevantes = todosEnLista.filter(a => a.estado !== 'cancelado');
    
    if (articulosRelevantes.length === 0) {
      await this.listaComprasRepository.update(id_lista, { progreso: 0 });
      return 0;
    }

    const compradosCount = articulosRelevantes.filter(a => a.estado === 'comprado').length;
    
    // Calcular el porcentaje basado solo en los relevantes (comprados y pendientes)
    // Usamos toFixed(2) para que el progreso refleje los decimales que solicitaste (ej. 22.22)
    const progresoRaw = (compradosCount / articulosRelevantes.length) * 100;
    const progreso = parseFloat(progresoRaw.toFixed(2));

    await this.listaComprasRepository.update(id_lista, { progreso });
    return progreso;
  }
}
