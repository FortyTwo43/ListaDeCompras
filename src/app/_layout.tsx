import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../presentation/constants/theme';
import '../presentation/i18n'; // Activa el sistema de idiomas global

export default function RootLayout() {
  const { t } = useTranslation();
  // TODO: Leer del contexto o AsyncStorage si es dark/light (por defecto Dark en las capturas)
  const isDark = true;
  const currentTheme = isDark ? Colors.dark : Colors.light;

  return (
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.surface,
          },
          headerTintColor: currentTheme.text,
          contentStyle: {
            backgroundColor: currentTheme.background,
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
      </Stack>
  );
}
