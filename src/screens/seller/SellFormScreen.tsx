import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { BODY_TYPES, FUEL_TYPES, COUNTRIES, useSellDraft, SellDraft } from '@/lib/sellFlow';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SellFormScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { draft, set } = useSellDraft();
  const cities = COUNTRIES.find((c) => c.code === draft.country)?.cities ?? [];

  const canContinue =
    draft.make.trim().length > 0 &&
    draft.model.trim().length > 0 &&
    /^\d{4}$/.test(draft.year) &&
    Number(draft.year) >= 1950 &&
    Number(draft.year) <= 2030;

  return (
    <View style={styles.root}>
      <TopBar
        title="Place an ad"
        subtitle="Step 2 of 5 · Details"
        leading="close"
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} keyboardShouldPersistTaps="handled">
        <View style={styles.progress}><View style={[styles.progressFill, { width: '40%' }]} /></View>
        <Text style={styles.crumb}>
          MOTORS  ›  CARS  ›  {draft.marketplace === 'balkans' ? 'BALKANS' : 'IMPORT'}
        </Text>
        <Text style={styles.title}>Tell us about your car</Text>

        <View style={{ marginTop: 18, gap: 12 }}>
          <Input label="Make *" value={draft.make} onChange={(v) => set('make', v)} placeholder="BMW, Audi…" autoCapitalize="words" />
          <Input label="Model *" value={draft.model} onChange={(v) => set('model', v)} placeholder="M3, RS6…" autoCapitalize="words" />
          <Input label="Trim" value={draft.trim} onChange={(v) => set('trim', v)} placeholder="Competition, Avant…" />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input label="Year *" value={draft.year} onChange={(v) => set('year', v.replace(/\D/g, '').slice(0, 4))} placeholder="2024" keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Kilometers" value={draft.km} onChange={(v) => set('km', v.replace(/\D/g, ''))} placeholder="4200" keyboardType="numeric" />
            </View>
          </View>

          <Pills label="Body type" options={BODY_TYPES} value={draft.body} onPick={(v) => set('body', v)} />
          <Pills label="Fuel" options={FUEL_TYPES} value={draft.fuel} onPick={(v) => set('fuel', v)} />

          <Input
            label="Price (EUR)"
            value={draft.price_eur}
            onChange={(v) => set('price_eur', v.replace(/\D/g, ''))}
            placeholder="121300"
            keyboardType="numeric"
          />

          <Pills
            label="Country"
            options={COUNTRIES.map((c) => c.code)}
            displayMap={Object.fromEntries(COUNTRIES.map((c) => [c.code, c.name]))}
            value={draft.country}
            onPick={(v) => {
              const c = COUNTRIES.find((x) => x.code === v);
              set('country', v);
              if (c && !c.cities.includes(draft.city)) set('city', '');
            }}
          />

          {cities.length > 0 && (
            <Pills
              label="City"
              options={cities}
              value={draft.city}
              onPick={(v) => set('city', v)}
            />
          )}

          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={draft.description}
              onChangeText={(v) => set('description', v)}
              placeholder="Single owner, fully serviced, …"
              placeholderTextColor={T.muted}
              multiline
              style={styles.textarea}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button
          variant="primary"
          size="md"
          iconRight="chevR"
          onPress={() => nav.navigate('SellPhotos')}
          disabled={!canContinue}
        >
          Next: photos
        </Button>
      </View>
    </View>
  );
}

// ============================================================
// Inputs
// ============================================================

function Input({
  label, value, onChange, placeholder, keyboardType, autoCapitalize,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={T.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={styles.input}
        />
      </View>
    </View>
  );
}

function Pills<T extends string>({
  label, options, value, onPick, displayMap,
}: {
  label: string;
  options: readonly T[];
  value: string;
  onPick: (v: T) => void;
  displayMap?: Record<string, string>;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillRow}>
        {options.map((o) => {
          const sel = value === o;
          return (
            <Pressable
              key={o}
              onPress={() => onPick(o)}
              style={[styles.pill, { backgroundColor: sel ? T.gold : T.surfaceAlt }]}
            >
              <Text style={[styles.pillText, { fontWeight: sel ? '700' : '600' }]}>
                {displayMap?.[o] ?? o}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  progress: { height: 4, backgroundColor: T.hairline, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: T.gold },
  crumb: { fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 8, letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, marginTop: 8, letterSpacing: -0.4, fontFamily: T.font },
  label: { fontSize: 12, color: T.body, fontWeight: '600', marginBottom: 6, fontFamily: T.font },
  inputBox: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.hairline,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: 14, color: T.ink, fontFamily: T.font, padding: 0 },
  textarea: {
    minHeight: 90,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.hairline,
    backgroundColor: '#fff',
    fontSize: 14,
    color: T.ink,
    fontFamily: T.font,
    textAlignVertical: 'top',
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  pillText: { fontSize: 12, color: T.ink, fontFamily: T.font, textTransform: 'capitalize' },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
