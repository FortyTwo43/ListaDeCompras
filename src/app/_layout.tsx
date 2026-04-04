import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider as ContextThemeProvider, useAppTheme } from '../presentation/context/ThemeContext';
import '../presentation/i18n'; // Activa el sistema de idiomas global

function RootNavigation() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

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
