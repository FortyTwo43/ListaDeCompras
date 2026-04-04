import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';
import { ListaCompras } from '../../domain/entities/ListaCompras';

interface ListCardProps {
  lista: ListaCompras;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDark?: boolean;
}

import { useTranslation } from 'react-i18next';

export function ListCard({ lista, onPress, onEdit, onDelete, isDark = true }: ListCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const theme = isDark ? Colors.dark : Colors.light;
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  // El FlatList tiene padding 8 por lado (16 total).
  // La tarjeta tiene margin: 8 por lado (16 total por tarjeta).
  // width / 2 - (padding del padre + márgenes propios)
  const exactCardWidth = (width / 2) - 24;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.surfaceHighlight,
          width: exactCardWidth,
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icono Redondo e Icono de opciones */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <MaterialCommunityIcons name={lista.icon as any} size={24} color={lista.color} /> 
        </View>

        <TouchableOpacity 
          onPress={() => setShowMenu(!showMenu)} 
          style={styles.moreButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Menú de Opciones (Tablero) */}
      {showMenu && (
        <View style={[styles.menuContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { setShowMenu(false); onEdit(); }}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>{t('edit')}</Text>
          </TouchableOpacity>
          
          <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { setShowMenu(false); onDelete(); }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.danger || '#FF5252'} />
            <Text style={[styles.menuText, { color: theme.danger || '#FF5252' }]}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>
      )}

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
    // Eliminamos flex: 1 y maxWidth. Ahora React respeta el width inyectado dinámicamente
    minHeight: 220,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radii.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreButton: {
    padding: 4,
    marginTop: -4,
    marginRight: -8,
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    borderRadius: Radii.sm,
    borderWidth: 1,
    paddingVertical: 8,
    width: 120,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 12,
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
    height: 48, // Obliga a ocupar exactamente el espacio de 3 líneas (16 * 3)
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
