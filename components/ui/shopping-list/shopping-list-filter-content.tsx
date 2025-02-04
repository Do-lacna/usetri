import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "../label";
import { Text } from "../text";

interface ShoppingListFilterContentProps {
  onFilterChange: (filter: ShoppingListFilter) => void;
}

export enum ShoppingListFilter {
  CATEGORIES = "CATEGORIES",
  PRODUCTS = "PRODUCTS",
}

function RadioGroupItemWithLabel({
  label,
  description,
  value,
  onLabelPress,
}: {
  label: string;
  description?: string;
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <Pressable
      className={"flex-row gap-4 items-center px-6"}
      onPress={onLabelPress}
    >
      <RadioGroupItem
        aria-labelledby={`label-for-${value}`}
        value={value}
        className="text-xl"
      />
      <View className="flex-col flex-1">
        <Label nativeID={`label-for-${value}`} className="text-xl">
          {label}
        </Label>
        {description && <Text className="text-gray-500">{description}</Text>}
      </View>
    </Pressable>
  );
}

const ShoppingListFilterContent: React.FC<ShoppingListFilterContentProps> = ({
  onFilterChange,
}) => {
  const [filter, setFilter] = React.useState<ShoppingListFilter>(
    ShoppingListFilter.CATEGORIES
  );

  const handleFilterChange = (value: string) => {
    const valueConverted = value as ShoppingListFilter;
    setFilter(valueConverted);
    onFilterChange(valueConverted);
  };
  return (
    <RadioGroup
      value={filter}
      onValueChange={handleFilterChange}
      className="gap-5 w-full pb-10 pt-5"
    >
      <RadioGroupItemWithLabel
        label="Hľadaj kategóriu produktov"
        description="Vyhľadaj produkty v reťazcoch na základe kategórií"
        value={ShoppingListFilter.CATEGORIES}
        onLabelPress={() => handleFilterChange(ShoppingListFilter.CATEGORIES)}
      />
      <RadioGroupItemWithLabel
        label="Hľadaj konkrétny produkt"
        description="Toto vyhľadávanie môže obmedziť zoznam len na siete, ktoré majú produkt konkrétnej značky v ponuke"
        value={ShoppingListFilter.PRODUCTS}
        onLabelPress={() => handleFilterChange(ShoppingListFilter.PRODUCTS)}
      />
    </RadioGroup>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShoppingListFilterContent;
