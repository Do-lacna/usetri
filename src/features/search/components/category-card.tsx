import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Platform, Pressable, View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { PopularCategoryDto } from '~/src/network/model';
import PLACEHOLDER_PRODUCT_IMAGE from '~/assets/images/other/product_placeholder.jpg';

cssInterop(Image, { className: 'style' });

interface CategoryCardProps {
  category: PopularCategoryDto;
  onPress: () => void;
}

export function CategoryCard({
  category,
  onPress,
}: Readonly<CategoryCardProps>) {
  return (
    <Pressable
      className="flex-1 mx-2"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <View
        className={`rounded-2xl overflow-hidden border border-primary/20 h-[180px] relative`}
        style={
          Platform.OS === 'ios'
            ? {
                shadowColor: '#5645CC',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              }
            : { elevation: 4 }
        }
      >
        <Image
          source={
            category?.category?.image_url
              ? { uri: category.category.image_url }
              : PLACEHOLDER_PRODUCT_IMAGE
          }
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

        <View className="absolute bottom-0 left-0 right-0 bg-primary/70 backdrop-blur-sm px-3 py-3">
          <Text
            className="text-sm font-expose-bold text-white text-center leading-tight"
            numberOfLines={2}
          >
            {category?.category?.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
