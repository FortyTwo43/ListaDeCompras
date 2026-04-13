import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ItemRow } from './ItemRow';

// Aseguramos que cualquier elemento que pasemos tenga al menos un ID y un nombre
export interface CatalogItem {
  id: string;
  nombre: string;
}

interface CatalogListProps<T extends CatalogItem> {
  data: T[];
  refreshing: boolean;
  onRefresh: () => void;
  onDelete: (item: T) => void;
  onRowPress: (item: T) => void;
  isDark: boolean;
  theme: any;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function CatalogList<T extends CatalogItem>({
  data,
  refreshing,
  onRefresh,
  onDelete,
  onRowPress,
  isDark,
  theme,
  ListEmptyComponent
}: CatalogListProps<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
      renderItem={({ item }) => (
        <ItemRow 
          name={item.nombre} 
          onDelete={() => onDelete(item)} 
          onRowPress={() => onRowPress(item)}
          isDark={isDark} 
        />
      )}
      contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
    />
  );
}
