// shopLogoUtils.ts
import type { ImageResizeMode, ImageSourcePropType } from 'react-native';

// Type for the mapping of shop IDs to their respective require statements
type ShopLogoMapping = {
  [key: string]: ImageSourcePropType;
};

// Type for the returned logo props
interface LogoProps {
  source: ImageSourcePropType;
  resizeMode: ImageResizeMode;
}

// Define all logo requires statically
// This is necessary because React Native's require must be static
export const SHOP_LOGOS = {
  1: require('~/assets/images/logos/lidl_logo.png'),
  2: require('~/assets/images/logos/billa_logo.png'),
  3: require('~/assets/images/logos/kaufland_logo.png'),
  4: require('~/assets/images/logos/tesco_logo.png'),

  // Add more shops as needed
} as const;

export const SHOP_COVER_IMAGES = {
  1: require('~/assets/images/store-pictures/lidl.png'),
  2: require('~/assets/images/store-pictures/billa.png'),
  3: require('~/assets/images/store-pictures/kaufland.png'),
  4: require('~/assets/images/store-pictures/tesco.jpg'),
};

/**
 * Gets the logo source for a specific shop
 * @param shopId - The ID of the shop
 * @returns The logo props object or null if not found
 */
export const getShopLogo = (
  shopId: keyof typeof SHOP_LOGOS,
): LogoProps | null => {
  try {
    const logoSource = SHOP_LOGOS[shopId];

    if (!logoSource) {
      console.warn(`No logo found for shop ID: ${shopId}`);
      return null;
    }

    return {
      source: logoSource,
      resizeMode: 'contain' as const,
    };
  } catch (error) {
    console.error(`Error loading logo for shop ${shopId}:`, error);
    return null;
  }
};

export const getShopCoverImage = (shopId: number): ImageSourcePropType => {
  try {
    const logoSource =
      SHOP_COVER_IMAGES[shopId as keyof typeof SHOP_COVER_IMAGES];

    if (!logoSource) {
      console.warn(`No cover image found for shop ID: ${shopId}`);
      return require('~/assets/images/store-pictures/default-store.jpeg');
    }

    return logoSource;
  } catch (error) {
    console.error(`Error loading cover image for shop ${shopId}:`, error);
    return require('~/assets/images/store-pictures/default-store.jpeg');
  }
};

/**
 * Checks if a shop has a logo
 * @param shopId - The ID of the shop
 * @returns Whether the shop has a logo
 */
export const hasShopLogo = (
  shopId: string,
): shopId is keyof typeof SHOP_LOGOS => {
  return shopId in SHOP_LOGOS;
};

/**
 * Gets all available shop IDs
 * @returns Array of all available shop IDs
 */
export const getAllShopIds = (): Array<keyof typeof SHOP_LOGOS> => {
  return Object.keys(SHOP_LOGOS) as Array<keyof typeof SHOP_LOGOS>;
};

// Type for component props that use the shop logo
export interface ShopLogoProps {
  shopId: keyof typeof SHOP_LOGOS;
  width?: number;
  height?: number;
  className?: string;
}
