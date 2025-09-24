import { Dua, DayOfWeek } from '../types/dua';
import { getDuasData } from './dataLoader';

export const getDuasByDay = (day: DayOfWeek): Dua[] => {
  const allDuas = getDuasData();
  return allDuas.filter(dua => dua.day === day);
};

export const getTodayDuas = (): Dua[] => {
  const today = new Date();
  const dayNames: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDay = dayNames[today.getDay()];
  
  return getDuasByDay(todayDay);
};

export const getTodayDayName = (): DayOfWeek => {
  const today = new Date();
  const dayNames: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return dayNames[today.getDay()];
};

export const getAllDays = (): DayOfWeek[] => {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
};

export const getDayDisplayName = (day: DayOfWeek): string => {
  const dayNames: Record<DayOfWeek, string> = {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  };
  return dayNames[day];
};
