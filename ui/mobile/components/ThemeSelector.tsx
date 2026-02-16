import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type MobileTheme = 'light' | 'dark';

export interface ThemeSelectorProps {
  theme: MobileTheme;
  onChange: (t: MobileTheme) => void;
}

export default function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <View style={styles.buttons}>
        <Pressable onPress={() => onChange('light')} style={[styles.btn, theme === 'light' && styles.btnActive]}>
          <Text style={[styles.btnText, theme === 'light' && styles.btnTextActive]}>Light</Text>
        </Pressable>
        <Pressable onPress={() => onChange('dark')} style={[styles.btn, theme === 'dark' && styles.btnActive]}>
          <Text style={[styles.btnText, theme === 'dark' && styles.btnTextActive]}>Dark</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  btnText: {
    color: '#374151',
    fontWeight: '600',
  },
  btnTextActive: {
    color: '#fff',
  },
});
