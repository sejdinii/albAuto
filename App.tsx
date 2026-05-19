import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from '@/navigation/types';
import { TabsNavigator } from '@/navigation/TabsNavigator';

import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { OtpScreen } from '@/screens/auth/OtpScreen';

import { NotificationsScreen } from '@/screens/home/NotificationsScreen';
import { SearchScreen } from '@/screens/home/SearchScreen';

import {
  BalkanCountriesScreen,
  BalkanCitiesScreen,
  ContinentScreen,
  EuCountriesScreen,
} from '@/screens/browse/SelectListScreens';
import { MakesScreen } from '@/screens/browse/MakesScreen';
import { ModelsScreen } from '@/screens/browse/ModelsScreen';
import { ListingsScreen } from '@/screens/browse/ListingsScreen';
import { FiltersScreen } from '@/screens/browse/FiltersScreen';
import { CarDetailScreen } from '@/screens/browse/CarDetailScreen';

import { ChatDetailScreen } from '@/screens/chat/ChatDetailScreen';

import { CompareScreen } from '@/screens/fav/CompareScreen';
import { SavedSearchesScreen } from '@/screens/fav/SavedSearchesScreen';
import { RecentScreen } from '@/screens/profile/RecentScreen';

import { AppointmentScreen } from '@/screens/profile/AppointmentScreen';
import { FinancingScreen } from '@/screens/profile/FinancingScreen';

import { SellFormScreen } from '@/screens/seller/SellFormScreen';
import { SellPhotosScreen } from '@/screens/seller/SellPhotosScreen';
import { SellSummaryScreen } from '@/screens/seller/SellSummaryScreen';
import { SellOptionsScreen } from '@/screens/seller/SellOptionsScreen';
import { SellPublishedScreen } from '@/screens/seller/SellPublishedScreen';

import { SocialConnectScreen } from '@/screens/social/SocialConnectScreen';
import { SocialPermissionsScreen } from '@/screens/social/SocialPermissionsScreen';
import { SocialImportingScreen } from '@/screens/social/SocialImportingScreen';
import { SocialImportedScreen } from '@/screens/social/SocialImportedScreen';
import { SocialReviewScreen } from '@/screens/social/SocialReviewScreen';
import { DealerDashboardScreen } from '@/screens/social/DealerDashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FAFAF7' } }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />

            <Stack.Screen name="Tabs" component={TabsNavigator} />

            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />

            <Stack.Screen name="BalkanCountries" component={BalkanCountriesScreen} />
            <Stack.Screen name="BalkanCities" component={BalkanCitiesScreen} />
            <Stack.Screen name="Continent" component={ContinentScreen} />
            <Stack.Screen name="EuCountries" component={EuCountriesScreen} />
            <Stack.Screen name="Makes" component={MakesScreen} />
            <Stack.Screen name="Models" component={ModelsScreen} />
            <Stack.Screen name="Listings" component={ListingsScreen} />
            <Stack.Screen name="Filters" component={FiltersScreen} options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="CarDetail" component={CarDetailScreen} />

            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />

            <Stack.Screen name="Compare" component={CompareScreen} />
            <Stack.Screen name="SavedSearches" component={SavedSearchesScreen} />
            <Stack.Screen name="Recent" component={RecentScreen} />
            <Stack.Screen name="Appointment" component={AppointmentScreen} />
            <Stack.Screen name="Financing" component={FinancingScreen} />

            <Stack.Screen name="SellForm" component={SellFormScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="SellPhotos" component={SellPhotosScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="SellSummary" component={SellSummaryScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="SellOptions" component={SellOptionsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="SellPublished" component={SellPublishedScreen} options={{ presentation: 'modal' }} />

            <Stack.Screen name="SocialConnect" component={SocialConnectScreen} />
            <Stack.Screen name="SocialPermissions" component={SocialPermissionsScreen} />
            <Stack.Screen name="SocialImporting" component={SocialImportingScreen} />
            <Stack.Screen name="SocialImported" component={SocialImportedScreen} />
            <Stack.Screen name="SocialReview" component={SocialReviewScreen} />
            <Stack.Screen name="DealerDash" component={DealerDashboardScreen} />
          </Stack.Navigator>
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
