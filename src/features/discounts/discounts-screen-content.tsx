import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestRegistrationOverlay } from '~/src/components/guest-registration-overlay';
import { useSession } from '~/src/context/authentication-context';
import { useGetDiscountsStatistics } from '~/src/network/query/query';
import DiscountList from './components/discount-list';
import { StoreCarousel } from './components/store-carousel';
import { useStoreSelection } from './hooks/use-store-selection';

// Approximate scroll distance to show ~10 products (5 rows × ~200px per row)
const GUEST_SCROLL_LIMIT = 1000;

export const DiscountsScreenContent: React.FC = () => {
  const { isGuest } = useSession();
  const [showGuestOverlay, setShowGuestOverlay] = useState(false);
  const [isOverlayDismissable, setIsOverlayDismissable] = useState(false);
  const [guestOverlayMessage, setGuestOverlayMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const {
    data: { stats = [] } = {},
    isLoading: areDiscountStatisticsLoading,
  } = useGetDiscountsStatistics();

  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  } = useStoreSelection(scrollY);

  // Reset scroll position and overlay when shop changes
  useEffect(() => {
    scrollY.setValue(0);
    setShowGuestOverlay(false);
    setGuestOverlayMessage(null);
  }, [activeStoreId, scrollY]);

  const handleGuestScrollLimitReached = useCallback(() => {
    setGuestOverlayMessage(null);
    setIsOverlayDismissable(false);
    setShowGuestOverlay(true);
  }, []);

  const handleProductPressBlocked = useCallback(() => {
    setGuestOverlayMessage({
      title: 'Detail produktu',
      description:
        'Pre zobrazenie detailu produktu a porovnania cien sa prosím zaregistrujte alebo prihláste.',
    });
    setIsOverlayDismissable(true);
    setShowGuestOverlay(true);
  }, []);

  const handleDismissOverlay = useCallback(() => {
    setShowGuestOverlay(false);
    setIsOverlayDismissable(false);
    setGuestOverlayMessage(null);
  }, []);

  const SCROLL_DISTANCE = 150;
  const MIN_HEIGHT = 90;
  const MAX_HEIGHT = 240;

  const carouselHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <StoreCarousel
        shops={sortedShops}
        activeStoreId={activeStoreId}
        stats={stats || []}
        onStoreSelect={handleStoreSelect}
        onSnapToItem={handleSnapToItem}
        animatedHeight={carouselHeight}
        scrollY={scrollY}
      />

      {!!activeStore && (
        <View className="flex-1 bg-background">
          <DiscountList
            key={activeStoreId}
            shop={activeStore}
            onScroll={isGuest ? undefined : scrollY}
            guestScrollLimit={isGuest ? GUEST_SCROLL_LIMIT : undefined}
            onGuestScrollLimitReached={
              isGuest ? handleGuestScrollLimitReached : undefined
            }
            isGuest={isGuest}
            onProductPressBlocked={handleProductPressBlocked}
          />
        </View>
      )}

      {isGuest && showGuestOverlay && (
        <GuestRegistrationOverlay
          title={guestOverlayMessage?.title}
          description={guestOverlayMessage?.description}
          dismissable={isOverlayDismissable}
          onDismiss={handleDismissOverlay}
        />
      )}

      {!isGuest && (
        <View className="bg-card px-4 py-3 border-t border-border">
          <Text className="text-center text-xs text-muted-foreground">
            Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
