import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { ItemRow } from '../../presentation/components/ItemRow';
import { Colors } from '../../presentation/constants/theme';
import { articuloUseCases } from '../../di';
import { Articulo } from '../../domain/entities/Articulo';

export default function ArticulosScreen() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = true;
  const theme = isDark ? Colors.dark : Colors.light;

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
      "Eliminar artículo",
      `¿Estás seguro que deseas eliminar "${articulo.nombre}" del catálogo?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Verificamos si existe un método eliminarArticulo en el UseCase, 
              // sino apuntamos al repositorio inyectado temporalmente.
              if ('eliminarArticulo' in articuloUseCases) {
                await (articuloUseCases as any).eliminarArticulo(articulo.id);
              } else {
                const repo = (articuloUseCases as any).articuloRepository;
                if (repo && repo.delete) {
                  await repo.delete(articulo.id);
                }
              }
              cargarArticulos();
            } catch (error) {
              console.error(error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {articulos.length === 0 ? (
        <EmptyState messageKey="noItems" isDark={isDark} />
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            data={articulos}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <View>
                <ItemRow 
                  name={item.nombre} 
                  onDelete={() => handleDelete(item)} 
                  isDark={isDark} 
                />
              </View>
            )}
          />
        </View>
      )}

      <Fab onPress={() => {}} isDark={isDark} />
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
    paddingTop: 0, // Espacio superior fiel a la captura
    // antes 36
  },
  // lastSeparatorContainer: {
  //   paddingHorizontal: 16, //antes 16
  // },
  // separator: {
  //   height: 1,
  //   width: '100%',
  // }
});
