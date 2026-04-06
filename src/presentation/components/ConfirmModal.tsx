import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDark?: boolean;
  isDestructive?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDark = true,
  isDestructive = true
}: ConfirmModalProps) {
  const theme = isDark ? Colors.dark : Colors.light;
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={[styles.content, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name={isDestructive ? "alert-circle-outline" : "help-circle-outline"} 
                size={32} 
                color={isDestructive ? "#FF9800" : theme.primary} 
              />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          </View>

          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.button}>
              <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>
                {cancelText || t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onConfirm} 
              style={[
                styles.button, 
                styles.confirmButton, 
                { backgroundColor: theme.primary }
              ]}
            >
              <Text style={{ color: '#FFF', fontWeight: '700' }}>
                {confirmText || (isDestructive ? t('delete') : t('save'))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Radii.md,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radii.sm,
  },
  confirmButton: {
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
