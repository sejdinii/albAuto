import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { T } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: IconName;
  rightLabel?: string;
  error?: string;
  focused?: boolean;
  secureTextEntry?: boolean;
  onChangeText?: (v: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
};

export function Field({ label, value, placeholder, icon, rightLabel, error, focused, secureTextEntry, onChangeText, keyboardType }: Props) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.box,
          { borderColor: focused ? T.ink : error ? T.red : T.hairline },
        ]}
      >
        {icon && <Icon name={icon} color={T.muted} size={18} />}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={T.muted}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          style={styles.input}
        />
        {rightLabel && <Text style={styles.right}>{rightLabel}</Text>}
      </View>
      {error && <Text style={styles.err}>{error}</Text>}
    </View>
  );
}

export function SelectField({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, { borderColor: T.hairline }]}>
        <Text style={styles.input}>{value}</Text>
        <Icon name="chevD" color={T.muted} size={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: T.body,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: T.font,
  },
  box: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
    fontFamily: T.font,
    padding: 0,
  },
  right: {
    fontSize: 12,
    color: T.ink,
    fontWeight: '600',
    fontFamily: T.font,
  },
  err: {
    fontSize: 11,
    color: T.red,
    marginTop: 4,
    fontFamily: T.font,
  },
});
