import { useState, useEffect, useCallback } from 'react';
import { 
  listaUseCases, 
  listaArticuloUseCases, 
  articuloUseCases, 
  medidaUseCases 
} from '../../di';
import { EstadoArticulo, ListaArticulo, ListaCompras, Articulo, Medida } from '../../domain';

export interface ExtendedArticulo extends ListaArticulo {
  nombreArticulo: string;
  nombreMedida: string;
}

export function useDetallesLista(id: string | undefined) {
  const [lista, setLista] = useState<ListaCompras | null>(null);
  const [articulosEnLista, setArticulosEnLista] = useState<ExtendedArticulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSelecting, setIsSelecting] = useState(false);
  const [catalogArticulos, setCatalogArticulos] = useState<Articulo[]>([]);
  const [medidasCatalog, setMedidasCatalog] = useState<Medida[]>([]);
  const [newItemName, setNewItemName] = useState('');

  const [modalQuantityVisible, setModalQuantityVisible] = useState(false);
  const [selectedArticuloForAdding, setSelectedArticuloForAdding] = useState<{ id?: string, nombre: string, listaArticuloId?: string, initialQuantity?: string, initialMedidaId?: string } | null>(null);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<ExtendedArticulo | null>(null);

  const cargarData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setLista(null);
      setArticulosEnLista([]);
      return;
    }

    try {
      setLoading(true);
      // Resetear datos previos para evitar visualización "stale"
      setLista(null);
      setArticulosEnLista([]);

      const [listaRef, articulosRel, todosLosArticulos, todasLasMedidas] = await Promise.all([
        listaUseCases.obtenerListas().then(l => l.find(x => x.id === id)),
        listaArticuloUseCases.obtenerArticulosDeLista(id),
        articuloUseCases.obtenerTodosLosArticulos(),
        medidaUseCases.obtenerMedidas()
      ]);

      if (listaRef) {
        setLista(listaRef);
      } else {
        setLista(null);
      }

      setCatalogArticulos(todosLosArticulos);
      setMedidasCatalog(todasLasMedidas);

      const viewModels: ExtendedArticulo[] = articulosRel.map(item => {
        const art = todosLosArticulos.find(a => a.id === item.id_articulo);
        const med = todasLasMedidas.find(m => m.id === item.id_medida);
        return {
          ...item,
          nombreArticulo: art ? art.nombre : 'Desconocido',
          nombreMedida: med ? med.nombre : ''
        };
      });

      setArticulosEnLista(viewModels);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargarData();
  }, [cargarData]);

  const actualizarEstado = async (idArticuloLista: string, estado: EstadoArticulo) => {
    if (!id) return;
    await listaArticuloUseCases.cambiarEstadoArticulo(idArticuloLista, estado, id);
    cargarData();
  };

  const onSelectNuevoEstado = async (nuevoEstado: EstadoArticulo) => {
    if (!activeItem || !id) return;
    await actualizarEstado(activeItem.id, nuevoEstado);
    setStatusModalVisible(false);
    setActiveItem(null);
  };

  const handleDeleteArticulo = async () => {
    if (!activeItem || !id) return;
    try {
      await listaArticuloUseCases.eliminarArticuloDeLista(activeItem.id, id);
      setConfirmDeleteVisible(false);
      setActiveItem(null);
      cargarData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarAgregado = async (finalQuantity: number, finalMedidaId: string) => {
    if (!selectedArticuloForAdding || !id) return;

    try {
      if (selectedArticuloForAdding.listaArticuloId) {
        await listaArticuloUseCases.actualizarArticuloDeLista(
          selectedArticuloForAdding.listaArticuloId,
          {
            cantidad: finalQuantity,
            id_medida: finalMedidaId
          },
          id
        );
      } else {
        let idArticulo = selectedArticuloForAdding.id;
        
        if (!idArticulo) {
          const nuevoArt = await articuloUseCases.crearArticulo({ nombre: selectedArticuloForAdding.nombre });
          idArticulo = nuevoArt.id;
        }

        await listaArticuloUseCases.agregarArticuloALista({
          id_lista: id,
          id_articulo: idArticulo!,
          id_medida: finalMedidaId,
          cantidad: finalQuantity,
          estado: 'pendiente'
        });
      }

      setModalQuantityVisible(false);
      cargarData();
      setNewItemName('');
    } catch (error) {
      console.error(error);
    }
  };

  return {
    lista,
    articulosEnLista,
    catalogArticulos,
    medidasCatalog,
    loading,
    searchQuery,
    setSearchQuery,
    isSelecting,
    setIsSelecting,
    newItemName,
    setNewItemName,
    modalQuantityVisible,
    setModalQuantityVisible,
    selectedArticuloForAdding,
    setSelectedArticuloForAdding,
    statusModalVisible,
    setStatusModalVisible,
    confirmDeleteVisible,
    setConfirmDeleteVisible,
    activeItem,
    setActiveItem,
    onSelectNuevoEstado,
    handleConfirmarAgregado,
    handleDeleteArticulo
  };
}
