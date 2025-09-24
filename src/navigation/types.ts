import { DayOfWeek } from '../types/dua';

export type RootStackParamList = {
  MainTabs: undefined;
  DayView: { day: DayOfWeek };
  DuaDetail: { duaId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Days: undefined;
  Favorites: undefined;
  Settings: undefined;
};
