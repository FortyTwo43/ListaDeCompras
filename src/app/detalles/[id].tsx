import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  articuloUseCases,
  listaArticuloUseCases,
  listaUseCases,
  medidaUseCases
} from '../../di';
import { EstadoArticulo, ListaArticulo, ListaCompras } from '../../domain';
import { ArticuloRow } from '../../presentation/components/ArticuloRow';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { Colors } from '../../presentation/constants/theme';


// Utilidad local para cruzar datos
interface ExtendedArticulo extends ListaArticulo {
  nombreArticulo: string;
  nombreMedida: string;
}

export default function DetallesListaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [lista, setLista] = useState<ListaCompras | null>(null);
  const [articulos, setArticulos] = useState<ExtendedArticulo[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = true;
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (id) {
      cargarData();
    }
  }, [id]);

  const cargarData = async () => {
    try {
      setLoading(true);
      // Obtener los datos paralelos para poblar el viewmodel
      const [listaRef, articulosEnLista, todosLosArticulos, todasLasMedidas] = await Promise.all([
        listaUseCases.obtenerListas().then(l => l.find(x => x.id === id)),
        listaArticuloUseCases.obtenerArticulosDeLista(id),
        articuloUseCases.obtenerTodosLosArticulos(),
        medidaUseCases.obtenerMedidas()
      ]);

      if (listaRef) setLista(listaRef);

      // Entrelazamos los IDs basándonos en Clean Architecture combinándolo a ViewModel
      const viewModels: ExtendedArticulo[] = articulosEnLista.map(item => {
        const art = todosLosArticulos.find(a => a.id === item.id_articulo);
        const med = todasLasMedidas.find(m => m.id === item.id_medida);
        return {
          ...item,
          nombreArticulo: art ? art.nombre : 'Desconocido',
          nombreMedida: med ? med.nombre : ''
        };
      });

      setArticulos(viewModels);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = (item: ExtendedArticulo) => {
    // Ciclar estado: pendiente -> comprado -> cancelado -> pendiente
    let nuevoEstado: EstadoArticulo = 'comprado';
    if (item.estado === 'comprado') nuevoEstado = 'cancelado';
    if (item.estado === 'cancelado') nuevoEstado = 'pendiente';

    // Al lanzar un Action Sheet real se requiere native Alert o ActionSheetIOS, por ahora rotamos cíclicamente o con Alert para demostrar
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
    cargarData(); // Refrescar para ver el progreso modificado y barra interactiva
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
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER PERSONALIZADO GIGANTE - CONTROL ABSOLUTO DE ALTURA AQUÍ */}
      <View style={[
        styles.customHeader,
        {
          backgroundColor: theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.border
        }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 20 }]}>
          {lista?.titulo || 'Cargando...'}
        </Text>
        <View style={styles.headerSpacer} />
        <View style={styles.headerIconsContainer}>
          <TouchableOpacity onPress={() => console.log('Buscar')} style={styles.iconButton}>
            <MaterialCommunityIcons name="magnify" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Configuracion')} style={styles.iconButton}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderizamos la barra de progreso en la parte superior idéntica al diseño */}
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

      {articulos.length === 0 ? (
        <EmptyState messageKey="noItems" isDark={isDark} />
      ) : (
        <FlatList
          data={articulos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticuloRow
              item={item}
              nombreArticulo={item.nombreArticulo}
              nombreMedida={item.nombreMedida}
              isDark={isDark}
              onToggleEstado={() => handleToggleEstado(item)}
              onEdit={() => console.log('Editando', item.nombreArticulo)}
            />
          )}
        />
      )}

      <Fab onPress={() => { }} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    height: 100, // AHORA SÍ: puedes editar este valor hasta encontrar la altura perfecta.
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36, // Espacio superior para alejarlo de la muesca y barra de batería
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 12,
  },
  headerTitle: {
    fontSize: 22,
    marginLeft: 12,
  },
  headerSpacer: {
    flex: 1,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    paddingRight: 8,
    gap: 16,
  },
  iconButton: {
    padding: 4,
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
});
