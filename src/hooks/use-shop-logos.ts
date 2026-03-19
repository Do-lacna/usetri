import { useMemo } from 'react';

// Add all PNG logo imports here
const logoImports = [
  require('~/assets/store-logos/logo1.png'),
  require('~/assets/store-logos/logo2.png'),
  // ...add more store-logos as needed
];

const useShopLogos = () => {
  // Memoize the array so it doesn't change between renders
  return useMemo(() => logoImports, []);
};

export default useShopLogos;
