import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

import { T } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Icon } from '@/components/Icon';
import { useBrowseFilters } from '@/lib/browse';
import { fetchModelCounts } from '@/lib/db';
import { hasSupabaseConfig } from '@/lib/supabase';
import { BMW_MODELS } from '@/data/mock';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Built-in model lists for the makes we know. For any other make we fall
// back to whatever models exist in the listings table.
const MODELS_BY_MAKE: Record<string, string[]> = {
  BMW: BMW_MODELS,
  Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS3', 'RS6 Avant', 'RS Q8', 'TT', 'e-tron'],
  Mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLE-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G 63', 'AMG GT'],
  VW: ['Golf', 'Golf R', 'Passat', 'Polo', 'Tiguan', 'Touareg', 'Arteon', 'ID.3', 'ID.4', 'T-Cross'],
  Toyota: ['Corolla', 'Camry', 'RAV4', 'C-HR', 'Yaris', 'Land Cruiser', 'Hilux', 'Prius', 'Supra'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Ford: ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'Kuga', 'Puma', 'Ranger', 'Explorer'],
  'Range Rover': ['Evoque', 'Velar', 'Sport', 'Sport SVR', 'Range Rover'],
};

export function ModelsScreen() {
  const nav = useNavigation<Nav>();
  const { filters, patch } = useBrowseFilters();
  const make = filters.make ?? 'BMW';
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    setLoading(true);
    fetchModelCounts(make, filters.country).then((c) => {
      setCounts(c);
      setLoading(false);
    });
  }, [make, filters.country]);

  const builtin = MODELS_BY_MAKE[make] ?? [];
  const allModels = Array.from(new Set([...builtin, ...Object.keys(counts)])).sort();

  const pick = (model: string | null) => {
    patch({ model: model ?? undefined });
    nav.navigate('Listings');
  };

  if (loading && allModels.length === 0) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopBar
        title="Select Model"
        subtitle={`${make} · Step ${filters.marketplace === 'import' ? 5 : 4}`}
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Pressable
          onPress={() => pick(null)}
          style={[styles.row, { backgroundColor: filters.model == null ? T.goldTint : 'transparent' }]}
        >
          <Text style={[styles.name, { fontWeight: '700' }]}>All {make} models</Text>
        </Pressable>
        {allModels.map((m) => {
          const sel = filters.model === m;
          const c = counts[m];
          return (
            <Pressable
              key={m}
              onPress={() => pick(m)}
              style={[styles.row, { backgroundColor: sel ? T.goldTint : 'transparent' }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { fontWeight: sel ? '700' : '500' }]}>{m}</Text>
                {c != null && c > 0 && (
                  <Text style={styles.count}>{c.toLocaleString()} listing{c === 1 ? '' : 's'}</Text>
                )}
              </View>
              {sel && (
                <View style={styles.check}>
                  <Icon name="check" color={T.ink} size={16} strokeWidth={2.6} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.hairline,
  },
  name: { fontSize: 15, color: T.ink, fontFamily: T.font },
  count: { fontSize: 11, color: T.muted, fontFamily: T.mono, marginTop: 1 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
