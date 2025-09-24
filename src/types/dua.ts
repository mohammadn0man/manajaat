export type DayOfWeek = 'friday' | 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday';

export interface Dua {
  id: string;
  day: DayOfWeek;
  arabic: string;
  translations: {
    en?: string;
    ur?: string;
  };
  reference?: string;
}

export interface RawDuaData {
  schema_version: string;
  days: {
    [K in DayOfWeek]: {
      arabic: string;
      translations: {
        en: string;
        ur: string;
      };
      reference: string;
    }[];
  };
}
