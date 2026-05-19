import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Badge } from '@/components/Badge';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { fetchImportJobs, ImportJob, publishImportJob, skipImportJob } from '@/lib/db';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SocialImportedScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { dealer, session, ensureDealer } = useAuth();
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'ready' | 'review' | 'skipped'>('all');

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const d = dealer ?? (await ensureDealer(session.user.user_metadata?.name ?? 'Dealer'));
      const list = await fetchImportJobs(d.id);
      setJobs(list);
    } catch (err: any) {
      Alert.alert('Could not load', err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [session, dealer, ensureDealer]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onPublish = async (job: ImportJob) => {
    if (!session) return;
    setBusyId(job.id);
    try {
      const d = dealer ?? (await ensureDealer(session.user.user_metadata?.name ?? 'Dealer'));
      await publishImportJob(job.id, session.user.id, d.id);
      await load();
    } catch (err: any) {
      Alert.alert('Could not publish', err?.message ?? String(err));
    } finally {
      setBusyId(null);
    }
  };

  const onSkip = async (job: ImportJob) => {
    setBusyId(job.id);
    try {
      await skipImportJob(job.id);
      await load();
    } catch (err: any) {
      Alert.alert('Could not skip', err?.message ?? String(err));
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    all: jobs.length,
    ready: jobs.filter((j) => j.status === 'ready').length,
    review: jobs.filter((j) => j.status === 'review').length,
    skipped: jobs.filter((j) => j.status === 'skipped').length,
  };
  const filtered = tab === 'all' ? jobs : jobs.filter((j) => j.status === tab);

  return (
    <View style={styles.root}>
      <TopBar
        title="Imported inventory"
        subtitle={`${counts.ready} ready · ${counts.review} need review`}
        variant="white"
        onBack={() => nav.goBack()}
        trailing={
          <Pressable onPress={load}>
            <Icon name="sync" color={T.ink} size={20} />
          </Pressable>
        }
      />
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['all', 'ready', 'review', 'skipped'] as const).map((t) => {
            const a = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[
                  styles.tab,
                  { backgroundColor: a ? T.ink : '#fff', borderWidth: a ? 0 : StyleSheet.hairlineWidth },
                ]}
              >
                <Text style={[styles.tabText, { color: a ? '#fff' : T.body }]}>{labelFor(t)}</Text>
                <Text style={[styles.tabCount, { color: a ? T.gold : T.muted }]}>{counts[t]}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 130 }}
        refreshControl={<RefreshControl refreshing={loading && jobs.length > 0} onRefresh={load} />}
      >
        {loading && jobs.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={T.gold} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="sparkles" color={T.muted} size={28} />
            <Text style={styles.emptyTitle}>No imports yet</Text>
            <Text style={styles.emptySub}>Paste a post caption and let Claude extract the listing.</Text>
            <Pressable onPress={() => nav.navigate('SocialImporting')} style={{ marginTop: 14, alignSelf: 'stretch' }}>
              <Button variant="primary" size="md" icon="sparkles">Import a post</Button>
            </Pressable>
          </View>
        ) : (
          filtered.map((j) => (
            <Row key={j.id} job={j} busy={busyId === j.id} onPublish={() => onPublish(j)} onSkip={() => onSkip(j)} onReview={() => nav.navigate('SocialReview', { jobId: j.id } as never)} />
          ))
        )}
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Button variant="primary" size="md" icon="bolt" onPress={() => nav.navigate('SocialImporting')}>
          Import another post
        </Button>
      </View>
    </View>
  );
}

function Row({
  job, busy, onPublish, onSkip, onReview,
}: { job: ImportJob; busy: boolean; onPublish: () => void; onSkip: () => void; onReview: () => void }) {
  const e = job.ai_extraction;
  const title = e?.make && e?.model ? `${e.make} ${e.model}` : 'Untitled';
  const sub = describeJob(job);
  const hue = hueForName(title);
  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <CarPhoto hue={hue} height={60} />
        {job.source && (
          <View style={styles.srcBadge}>
            <Text style={styles.srcBadgeText}>{job.source === 'instagram' ? 'IG' : 'FB'}</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
        <View style={styles.metaRow}>
          <StatusBadge status={job.status} />
          {job.ai_confidence != null && (
            <Text style={styles.conf}>AI {job.ai_confidence}%</Text>
          )}
        </View>
      </View>
      <View style={{ gap: 6, alignItems: 'flex-end' }}>
        {busy ? (
          <ActivityIndicator color={T.ink} />
        ) : job.status === 'ready' ? (
          <Pressable onPress={onPublish} style={styles.actionGold}>
            <Text style={styles.actionGoldText}>Publish</Text>
          </Pressable>
        ) : job.status === 'review' ? (
          <Pressable onPress={onReview} style={styles.actionDark}>
            <Text style={styles.actionDarkText}>Review</Text>
          </Pressable>
        ) : job.status === 'published' ? (
          <Icon name="check" color={T.green} size={20} strokeWidth={2.6} />
        ) : (
          <Pressable onPress={onSkip} style={styles.actionGhost}>
            <Text style={styles.actionGhostText}>Hide</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function StatusBadge({ status }: { status: ImportJob['status'] }) {
  if (status === 'ready')      return <Badge color={T.greenSoft}   fg={T.green} size="sm">Ready</Badge>;
  if (status === 'review')     return <Badge color={T.redSoft}     fg={T.red}   size="sm">Needs review</Badge>;
  if (status === 'duplicate')  return <Badge color={T.surfaceAlt}  fg={T.body}  size="sm">Duplicate</Badge>;
  if (status === 'published')  return <Badge color={T.greenSoft}   fg={T.green} size="sm">Published</Badge>;
  if (status === 'skipped')    return <Badge color={T.surfaceAlt}  fg={T.body}  size="sm">Skipped</Badge>;
  if (status === 'failed')     return <Badge color={T.redSoft}     fg={T.red}   size="sm">Failed</Badge>;
  return <Badge color={T.surfaceAlt} fg={T.body} size="sm">{status}</Badge>;
}

function describeJob(j: ImportJob): string {
  const e = j.ai_extraction;
  if (e?.price_eur) return `€${e.price_eur.toLocaleString()} · ${e.year ?? '—'}`;
  if (j.status === 'review') return j.ai_extraction?.notes?.[0] ?? 'Missing fields';
  if (j.status === 'failed') return j.error ?? 'Extraction failed';
  return 'Awaiting extraction';
}

function labelFor(t: 'all' | 'ready' | 'review' | 'skipped'): string {
  return t === 'all' ? 'All' : t === 'ready' ? 'Ready' : t === 'review' ? 'Needs review' : 'Skipped';
}

function hueForName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  tabRow: { paddingHorizontal: 16, paddingVertical: 8 },
  tab: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    borderColor: T.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabText: { fontSize: 12, fontWeight: '700', fontFamily: T.font },
  tabCount: { fontSize: 10, fontFamily: T.mono },
  empty: { padding: 30, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  emptySub: { fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: T.font },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photo: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  srcBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  srcBadgeText: { color: '#fff', fontSize: 8, fontWeight: '700', fontFamily: T.mono },
  title: { fontSize: 13, fontWeight: '700', color: T.ink, lineHeight: 16, fontFamily: T.font },
  sub: { fontSize: 11, color: T.muted, marginTop: 2, fontFamily: T.font },
  metaRow: { flexDirection: 'row', gap: 5, marginTop: 6, alignItems: 'center' },
  conf: { fontSize: 10, color: T.muted, fontFamily: T.mono },
  actionGold: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: T.gold },
  actionGoldText: { fontSize: 11, fontWeight: '700', color: T.ink, fontFamily: T.font },
  actionDark: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: T.ink },
  actionDarkText: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: T.font },
  actionGhost: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
  },
  actionGhostText: { fontSize: 11, fontWeight: '700', color: T.body, fontFamily: T.font },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
