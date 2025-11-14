import { useMemo } from 'react';

// Add all PNG logo imports here
const logoImports = [
  require('~/assets/logos/logo1.png'),
  require('~/assets/logos/logo2.png'),
  // ...add more logos as needed
];

const useShopLogos = () => {
  // Memoize the array so it doesn't change between renders
  return useMemo(() => logoImports, []);
};

export default useShopLogos;
