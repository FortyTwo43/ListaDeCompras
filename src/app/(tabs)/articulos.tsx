import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity, Text, Pressable, RefreshControl } from 'react-native';
import { ConfirmModal } from '../../presentation/components/ConfirmModal';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { CatalogList } from '../../presentation/components/CatalogList';
import { Colors, Radii } from '../../presentation/constants/theme';
import { articuloUseCases } from '../../di';
import { Articulo } from '../../domain/entities/Articulo';

import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { useNavigation, useFocusEffect } from 'expo-router';

export default function ArticulosScreen() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [articuloActual, setArticuloActual] = useState<{ id?: string, nombre: string }>({ nombre: '' });

  // Estados del Modal de Confirmación
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);

  const { isDark, theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      onSearch: (text: string) => setSearchQuery(text)
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      cargarArticulos();
    }, [])
  );

  const cargarArticulos = async () => {
    try {
      const data = await articuloUseCases.obtenerTodosLosArticulos();
      setArticulos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarArticulos();
    setRefreshing(false);
  }, []);

  const handleDelete = (articulo: Articulo) => {
    setArticuloAEliminar(articulo);
    setConfirmModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!articuloAEliminar) return;
    try {
      await articuloUseCases.eliminarArticulo(articuloAEliminar.id);
      setConfirmModalVisible(false);
      setArticuloAEliminar(null);
      cargarArticulos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuardar = async () => {
    if (!articuloActual.nombre.trim()) {
      Alert.alert("Error", t('errorTitleRequired'));
      return;
    }

    try {
      if (articuloActual.id) {
        await articuloUseCases.actualizarArticulo(articuloActual.id, { nombre: articuloActual.nombre });
      } else {
        await articuloUseCases.crearArticulo({ nombre: articuloActual.nombre });
      }
      setModalVisible(false);
      cargarArticulos();
    } catch (error) {
      console.error(error);
    }
  };

  const abrirFormulario = (articulo?: Articulo) => {
    if (articulo) {
      setArticuloActual({ id: articulo.id, nombre: articulo.nombre });
    } else {
      setArticuloActual({ nombre: '' });
    }
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const filteredArticulos = articulos
    .filter(a => (a.nombre || '').toString().toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {filteredArticulos.length === 0 ? (
        <EmptyState messageKey="noItems" isDark={isDark} />
      ) : (
        <View style={styles.listWrapper}>
          <CatalogList
            data={filteredArticulos}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onDelete={handleDelete}
            onRowPress={abrirFormulario}
            isDark={isDark}
            theme={theme}
          />
        </View>
      )}

      {/* Formulario Modal Para Artículos */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {articuloActual.id ? t('editItem') : t('newItem')}
            </Text>
            
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder={t('placeholderItem')}
              placeholderTextColor={theme.textSecondary}
              value={articuloActual.nombre}
              onChangeText={(text) => setArticuloActual({ ...articuloActual, nombre: text })}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.actionButton}>
                <Text style={{ color: theme.textSecondary }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGuardar} style={[styles.actionButton, { backgroundColor: theme.primary, borderRadius: Radii.sm }]}>
                <Text style={{ color: Colors.light.surface }}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmModal
        visible={confirmModalVisible}
        title={t('delete')}
        message={t('deleteItemConfirm', { name: articuloAEliminar?.nombre || '' })}
        onConfirm={confirmarEliminacion}
        onCancel={() => setConfirmModalVisible(false)}
        isDark={isDark}
      />

      <Fab onPress={() => abrirFormulario()} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 24,
    borderRadius: Radii.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  }
});
