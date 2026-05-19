import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { T, shadow } from '@/theme/tokens';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { CarPhoto } from './CarPhoto';
import { Car } from '@/data/mock';

type Props = { car: Car; onPress?: () => void };

export function CarCardSmall({ car, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={smallStyles.wrap}>
      <CarPhoto hue={car.hue} label={car.label} height={84} radius={10} />
      <Text style={smallStyles.year}>{car.year}</Text>
      <Text style={smallStyles.make}>{car.make}</Text>
      <Text style={smallStyles.model}>{car.model}</Text>
      <Text style={smallStyles.price}>{car.price}</Text>
    </Pressable>
  );
}

const smallStyles = StyleSheet.create({
  wrap: { gap: 6 },
  year: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  make: { fontSize: 12, fontWeight: '700', color: T.ink, lineHeight: 14 },
  model: { fontSize: 11, color: T.body, lineHeight: 13, marginTop: -2 },
  price: { fontSize: 13, fontWeight: '800', color: T.goldDark, fontFamily: T.mono, marginTop: 2 },
});

type MedProps = { car: Car; favorited?: boolean; onPress?: () => void; onToggleFav?: () => void };

export function CarCardMedium({ car, favorited = true, onPress, onToggleFav }: MedProps) {
  return (
    <Pressable onPress={onPress} style={medStyles.card}>
      <View style={medStyles.photo}>
        <CarPhoto
          hue={car.hue}
          label={car.label}
          height={120}
          count={car.photos ? `${car.photos.cur}/${car.photos.total}` : null}
          badge={
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onToggleFav?.();
              }}
              style={medStyles.heart}
            >
              <Icon name="heart" color={favorited ? T.red : T.muted} fill={favorited} size={16} />
            </Pressable>
          }
        />
      </View>
      <View style={medStyles.body}>
        <Text style={medStyles.year}>{car.year} · {car.km}</Text>
        <Text style={medStyles.title}>{car.make} {car.model}</Text>
        <Text style={medStyles.trim}>{car.trim}</Text>
        <Text style={medStyles.price}>{car.price}</Text>
      </View>
    </Pressable>
  );
}

const medStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    ...shadow.card,
  },
  photo: { position: 'relative' },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 10 },
  year: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  title: { fontSize: 13, fontWeight: '700', color: T.ink, marginTop: 2, lineHeight: 16 },
  trim: { fontSize: 11, color: T.body, marginTop: 1 },
  price: { fontSize: 15, fontWeight: '800', color: T.ink, fontFamily: T.mono, marginTop: 6, letterSpacing: -0.3 },
});

type ListProps = { car: Car; premium?: boolean; onPress?: () => void; onChat?: () => void; onWhatsapp?: () => void };

export function CarCardListing({ car, premium = false, onPress, onChat, onWhatsapp }: ListProps) {
  return (
    <Pressable onPress={onPress} style={listStyles.card}>
      <View>
        <CarPhoto
          hue={car.hue}
          label={car.label}
          height={195}
          count={car.photos ? `${car.photos.cur}/${car.photos.total}` : null}
          badge={
            <>
              {premium && (
                <View style={listStyles.premium}>
                  <Badge color="#0F0F10" fg={T.gold} icon="bolt">Premium</Badge>
                </View>
              )}
              <View style={listStyles.actions}>
                <View style={listStyles.actionBtn}>
                  <Icon name="share" color={T.ink} size={15} />
                </View>
                <View style={listStyles.actionBtn}>
                  <Icon name="heart" color={T.muted} size={15} />
                </View>
              </View>
              {car.photos && (
                <View style={listStyles.dots}>
                  {Array.from({ length: car.photos.total }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        listStyles.dot,
                        { backgroundColor: i === car.photos.cur - 1 ? '#fff' : 'rgba(255,255,255,0.4)' },
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          }
        />
      </View>
      <View style={listStyles.body}>
        <View style={listStyles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={listStyles.title}>{car.make} {car.model}</Text>
            <Text style={listStyles.sub}>{car.trim} · {car.subtitle}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={listStyles.price}>{car.price}</Text>
            <Text style={listStyles.priceEur}>{car.priceEur}</Text>
          </View>
        </View>
        <View style={listStyles.badges}>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Warranty</Badge>
          <Badge color={T.greenSoft} fg={T.green} icon="check">Service</Badge>
          <Badge color={T.surfaceAlt} fg={T.body}>{String(car.year)}</Badge>
          <Badge color={T.surfaceAlt} fg={T.body}>{car.km}</Badge>
        </View>
        <View style={listStyles.footer}>
          <View style={listStyles.location}>
            <Icon name="pin" color={T.muted} size={13} />
            <Text style={listStyles.locationText}>{car.location}</Text>
          </View>
          <View style={listStyles.ctaRow}>
            <Pressable onPress={onChat} style={listStyles.chatBtn}>
              <Icon name="chat" size={14} color={T.ink} strokeWidth={2.2} />
              <Text style={listStyles.chatText}>Chat</Text>
            </Pressable>
            <Pressable onPress={onWhatsapp} style={listStyles.waBtn}>
              <Icon name="whatsapp" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const listStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.hairline,
    marginBottom: 14,
    ...shadow.card,
  },
  premium: { position: 'absolute', top: 10, left: 10 },
  actions: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: { width: 5, height: 5, borderRadius: 99 },
  body: { padding: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '800', color: T.ink, letterSpacing: -0.2, fontFamily: T.font },
  sub: { fontSize: 12, color: T.body, marginTop: 2, fontFamily: T.font },
  price: { fontSize: 17, fontWeight: '800', color: T.ink, fontFamily: T.mono, letterSpacing: -0.4 },
  priceEur: { fontSize: 11, color: T.muted, fontFamily: T.mono },
  badges: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hairline,
  },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: T.body, fontFamily: T.font },
  ctaRow: { flexDirection: 'row', gap: 8 },
  chatBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 99,
    backgroundColor: T.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatText: { fontSize: 13, fontWeight: '700', color: T.ink, fontFamily: T.font },
  waBtn: {
    height: 36,
    width: 36,
    borderRadius: 99,
    backgroundColor: T.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
