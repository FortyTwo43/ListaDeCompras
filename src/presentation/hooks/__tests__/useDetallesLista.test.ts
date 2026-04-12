import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDetallesLista } from '../useDetallesLista';

// Mock the DI module so we control all use case responses
jest.mock('../../../di', () => ({
  listaUseCases: {
    obtenerListas: jest.fn(),
  },
  listaArticuloUseCases: {
    obtenerArticulosDeLista: jest.fn(),
    cambiarEstadoArticulo: jest.fn(),
    eliminarArticuloDeLista: jest.fn(),
    agregarArticuloALista: jest.fn(),
    actualizarArticuloDeLista: jest.fn(),
  },
  articuloUseCases: {
    obtenerTodosLosArticulos: jest.fn(),
    crearArticulo: jest.fn(),
  },
  medidaUseCases: {
    obtenerMedidas: jest.fn(),
  },
}));

// Import after mocking so we get the mocked versions
import {
  listaUseCases,
  listaArticuloUseCases,
  articuloUseCases,
  medidaUseCases,
} from '../../../di';

const mockLista = {
  id: 'list-1',
  titulo: 'Weekly Shop',
  descripcion: null,
  progreso: 50,
  icon: 'cart',
  color: '#FF0000',
};

const mockArticulos = [
  { id: 'a-1', nombre: 'Milk' },
  { id: 'a-2', nombre: 'Bread' },
];

const mockMedidas = [
  { id: 'm-1', nombre: 'Units' },
  { id: 'm-2', nombre: 'Kg' },
];

const mockListaArticulos = [
  {
    id: 'la-1',
    estado: 'pendiente' as const,
    cantidad: 2,
    id_articulo: 'a-1',
    id_lista: 'list-1',
    id_medida: 'm-1',
  },
  {
    id: 'la-2',
    estado: 'comprado' as const,
    cantidad: 1,
    id_articulo: 'a-2',
    id_lista: 'list-1',
    id_medida: 'm-2',
  },
];

function setupMocks() {
  (listaUseCases.obtenerListas as jest.Mock).mockResolvedValue([mockLista]);
  (listaArticuloUseCases.obtenerArticulosDeLista as jest.Mock).mockResolvedValue(mockListaArticulos);
  (articuloUseCases.obtenerTodosLosArticulos as jest.Mock).mockResolvedValue(mockArticulos);
  (medidaUseCases.obtenerMedidas as jest.Mock).mockResolvedValue(mockMedidas);
}

describe('useDetallesLista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  describe('initial state and data loading', () => {
    it('returns loading=true initially', () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      expect(result.current.loading).toBe(true);
    });

    it('loads lista, articulosEnLista, catalogArticulos, medidasCatalog after mount', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.lista).toEqual(mockLista);
      expect(result.current.articulosEnLista).toHaveLength(2);
      expect(result.current.catalogArticulos).toEqual(mockArticulos);
      expect(result.current.medidasCatalog).toEqual(mockMedidas);
    });

    it('maps nombreArticulo and nombreMedida on articulosEnLista', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      const first = result.current.articulosEnLista[0];
      expect(first.nombreArticulo).toBe('Milk');
      expect(first.nombreMedida).toBe('Units');

      const second = result.current.articulosEnLista[1];
      expect(second.nombreArticulo).toBe('Bread');
      expect(second.nombreMedida).toBe('Kg');
    });

    it('uses "Desconocido" for unknown articulo id', async () => {
      (listaArticuloUseCases.obtenerArticulosDeLista as jest.Mock).mockResolvedValue([
        { id: 'la-99', estado: 'pendiente', cantidad: 1, id_articulo: 'unknown-id', id_lista: 'list-1', id_medida: 'm-1' },
      ]);
      const { result } = renderHook(() => useDetallesLista('list-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.articulosEnLista[0].nombreArticulo).toBe('Desconocido');
    });

    it('uses empty string for unknown medida id', async () => {
      (listaArticuloUseCases.obtenerArticulosDeLista as jest.Mock).mockResolvedValue([
        { id: 'la-99', estado: 'pendiente', cantidad: 1, id_articulo: 'a-1', id_lista: 'list-1', id_medida: 'unknown-m' },
      ]);
      const { result } = renderHook(() => useDetallesLista('list-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.articulosEnLista[0].nombreMedida).toBe('');
    });

    it('does not call any use case when id is undefined', async () => {
      const { result } = renderHook(() => useDetallesLista(undefined));

      // Small wait to let effects run
      await act(async () => {});

      expect(listaUseCases.obtenerListas).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(true);
    });

    it('sets loading to false after data loads', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.loading).toBe(false);
    });
  });

  describe('initial default states', () => {
    it('starts with empty searchQuery', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.searchQuery).toBe('');
    });

    it('starts with isSelecting=false', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.isSelecting).toBe(false);
    });

    it('starts with newItemName=""', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.newItemName).toBe('');
    });

    it('starts with all modals hidden', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.modalQuantityVisible).toBe(false);
      expect(result.current.statusModalVisible).toBe(false);
      expect(result.current.confirmDeleteVisible).toBe(false);
    });

    it('starts with activeItem=null', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.activeItem).toBeNull();
    });
  });

  describe('onSelectNuevoEstado', () => {
    it('calls cambiarEstadoArticulo with the activeItem id and new estado', async () => {
      (listaArticuloUseCases.cambiarEstadoArticulo as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      const activeItem = result.current.articulosEnLista[0];

      await act(async () => {
        result.current.setActiveItem(activeItem);
      });

      await act(async () => {
        await result.current.onSelectNuevoEstado('comprado');
      });

      expect(listaArticuloUseCases.cambiarEstadoArticulo).toHaveBeenCalledWith(
        activeItem.id,
        'comprado',
        'list-1'
      );
    });

    it('hides statusModal and clears activeItem after state change', async () => {
      (listaArticuloUseCases.cambiarEstadoArticulo as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      const activeItem = result.current.articulosEnLista[0];

      await act(async () => {
        result.current.setActiveItem(activeItem);
        result.current.setStatusModalVisible(true);
      });

      await act(async () => {
        await result.current.onSelectNuevoEstado('cancelado');
      });

      expect(result.current.statusModalVisible).toBe(false);
      expect(result.current.activeItem).toBeNull();
    });

    it('does nothing when activeItem is null', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.onSelectNuevoEstado('comprado');
      });

      expect(listaArticuloUseCases.cambiarEstadoArticulo).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteArticulo', () => {
    it('calls eliminarArticuloDeLista with the activeItem id and lista id', async () => {
      (listaArticuloUseCases.eliminarArticuloDeLista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      const activeItem = result.current.articulosEnLista[0];

      await act(async () => {
        result.current.setActiveItem(activeItem);
        result.current.setConfirmDeleteVisible(true);
      });

      await act(async () => {
        await result.current.handleDeleteArticulo();
      });

      expect(listaArticuloUseCases.eliminarArticuloDeLista).toHaveBeenCalledWith(
        activeItem.id,
        'list-1'
      );
    });

    it('hides confirmDelete modal and clears activeItem after deletion', async () => {
      (listaArticuloUseCases.eliminarArticuloDeLista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      const activeItem = result.current.articulosEnLista[0];

      await act(async () => {
        result.current.setActiveItem(activeItem);
        result.current.setConfirmDeleteVisible(true);
      });

      await act(async () => {
        await result.current.handleDeleteArticulo();
      });

      expect(result.current.confirmDeleteVisible).toBe(false);
      expect(result.current.activeItem).toBeNull();
    });

    it('does nothing when activeItem is null', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteArticulo();
      });

      expect(listaArticuloUseCases.eliminarArticuloDeLista).not.toHaveBeenCalled();
    });
  });

  describe('handleConfirmarAgregado - adding a new item from catalog', () => {
    it('calls agregarArticuloALista when selectedArticulo has an existing id', async () => {
      (listaArticuloUseCases.agregarArticuloALista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        result.current.setSelectedArticuloForAdding({ id: 'a-1', nombre: 'Milk' });
      });

      await act(async () => {
        await result.current.handleConfirmarAgregado(3, 'm-2');
      });

      expect(listaArticuloUseCases.agregarArticuloALista).toHaveBeenCalledWith({
        id_lista: 'list-1',
        id_articulo: 'a-1',
        id_medida: 'm-2',
        cantidad: 3,
        estado: 'pendiente',
      });
    });

    it('creates a new articulo when selectedArticulo has no id', async () => {
      (articuloUseCases.crearArticulo as jest.Mock).mockResolvedValue({ id: 'a-new', nombre: 'NewItem' });
      (listaArticuloUseCases.agregarArticuloALista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        result.current.setSelectedArticuloForAdding({ nombre: 'NewItem' });
      });

      await act(async () => {
        await result.current.handleConfirmarAgregado(1, 'm-1');
      });

      expect(articuloUseCases.crearArticulo).toHaveBeenCalledWith({ nombre: 'NewItem' });
      expect(listaArticuloUseCases.agregarArticuloALista).toHaveBeenCalledWith(
        expect.objectContaining({ id_articulo: 'a-new' })
      );
    });

    it('closes the quantity modal after adding', async () => {
      (listaArticuloUseCases.agregarArticuloALista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        result.current.setSelectedArticuloForAdding({ id: 'a-1', nombre: 'Milk' });
        result.current.setModalQuantityVisible(true);
      });

      await act(async () => {
        await result.current.handleConfirmarAgregado(2, 'm-1');
      });

      expect(result.current.modalQuantityVisible).toBe(false);
    });

    it('clears newItemName after adding', async () => {
      (listaArticuloUseCases.agregarArticuloALista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        result.current.setNewItemName('Chocolate');
        result.current.setSelectedArticuloForAdding({ id: 'a-1', nombre: 'Milk' });
      });

      await act(async () => {
        await result.current.handleConfirmarAgregado(2, 'm-1');
      });

      expect(result.current.newItemName).toBe('');
    });

    it('does nothing when selectedArticuloForAdding is null', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleConfirmarAgregado(2, 'm-1');
      });

      expect(listaArticuloUseCases.agregarArticuloALista).not.toHaveBeenCalled();
    });
  });

  describe('handleConfirmarAgregado - updating an existing item', () => {
    it('calls actualizarArticuloDeLista when selectedArticulo has listaArticuloId', async () => {
      (listaArticuloUseCases.actualizarArticuloDeLista as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        result.current.setSelectedArticuloForAdding({
          id: 'a-1',
          nombre: 'Milk',
          listaArticuloId: 'la-1',
          initialQuantity: '2',
          initialMedidaId: 'm-1',
        });
      });

      await act(async () => {
        await result.current.handleConfirmarAgregado(5, 'm-2');
      });

      expect(listaArticuloUseCases.actualizarArticuloDeLista).toHaveBeenCalledWith(
        'la-1',
        { cantidad: 5, id_medida: 'm-2' },
        'list-1'
      );
      expect(listaArticuloUseCases.agregarArticuloALista).not.toHaveBeenCalled();
    });
  });

  describe('state setters', () => {
    it('setSearchQuery updates searchQuery', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setSearchQuery('apple');
      });

      expect(result.current.searchQuery).toBe('apple');
    });

    it('setIsSelecting toggles isSelecting', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setIsSelecting(true);
      });

      expect(result.current.isSelecting).toBe(true);
    });

    it('setNewItemName updates newItemName', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setNewItemName('Sugar');
      });

      expect(result.current.newItemName).toBe('Sugar');
    });

    it('setModalQuantityVisible updates modalQuantityVisible', async () => {
      const { result } = renderHook(() => useDetallesLista('list-1'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setModalQuantityVisible(true);
      });

      expect(result.current.modalQuantityVisible).toBe(true);
    });
  });

  describe('error handling', () => {
    it('sets loading to false even when cargarData throws', async () => {
      (listaUseCases.obtenerListas as jest.Mock).mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useDetallesLista('list-1'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.loading).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});