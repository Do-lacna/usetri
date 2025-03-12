import React, { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import SearchPlaceholderImage from "~/assets/images/svg/search-placeholder.svg";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "../label";
import { Text } from "../text";

interface ShoppingListFilterContentProps {
  currentFilter?: ShoppingListFilter;
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
  currentFilter,
  onFilterChange,
}) => {
  const [filter, setFilter] = React.useState<ShoppingListFilter>(
    currentFilter ?? ShoppingListFilter.CATEGORIES
  );

  const handleFilterChange = (value: string) => {
    const valueConverted = value as ShoppingListFilter;
    setFilter(valueConverted);
    onFilterChange(valueConverted);
  };
  return (
    <Fragment>
      <View className="w-[120px] h-[120px] my-4">
        <SearchPlaceholderImage width={"100%"} height={"100%"} />
      </View>
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
    </Fragment>
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
