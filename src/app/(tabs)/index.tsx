import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyState } from '../../presentation/components/EmptyState';
import { Fab } from '../../presentation/components/Fab';
import { Colors } from '../../presentation/constants/theme';
import { useRouter } from 'expo-router';

export default function ListasScreen() {
  // TODO: Simular fetching de UseCases. Si no hay, mostrar vacío.
  const hasLists = false; 
  const isDark = true; 
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!hasLists ? (
        <EmptyState messageKey="noLists" isDark={isDark} />
      ) : (
        // Aquí iría el componente Section de las tarjetas
        <View />
      )}
      
      <Fab onPress={() => { /* Modal para nueva lista */ }} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
