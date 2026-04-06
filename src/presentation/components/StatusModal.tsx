import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';
import { useTranslation } from 'react-i18next';
import { EstadoArticulo } from '../../domain';

interface StatusModalProps {
  visible: boolean;
  itemName: string;
  onSelect: (estado: EstadoArticulo) => void;
  onCancel: () => void;
  isDark?: boolean;
}

export function StatusModal({
  visible,
  itemName,
  onSelect,
  onCancel,
  isDark = true
}: StatusModalProps) {
  const theme = isDark ? Colors.dark : Colors.light;
  const { t } = useTranslation();

  const options: { label: string; value: EstadoArticulo; icon: any; color: string }[] = [
    { label: t('pendiente'), value: 'pendiente', icon: 'circle-outline', color: theme.pending },
    { label: t('comprado'), value: 'comprado', icon: 'check-circle', color: theme.success },
    { label: t('cancelado'), value: 'cancelado', icon: 'close-circle', color: theme.danger },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.content, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, { color: theme.text }]}>{t('changeStatus')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('chooseStatusFor', { name: itemName })}
          </Text>

          <View style={styles.optionsContainer}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.optionButton}
                onPress={() => onSelect(opt.value)}
              >
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name={opt.icon} size={32} color={opt.color} />
                </View>
                <Text style={[styles.optionLabel, { color: theme.text }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>{t('cancel')}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radii.md,
    padding: 24,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  iconBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    marginVertical: 10,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
