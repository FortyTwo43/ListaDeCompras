import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, Text, ScrollView, Alert, Pressable, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ConfirmModal } from '../../presentation/components/ConfirmModal';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { ListCard } from '../../presentation/components/ListCard';
import { Colors, Radii } from '../../presentation/constants/theme';
import { ICONS_LIST } from '../../presentation/constants/Icons';
import { COLORS_LIST } from '../../presentation/constants/ColorsList';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
// Importamos la inyección para consumir los mocks que hicimos
import { listaUseCases } from '../../di';
import { ListaCompras } from '../../domain/entities/ListaCompras';

export default function ListasScreen() {
  const [listas, setListas] = useState<ListaCompras[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState<{ id?: string, titulo: string, descripcion: string, icon: string, color: string }>({ 
    titulo: '', 
    descripcion: '', 
    icon: ICONS_LIST[0], 
    color: COLORS_LIST[0] 
  });

  // Estados para el Modal de Confirmación
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [listaAEliminar, setListaAEliminar] = useState<ListaCompras | null>(null);

  const { isDark, theme } = useAppTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Acoplar la función de búsqueda a la Cabecera Nativa
  useEffect(() => {
    navigation.setOptions({
      onSearch: (text: string) => setSearchQuery(text)
    });
  }, [navigation]);

  // Actualizar listas cuando la pantalla recibe el foco (al regresar atrás de detalles)
  useFocusEffect(
    useCallback(() => {
      cargarListas();
    }, [])
  );

  const cargarListas = async () => {
    try {
      const data = await listaUseCases.obtenerListas();
      setListas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarListas();
    setRefreshing(false);
  }, []);

  const handleCardPress = (id: string) => {
    // Redireccion al detalle
    router.push(`/detalles/${id}` as any);
  };

  const abrirFormulario = (lista?: ListaCompras) => {
    if (lista) {
      setNuevaLista({ 
        id: lista.id, 
        titulo: lista.titulo, 
        descripcion: lista.descripcion || '', 
        icon: lista.icon, 
        color: lista.color 
      });
    } else {
      setNuevaLista({ titulo: '', descripcion: '', icon: ICONS_LIST[0], color: COLORS_LIST[0] });
    }
    setModalVisible(true);
  };

  const handleDeleteLista = (lista: ListaCompras) => {
    setListaAEliminar(lista);
    setConfirmModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    if (!listaAEliminar) return;
    try {
      await listaUseCases.eliminarLista(listaAEliminar.id);
      setConfirmModalVisible(false);
      setListaAEliminar(null);
      cargarListas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuardar = async () => {
    if (!nuevaLista.titulo.trim()) {
      Alert.alert("Error", t('errorTitleListRequired'));
      return;
    }

    if (!nuevaLista.icon || !nuevaLista.color) {
      Alert.alert("Error", t('errorSelectionRequired'));
      return;
    }

    try {
      const data = { 
        titulo: nuevaLista.titulo, 
        descripcion: nuevaLista.descripcion || null, 
        icon: nuevaLista.icon, 
        color: nuevaLista.color 
      };

      if (nuevaLista.id) {
        // ACTUALIZAR
        await listaUseCases.actualizarLista(nuevaLista.id, data);
      } else {
        // CREAR
        await listaUseCases.crearLista(data);
      }
      setModalVisible(false);
      cargarListas();
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

  const filteredListas = listas
    .filter(l => (l.titulo || '').toString().toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.titulo.localeCompare(b.titulo));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <FlatList
        data={filteredListas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100, flexGrow: 1 }]}
        ListEmptyComponent={<EmptyState messageKey="noLists" isDark={isDark} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        renderItem={({ item }) => (
          <ListCard 
            lista={item} 
            isDark={isDark} 
            onPress={() => handleCardPress(item.id)}
            onEdit={() => abrirFormulario(item)}
            onDelete={() => handleDeleteLista(item)} 
          />
        )}
      />

      {/* MODAL PARA CREAR NUEVA LISTA */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {nuevaLista.id ? t('editList') : t('newList')}
            </Text>
            
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder={t('placeholderList')}
              placeholderTextColor={theme.textSecondary}
              value={nuevaLista.titulo}
              onChangeText={(text) => setNuevaLista({ ...nuevaLista, titulo: text })}
            />

            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, height: 60 }]}
              placeholder={t('description') + " (" + t('optional') + ")"}
              placeholderTextColor={theme.textSecondary}
              value={nuevaLista.descripcion}
              onChangeText={(text) => setNuevaLista({ ...nuevaLista, descripcion: text })}
              multiline
            />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('icon')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
              {ICONS_LIST.map((iconNombre) => (
                <TouchableOpacity
                  key={iconNombre}
                  onPress={() => setNuevaLista({ ...nuevaLista, icon: iconNombre })}
                  style={[
                    styles.iconCircle,
                    { 
                      backgroundColor: nuevaLista.icon === iconNombre ? theme.primary : theme.background,
                      borderColor: theme.border,
                      borderWidth: nuevaLista.icon === iconNombre ? 0 : 1
                    }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name={iconNombre as any} 
                    size={24} 
                    color={nuevaLista.icon === iconNombre ? Colors.light.surface : theme.textSecondary} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('color')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
              {COLORS_LIST.map((hexColor) => (
                <TouchableOpacity
                  key={hexColor}
                  onPress={() => setNuevaLista({ ...nuevaLista, color: hexColor })}
                  style={[
                    styles.colorCircle,
                    { 
                      backgroundColor: hexColor,
                      borderWidth: nuevaLista.color === hexColor ? 3 : 0,
                      borderColor: theme.text // Borde para indicar seleccionado
                    }
                  ]}
                />
              ))}
            </ScrollView>

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
        message={t('deleteListConfirm', { name: listaAEliminar?.titulo || '' })}
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
  listContainer: {
    padding: 8,
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
    borderRadius: Radii.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});
