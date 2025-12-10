import { Minus, Plus, Trash2 } from 'lucide-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetCart } from '~/src/network/cart/cart';
import type { CartCategoryDto } from '~/src/network/model';
import { useGetProducts } from '~/src/network/query/query';
const PLACEHOLDER_PRODUCT_IMAGE = require('~/assets/images/product_placeholder.jpg');
import { useColorScheme } from '../../../lib/useColorScheme';
import SuggestedProductCard from './suggested-product-card';

const ShoppingListCategoryItem: React.FC<{
  item: CartCategoryDto;
  onUpdateQuantity: (categoryId: number, quantity: number) => void;
  onAlternativeSelect: (productId: number, categoryId: number) => void;
  isExpanded?: boolean;
}> = ({
  item,
  onUpdateQuantity,
  onAlternativeSelect,
  isExpanded: externalIsExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const {
    category: { id, name, image_url } = {},
    quantity = 1,
    price = 0,
  } = item;

  const {
    data: { cart } = {},
  } = useGetCart();

  // Theme-aware colors
  const iconColor = isDarkColorScheme ? '#9CA3AF' : '#374151';
  const activityIndicatorColor = isDarkColorScheme ? '#9CA3AF' : '#1F2937';

  const {
    data: { products: suggestedProducts = [] } = {},
    isLoading,
  } = useGetProducts(
    {
      category_id: id,
      is_category_checked: true,
    },
    { query: { enabled: !!id && isExpanded } },
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

  const isSelected = (productId: string): boolean =>
    cart?.specific_products?.some(
      ({ product }) => String(product?.id) === productId,
    ) ?? false;

  return (
    <View className="mb-3">
      <Pressable
        onPress={() => setIsExpanded(expanded => !expanded)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
      >
        <View
          className={`
            flex-row items-center px-4 py-3 rounded-full min-h-[48px]
            ${
              isExpanded
                ? 'border border-2 border-primary shadow-md'
                : 'bg-card border border-border shadow-sm'
            }
          `}
        >
          {!!image_url && (
            <View
              className={`
                w-8 h-8 rounded-full mr-3 justify-center items-center
                ${isExpanded ? 'bg-primary/20' : 'bg-card'}
              `}
            >
              <Image
                source={image_url ? { uri: image_url } : PLACEHOLDER_PRODUCT_IMAGE}
                className="w-8 h-8 rounded-full"
                resizeMode="contain"
              />
            </View>
          )}

          <View className="flex-1">
            <Text
              className="font-medium text-sm text-foreground"
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>

          <View className="flex-row items-center ml-2">
            <Text className="text-foreground font-bold text-sm mr-2">
              {totalPrice}€
            </Text>
            {quantity > 1 && (
              <Text className="text-muted-foreground text-xs mr-2">
                ({price.toFixed(2)} €)
              </Text>
            )}
          </View>

          <View className="flex-row items-center bg-muted rounded-full ml-2">
            <TouchableOpacity
              onPress={decrementQuantity}
              className="p-2"
              disabled={quantity <= 0}
            >
              {quantity <= 1 ? (
                <Trash2 size={16} color="#ef4444" />
              ) : (
                <Minus size={14} color={iconColor} />
              )}
            </TouchableOpacity>

            <Text className="px-2 text-foreground font-medium min-w-[24px] text-center text-sm">
              {item.quantity}
            </Text>

            <TouchableOpacity onPress={incrementQuantity} className="p-2">
              <Plus size={14} color={iconColor} />
            </TouchableOpacity>
          </View>

          {isExpanded && (
            <View className="w-2 h-2 bg-primary-foreground rounded-full ml-2 opacity-80" />
          )}
        </View>
      </Pressable>
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
                    Number(isSelected(String(b.detail?.id))) -
                    Number(isSelected(String(a.detail?.id))),
                )
                ?.map(({ detail, shops_prices }, index) => (
                  <SuggestedProductCard
                    key={detail?.id || index}
                    product={{ detail }}
                    shopsPrices={shops_prices}
                    onPress={onAlternativeSelect}
                    isSelected={isSelected(String(detail?.id))}
                  />
                ))}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListCategoryItem;
