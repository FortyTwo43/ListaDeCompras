import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SearchHeaderProps {
  title: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  placeholder = 'Buscar...',
  onChangeText,
  showBack = false,
  onBackPress,
}) => {
  const { theme } = useAppTheme();
  const router = useRouter();
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
    onChangeText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.content}>
        
        {/* Lado Izquierdo: Botón de regresar nativo o el Botón para cerrar la búsqueda */}
        {(showBack || isSearching) ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={isSearching ? closeSearch : onBackPress}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : null}

        {/* Título o Input de Búsqueda */}
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
                onChangeText(text);
              }}
              returnKeyType="search"
            />
          ) : (
            <Text 
              style={[styles.title, { color: theme.text, marginLeft: showBack ? 0 : 16 }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        {/* Lado Derecho: Lupa y Configuración */}
        <View style={styles.rightActions}>
          {!isSearching && (
            <TouchableOpacity style={styles.iconButton} onPress={startSearch}>
              <MaterialCommunityIcons name="magnify" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/configuracion' as any)}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100, // Misma altura que definimos en Detalles y Configuración
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 56, // Altura segura del contenido real
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
    padding: 0, // Quitamos padding por defecto
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
