import { Image, Pressable, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../../lib/constants";
import type { PopularCategoryDto } from "../../../network/model";
import { Text } from "../../ui/text";

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
        transform: [{ scale: pressed ? 0.95 : 1 }]
      })}
    >
      <View className="bg-card rounded-2xl p-4 shadow-md border border-border h-[160px] justify-between">
        {/* Icon container with gradient background */}
        <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 justify-center items-center mb-3">
          <Image
            source={{
              uri: category?.category?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

        <Text
          className="text-base font-semibold text-card-foreground leading-5"
          numberOfLines={2}
        >
          {category?.category?.name}
        </Text>
      </View>
    </Pressable>
  );
}
