import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View
} from 'react-native';

import { useDetallesLista, ExtendedArticulo } from '../../presentation/hooks/useDetallesLista';
import { ConfirmModal } from '../../presentation/components/ConfirmModal';
import { StatusModal } from '../../presentation/components/StatusModal';
import { ArticuloRow } from '../../presentation/components/ArticuloRow';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { SearchHeader } from '../../presentation/components/SearchHeader';
import { SelectionHeader } from '../../presentation/components/SelectionHeader';
import { ListProgressBar } from '../../presentation/components/ListProgressBar';
import { QuantityModal } from '../../presentation/components/QuantityModal';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { Articulo } from '../../domain';

export default function DetallesListaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark, theme } = useAppTheme();

  const {
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
  } = useDetallesLista(id);

  const abrirModalSeleccion = (art: { id?: string, nombre: string }) => {
    setSelectedArticuloForAdding({
      ...art,
      initialQuantity: '1'
    });
    setModalQuantityVisible(true);
  };

  const abrirModalEdicionCantidad = (item: ExtendedArticulo) => {
    setSelectedArticuloForAdding({
      id: item.id_articulo,
      nombre: item.nombreArticulo,
      listaArticuloId: item.id,
      initialQuantity: item.cantidad.toString(),
      initialMedidaId: item.id_medida
    });
    setModalQuantityVisible(true);
  };

  const handleToggleEstado = (item: ExtendedArticulo) => {
    setActiveItem(item);
    setStatusModalVisible(true);
  };

  const onDeleteClick = (item: ExtendedArticulo) => {
    setActiveItem(item);
    setConfirmDeleteVisible(true);
  };

  const filteredCatalog = catalogArticulos
    .filter((a: Articulo) => a.nombre.toLowerCase().includes(newItemName.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const sortedItemsEnLista = articulosEnLista
    .filter((a: ExtendedArticulo) => a.nombreArticulo.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nombreArticulo.localeCompare(b.nombreArticulo));

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

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
        <SelectionHeader 
          newItemName={newItemName}
          onNewItemNameChange={setNewItemName}
          onBackPress={() => setIsSelecting(false)}
          onAddPress={() => {
            const trimmed = newItemName.trim();
            if (trimmed) abrirModalSeleccion({ nombre: trimmed });
          }}
          theme={theme}
        />
      )}

      {!isSelecting && articulosEnLista.length > 0 && (
        <ListProgressBar progreso={lista?.progreso || 0} theme={theme} />
      )}

      <View style={styles.content}>
        {isSelecting ? (
          <FlatList
            data={filteredCatalog}
            keyExtractor={(item: Articulo) => item.id}
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            ListEmptyComponent={<EmptyState messageKey="noItems" isDark={isDark} />}
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
          <FlatList
            data={sortedItemsEnLista}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            ListEmptyComponent={<EmptyState messageKey="noItems" isDark={isDark} />}
            renderItem={({ item }) => (
              <ArticuloRow
                item={item}
                nombreArticulo={item.nombreArticulo}
                nombreMedida={item.nombreMedida}
                isDark={isDark}
                onToggleEstado={() => handleToggleEstado(item)}
                onEditMeasure={() => abrirModalEdicionCantidad(item)}
                onDelete={() => onDeleteClick(item)}
              />
            )}
          />
        )}
      </View>

      <QuantityModal 
        visible={modalQuantityVisible}
        onClose={() => setModalQuantityVisible(false)}
        onSave={(q, mid) => handleConfirmarAgregado(q, mid)}
        itemName={selectedArticuloForAdding?.nombre || ''}
        initialQuantity={selectedArticuloForAdding?.initialQuantity || '1'}
        initialMedidaId={selectedArticuloForAdding?.initialMedidaId}
        medidasCatalog={medidasCatalog}
        theme={theme}
      />

      <StatusModal
        visible={statusModalVisible}
        itemName={activeItem?.nombreArticulo || ''}
        isDark={isDark}
        onSelect={onSelectNuevoEstado}
        onCancel={() => setStatusModalVisible(false)}
      />

      <ConfirmModal
        visible={confirmDeleteVisible}
        title={t('deleteFromList')}
        message={t('deleteFromListConfirm', { name: activeItem?.nombreArticulo || '' })}
        onConfirm={handleDeleteArticulo}
        onCancel={() => setConfirmDeleteVisible(false)}
        isDark={isDark}
      />

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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
