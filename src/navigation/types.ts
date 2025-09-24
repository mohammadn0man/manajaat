import { DayOfWeek } from '../types/dua';

export type RootStackParamList = {
  MainTabs: undefined;
  DayView: { day: DayOfWeek };
};

export type MainTabParamList = {
  Home: undefined;
  Days: undefined;
};
