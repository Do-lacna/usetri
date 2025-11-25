import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Platform, Pressable, View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { PopularCategoryDto } from '~/src/network/model';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../../../lib/constants';

cssInterop(Image, { className: 'style' });

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
        <Image
          source={{
            uri: category?.category?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
          }}
          className="w-full h-full absolute inset-0"
          contentFit="cover"
          transition={400}
          cachePolicy="memory-disk"
          priority="high"
          placeholder={{
            blurhash:
              '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[',
          }}
        />

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
