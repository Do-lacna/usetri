import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  View,
} from 'react-native';
import type { PopularCategoryDto } from '../../../network/model';
import { Text } from '../../ui/text';

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
  const { t } = useTranslation();
  // Get subcategories from the selected main category
  const subcategories = selectedCategory?.children || [];

  const renderSubcategory = ({ item }: ListRenderItemInfo<any>) => {
    const { name, id, image_url } = item;
    const isSelected = selectedSubcategoryId === id;

    return (
      <Pressable
        onPress={() => {
          // Toggle behavior: if already selected, deselect it, otherwise select it
          if (isSelected) {
            onSubcategorySelect(undefined, ''); // Deselect
          } else {
            onSubcategorySelect(id, name); // Select
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
                 ? 'bg-primary border border-primary shadow-lg'
                 : 'bg-card border border-border shadow-sm'
             }
           `}
        >
          {/* Icon container with improved styling */}
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
                className="w-8 h-8 rounded-full bg-card/50"
              />
            </View>
          )}

          {/* Subcategory name with improved typography */}
          <Text
            className={`
               font-medium text-sm
               ${isSelected ? 'text-primary-foreground' : 'text-foreground'}
             `}
            numberOfLines={1}
          >
            {name}
          </Text>

          {/* Selected indicator dot */}
          {isSelected && (
            <View className="w-2 h-2 bg-primary-foreground rounded-full ml-2 opacity-80" />
          )}
        </View>
      </Pressable>
    );
  };

  // Don't render if no subcategories
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <View className="py-3 bg-background/50">
      {/* Section header showing main category name */}
      <View className="px-4 mb-3">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {selectedCategory?.category?.name} - {t('subcategories_label')}
        </Text>
      </View>

      {/* Horizontal subcategory list */}
      <FlatList
        horizontal
        data={subcategories}
        ItemSeparatorComponent={() => <View className="w-3" />}
        renderItem={renderSubcategory}
        keyExtractor={subcategory => String(subcategory?.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
        style={{
          flexGrow: 0,
        }}
      />
    </View>
  );
};
