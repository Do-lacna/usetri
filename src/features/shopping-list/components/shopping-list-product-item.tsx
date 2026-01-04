import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';
import type { CartProductDto } from '~/src/network/model';
import { useGetProducts } from '~/src/network/query/query';
import { useColorScheme } from '../../../lib/useColorScheme';
import SuggestedProductCard from './suggested-product-card';
const PLACEHOLDER_PRODUCT_IMAGE = require('~/assets/images/product_placeholder.jpg');

const ShoppingListProductItem: React.FC<{
  item: CartProductDto;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onAlternativeSelect: (originalProductId: number, productId: number) => void;
  isExpanded?: boolean;
}> = ({
  item,
  onUpdateQuantity,
  onAlternativeSelect,
  isExpanded: externalIsExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const iconColor = isDarkColorScheme ? '#9CA3AF' : '#374151';
  const activityIndicatorColor = isDarkColorScheme ? '#9CA3AF' : '#1F2937';

  const {
    product: {
      id,
      name = 'Specific product',
      unit: { normalized_amount: amount = '', normalized_unit: unit = '' } = {},
      brand,
      category: { id: categoryId, image_url: categoryImageUrl } = {},
      image_url,
    } = {},
    quantity = 1,
    price = 0,
    available_shop_ids = [],
  } = item;

  const {
    data: { products: suggestedProducts = [] } = {},
    isLoading,
  } = useGetProducts(
    {
      category_id: categoryId,
      is_category_checked: true,
    },
    { query: { enabled: !!categoryId && isExpanded } },
  );

  useEffect(() => {
    if (externalIsExpanded !== undefined) {
      setIsExpanded(externalIsExpanded);
    }
  }, [externalIsExpanded]);

  const incrementQuantity = () => {
    onUpdateQuantity(Number(id), quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity <= 0) return;
    onUpdateQuantity(Number(id), quantity - 1);
  };

  const totalPrice = (price * quantity).toFixed(2);

  const isSelected = (suggestedProductId: number): boolean =>
    suggestedProductId === id;

  const validShops = available_shop_ids?.filter(Boolean) || [];
  const shopCount = validShops.length;

  return (
    <View className="bg-card rounded-xl p-3 mb-3 shadow-sm border border-border">
      <TouchableOpacity
        onPress={() => setIsExpanded(expanded => !expanded)}
        activeOpacity={0.7}
      >
        <View className="flex-row gap-3">
          <View className="relative">
            <Image
              source={
                image_url
                  ? { uri: image_url }
                  : categoryImageUrl
                    ? { uri: categoryImageUrl }
                    : PLACEHOLDER_PRODUCT_IMAGE
              }
              className="w-16 h-16 rounded-lg"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 flex-col justify-between py-0.5">
            <View>
              <Text
                className="text-card-foreground font-semibold text-base leading-tight"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text
                className="text-muted-foreground text-xs mt-0.5"
                numberOfLines={1}
              >
                {brand} • {amount} {unit}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-baseline gap-1">
                <Text className="text-card-foreground font-bold text-lg">
                  {totalPrice}€
                </Text>
                {quantity > 1 && (
                  <Text className="text-muted-foreground text-xs">
                    ({price.toFixed(2)}/ks)
                  </Text>
                )}
              </View>

              <View className="flex-row items-center gap-2">
                <View className="relative flex-row justify-end mr-1">
                  {validShops.map((retailer, index) => (
                    <View
                      key={retailer}
                      style={{
                        marginRight: index === shopCount - 1 ? 0 : -8,
                        zIndex: shopCount - index,
                      }}
                    >
                      <ShopLogoBadge shopId={retailer} size={20} index={0} />
                    </View>
                  ))}
                </View>

                <View className="flex-row items-center bg-muted rounded-full h-8">
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    className="w-8 h-8 items-center justify-center"
                    disabled={quantity <= 0}
                  >
                    {quantity <= 1 ? (
                      <Trash2 size={14} color="#ef4444" />
                    ) : (
                      <Minus size={14} color={iconColor} />
                    )}
                  </TouchableOpacity>

                  <Text className="text-foreground font-medium min-w-[16px] text-center text-sm">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={incrementQuantity}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Plus size={14} color={iconColor} />
                  </TouchableOpacity>
                </View>

                <View className="ml-1">
                  {isExpanded ? (
                    <ChevronUp size={18} color={iconColor} />
                  ) : (
                    <ChevronDown size={18} color={iconColor} />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {isExpanded &&
        (isLoading ? (
          <View className="h-20 justify-center items-center">
            <ActivityIndicator color={activityIndicatorColor} />
          </View>
        ) : (
          <ScrollView
            horizontal
            className="p-4"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row align-center justify-center space-x-4 w-full h-45 gap-4">
              {suggestedProducts
                ?.sort(
                  (a, b) =>
                    Number(isSelected(Number(b.detail?.id))) -
                    Number(isSelected(Number(a.detail?.id))),
                )
                ?.map(
                  (
                    {
                      detail: { id: suggestedProductId } = {},
                      detail,
                      shops_prices,
                    },
                    index,
                  ) => (
                    <SuggestedProductCard
                      key={suggestedProductId || index}
                      product={{ detail }}
                      shopsPrices={shops_prices}
                      onPress={() =>
                        onAlternativeSelect(
                          Number(id),
                          Number(suggestedProductId),
                        )
                      }
                      isSelected={isSelected(Number(suggestedProductId))}
                    />
                  ),
                )}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListProductItem;
