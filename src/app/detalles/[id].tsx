import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Modal, ScrollView, TextInput as RNTextInput, ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  articuloUseCases,
  listaArticuloUseCases,
  listaUseCases,
  medidaUseCases
} from '../../di';
import { EstadoArticulo, ListaArticulo, ListaCompras, Articulo, Medida } from '../../domain';
import { ArticuloRow } from '../../presentation/components/ArticuloRow';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { SearchHeader } from '../../presentation/components/SearchHeader';
import { Colors } from '../../presentation/constants/theme';


// Utilidad local para cruzar datos
interface ExtendedArticulo extends ListaArticulo {
  nombreArticulo: string;
  nombreMedida: string;
}

export default function DetallesListaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [lista, setLista] = useState<ListaCompras | null>(null);
  const [articulosEnLista, setArticulosEnLista] = useState<ExtendedArticulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Estados para el modo Selección ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [catalogArticulos, setCatalogArticulos] = useState<Articulo[]>([]);
  const [medidasCatalog, setMedidasCatalog] = useState<Medida[]>([]);
  const [newItemName, setNewItemName] = useState('');

  // --- Estados del Modal de Cantidad ---
  const [modalQuantityVisible, setModalQuantityVisible] = useState(false);
  const [selectedArticuloForAdding, setSelectedArticuloForAdding] = useState<{ id?: string, nombre: string } | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [selectedMedidaId, setSelectedMedidaId] = useState('');

  const { isDark, theme } = useAppTheme();

  useEffect(() => {
    if (id) {
      cargarData();
    }
  }, [id]);

  const cargarData = async () => {
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
  };

  const handleToggleEstado = (item: ExtendedArticulo) => {
    Alert.alert(
      "Cambiar estado",
      `¿A qué estado deseas cambiar "${item.nombreArticulo}"?`,
      [
        { text: 'Pendiente', onPress: () => actualizarEstado(item.id, 'pendiente') },
        { text: 'Comprado', onPress: () => actualizarEstado(item.id, 'comprado') },
        { text: 'Cancelado', onPress: () => actualizarEstado(item.id, 'cancelado'), style: 'destructive' },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const actualizarEstado = async (idArticuloLista: string, estado: EstadoArticulo) => {
    await listaArticuloUseCases.cambiarEstadoArticulo(idArticuloLista, estado, id);
    cargarData();
  };

  const abrirModalSeleccion = (art: { id?: string, nombre: string }) => {
    setSelectedArticuloForAdding(art);
    setQuantity('1');
    setModalQuantityVisible(true);
  };

  const handleConfirmarAgregado = async () => {
    if (!selectedArticuloForAdding || !id) return;

    try {
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

      setModalQuantityVisible(false);
      cargarData();
      setNewItemName('');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItemsEnLista = articulosEnLista.filter((a: ExtendedArticulo) => 
    a.nombreArticulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCatalog = catalogArticulos.filter((a: Articulo) => 
    a.nombre.toLowerCase().includes(newItemName.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const handleDeleteArticulo = (item: ExtendedArticulo) => {
    Alert.alert(
      t('deleteFromList'),
      t('deleteFromListConfirm', { name: item.nombreArticulo }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive', 
          onPress: async () => {
            if (!id) return;
            try {
              await listaArticuloUseCases.eliminarArticuloDeLista(item.id, id);
              cargarData();
            } catch (error) {
              console.error(error);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {!isSelecting ? (
        <SearchHeader 
          title={lista?.titulo || ''} 
          onChangeText={setSearchQuery} 
          placeholder={t('items') + "..."}
          showBack
          onBackPress={() => router.back()}
        />
      ) : (
        <View style={[styles.customHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => setIsSelecting(false)} style={styles.headerIcon}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <RNTextInput
              style={[styles.headerInput, { color: theme.text }]}
              placeholder={t('newItem') + "..."}
              placeholderTextColor={theme.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />

            <TouchableOpacity 
              onPress={() => newItemName.trim() && abrirModalSeleccion({ nombre: newItemName })}
              style={[styles.headerIcon, { opacity: newItemName.trim() ? 1 : 0.5, marginRight: 10 }]}
            >
              <MaterialCommunityIcons name="plus" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isSelecting && (
        <View style={[styles.topProgressWrapper]}>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.primary }]}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: Colors.dark.success, width: `${lista?.progreso || 0}%` }
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.content}>
        {isSelecting ? (
          <FlatList
            data={filteredCatalog}
            keyExtractor={(item: Articulo) => item.id}
            renderItem={({ item }: { item: Articulo }) => (
              <View style={styles.catalogItemContainer}>
                <View style={styles.catalogItemRow}>
                  <Text style={[styles.catalogItemName, { color: theme.textSecondary }]}>{item.nombre}</Text>
                  <TouchableOpacity onPress={() => abrirModalSeleccion({ id: item.id, nombre: item.nombre })}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.separator, { backgroundColor: theme.border }]} />
              </View>
            )}
          />
        ) : (
          filteredItemsEnLista.length === 0 ? (
            <EmptyState messageKey="noItems" isDark={isDark} />
          ) : (
            <FlatList
              data={filteredItemsEnLista}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ArticuloRow
                  item={item}
                  nombreArticulo={item.nombreArticulo}
                  nombreMedida={item.nombreMedida}
                  isDark={isDark}
                  onToggleEstado={() => handleToggleEstado(item)}
                  onEdit={() => console.log('Editando', item.nombreArticulo)}
                  onDelete={() => handleDeleteArticulo(item)}
                />
              )}
            />
          )
        )}
      </View>

      <Modal animationType="fade" transparent={true} visible={modalQuantityVisible} onRequestClose={() => setModalQuantityVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedArticuloForAdding?.nombre}</Text>
            
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('quantity')}</Text>
            <RNTextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder="0.0"
              placeholderTextColor={theme.textSecondary}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('measure')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
              {medidasCatalog.map((medida: Medida) => (
                <TouchableOpacity
                  key={medida.id}
                  onPress={() => setSelectedMedidaId(medida.id)}
                  style={[
                    styles.measureChip,
                    { 
                      backgroundColor: selectedMedidaId === medida.id ? theme.primary : theme.background,
                      borderColor: theme.border,
                    }
                  ]}
                >
                  <Text style={{ color: selectedMedidaId === medida.id ? '#FFF' : theme.text }}>
                    {medida.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalQuantityVisible(false)} style={styles.actionButton}>
                <Text style={{ color: theme.textSecondary }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmarAgregado} style={[styles.actionButton, { backgroundColor: theme.primary, borderRadius: 6 }]}>
                <Text style={{ color: '#FFF' }}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {!isSelecting && (
        <Fab onPress={() => setIsSelecting(true)} isDark={isDark} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topProgressWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  progressBarBackground: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  customHeader: {
    height: 100,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 56,
  },
  headerIcon: {
    padding: 8,
  },
  headerInput: {
    flex: 1,
    fontSize: 18,
    marginHorizontal: 8,
  },
  catalogItemContainer: {
    paddingHorizontal: 16,
  },
  catalogItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  catalogItemName: {
    fontSize: 16,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  measureChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
