import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../presentation/context/ThemeContext';

export default function TabLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('lists') || 'Listas de Compras',
          tabBarLabel: t('lists'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-list" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="articulos"
        options={{
          title: t('items') || 'Artículos',
          tabBarLabel: t('items'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="medidas"
        options={{
          title: t('measures') || 'Medidas',
          tabBarLabel: t('measures'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="scale-balance" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
