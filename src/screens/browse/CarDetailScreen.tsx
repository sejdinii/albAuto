import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Image, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { T, shadow } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { CarPhoto } from '@/components/CarPhoto';
import { Badge } from '@/components/Badge';
import { useAuth } from '@/lib/auth';
import { fetchListingDetail, recordView, toggleFavorite } from '@/lib/db';
import { CARS, Car } from '@/data/mock';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'CarDetail'>;

type Detail = {
  id: string;
  seller_id: string | null;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  km: number | null;
  body: string | null;
  fuel: string | null;
  hp: number | null;
  transmission: string | null;
  drive: string | null;
  price_eur: number | null;
  city: string | null;
  country: string | null;
  description: string | null;
  hue: number;
  photos: { url: string; is_cover: boolean }[];
  seller_name: string | null;
  seller_verified: string | null;
  published_at: string | null;
  isMock: boolean;
};

export function CarDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  const id = route.params?.id ?? '1';

  const load = useCallback(async () => {
    setLoading(true);
    const isUuid = /^[0-9a-f-]{36}$/i.test(id);
    if (hasSupabaseConfig && isUuid) {
      try {
        const row = await fetchListingDetail(id);
        setDetail({
          id: row.id,
          seller_id: row.seller_id,
          make: row.make,
          model: row.model,
          trim: row.trim,
          year: row.year,
          km: row.km,
          body: row.body,
          fuel: row.fuel,
          hp: row.hp,
          transmission: row.transmission,
          drive: row.drive,
          price_eur: row.price_eur,
          city: row.city,
          country: row.country,
          description: row.description,
          hue: row.hue ?? 30,
          photos: (row.listing_photos ?? []).sort((a, b) => Number(b.is_cover) - Number(a.is_cover)),
          seller_name: row.profiles?.name ?? null,
          seller_verified: row.profiles?.verified ?? null,
          published_at: row.published_at,
          isMock: false,
        });
      } catch {
        setDetail(detailFromMock(id));
      }
    } else {
      setDetail(detailFromMock(id));
    }
    if (userId && isUuid) {
      const { data } = await supabase.from('favorites').select('listing_id').eq('user_id', userId).eq('listing_id', id).maybeSingle();
      setFav(!!data);
      // Track view (fire and forget)
      recordView(userId, id).catch(() => undefined);
    }
    setLoading(false);
  }, [id, userId]);

  useEffect(() => { load(); }, [load]);

  const onToggleFav = async () => {
    if (!userId || !detail || detail.isMock) return;
    const next = !fav;
    setFav(next);
    try {
      await toggleFavorite(userId, detail.id, next);
    } catch {
      setFav(!next);
    }
  };

  if (loading || !detail) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={T.gold} />
      </View>
    );
  }

  const cover = detail.photos[0]?.url;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 340 }}>
          {cover ? (
            <Image source={{ uri: cover }} style={styles.coverImg} />
          ) : (
            <CarPhoto hue={detail.hue} height={340} dark count={`1 / ${Math.max(detail.photos.length, 1)}`} />
          )}
          <Pressable
            onPress={() => nav.goBack()}
            style={[styles.iconOverlay, { top: insets.top + 6, left: 16 }]}
          >
            <Icon name="back" color="#fff" size={20} strokeWidth={2.2} />
          </Pressable>
          <View style={[styles.overlayRow, { top: insets.top + 6, right: 16 }]}>
            <View style={styles.iconOverlay}>
              <Icon name="share" color="#fff" size={18} />
            </View>
            <Pressable onPress={onToggleFav} style={[styles.iconOverlay, { position: 'relative' }]}>
              <Icon name="heart" color={fav ? T.red : '#fff'} fill={fav} size={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.crumb}>
            {[detail.make, detail.model, detail.trim].filter(Boolean).map((s) => s!.toUpperCase()).join(' · ')}
          </Text>
          <Text style={styles.title}>
            {detail.year}{detail.km != null ? ` · ${detail.km.toLocaleString()} km` : ''}
          </Text>

          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>PRICE</Text>
              <Text style={styles.priceGold}>
                {detail.price_eur ? `€ ${detail.price_eur.toLocaleString()}` : 'No price'}
              </Text>
            </View>
          </View>

          <View style={styles.badgesRow}>
            {detail.body && <Badge color={T.surfaceAlt} fg={T.body}>{detail.body}</Badge>}
            {detail.fuel && <Badge color={T.surfaceAlt} fg={T.body}>{detail.fuel}</Badge>}
            {detail.km != null && <Badge color={T.surfaceAlt} fg={T.body}>{detail.km.toLocaleString()} km</Badge>}
          </View>

          <View style={styles.locRow}>
            <Icon name="pin" color={T.muted} size={14} />
            <Text style={styles.locText}>
              {[detail.city, detail.country].filter(Boolean).join(' · ') || 'Location not set'}
            </Text>
            {detail.published_at && (
              <Text style={styles.posted}>Posted {timeAgo(detail.published_at)}</Text>
            )}
          </View>

          {detail.description && (
            <>
              <Text style={styles.section}>Description</Text>
              <Text style={styles.desc}>{detail.description}</Text>
            </>
          )}

          {detail.seller_name && (
            <View style={styles.seller}>
              <View style={styles.sellerBadge}>
                <Text style={styles.sellerInit}>{(detail.seller_name?.[0] ?? 'U').toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sellerName}>{detail.seller_name}</Text>
                {detail.seller_verified && (
                  <Text style={styles.sellerSub}>Verified · {detail.seller_verified}</Text>
                )}
              </View>
            </View>
          )}

          {detail.isMock && (
            <View style={styles.mockHint}>
              <Icon name="sparkles" color={T.goldDark} size={14} />
              <Text style={styles.mockHintText}>
                This is a sample listing. Publish your own from the Sell tab.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: 12 + insets.bottom }, shadow.sticky]}>
        <Pressable style={styles.callBtn}>
          <Icon name="phone" color={T.ink} size={16} strokeWidth={2.2} />
          <Text style={styles.callBtnText}>Call</Text>
        </Pressable>
        <Pressable style={styles.waBtn}>
          <Icon name="whatsapp" color="#fff" size={16} />
          <Text style={styles.waBtnText}>WhatsApp</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (detail.isMock || !detail.seller_id) {
              nav.navigate('ChatDetail');
              return;
            }
            if (detail.seller_id === userId) {
              return;
            }
            nav.navigate('ChatDetail', { sellerId: detail.seller_id, listingId: detail.id });
          }}
          style={styles.chatBtn}
        >
          <Icon name="chat" color={T.gold} size={20} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

function detailFromMock(id: string): Detail {
  const m = CARS.find((c) => c.id === id) ?? CARS[0];
  return mockToDetail(m);
}

function mockToDetail(c: Car): Detail {
  return {
    id: c.id,
    seller_id: null,
    make: c.make,
    model: c.model,
    trim: c.trim,
    year: c.year,
    km: numFrom(c.km),
    body: c.subtitle,
    fuel: null,
    hp: null,
    transmission: null,
    drive: null,
    price_eur: numFrom(c.priceEur),
    city: c.location.split(',')[0]?.trim() ?? null,
    country: c.location.split(',')[1]?.trim() ?? null,
    description: null,
    hue: c.hue,
    photos: [],
    seller_name: 'AutoBalkan',
    seller_verified: 'gold',
    published_at: null,
    isMock: true,
  };
}

function numFrom(s: string | null | undefined): number | null {
  if (!s) return null;
  const digits = s.replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 3_600_000);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(diff / 60_000);
  return `${Math.max(1, m)}m ago`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  coverImg: { width: '100%', height: 340 },
  iconOverlay: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(15,15,16,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlayRow: { position: 'absolute', flexDirection: 'row', gap: 8 },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
    padding: 20,
  },
  crumb: {
    fontSize: 11,
    color: T.muted,
    fontFamily: T.mono,
    letterSpacing: 1,
  },
  title: { fontSize: 22, fontWeight: '800', color: T.ink, marginTop: 4, letterSpacing: -0.4, fontFamily: T.font },
  priceBox: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: T.ink,
  },
  priceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: T.mono, letterSpacing: 1 },
  priceGold: { fontSize: 24, fontWeight: '800', color: T.gold, fontFamily: T.mono, letterSpacing: -0.4 },
  badgesRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  locRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  locText: { fontSize: 12, color: T.body, fontFamily: T.font },
  posted: { marginLeft: 'auto', fontSize: 11, color: T.muted, fontFamily: T.font },
  section: { fontSize: 13, fontWeight: '800', color: T.ink, marginTop: 16, marginBottom: 8, fontFamily: T.font },
  desc: { fontSize: 13, color: T.body, lineHeight: 19, fontFamily: T.font },
  seller: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.surfaceAlt,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInit: { color: T.gold, fontWeight: '800', fontSize: 14, fontFamily: T.font },
  sellerName: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  sellerSub: { fontSize: 11, color: T.muted, fontFamily: T.font },
  mockHint: {
    marginTop: 16,
    padding: 12,
    backgroundColor: T.goldTint,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mockHintText: { flex: 1, fontSize: 11, color: T.body, lineHeight: 15, fontFamily: T.font },
  cta: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callBtnText: { fontSize: 14, fontWeight: '700', color: T.ink, fontFamily: T.font },
  waBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  waBtnText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: T.font },
  chatBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
