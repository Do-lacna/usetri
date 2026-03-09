import type React from 'react';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  View,
} from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { PopularCategoryDto } from '~/src/network/model';

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
             flex-row items-center px-4 py-2 rounded-full min-h-[48px]
             ${
               isSelected
                 ? 'bg-primary border-primary shadow-md'
                 : 'bg-accent/10 border-accent/10 shadow-sm'
             }
           `}
        >
          {!!image_url && (
            <View
              className={`
               w-6 h-6 mr-3 justify-center items-center
               ${isSelected ? 'bg-white/20' : 'bg-accent/20'}
             `}
            >
              <Image
                source={{ uri: image_url as string }}
                resizeMode="contain"
                className="w-10 h-10 rounded-full"
              />
            </View>
          )}

          <Text
            className={`font-semibold text-sm ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <View className="py-2 bg-accent/5 border-b border-primary/10">
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
