import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PLACEHOLDER_PRODUCT_IMAGE from '~/assets/images/other/product_placeholder.jpg';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';
import { Skeleton } from '~/src/components/ui/skeleton';
import { Check } from '~/src/lib/icons/Check';
import { Info } from '~/src/lib/icons/Info';
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
  const checkedTextClass = isChecked
    ? 'line-through text-muted-foreground'
    : '';

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      android_ripple={{ borderless: false }}
      className={`flex-row items-center gap-3 rounded-2xl p-3 border ${
        isChecked
          ? 'bg-muted border-border opacity-70'
          : 'bg-card border-border'
      }`}
    >
      <View className="relative w-16 h-16">
        {!isImageLoaded && <Skeleton className="absolute inset-0 rounded-xl" />}
        <Image
          source={imageSource}
          className={
            isImageLoaded
              ? 'w-16 h-16 rounded-xl'
              : 'w-16 h-16 rounded-xl opacity-0'
          }
          resizeMode="contain"
          onLoadEnd={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
      </View>

      <View className="flex-1 justify-between self-stretch py-0.5">
        <View>
          <Text
            className={`text-card-foreground font-expose-bold text-base leading-tight ${checkedTextClass}`}
            numberOfLines={1}
          >
            {name}
          </Text>
          {(brand || amount || unit) && (
            <Text
              className={`text-muted-foreground font-expose text-xs mt-1 ${checkedTextClass}`}
              numberOfLines={1}
            >
              {brand}
              {brand && (amount || unit) ? ' • ' : ''}
              {amount} {unit}
            </Text>
          )}
        </View>

        <View className="flex-row items-end justify-between mt-2">
          <View className="flex-row items-baseline gap-1">
            <Text
              className={`text-card-foreground font-expose-bold text-lg ${checkedTextClass}`}
            >
              {totalPrice}€
            </Text>
            {quantity > 1 && (
              <Text
                className={`text-muted-foreground font-expose text-xs ${checkedTextClass}`}
              >
                ({price.toFixed(2)}/ks × {quantity})
              </Text>
            )}
          </View>
        </View>
      </View>

      <View
        className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
          isChecked
            ? 'bg-primary border-primary'
            : 'bg-background border-muted-foreground'
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
    </Pressable>
  );
};

const SavedCartReceiptView: React.FC<SavedCartReceiptViewProps> = ({
  cartId,
  shop: { name: shopName, id: shopId } = {},
  specific_products: groceries = [],
  total_price,
}) => {
  const { t } = useTranslation();
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

  const totalItems = groceries?.length ?? 0;
  const checkedCount = groceries
    ? groceries.filter(p => {
        const id = p.detail?.product_id;
        return typeof id === 'number' && checkedIds.has(id);
      }).length
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-2 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 p-4 mb-3 rounded-2xl bg-card border border-border">
          {typeof shopId === 'number' && (
            <ShopLogoBadge shopId={shopId} size={36} />
          )}
          <View className="flex-1">
            {!!shopName && (
              <Text className="text-lg font-expose-bold text-foreground">
                {shopName}
              </Text>
            )}
            {canToggle && totalItems > 0 && (
              <Text className="text-xs font-expose text-muted-foreground mt-0.5">
                {t('saved_cart_receipt.progress', {
                  done: checkedCount,
                  total: totalItems,
                })}
              </Text>
            )}
          </View>
        </View>

        {canToggle && totalItems > 0 && (
          <View className="flex-row items-start gap-3 p-3 mb-4 rounded-2xl bg-muted border border-border">
            <View className="w-8 h-8 rounded-full bg-background items-center justify-center">
              <Info size={16} className="text-muted-foreground" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-expose-bold text-foreground">
                {t('saved_cart_receipt.hint_title')}
              </Text>
              <Text className="text-xs font-expose text-muted-foreground mt-0.5 leading-relaxed">
                {t('saved_cart_receipt.hint_description')}
              </Text>
            </View>
          </View>
        )}

        <View className="gap-2.5">
          {orderedGroceries?.map(product => {
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

        <View className="flex-row justify-between items-center p-4 mt-4 rounded-2xl bg-card border border-border">
          <Text className="text-base font-expose-bold text-foreground">
            {t('saved_cart_receipt.total')}
          </Text>
          <Text className="text-xl font-expose-bold text-foreground">
            {formatPrice(total_price)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedCartReceiptView;
