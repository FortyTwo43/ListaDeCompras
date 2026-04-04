import { IMedidaRepository, Medida } from '../../domain';

export class MedidaUseCases {
  constructor(private medidaRepository: IMedidaRepository) {}

  async crearMedida(data: Omit<Medida, 'id'>): Promise<Medida> {
    return await this.medidaRepository.create(data);
  }

  async obtenerMedidas(): Promise<Medida[]> {
    return await this.medidaRepository.getAll();
  }

  async actualizarMedida(id: string, data: Partial<Medida>): Promise<Medida> {
    return await this.medidaRepository.update(id, data);
  }

  async eliminarMedida(id: string): Promise<void> {
    return await this.medidaRepository.delete(id);
  }
}
