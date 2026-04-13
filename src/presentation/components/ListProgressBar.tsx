import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface ListProgressBarProps {
  progreso: number;
  theme: any;
}

export function ListProgressBar({ progreso, theme }: ListProgressBarProps) {
  // Asegurar que el progreso siempre sea un número entre 0 y 100 (evitar NaN o desbordamientos)
  const safeProgress = Math.min(Math.max(Number(progreso) || 0, 0), 100);

  return (
    <View style={styles.topProgressWrapper}>
      <View style={[styles.progressBarBackground, { backgroundColor: theme.primary }]}>
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: Colors.dark.success, width: `${safeProgress}%` }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topProgressWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  progressBarBackground: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
