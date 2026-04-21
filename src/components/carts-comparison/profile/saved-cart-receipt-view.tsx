import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PLACEHOLDER_PRODUCT_IMAGE from '~/assets/images/other/product_placeholder.jpg';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';
import { Skeleton } from '~/src/components/ui/skeleton';
import { Check } from '~/src/lib/icons/Check';
import type { ArchivedCartProduct, ShopExtendedDto } from '~/src/network/model';
import { useGetCategories } from '~/src/network/query/query';
import {
  getCheckedItems,
  setCheckedItems,
} from '~/src/persistence/cart-checked-items-storage';

interface SavedCartReceiptViewProps {
  cartId?: number;
  shop?: ShopExtendedDto;
  specific_products?: ArchivedCartProduct[];
  total_price?: number;
  actionsExecutable?: boolean;
}

const ReceiptItemRow: React.FC<{
  product: ArchivedCartProduct;
  isChecked: boolean;
  onToggle: () => void;
  disabled: boolean;
  categoryImageUrl?: string | null;
}> = ({ product, isChecked, onToggle, disabled, categoryImageUrl }) => {
  const {
    price = 0,
    quantity = 1,
    detail: { name = '', brand = '', amount = '', unit = '', image_url } = {},
  } = product;

  const resolvedImageUrl = image_url || categoryImageUrl || null;
  const hasRemoteImage = Boolean(resolvedImageUrl);
  const [isImageLoaded, setIsImageLoaded] = useState(!hasRemoteImage);

  const imageSource: ImageSourcePropType = resolvedImageUrl
    ? { uri: resolvedImageUrl }
    : PLACEHOLDER_PRODUCT_IMAGE;

  const totalPrice = (price * quantity).toFixed(2);
  const checkedClass = isChecked ? 'line-through opacity-50' : '';

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      className={`bg-card rounded-xl p-3 shadow-sm border border-v2 ${
        isChecked ? 'opacity-70' : ''
      }`}
    >
      <View className="flex-row gap-3 items-center">
        <View className="relative w-16 h-16">
          {!isImageLoaded && (
            <Skeleton className="absolute inset-0 rounded-lg" />
          )}
          <Image
            source={imageSource}
            className={
              isImageLoaded
                ? 'w-16 h-16 rounded-lg'
                : 'w-16 h-16 rounded-lg opacity-0'
            }
            resizeMode="contain"
            onLoadEnd={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </View>

        <View className="flex-1 flex-col justify-between py-0.5">
          <View>
            <Text
              className={`text-card-foreground font-expose-bold text-base leading-tight ${checkedClass}`}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className={`text-muted-foreground font-expose text-xs mt-0.5 ${checkedClass}`}
              numberOfLines={1}
            >
              {brand}
              {brand && (amount || unit) ? ' • ' : ''}
              {amount} {unit}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-baseline gap-1">
              <Text
                className={`text-card-foreground font-expose-bold text-lg ${checkedClass}`}
              >
                {totalPrice}€
              </Text>
              {quantity > 1 && (
                <Text
                  className={`text-muted-foreground font-expose text-xs ${checkedClass}`}
                >
                  ({price.toFixed(2)}/ks × {quantity})
                </Text>
              )}
            </View>

            <View
              className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                isChecked
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground'
              }`}
            >
              {isChecked && (
                <Check
                  size={16}
                  className="text-primary-foreground"
                  strokeWidth={3}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const SavedCartReceiptView: React.FC<SavedCartReceiptViewProps> = ({
  cartId,
  shop: { name: shopName, id: shopId } = {},
  specific_products: groceries = [],
  total_price,
}) => {
  const canToggle = typeof cartId === 'number';

  const {
    data: { categories = [] } = {},
  } = useGetCategories();

  const categoryImageById = useMemo(() => {
    const map = new Map<number, string>();
    for (const category of categories ?? []) {
      if (typeof category.id === 'number' && category.image_url) {
        map.set(category.id, category.image_url);
      }
    }
    return map;
  }, [categories]);

  const [checkedIds, setCheckedIdsState] = useState<Set<number>>(() =>
    canToggle ? new Set(getCheckedItems(cartId as number)) : new Set(),
  );

  const toggleChecked = (productId?: number) => {
    if (!canToggle || typeof productId !== 'number') return;
    const next = new Set(checkedIds);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    setCheckedIdsState(next);
    setCheckedItems(cartId as number, Array.from(next));
  };

  const formatPrice = (price = 0): string => `${price.toFixed(2)} €`;

  const orderedGroceries = useMemo(() => {
    const unchecked: ArchivedCartProduct[] = [];
    const checked: ArchivedCartProduct[] = [];
    for (const product of groceries ?? []) {
      const productId = product.detail?.product_id;
      if (typeof productId === 'number' && checkedIds.has(productId)) {
        checked.push(product);
      } else {
        unchecked.push(product);
      }
    }
    return [...unchecked, ...checked];
  }, [groceries, checkedIds]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pb-6">
        <View className="flex-row items-center justify-center gap-2 pb-4 mb-3">
          {typeof shopId === 'number' && (
            <ShopLogoBadge shopId={shopId} size={28} />
          )}
          {!!shopName && (
            <Text className="text-xl font-expose-bold text-foreground">
              {shopName}
            </Text>
          )}
        </View>

        <View className="mb-2">
          {groceries?.map(product => {
            const productId = product.detail?.product_id;
            const categoryId = product.detail?.category_id;
            const isChecked =
              typeof productId === 'number' && checkedIds.has(productId);
            const categoryImageUrl =
              typeof categoryId === 'number'
                ? categoryImageById.get(categoryId)
                : undefined;
            return (
              <ReceiptItemRow
                key={productId}
                product={product}
                isChecked={isChecked}
                onToggle={() => toggleChecked(productId)}
                disabled={!canToggle}
                categoryImageUrl={categoryImageUrl}
              />
            );
          })}
        </View>

        <View className="flex-row justify-between items-center bg-muted p-4 rounded-lg mt-2">
          <Text className="text-lg font-expose-bold text-foreground">
            Celková suma
          </Text>
          <Text className="text-xl font-expose-bold text-green-600">
            {formatPrice(total_price)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedCartReceiptView;
