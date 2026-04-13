import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Colors } from '../constants/theme';
import { Medida } from '../../domain';
import { useTranslation } from 'react-i18next';

interface QuantityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (finalQuantity: number, finalMedidaId: string) => void;
  itemName: string;
  initialQuantity: string;
  initialMedidaId?: string;
  medidasCatalog: Medida[];
  theme: any;
}

export function QuantityModal({
  visible,
  onClose,
  onSave,
  itemName,
  initialQuantity,
  initialMedidaId,
  medidasCatalog,
  theme
}: QuantityModalProps) {
  const { t } = useTranslation();
  const [localQuantity, setLocalQuantity] = useState('1');
  const [localMedidaId, setLocalMedidaId] = useState('');

  useEffect(() => {
    if (visible) {
      setLocalQuantity(initialQuantity || '1');
      setLocalMedidaId(initialMedidaId || (medidasCatalog.length > 0 ? medidasCatalog[0].id : ''));
    }
  }, [visible, initialQuantity, initialMedidaId, medidasCatalog]);

  const handleSave = () => {
    const qty = parseFloat(localQuantity);

    // Validación de cantidad: debe ser un número válido y estrictamente mayor que cero
    if (isNaN(qty) || qty <= 0) {
      Alert.alert(t('error'), t('errorQuantityRequired'));
      return;
    }

    // Validación de unidad de medida: no puede estar vacía
    if (!localMedidaId) {
      Alert.alert(t('error'), t('errorMeasureRequired'));
      return;
    }

    onSave(qty, localMedidaId);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>{itemName}</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('quantity')}</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="0.0"
            placeholderTextColor={theme.textSecondary}
            value={localQuantity}
            onChangeText={setLocalQuantity}
            keyboardType="numeric"
          />

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('measure')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
            {medidasCatalog.map((medida: Medida) => (
              <TouchableOpacity
                key={medida.id}
                onPress={() => setLocalMedidaId(medida.id)}
                style={[
                  styles.measureChip,
                  { 
                    backgroundColor: localMedidaId === medida.id ? theme.primary : theme.background,
                    borderColor: theme.border,
                  }
                ]}
              >
                <Text style={{ color: localMedidaId === medida.id ? '#FFF' : theme.text }}>
                  {medida.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={styles.actionButton}>
              <Text style={{ color: theme.textSecondary }}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.actionButton, { backgroundColor: theme.primary, borderRadius: 6 }]}>
              <Text style={{ color: '#FFF' }}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  measureChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
