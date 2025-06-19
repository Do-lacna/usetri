import { useState } from "react";
import { Text, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import { Check } from "~/lib/icons/Check";
import { Pencil } from "~/lib/icons/Pencil";

import { generateShoppingListItemDescription } from "~/lib/utils";
import { BrigaderReviewListItemDto } from "~/network/model";
import IconButton from "../../icon-button";
import { Badge } from "../badge";
import { Input } from "../input";

interface IShoppingListItemProps {
  product: BrigaderReviewListItemDto;
  price?: number;
  shopId?: number;
  barcode?: string;
  onConfirm?: (price: number, isOldPriceValid: boolean) => void;
}

const BrigaderProductRow = ({
  product,
  shopId,
  onConfirm,
}: IShoppingListItemProps) => {
  const { brand, unit, amount, price, name, barcode, is_checked } = product;

  const [newPrice, setNewPrice] = useState<string | undefined>(
    price ? price.toString() : ""
  );
  const [edittingPrice, setEdittingPrice] = useState(false);
  return (
    <View
      className={`w-full rounded-lg shadow-md mb-2 relative flex-row items-center justify-between p-4 ${
        is_checked ? "bg-green-100" : "bg-white"
      }`}
    >
      {/* Text content container with flex-1 to take available space and shrink if needed */}
      <View className="flex-1 mr-4">
        <Text
          className="text-base font-medium text-gray-800"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        {!!brand && (
          <Text
            className="text-sm font-medium text-gray-600"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {generateShoppingListItemDescription({ brand, unit, amount })}
          </Text>
        )}
      </View>

      {/* Buttons container with flex-shrink-0 to prevent shrinking */}
      {is_checked ? (
        <View className="flex items-center gap-2">
          <Badge>
            <Text className="font-bold">{price?.toFixed(2)} €</Text>
          </Badge>
        </View>
      ) : (
        <View>
          {edittingPrice ? (
            <View className="flex items-center gap-2">
              <Input
                placeholder="Cena"
                placeholderClassName="text-sm"
                className="w-[150px]"
                onChangeText={(value) => setNewPrice(value)}
                value={newPrice}
                keyboardType="numeric"
              />
              <View className="flex-row items-center gap-4 flex-shrink-0">
                <IconButton
                  onPress={() => setEdittingPrice(false)}
                  className="bg-red-200 rounded-full w-16 h-10 flex items-center justify-center self-center"
                >
                  <X size={18} />
                </IconButton>
                <IconButton
                  onPress={() => onConfirm?.(Number(newPrice), false)}
                  className="bg-primary rounded-full w-16 h-10 flex items-center justify-center self-center"
                >
                  <Check size={20} />
                </IconButton>
              </View>
            </View>
          ) : (
            <View className="flex items-center gap-2">
              <Text className="font-bold">{price} €</Text>
              <View className="flex-row items-center gap-4 flex-shrink-0">
                <IconButton
                  onPress={() => setEdittingPrice(true)}
                  className="bg-divider rounded-full w-12 h-10 flex items-center justify-center self-center"
                >
                  <Pencil size={18} />
                </IconButton>
                <IconButton
                  onPress={() => onConfirm?.(Number(price), true)}
                  className="bg-divider rounded-full w-12 h-10 flex items-center justify-center self-center"
                >
                  <Check size={20} />
                </IconButton>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default BrigaderProductRow;
