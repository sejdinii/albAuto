import { NavigatorScreenParams } from '@react-navigation/native';

export type TabsParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
  SellTab: undefined;
  ChatsTab: undefined;
  MenuTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Otp: undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;

  Notifications: undefined;
  Search: undefined;

  BalkanCountries: undefined;
  BalkanCities: undefined;
  Continent: undefined;
  EuCountries: undefined;
  Makes: undefined;
  Models: undefined;
  Listings: undefined;
  Filters: undefined;
  CarDetail: { id?: string } | undefined;

  ChatDetail: { chatId?: string; sellerId?: string; listingId?: string } | undefined;

  Compare: undefined;
  SavedSearches: undefined;
  Recent: undefined;
  Appointment: { listingId?: string } | undefined;
  Financing: { listingId?: string } | undefined;

  SellForm: undefined;
  SellPhotos: undefined;
  SellSummary: undefined;
  SellOptions: undefined;
  SellPublished: undefined;

  SocialConnect: undefined;
  SocialPermissions: undefined;
  SocialImporting: undefined;
  SocialImported: undefined;
  SocialReview: { jobId?: string } | undefined;

  DealerDash: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
