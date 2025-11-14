import {
  colorScheme as nativeWindColorScheme,
  useColorScheme as useNativewindColorScheme,
} from 'nativewind';
import { setTheme } from '~/src/persistence/theme-storage';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  const handleToggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
    setTheme(newScheme);
    nativeWindColorScheme.set(newScheme);
  };

  const handleSetColorScheme = (scheme: 'light' | 'dark') => {
    setColorScheme(scheme);
    setTheme(scheme);
    nativeWindColorScheme.set(scheme);
  };

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme: handleSetColorScheme,
    toggleColorScheme: handleToggleColorScheme,
  };
}
