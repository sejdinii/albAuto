import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { useAuth } from '@/lib/auth';
import { useSellDraft } from '@/lib/sellFlow';
import { attachPhotosToListing, createListing, Listing } from '@/lib/db';
import { uploadListingPhoto } from '@/lib/storage';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Phase = 'working' | 'done' | 'error';

export function SellPublishedScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const { draft, reset } = useSellDraft();
  const [phase, setPhase] = useState<Phase>('working');
  const [step, setStep] = useState('Saving listing…');
  const [listing, setListing] = useState<Listing | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!session) {
        setPhase('error');
        setErrorText('You must be signed in to publish.');
        return;
      }
      try {
        setStep('Saving listing…');
        const created = await createListing(session.user.id, {
          make: draft.make,
          model: draft.model,
          trim: draft.trim || undefined,
          year: Number(draft.year),
          km: draft.km ? Number(draft.km) : null,
          body: draft.body || null,
          fuel: draft.fuel || null,
          price_eur: draft.price_eur ? Number(draft.price_eur) : null,
          city: draft.city || null,
          country: draft.country,
          description: draft.description || null,
          tier: draft.tier,
        });
        if (cancelled) return;

        if (draft.photos.length > 0) {
          setStep(`Uploading ${draft.photos.length} photo${draft.photos.length === 1 ? '' : 's'}…`);
          const uploaded: { storagePath: string; url: string }[] = [];
          for (const p of draft.photos) {
            const r = await uploadListingPhoto(session.user.id, p.uri);
            uploaded.push(r);
          }
          await attachPhotosToListing(created.id, uploaded);
        }

        if (cancelled) return;
        setListing(created);
        setPhase('done');
      } catch (err: any) {
        if (cancelled) return;
        setPhase('error');
        setErrorText(err?.message ?? String(err));
      }
    };
    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewListing = () => {
    if (!listing) return;
    reset();
    nav.reset({
      index: 1,
      routes: [
        { name: 'Tabs', params: { screen: 'HomeTab' } },
        { name: 'CarDetail', params: { id: listing.id } },
      ],
    });
  };

  if (phase === 'working') {
    return (
      <View style={styles.root}>
        <View style={styles.center}>
          <ActivityIndicator color={T.gold} size="large" />
          <Text style={styles.workTitle}>Publishing…</Text>
          <Text style={styles.workSub}>{step}</Text>
        </View>
      </View>
    );
  }

  if (phase === 'error') {
    return (
      <View style={styles.root}>
        <View style={styles.center}>
          <View style={styles.errorBadge}>
            <Icon name="close" color="#fff" size={32} strokeWidth={3} />
          </View>
          <Text style={styles.title}>Could not publish</Text>
          <Text style={styles.sub}>{errorText}</Text>
        </View>
        <View style={[styles.btns, { paddingBottom: 24 + insets.bottom }]}>
          <Button variant="primary" size="lg" onPress={() => nav.goBack()}>Try again</Button>
          <Button variant="outline" size="lg" onPress={() => nav.navigate('Tabs', { screen: 'HomeTab' })}>
            Back to home
          </Button>
        </View>
      </View>
    );
  }

  const cover = draft.photos[0]?.uri;
  return (
    <View style={[styles.root, { paddingTop: 80 + insets.top, paddingBottom: 24 + insets.bottom }]}>
      <View style={styles.center}>
        <View style={[styles.badge, shadow.goldGlow]}>
          <Icon name="check" color={T.ink} size={42} strokeWidth={3} />
        </View>
        <Text style={styles.title}>Your ad is live!</Text>
        <Text style={styles.sub}>
          We've published it to {draft.marketplace === 'balkans' ? 'the Balkans marketplace' : 'the Import marketplace'}. You'll get a notification when buyers reach out.
        </Text>

        {listing && (
          <View style={styles.previewCard}>
            {cover ? (
              <Image source={{ uri: cover }} style={styles.previewPhoto} />
            ) : (
              <View style={styles.previewPhoto}>
                <CarPhoto hue={listing.hue} height={60} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.previewTitle}>{listing.make} {listing.model}</Text>
              <Text style={styles.previewSub}>Live · ID #{listing.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.previewPrice}>
                {listing.price_eur ? `€ ${listing.price_eur.toLocaleString()}` : 'No price'}
              </Text>
            </View>
            <View style={styles.active}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.btns}>
        <Button variant="primary" size="lg" icon="eye" onPress={onViewListing}>
          View my listing
        </Button>
        <Button
          variant="outline"
          size="lg"
          icon="bolt"
          onPress={() => {
            reset();
            nav.navigate('Tabs', { screen: 'HomeTab' });
          }}
        >
          Back to home
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 99,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBadge: {
    width: 80,
    height: 80,
    borderRadius: 99,
    backgroundColor: T.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: T.ink,
    marginTop: 22,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: T.font,
  },
  sub: { fontSize: 13, color: T.muted, marginTop: 8, textAlign: 'center', lineHeight: 20, fontFamily: T.font },
  workTitle: { fontSize: 16, fontWeight: '700', color: T.ink, marginTop: 18, fontFamily: T.font },
  workSub: { fontSize: 12, color: T.muted, marginTop: 4, fontFamily: T.font },
  previewCard: {
    marginTop: 24,
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  previewPhoto: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden' },
  previewTitle: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.font },
  previewSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  previewPrice: { fontSize: 13, fontWeight: '800', color: T.ink, fontFamily: T.mono, marginTop: 2 },
  active: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: T.greenSoft },
  activeText: { color: T.green, fontSize: 10, fontWeight: '800', fontFamily: T.font },
  btns: { gap: 10 },
});
