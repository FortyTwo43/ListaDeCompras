import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../presentation/context/ThemeContext';

export default function ConfiguracionScreen() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme, theme } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[
        styles.customHeader,
        {
          backgroundColor: theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.border
        }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 20 }]}>
          {t('settings')}
        </Text>
      </View>
      
      <View style={styles.section}>
        {/* Row para Tema sin divisorias */}
        <View style={[styles.row, { backgroundColor: theme.surface }]}>
          <Text style={[styles.rowText, { color: theme.text }]}>{t('darkTheme')}</Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDark ? theme.text : theme.textSecondary}
          />
        </View>

        {/* Row para Idioma sin divisorias */}
        <TouchableOpacity 
          style={[styles.row, { backgroundColor: theme.surface, marginTop: 1 }]}
          onPress={() => {
            const nextLang = i18n.language === 'es' ? 'en' : 'es';
            i18n.changeLanguage(nextLang);
          }}
        >
          <Text style={[styles.rowText, { color: theme.text }]}>{t('language')}</Text>
          <Text style={[styles.valueText, { color: theme.primary }]}>
            {i18n.language === 'es' ? t('spanish') : t('english')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    height: 100, // Altura que estableciste en la pantalla Detalles
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36, // Mismo espaciado de seguridad
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 12,
  },
  headerTitle: {
    fontSize: 22,
    marginLeft: 12,
  },
  section: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64, // <-- CAMBIA ESTE NÚMERO (ej. 56, 64, 72) PARA PROBAR EL TAMAÑO QUE MÁS TE GUSTE
    paddingHorizontal: 20,
    marginBottom: -1,
    // Eliminamos cualquier borderBottomWidth para cumplir sin separaciones
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
