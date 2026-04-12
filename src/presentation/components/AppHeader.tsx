import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Interfaz para definir qué opciones (Slots) extra acepta nuestra cabecera
export interface AppHeaderOptions {
  onSearch?: (text: string) => void;
  placeholder?: string;
  headerRight?: () => React.ReactNode;
  headerLeft?: () => React.ReactNode;
}

export function AppHeader({ options, navigation }: BottomTabHeaderProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  // Extraemos tanto las opciones nativas como nuestras opciones personalizadas (Slots)
  const title = options.title || '';
  const { onSearch, placeholder = 'Buscar...', headerRight, headerLeft } = options as any;

  // Estado interno de la Cabecera
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const startSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearching(false);
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.surface, 
        borderBottomColor: theme.border,
        paddingTop: insets.top // Respetar el "notch" o la barra de notificaciones nativa
      }
    ]}>
      <View style={styles.content}>
        
        {/* SLOT IZQUIERDO: Flecha de regreso de búsqueda O slot personalizado */}
        {isSearching ? (
          <TouchableOpacity style={styles.iconButton} onPress={closeSearch}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          headerLeft ? headerLeft() : null
        )}

        {/* SLOT CENTRAL: Input O Título */}
        <View style={styles.titleContainer}>
          {isSearching ? (
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: theme.text }]}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (onSearch) onSearch(text);
              }}
              returnKeyType="search"
            />
          ) : (
            <Text style={[styles.title, { color: theme.text, marginLeft: (headerLeft || isSearching) ? 0 : 16 }]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* SLOT DERECHO: Lupa (si onSearch existe) + Slots personalizados */}
        <View style={styles.rightActions}>
          {!isSearching && onSearch && (
            <TouchableOpacity style={styles.iconButton} onPress={startSearch}>
              <MaterialCommunityIcons name="magnify" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          
          {/* Aquí inyectamos cualquier botón extra que la pantalla quiera agregar */}
          {!isSearching && headerRight && headerRight()}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 60, // Altura del contenido (excluyendo el paddingTop del notch)
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
  },
  input: {
    fontSize: 18,
    padding: 0,
    marginHorizontal: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  }
});
