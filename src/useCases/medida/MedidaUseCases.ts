import { IMedidaRepository, Medida } from '../../domain';

export class MedidaUseCases {
  constructor(private medidaRepository: IMedidaRepository) {}

  async crearMedida(nombre: string): Promise<Medida> {
    return await this.medidaRepository.create({ nombre });
  }

  async obtenerMedidas(): Promise<Medida[]> {
    return await this.medidaRepository.getAll();
  }

  async actualizarMedida(id: string, nombre: string): Promise<Medida> {
    return await this.medidaRepository.update(id, { nombre });
  }

  async eliminarMedida(id: string): Promise<void> {
    return await this.medidaRepository.delete(id);
  }
}
