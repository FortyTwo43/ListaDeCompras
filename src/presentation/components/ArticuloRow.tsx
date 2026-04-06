import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { ListaArticulo, EstadoArticulo } from '../../domain';

interface ArticuloRowProps {
  item: ListaArticulo;
  nombreArticulo: string;
  nombreMedida: string;
  onToggleEstado: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDark?: boolean;
}

export function ArticuloRow({ item, nombreArticulo, nombreMedida, onToggleEstado, onEdit, onDelete, isDark = true }: ArticuloRowProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getIcon = () => {
    switch (item.estado) {
      case 'comprado': return { name: 'check-circle', color: Colors.dark.success };
      case 'cancelado': return { name: 'close-circle', color: Colors.dark.danger };
      default: return { name: 'circle-outline', color: theme.pending };
    }
  };

  const iconInfo = getIcon();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleEstado} activeOpacity={0.7}>
          <MaterialCommunityIcons name={iconInfo.name as any} size={24} color={iconInfo.color} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoContainer} onPress={onEdit} activeOpacity={0.7}>
          <Text 
            style={[
              styles.name, 
              { 
                color: theme.text, 
                textDecorationLine: item.estado === 'cancelado' ? 'line-through' : 'none', 
                opacity: item.estado === 'cancelado' ? 0.6 : 1 
              }
            ]}
          >
            {nombreArticulo}
          </Text>
        </TouchableOpacity>
        

        <Text style={[styles.quantity, { color: theme.textSecondary }]}>
          {item.cantidad} {nombreMedida}
        </Text>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={onDelete} 
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="trash-can-outline" 
            size={22} 
            color="#FF5252" 
          />
        </TouchableOpacity>
      </View>
      {/* Línea divisoria inferior */}
      <View style={[styles.separator, { backgroundColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    paddingHorizontal: 16 
  },
  separator: { 
    height: 1, 
    width: '100%', 
    marginVertical: 4 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 12 
  },
  iconButton: { 
    marginRight: 16 
  },
  infoContainer: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  name: { 
    fontSize: 16,
    fontWeight: '500'
  },
  quantity: { 
    fontSize: 14, 
    marginHorizontal: 8 
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  }
});
