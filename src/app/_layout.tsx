import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider as ContextThemeProvider, useAppTheme } from '../presentation/context/ThemeContext';
import '../presentation/i18n'; // Activa el sistema de idiomas global
import { initDatabase } from '../infrastructure/database/sqliteConfig';
import { ErrorScreen } from '../presentation/components/ErrorScreen';


function RootNavigation() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [dbError, setDbError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      initDatabase();
    } catch (e) {
      console.error("Error al inicializar SQLite", e);
      setDbError(e as Error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  if (isInitializing) {
    // You could return a Splash screen here, but returning null is standard.
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  if (dbError) {
    return <ErrorScreen error={dbError} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        contentStyle: {
          backgroundColor: theme.background,
        }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false  }} />
      <Stack.Screen
        name="detalles/[id]"
        options={{
          headerShown: false,
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="configuracion"
        options={{
          title: t('settings') || 'Configuración',
          presentation: 'card'
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ContextThemeProvider>
      <RootNavigation />
    </ContextThemeProvider>
  );
}

