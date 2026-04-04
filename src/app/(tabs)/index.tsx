import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { ListCard } from '../../presentation/components/ListCard';
import { Colors, Radii } from '../../presentation/constants/theme';
import { ICONS_LIST } from '../../presentation/constants/Icons';
import { COLORS_LIST } from '../../presentation/constants/ColorsList';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../presentation/context/ThemeContext';
import { SearchHeader } from '../../presentation/components/SearchHeader';
// Importamos la inyección para consumir los mocks que hicimos
import { listaUseCases } from '../../di';
import { ListaCompras } from '../../domain/entities/ListaCompras';

export default function ListasScreen() {
  const [listas, setListas] = useState<ListaCompras[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState({ titulo: '', descripcion: '', icon: ICONS_LIST[0], color: COLORS_LIST[0] });

  const { isDark, theme } = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation();

  // Cargar datos a través del Patrón Use Case
  useEffect(() => {
    cargarListas();
  }, []);

  const cargarListas = async () => {
    try {
      setLoading(true);
      const data = await listaUseCases.obtenerListas();
      setListas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (id: string) => {
    // Redireccion al detalle
    router.push(`/detalles/${id}` as any);
  };

  const abrirFormulario = () => {
    setNuevaLista({ titulo: '', descripcion: '', icon: ICONS_LIST[0], color: COLORS_LIST[0] });
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!nuevaLista.titulo.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!nuevaLista.icon || !nuevaLista.color) {
      Alert.alert("Error", "Debe seleccionar un ícono y un color");
      return;
    }

    try {
      if ('crearLista' in listaUseCases) {
        await (listaUseCases as any).crearLista({ 
          titulo: nuevaLista.titulo, 
          descripcion: nuevaLista.descripcion || null, 
          icon: nuevaLista.icon, 
          color: nuevaLista.color 
        });
      } else {
        const repo = (listaUseCases as any).listaRepository || (listaUseCases as any).repository || (listaUseCases as any).listaComprasRepository;
        if (repo && repo.create) {
          await repo.create({ ...nuevaLista, progreso: 0, descripcion: nuevaLista.descripcion || null });
        }
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

  const filteredListas = listas.filter(l => 
    (l.titulo || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchHeader 
        title={t('lists')} 
        onChangeText={setSearchQuery} 
        placeholder="Buscar listas..."
      />

      {filteredListas.length === 0 ? (
        <EmptyState messageKey="noLists" isDark={isDark} />
      ) : (
        <FlatList
          data={filteredListas}
          keyExtractor={(item) => item.id}
          numColumns={2} // Grilla de 2 columnas según referencia
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ListCard 
              lista={item} 
              isDark={isDark} 
              onPress={() => handleCardPress(item.id)} 
            />
          )}
        />
      )}

      {/* MODAL PARA CREAR NUEVA LISTA */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nueva Lista</Text>
            
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder="Título (Ej. Supermercado)"
              placeholderTextColor={theme.textSecondary}
              value={nuevaLista.titulo}
              onChangeText={(text) => setNuevaLista({ ...nuevaLista, titulo: text })}
            />

            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, height: 60 }]}
              placeholder="Descripción (opcional)"
              placeholderTextColor={theme.textSecondary}
              value={nuevaLista.descripcion}
              onChangeText={(text) => setNuevaLista({ ...nuevaLista, descripcion: text })}
              multiline
            />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Icono</Text>
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

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Color</Text>
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
                <Text style={{ color: theme.textSecondary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGuardar} style={[styles.actionButton, { backgroundColor: theme.primary, borderRadius: Radii.sm }]}>
                <Text style={{ color: Colors.light.surface }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Fab onPress={abrirFormulario} isDark={isDark} />
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
