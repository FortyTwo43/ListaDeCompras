import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { ListCard } from '../../presentation/components/ListCard';
import { Colors } from '../../presentation/constants/theme';
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const filteredListas = listas.filter(l => 
    l.titulo.toLowerCase().includes(searchQuery.toLowerCase())
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
      
      <Fab onPress={() => { /* Modal para nueva lista */ }} isDark={isDark} />
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
});
