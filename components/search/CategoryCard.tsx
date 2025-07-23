import { Image, Pressable, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../lib/constants";
import type { PopularCategoryDto } from "../../network/model";
import { Text } from "../ui/text";

interface CategoryCardProps {
  category: PopularCategoryDto;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable className="flex-1 mx-1 max-w-[115px]" onPress={onPress}>
      <View className="flex bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-3 h-[130px] justify-center items-center">
        <View className="w-full h-24 rounded-lg relative mb-3">
          <Image
            source={{
              uri: category?.category?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-24 rounded-lg"
            resizeMode="contain"
          />
        </View>
        <Text
          className="flex-1 text-center text-sm font-medium text-gray-800 leading-5"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {category?.category?.name}
        </Text>
      </View>
    </Pressable>
  );
}
