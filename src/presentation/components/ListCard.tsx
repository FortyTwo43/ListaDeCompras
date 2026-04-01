import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';
import { ListaCompras } from '../../domain/entities/ListaCompras';

interface ListCardProps {
  lista: ListaCompras;
  onPress: () => void;
  isDark?: boolean;
}

export function ListCard({ lista, onPress, isDark = true }: ListCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surfaceHighlight }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icono Redondo */}
      <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
        <MaterialCommunityIcons name={lista.icon as any || 'basket'} size={24} color={Colors.light.success} /> 
        {/* Usamos el verde del éxito para contrastar el ícono según la captura */}
      </View>

      {/* Textos */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {lista.titulo}
        </Text>
        
        {/* Decoración de las 3 lineas que simulan el cuerpo de la tarjeta */}
        <View style={styles.mockLines}>
          <View style={styles.mockLineRow}>
            <MaterialCommunityIcons name="circle-outline" size={10} color={theme.text} />
            <View style={[styles.mockLine, { backgroundColor: theme.text }]} />
          </View>
          <View style={styles.mockLineRow}>
            <MaterialCommunityIcons name="circle-outline" size={10} color={theme.text} />
            <View style={[styles.mockLine, { backgroundColor: theme.text }]} />
          </View>
          <View style={styles.mockLineRow}>
            <MaterialCommunityIcons name="circle-outline" size={10} color={theme.text} />
            <View style={[styles.mockLine, { backgroundColor: theme.text }]} />
          </View>
        </View>

        <Text style={[styles.description, { color: theme.text }]} numberOfLines={3}>
          {lista.descripcion}
        </Text>
      </View>

      {/* Barra de Progreso Inferior */}
      <View style={styles.progressWrapper}>
        <View style={[styles.progressBarBackground, { backgroundColor: theme.primary }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { backgroundColor: Colors.dark.success, width: `${lista.progreso}%` }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.md,
    padding: 16,
    margin: 8,
    flex: 1, // Para que tome el tamaño equitativo en grilla
    minHeight: 220,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  mockLines: {
    marginBottom: 12,
  },
  mockLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mockLine: {
    height: 2,
    flex: 1,
    marginLeft: 6,
    borderRadius: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressWrapper: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  progressBarBackground: {
    height: 8,
    width: 80,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
