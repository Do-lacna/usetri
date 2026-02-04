import type React from 'react';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  View,
} from 'react-native';
import type { PopularCategoryDto } from '~/src/network/model';
import { Text } from '~/src/components/ui/text';

// Keep these outside to avoid recreating functions on each render (and satisfy lint rules)
const SubcategorySeparator = () => <View className="w-3" />;
const subcategoryKeyExtractor = (subcategory: { id?: number | string }) =>
  String(subcategory?.id);

interface CategorySelectorProps {
  selectedCategory: PopularCategoryDto;
  selectedSubcategoryId?: number;
  onSubcategorySelect: (
    subcategoryId: number | undefined,
    subcategoryName: string,
  ) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedSubcategoryId,
  onSubcategorySelect,
}) => {
  const subcategories = selectedCategory?.children || [];

  const renderSubcategory = ({ item }: ListRenderItemInfo<any>) => {
    const { name, id, image_url } = item;
    const isSelected = selectedSubcategoryId === id;

    return (
      <Pressable
        onPress={() => {
          if (isSelected) {
            onSubcategorySelect(undefined, '');
          } else {
            onSubcategorySelect(id, name);
          }
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
      >
        <View
          className={`
             flex-row items-center px-4 py-3 rounded-full min-h-[48px]
             ${
               isSelected
                 ? 'border-2 border-primary shadow-md'
                 : 'bg-card border border-border shadow-sm'
             }
           `}
        >
          {!!image_url && (
            <View
              className={`
               w-8 h-8 rounded-full mr-3 justify-center items-center
               ${isSelected ? 'bg-primary/20' : 'bg-card'}
             `}
            >
              <Image
                source={{ uri: image_url as string }}
                resizeMode="contain"
                className="w-8 h-8 rounded-full"
              />
            </View>
          )}

          <Text className="font-medium text-sm text-foreground" numberOfLines={1}>
            {name}
          </Text>

          {isSelected && (
            <View className="w-2 h-2 bg-primary-foreground rounded-full ml-2 opacity-80" />
          )}
        </View>
      </Pressable>
    );
  };

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <View className="py-3 bg-background/50">
      <FlatList
        horizontal
        data={subcategories}
        ItemSeparatorComponent={SubcategorySeparator}
        renderItem={renderSubcategory}
        keyExtractor={subcategoryKeyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
        className="grow-0"
      />
    </View>
  );
};
