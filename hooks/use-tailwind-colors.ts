// hooks/useTailwindColors.js
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '~/tailwind.config'; // Adjust path as needed

export function useTailwindColors() {
  // Resolve the config to get the full color palette
  const fullConfig = resolveConfig(tailwindConfig);

  // Return just the colors
  return fullConfig.theme.colors;
}
