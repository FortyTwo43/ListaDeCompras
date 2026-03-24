// Interface teórica para la configuración en caché (AsyncStorage u otro)
export interface IConfiguracionRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class ConfiguracionUseCases {
  constructor(private configRepository: IConfiguracionRepository) {}

  async cambiarIdioma(idioma: 'es' | 'en'): Promise<void> {
    await this.configRepository.set('idioma', idioma);
  }

  async obtenerIdiomaActual(): Promise<string> {
    const idioma = await this.configRepository.get('idioma');
    return idioma || 'es'; // Por defecto español
  }

  async cambiarTema(tema: 'light' | 'dark' | 'system'): Promise<void> {
    await this.configRepository.set('tema', tema);
  }

  async obtenerTemaActual(): Promise<string> {
    const tema = await this.configRepository.get('tema');
    return tema || 'system';
  }
}
