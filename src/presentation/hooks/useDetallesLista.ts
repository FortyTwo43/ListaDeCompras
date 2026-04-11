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
  const [selectedArticuloForAdding, setSelectedArticuloForAdding] = useState<{ id?: string, nombre: string, listaArticuloId?: string } | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [selectedMedidaId, setSelectedMedidaId] = useState('');

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<ExtendedArticulo | null>(null);

  const cargarData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [listaRef, articulosRel, todosLosArticulos, todasLasMedidas] = await Promise.all([
        listaUseCases.obtenerListas().then(l => l.find(x => x.id === id)),
        listaArticuloUseCases.obtenerArticulosDeLista(id),
        articuloUseCases.obtenerTodosLosArticulos(),
        medidaUseCases.obtenerMedidas()
      ]);

      if (listaRef) setLista(listaRef);
      setCatalogArticulos(todosLosArticulos);
      setMedidasCatalog(todasLasMedidas);
      if (todasLasMedidas.length > 0 && !selectedMedidaId) {
        setSelectedMedidaId(todasLasMedidas[0].id);
      }

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
  }, [id, selectedMedidaId]);

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

  const handleConfirmarAgregado = async () => {
    if (!selectedArticuloForAdding || !id) return;

    try {
      if (selectedArticuloForAdding.listaArticuloId) {
        await listaArticuloUseCases.actualizarArticuloDeLista(
          selectedArticuloForAdding.listaArticuloId,
          {
            cantidad: parseFloat(quantity) || 0,
            id_medida: selectedMedidaId
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
          id_medida: selectedMedidaId,
          cantidad: parseFloat(quantity) || 1,
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
    quantity,
    setQuantity,
    selectedMedidaId,
    setSelectedMedidaId,
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
