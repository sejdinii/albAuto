export type Car = {
  id: string;
  make: string;
  model: string;
  trim: string;
  subtitle: string;
  year: number;
  km: string;
  price: string;
  priceEur: string;
  hue: number;
  label: string;
  photos: { cur: number; total: number };
  location: string;
};

export type Verified = 'gold' | 'blue' | 'green' | null;

export type Chat = {
  name: string;
  init: string;
  verified: Verified;
  date: string;
  preview: string;
  unread: boolean;
  hue: number;
};

export type Country = { name: string; count: number; flag: string };
export type Continent = { name: string; count: number; hue: number };

export const CARS: Car[] = [
  { id: '1', make: 'BMW', model: 'M3', trim: 'Competition', subtitle: 'M xDrive', year: 2024, km: '4,200 km', price: 'AED 479,900', priceEur: '€ 121,300', hue: 30, label: '01', photos: { cur: 1, total: 3 }, location: 'Skopje, MK' },
  { id: '2', make: 'Audi', model: 'RS6 Avant', trim: 'Performance', subtitle: 'Quattro', year: 2023, km: '18,800 km', price: 'AED 489,000', priceEur: '€ 123,600', hue: 240, label: '02', photos: { cur: 2, total: 5 }, location: 'Tirana, AL' },
  { id: '3', make: 'Mercedes', model: 'CLE-Class', trim: 'AMG 53', subtitle: '4MATIC+', year: 2026, km: '1,200 km', price: 'AED 412,500', priceEur: '€ 104,300', hue: 200, label: '03', photos: { cur: 1, total: 8 }, location: 'Pristina, XK' },
  { id: '4', make: 'Porsche', model: '911', trim: 'Carrera S', subtitle: 'GT Silver', year: 2023, km: '9,400 km', price: 'AED 545,000', priceEur: '€ 137,800', hue: 60, label: '04', photos: { cur: 1, total: 12 }, location: 'Skopje, MK' },
  { id: '5', make: 'Range Rover', model: 'Sport SVR', trim: 'V8', subtitle: 'Carbon', year: 2022, km: '31,000 km', price: 'AED 318,000', priceEur: '€ 80,400', hue: 150, label: '05', photos: { cur: 1, total: 4 }, location: 'Vlorë, AL' },
  { id: '6', make: 'Tesla', model: 'Model Y', trim: 'Performance', subtitle: 'Long Range', year: 2024, km: '12,500 km', price: 'AED 198,000', priceEur: '€ 50,000', hue: 0, label: '06', photos: { cur: 1, total: 6 }, location: 'Tirana, AL' },
  { id: '7', make: 'VW', model: 'Golf R', trim: 'Performance Pack', subtitle: '4Motion', year: 2024, km: '8,600 km', price: 'AED 156,000', priceEur: '€ 39,400', hue: 280, label: '07', photos: { cur: 1, total: 5 }, location: 'Bitola, MK' },
  { id: '8', make: 'Toyota', model: 'Hilux', trim: 'GR Sport', subtitle: 'Diesel', year: 2023, km: '27,000 km', price: 'AED 142,000', priceEur: '€ 35,900', hue: 90, label: '08', photos: { cur: 1, total: 7 }, location: 'Pristina, XK' },
  { id: '9', make: 'Mercedes', model: 'G 63', trim: 'AMG', subtitle: 'Magno', year: 2023, km: '11,400 km', price: 'AED 998,000', priceEur: '€ 252,200', hue: 340, label: '09', photos: { cur: 1, total: 9 }, location: 'Tirana, AL' },
];

export const BALKAN_COUNTRIES: Country[] = [
  { name: 'North Macedonia', count: 1280, flag: '🇲🇰' },
  { name: 'Albania', count: 980, flag: '🇦🇱' },
  { name: 'Kosovo', count: 612, flag: '🇽🇰' },
];

export const MK_CITIES = [
  'Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Ohrid', 'Veles', 'Štip', 'Gostivar', 'Strumica', 'Kavadarci',
];

export const MAKES = [
  'Abarth', 'Acura', 'AITO', 'Al Damani', 'Alfa Romeo', 'Ariel', 'Ashok Leyland', 'Aston Martin', 'Audi', 'Aurus',
  'BMW', 'BYD', 'Cadillac', 'Chevrolet', 'Citroën', 'Cupra', 'Dacia', 'Dodge',
];

export const BMW_MODELS = [
  '1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series',
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'M2', 'M3', 'M4', 'M5', 'M8',
];

export const CONTINENTS: Continent[] = [
  { name: 'Europe', count: 8420, hue: 200 },
  { name: 'Asia', count: 3210, hue: 30 },
  { name: 'Americas', count: 1980, hue: 160 },
];

export const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Croatia', 'Czechia', 'Denmark', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Italy', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Spain', 'Sweden', 'Switzerland',
];

export const CHATS: Chat[] = [
  { name: 'Andrej M.', init: 'AM', verified: 'gold', date: '14:32', preview: 'Is it still available? Can I see it tomorrow?', unread: true, hue: 30 },
  { name: 'Vladimir S.', init: 'VS', verified: 'blue', date: '13:18', preview: 'Sent you the registration documents 📎', unread: true, hue: 200 },
  { name: 'Driton K.', init: 'DK', verified: 'green', date: 'Mon', preview: 'OK, I can offer 78,000 €. Final.', unread: false, hue: 120 },
  { name: 'Elena P.', init: 'EP', verified: null, date: 'Sun', preview: "Thanks, I'll think about it.", unread: false, hue: 340 },
  { name: 'Bujar H.', init: 'BH', verified: 'blue', date: 'Sat', preview: 'You: When can you come for a test drive?', unread: false, hue: 60 },
  { name: 'Marko D.', init: 'MD', verified: 'gold', date: 'Fri', preview: "You: I'll send the VIN tonight.", unread: false, hue: 280 },
  { name: 'Albulena Z.', init: 'AZ', verified: null, date: 'Thu', preview: 'Are you the original owner?', unread: false, hue: 150 },
];
