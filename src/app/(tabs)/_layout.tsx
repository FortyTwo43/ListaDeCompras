import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../presentation/constants/theme';

export default function TabLayout() {
  const { t } = useTranslation();
  const isDark = true;
  const currentTheme = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentTheme.text,
        tabBarInactiveTintColor: currentTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: currentTheme.surface,
          borderTopColor: currentTheme.border,
        },
        headerStyle: {
          backgroundColor: currentTheme.surface,
          borderBottomColor: currentTheme.border,
          borderBottomWidth: 1,
        },
        headerTintColor: currentTheme.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Listas de Compras',
          tabBarLabel: t('lists'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-list" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="articulos"
        options={{
          title: 'Artículos',
          tabBarLabel: t('items'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="medidas"
        options={{
          title: 'Medidas',
          tabBarLabel: t('measures'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="scale" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
