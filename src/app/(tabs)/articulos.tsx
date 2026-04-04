import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { ItemRow } from '../../presentation/components/ItemRow';
import { Colors, Radii } from '../../presentation/constants/theme';
import { articuloUseCases } from '../../di';
import { Articulo } from '../../domain/entities/Articulo';

import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { SearchHeader } from '../../presentation/components/SearchHeader';

export default function ArticulosScreen() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [articuloActual, setArticuloActual] = useState<{ id?: string, nombre: string }>({ nombre: '' });

  const { isDark, theme } = useAppTheme();
  const { t } = useTranslation();

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      const data = await articuloUseCases.obtenerTodosLosArticulos();
      setArticulos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (articulo: Articulo) => {
    Alert.alert(
      t('delete'),
      t('deleteItemConfirm', { name: articulo.nombre }),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('delete'), 
          style: "destructive", 
          onPress: async () => {
            try {
              await articuloUseCases.eliminarArticulo(articulo.id);
              cargarArticulos();
            } catch (error) {
              console.error(error);
            }
          }
        }
      ]
    );
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

  const filteredArticulos = articulos.filter(a => 
    (a.nombre || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchHeader 
        title={t('items')} 
        onChangeText={setSearchQuery} 
        placeholder={t('items') + "..."}
      />

      {filteredArticulos.length === 0 ? (
        <EmptyState messageKey="noItems" isDark={isDark} />
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredArticulos}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <View>
                <ItemRow 
                  name={item.nombre} 
                  onDelete={() => handleDelete(item)} 
                  onRowPress={() => abrirFormulario(item)}
                  isDark={isDark} 
                />
              </View>
            )}
          />
        </View>
      )}

      {/* Formulario Modal Para Artículos */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
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
          </View>
        </View>
      </Modal>

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
    paddingTop: 0, 
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
