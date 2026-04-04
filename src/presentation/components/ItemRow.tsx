import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface ItemRowProps {
  name: string;
  onDelete: () => void;
  onRowPress?: () => void;
  isDark?: boolean;
}

export function ItemRow({ name, onDelete, onRowPress, isDark = true }: ItemRowProps) {
  const theme = isDark ? Colors.dark : Colors.light;
  
  // Defensa contra datos dañados (objetos pasados como nombre)
  const safeName = typeof name === 'object' ? (name as any)?.nombre || String(name) : name;

  return (
    <View style={styles.container}>      
      <TouchableOpacity 
        style={styles.content} 
        onPress={onRowPress} 
        disabled={!onRowPress} 
        activeOpacity={onRowPress ? 0.7 : 1}
      >
        <Text style={[styles.text, { color: theme.textSecondary }]}>{safeName}</Text>
        <TouchableOpacity onPress={onDelete} activeOpacity={0.7} style={styles.iconButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
      {/* Línea divisoria inferior */}
      <View style={[styles.separator, { backgroundColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16, // Margen lateral según la captura
  },
  separator: {
    height: 1,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
  },
  iconButton: {
    padding: 4,
  }
});
