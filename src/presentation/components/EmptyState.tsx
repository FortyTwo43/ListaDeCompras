import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRandomKaomoji } from '../constants/kaomojis';
import { Colors } from '../constants/theme';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  messageKey: string;
  isDark: boolean;
}

export function EmptyState({ messageKey, isDark }: EmptyStateProps) {
  const { t } = useTranslation();
  const theme = isDark ? Colors.dark : Colors.light;

  // Fijar un kaomoji por renderizado o mount
  const [kaomoji] = useState(getRandomKaomoji());

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.kaomoji, { color: theme.text }]}>{kaomoji}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {t(messageKey)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  kaomoji: {
    fontSize: 48,
    marginBottom: 16,
    fontWeight: '300',
  },
  message: {
    fontSize: 16,
  },
});
