import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert, TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { AIExtraction, ImportJob, publishImportJob, skipImportJob } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'SocialReview'>;

export function SocialReviewScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const insets = useSafeAreaInsets();
  const { session, dealer, ensureDealer } = useAuth();
  const [job, setJob] = useState<ImportJob | null>(null);
  const [extraction, setExtraction] = useState<AIExtraction | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const jobId = route.params?.jobId;
      let row: ImportJob | null = null;
      if (jobId) {
        const { data } = await supabase.from('import_jobs').select('*').eq('id', jobId).single();
        row = (data as ImportJob | null) ?? null;
      } else {
        const { data } = await supabase
          .from('import_jobs')
          .select('*')
          .eq('status', 'review')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        row = (data as ImportJob | null) ?? null;
      }
      setJob(row);
      setExtraction(row?.ai_extraction ?? null);
    } finally {
      setLoading(false);
    }
  }, [route.params?.jobId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const set = (k: keyof AIExtraction, v: any) => setExtraction((e) => (e ? { ...e, [k]: v } : e));

  const save = async () => {
    if (!job || !extraction) return;
    const { error } = await supabase
      .from('import_jobs')
      .update({ ai_extraction: extraction })
      .eq('id', job.id);
    if (error) Alert.alert('Save failed', error.message);
  };

  const onApprove = async () => {
    if (!job || !extraction || !session) return;
    if (!extraction.make || !extraction.model || !extraction.year) {
      Alert.alert('Missing fields', 'Make, model and year are required to publish.');
      return;
    }
    setBusy(true);
    try {
      await save();
      const d = dealer ?? (await ensureDealer(session.user.user_metadata?.name ?? 'Dealer'));
      await publishImportJob(job.id, session.user.id, d.id);
      nav.goBack();
    } catch (err: any) {
      Alert.alert('Could not publish', err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  const onSkip = async () => {
    if (!job) return;
    setBusy(true);
    try {
      await skipImportJob(job.id);
      nav.goBack();
    } catch (err: any) {
      Alert.alert('Could not skip', err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  if (!job || !extraction) {
    return (
      <View style={styles.root}>
        <TopBar title="Review listing" variant="white" onBack={() => nav.goBack()} />
        <View style={[styles.center, { padding: 30 }]}>
          <Icon name="check" color={T.green} size={28} />
          <Text style={styles.emptyTitle}>Nothing to review</Text>
          <Text style={styles.emptySub}>Imports needing review will show up here.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopBar
        title="Review listing"
        subtitle={job.source === 'instagram' ? 'From Instagram' : 'From caption'}
        variant="white"
        onBack={() => nav.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 130 }}>
        <View style={styles.source}>
          <View style={styles.sourcePhoto}>
            <CarPhoto hue={hueForName(extraction.make ?? '')} height={70} dark />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={styles.sourceHead}>
              <Icon name={job.source === 'facebook' ? 'facebook' : 'instagram'} color={T.ink} size={12} />
              <Text style={styles.sourceHandle}>Imported caption</Text>
            </View>
            <Text style={styles.sourceCaption} numberOfLines={3}>
              {job.caption ?? '(no caption)'}
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Auto-filled · review and edit</Text>

        <View style={{ gap: 10 }}>
          <Editable label="Make & Model" value={`${extraction.make ?? ''} ${extraction.model ?? ''}`.trim()}
            onChange={(s) => {
              const [make, ...rest] = s.split(' ');
              set('make', make || null);
              set('model', rest.join(' ') || null);
            }}
          />
          <Editable label="Year" value={extraction.year != null ? String(extraction.year) : ''}
            onChange={(s) => set('year', Number(s.replace(/\D/g, '')) || null)} keyboardType="numeric" />
          <Editable label="Trim" value={extraction.trim ?? ''} onChange={(s) => set('trim', s || null)} />
          <Editable label="Price (EUR)"
            value={extraction.price_eur != null ? String(extraction.price_eur) : ''}
            onChange={(s) => set('price_eur', Number(s.replace(/\D/g, '')) || null)}
            keyboardType="numeric"
            error={extraction.price_eur == null ? "Couldn't read price from caption" : undefined}
          />
          <Editable label="Mileage (km)"
            value={extraction.km != null ? String(extraction.km) : ''}
            onChange={(s) => set('km', Number(s.replace(/\D/g, '')) || null)}
            keyboardType="numeric"
            warning={(extraction.confidence ?? 100) < 70 ? 'Low confidence — please verify' : undefined}
          />
          <Editable label="City" value={extraction.city ?? ''} onChange={(s) => set('city', s || null)} />
        </View>

        {extraction.notes && extraction.notes.length > 0 && (
          <View style={styles.hint}>
            <Icon name="sparkles" color={T.goldDark} size={18} />
            <Text style={styles.hintText}>
              <Text style={styles.hintBold}>AI notes: </Text>
              {extraction.notes.join(' · ')}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <View style={{ flex: 1 }}>
          <Button variant="outline" size="md" onPress={onSkip} disabled={busy}>
            Skip
          </Button>
        </View>
        <View style={{ flex: 1.6 }}>
          <Button variant="primary" size="md" iconRight="chevR" onPress={onApprove} disabled={busy}>
            {busy ? <ActivityIndicator color={T.ink} /> : 'Approve & publish'}
          </Button>
        </View>
      </View>
    </View>
  );
}

function Editable({
  label, value, onChange, error, warning, keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  warning?: string;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View>
      <Text style={styles.editLabel}>{label.toUpperCase()}</Text>
      <View
        style={[
          styles.editBox,
          { borderColor: error ? T.red : warning ? T.gold : T.hairline },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          style={styles.editInput}
          keyboardType={keyboardType}
          placeholder="—"
          placeholderTextColor={T.muted}
        />
        {(error || warning) && (
          <Icon name="questionmark" color={error ? T.red : T.gold} size={16} />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {warning && <Text style={styles.warnText}>{warning}</Text>}
    </View>
  );
}

function hueForName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
  source: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    marginBottom: 14,
  },
  sourcePhoto: { width: 70, height: 70, borderRadius: 10, overflow: 'hidden' },
  sourceHead: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sourceHandle: { fontSize: 11, fontWeight: '700', color: T.ink, fontFamily: T.font },
  sourceCaption: { fontSize: 12, color: T.body, marginTop: 4, lineHeight: 17, fontFamily: T.font },
  section: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: T.font,
  },
  editLabel: {
    fontSize: 11,
    color: T.body,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 5,
    fontFamily: T.font,
  },
  editBox: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: { flex: 1, fontSize: 14, color: T.ink, fontFamily: T.font, paddingVertical: 10 },
  errorText: { fontSize: 10, color: T.red, marginTop: 4, fontWeight: '600', fontFamily: T.font },
  warnText: { fontSize: 10, color: T.goldDark, marginTop: 4, fontWeight: '600', fontFamily: T.font },
  hint: {
    marginTop: 14,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
  },
  hintText: { flex: 1, fontSize: 12, color: T.body, lineHeight: 17, fontFamily: T.font },
  hintBold: { fontWeight: '700', color: T.ink },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
});
