import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface SelectionHeaderProps {
  newItemName: string;
  onNewItemNameChange: (text: string) => void;
  onBackPress: () => void;
  onAddPress: () => void;
  theme: any;
}

export function SelectionHeader({ newItemName, onNewItemNameChange, onBackPress, onAddPress, theme }: SelectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.customHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBackPress} style={styles.headerIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <RNTextInput
          style={[styles.headerInput, { color: theme.text }]}
          placeholder={t('newItem') + "..."}
          placeholderTextColor={theme.textSecondary}
          value={newItemName}
          onChangeText={onNewItemNameChange}
          autoFocus
        />

        <TouchableOpacity 
          onPress={onAddPress}
          style={[styles.headerIcon, { opacity: newItemName.trim() ? 1 : 0.5, marginRight: 10 }]}
        >
          <MaterialCommunityIcons name="plus" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    height: 100,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 56,
  },
  headerIcon: {
    padding: 8,
  },
  headerInput: {
    flex: 1,
    fontSize: 18,
    marginHorizontal: 8,
  },
});
