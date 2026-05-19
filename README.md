# AlbAuto

Cross-platform car marketplace for the Balkans (Macedonia · Albania · Kosovo) with a parallel import flow from Europe. Built with React Native + Expo.

## Status

**Phase 1 — Mobile frontend with mock data.** 30+ screens ported from the design package on the `sejdinii-design` branch. All navigation flows are wired; data comes from `src/data/mock.ts`. No backend yet.

## Running

```bash
npm install
npx expo start
```

Then:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

For physical devices, install Expo Go and scan the QR code.

## Project layout

```
App.tsx                      # NavigationContainer + Stack
src/
  theme/tokens.ts            # Design tokens (colors, type, radii, shadows)
  data/mock.ts               # Sample cars, chats, countries
  components/                # Icon, Button, Badge, CarPhoto, CarCards,
                             # TopBar, TabBar, Logo, Field
  navigation/
    types.ts                 # Typed route params
    TabsNavigator.tsx        # Bottom tabs (Home/Saved/Sell/Chats/Menu)
  screens/
    auth/                    # Welcome, Login, Signup, Otp
    home/                    # Home, Notifications, Search
    browse/                  # Country, city, makes, models,
                             # listings, filters, detail
    chat/                    # ChatList, ChatDetail (with offer cards)
    fav/                     # Favorites, Compare, SavedSearches
    profile/                 # Profile menu, Appointment,
                             # Financing, Recent
    seller/                  # 5-step posting flow
    social/                  # IG/FB auto-import + dealer dashboard
_design/                     # Reference: original design package
```

## Tech stack

- **Expo SDK 51** · React Native 0.74 · TypeScript
- **react-navigation** native-stack + bottom-tabs
- **react-native-svg** for all icons and gradient car silhouettes
- Custom token system (no NativeWind / styled-components — plain `StyleSheet` to keep it lean)

## What's not built yet

- Backend (Fastify + Prisma + Postgres + Socket.io per spec)
- Real auth (OTP, OAuth)
- Realtime chat
- Social-platform OAuth (IG/FB)
- Forms are currently display-only — no state, no validation
- Image upload / camera integration
- Map view for listings
- Push notifications

The screens are pixel-faithful to the design package; bringing them to life with real data and APIs is Phase 2.
