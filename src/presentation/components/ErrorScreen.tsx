import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../context/ThemeContext';
import { getRandomKaomoji } from '../constants/kaomojis';

interface ErrorScreenProps {
  error: Error;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  
  // Computamos el kaomoji una vez por ciclo de renderizado.
  const [kaomoji] = useState(getRandomKaomoji());

  return (
    <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.kaomojiText, { color: theme.textSecondary }]}>{kaomoji}</Text>
      <Text style={[styles.errorTitle, { color: theme.text }]}>{t('dbErrorTitle')}</Text>
      <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
        {t('dbErrorMessage')}
      </Text>
      <Text style={[styles.errorDetails, { color: theme.danger }]}>
        {error.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  kaomojiText: {
    fontSize: 48,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  }
});
