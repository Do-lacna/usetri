import { format } from 'date-fns';
import { DATE_FORMAT } from '~/src/lib/constants';

/**
 * Formats a date to Slovak format (DD.MM.YYYY)
 * @param date - Date object, ISO string, or timestamp
 * @returns Formatted date string in DD.MM.YYYY format
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, DATE_FORMAT);
};

/**
 * Formats a date with time to Slovak format (DD.MM.YYYY HH:mm:ss)
 * @param date - Date object, ISO string, or timestamp
 * @returns Formatted date-time string
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, 'dd.MM.yyyy HH:mm:ss');
};
