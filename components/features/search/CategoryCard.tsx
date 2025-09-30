import { Image, Platform, Pressable, View } from 'react-native';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../../../lib/constants';
import type { PopularCategoryDto } from '../../../network/model';
import { Text } from '../../ui/text';

interface CategoryCardProps {
  category: PopularCategoryDto;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      className="flex-1 mx-2"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <View
        className={`rounded-2xl overflow-hidden shadow-${
          Platform.OS === 'ios' ? 'sm' : 'md'
        } border border-border h-[180px] relative`}
      >
        {/* Image container - fills entire card */}
        <Image
          source={{
            uri: category?.category?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
          }}
          className="w-full h-full absolute inset-0"
          resizeMode="cover"
        />

        {/* Glassmorphism text overlay - use app palette tokens instead of hardcoded whites/grays */}
        <View className="absolute bottom-0 left-0 right-0 bg-card/75 backdrop-blur-sm px-2 py-3">
          <Text
            className="text-m font-semibold text-card-foreground text-center leading-tight"
            numberOfLines={2}
          >
            {category?.category?.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
