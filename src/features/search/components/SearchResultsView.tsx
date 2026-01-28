import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  View,
} from 'react-native';
import { GuestRegistrationOverlay } from '~/src/components/guest-registration-overlay';
import { NoDataText } from '~/src/components/no-data-text/no-data-text';
import DiscountedProductCard from '~/src/components/product-card/discounted-product-card';
import { useSession } from '~/src/context/authentication-context';
import type { ShopProductDto } from '~/src/network/model';

// Approximate scroll distance to show ~10 products
const GUEST_SCROLL_LIMIT = 800;

interface SearchResultsViewProps {
  products: ShopProductDto[];
  isLoading: boolean;
  onProductPress: (productId: number, categoryId?: number) => void;
  onRefresh: () => void;
}

export const SearchResultsView = ({
  products,
  isLoading,
  onProductPress,
  onRefresh,
}: SearchResultsViewProps) => {
  const { isGuest } = useSession();
  const [showGuestOverlay, setShowGuestOverlay] = React.useState(false);
  const [isOverlayDismissable, setIsOverlayDismissable] = React.useState(false);
  const [guestOverlayMessage, setGuestOverlayMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);
  const scrollLimitReachedRef = React.useRef(false);

  // Reset overlay when products change (new search)
  React.useEffect(() => {
    setShowGuestOverlay(false);
    setGuestOverlayMessage(null);
    setIsOverlayDismissable(false);
    scrollLimitReachedRef.current = false;
  }, [products]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isGuest) return;

    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (
      scrollPosition >= GUEST_SCROLL_LIMIT &&
      !scrollLimitReachedRef.current
    ) {
      scrollLimitReachedRef.current = true;
      setGuestOverlayMessage(null);
      setIsOverlayDismissable(false);
      setShowGuestOverlay(true);
    }
  };

  const handleProductPress = (productId: number, categoryId?: number) => {
    if (isGuest) {
      setGuestOverlayMessage({
        title: 'Detail produktu',
        description:
          'Pre zobrazenie detailu produktu a porovnania cien sa prosím zaregistrujte alebo prihláste.',
      });
      setIsOverlayDismissable(true);
      setShowGuestOverlay(true);
    } else {
      onProductPress(productId, categoryId);
    }
  };

  const handleDismissOverlay = () => {
    setShowGuestOverlay(false);
    setGuestOverlayMessage(null);
    setIsOverlayDismissable(false);
  };

  return (
    <View className="flex-1">
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <DiscountedProductCard
            product={item}
            onPress={handleProductPress}
            shopsPrices={item?.shops_prices || []}
          />
        )}
        numColumns={3}
        keyExtractor={product => String(product?.detail?.id)}
        contentContainerClassName="gap-4 py-12 px-2"
        columnWrapperClassName="gap-4"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          isGuest ? undefined : (
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          )
        }
        ListEmptyComponent={
          !isLoading ? (
            <ActivityIndicator animating={true} className="mt-12" />
          ) : (
            <View className="flex-1 flex items-center justify-center">
              <NoDataText className="text-xl my-4">Žiadne výsledky</NoDataText>
            </View>
          )
        }
      />
      {isGuest && showGuestOverlay && (
        <GuestRegistrationOverlay
          title={guestOverlayMessage?.title}
          description={guestOverlayMessage?.description}
          dismissable={isOverlayDismissable}
          onDismiss={handleDismissOverlay}
        />
      )}
    </View>
  );
};
