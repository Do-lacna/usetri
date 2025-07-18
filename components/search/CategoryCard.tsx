import { Image, Pressable, Text, View } from 'react-native';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../../lib/constants';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    image_url?: string;
    children?: { id: number; name: string }[];
  };
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      className="flex-1 mx-1"
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-3">
        <View className="w-full h-24 rounded-lg relative mb-3">
          <Image
            source={{
              uri: category?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-24 rounded-lg"
            resizeMode="contain"
          />
        </View>
        <Text className="text-center text-sm font-medium text-gray-800 leading-5">
          {category.name}
        </Text>
        {/* {category.children && (
          <Text className="text-center text-xs text-primary mt-1 font-medium">
            {category.children.length} podkategórií →
          </Text>
        )} */}
      </View>
    </Pressable>
  );
}
