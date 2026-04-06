import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { ConfirmModal } from '../../presentation/components/ConfirmModal';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { SearchHeader } from '../../presentation/components/SearchHeader';
import { ItemRow } from '../../presentation/components/ItemRow';
import { Colors, Radii } from '../../presentation/constants/theme';
import { medidaUseCases } from '../../di';
import { Medida } from '../../domain/entities/Medida';

export default function MedidasScreen() {
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [medidaActual, setMedidaActual] = useState<{ id?: string, nombre: string }>({ nombre: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal de Confirmación
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [medidaAEliminar, setMedidaAEliminar] = useState<Medida | null>(null);

  const { isDark, theme } = useAppTheme();
  const { t } = useTranslation();

  useEffect(() => {
    cargarMedidas();
  }, []);

  const cargarMedidas = async () => {
    try {
      setLoading(true);
      const data = await medidaUseCases.obtenerMedidas();
      setMedidas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!medidaActual.nombre.trim()) {
      Alert.alert("Error", t('errorTitleRequired'));
      return;
    }

    try {
      if (medidaActual.id) {
        // Modo Edición
        await medidaUseCases.actualizarMedida(medidaActual.id, { nombre: medidaActual.nombre });
      } else {
        // Modo Creación
        await medidaUseCases.crearMedida({ nombre: medidaActual.nombre });
      }
      setModalVisible(false);
      cargarMedidas();
    } catch (error) {
      console.error(error);
    }
  };

  const abrirFormulario = (medida?: Medida) => {
    if (medida) {
      setMedidaActual({ id: medida.id, nombre: medida.nombre });
    } else {
      setMedidaActual({ nombre: '' });
    }
    setModalVisible(true);
  };

  const handleDelete = (medida: Medida) => {
    setMedidaAEliminar(medida);
    setConfirmModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!medidaAEliminar) return;
    try {
      await medidaUseCases.eliminarMedida(medidaAEliminar.id);
      setConfirmModalVisible(false);
      setMedidaAEliminar(null);
      cargarMedidas();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const filteredMedidas = medidas
    .filter(m => (m.nombre || '').toString().toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchHeader 
        title={t('measures')} 
        onChangeText={setSearchQuery} 
        placeholder={t('measures') + "..."}
      />

      {filteredMedidas.length === 0 ? (
        <EmptyState messageKey="noMeasures" isDark={isDark} />
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredMedidas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ItemRow 
                name={item.nombre} 
                onDelete={() => handleDelete(item)} 
                onRowPress={() => abrirFormulario(item)}
                isDark={isDark} 
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )}

      {/* Formulario Emergente (Modal nativo simple y bonito alineado a la estética) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {medidaActual.id ? t('editMeasure') : t('newMeasure')}
            </Text>
            
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder={t('placeholderMeasure')}
              placeholderTextColor={theme.textSecondary}
              value={medidaActual.nombre}
              onChangeText={(text) => setMedidaActual({ ...medidaActual, nombre: text })}
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
        message={t('deleteMeasureConfirm', { name: medidaAEliminar?.nombre || '' })}
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
