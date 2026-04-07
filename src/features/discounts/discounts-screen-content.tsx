import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestRegistrationOverlay } from '~/src/components/guest-registration-overlay';
import { useSession } from '~/src/context/authentication-context';
import { useGetDiscountsStatistics } from '~/src/network/query/query';
import DiscountList from './components/discount-list';
import { StoreCarousel } from './components/store-carousel';
import { useStoreSelection } from './hooks/use-store-selection';

const GUEST_SCROLL_LIMIT = 1000;
const COLLAPSE_SCROLL_THRESHOLD = 120;
const EXPAND_SCROLL_THRESHOLD = 40;
const MIN_HEIGHT = 90;
const MAX_HEIGHT = 240;

export const DiscountsScreenContent: React.FC = () => {
  const { isGuest } = useSession();
  const { t } = useTranslation();
  const [showGuestOverlay, setShowGuestOverlay] = useState(false);
  const [isOverlayDismissable, setIsOverlayDismissable] = useState(false);
  const [guestOverlayMessage, setGuestOverlayMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const {
    data: { stats = [] } = {},
  } = useGetDiscountsStatistics();

  const collapseAnim = useRef(new Animated.Value(0)).current;
  const isCollapsed = useRef(false);

  const expand = useCallback(() => {
    if (!isCollapsed.current) return;
    isCollapsed.current = false;
    Animated.timing(collapseAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [collapseAnim]);

  const {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  } = useStoreSelection(expand);

  useEffect(() => {
    isCollapsed.current = false;
    collapseAnim.setValue(0);
    setShowGuestOverlay(false);
    setGuestOverlayMessage(null);
  }, [activeStoreId, collapseAnim]);

  const handleScrollPosition = useCallback(
    (scrollPosition: number) => {
      if (scrollPosition > COLLAPSE_SCROLL_THRESHOLD && !isCollapsed.current) {
        isCollapsed.current = true;
        Animated.timing(collapseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else if (
        scrollPosition < EXPAND_SCROLL_THRESHOLD &&
        isCollapsed.current
      ) {
        expand();
      }
    },
    [collapseAnim, expand],
  );

  const handleGuestScrollLimitReached = useCallback(() => {
    setGuestOverlayMessage(null);
    setIsOverlayDismissable(false);
    setShowGuestOverlay(true);
  }, []);

  const handleProductPressBlocked = useCallback(() => {
    setGuestOverlayMessage({
      title: t('product_detail.guest_block_title'),
      description: t('product_detail.guest_block_description'),
    });
    setIsOverlayDismissable(true);
    setShowGuestOverlay(true);
  }, []);

  const handleDismissOverlay = useCallback(() => {
    setShowGuestOverlay(false);
    setIsOverlayDismissable(false);
    setGuestOverlayMessage(null);
  }, []);

  const carouselHeight = collapseAnim.interpolate({
    inputRange: [0, 1],
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
        collapseAnim={collapseAnim}
      />

      {!!activeStore && (
        <View className="flex-1 bg-background">
          <DiscountList
            key={activeStoreId}
            shop={activeStore}
            onScrollPosition={isGuest ? undefined : handleScrollPosition}
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
        <View className="bg-background px-4 py-3 border-t border-border">
          <Text className="text-center text-xs text-muted-foreground font-sans">
            {t('discounts.prices_may_vary')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
