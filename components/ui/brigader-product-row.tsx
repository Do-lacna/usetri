import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Camera } from "~/lib/icons/Camera";
import { Check } from "~/lib/icons/Check";
import { generateShoppingListItemDescription } from "../../lib/utils";
import { BrigaderReviewListItemDto } from "../../network/model";
import IconButton from "../icon-button";
import { Badge } from "./badge";

interface IShoppingListItemProps {
  product: BrigaderReviewListItemDto;
  price?: number;
  shopId?: number;
  onConfirm?: () => void;
}

const BrigaderProductRow = ({
  product,
  shopId,
  onConfirm,
}: IShoppingListItemProps) => {
  const { brand, unit, amount, price, name, barcode, is_checked } = product;
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
        <View className="flex items-center gap-2">
          <Badge className="bg-divider">
            <Text className="font-bold">{price?.toFixed(2)} €</Text>
          </Badge>
          <View className="flex-row items-center gap-4 flex-shrink-0">
            <Link
              href={{
                pathname: "/main/brigader-scan-screen/[...slug]",
                params: { slug: [String(shopId), String(barcode)] },
              }}
              asChild
            >
              <TouchableOpacity
                disabled={is_checked}
                className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center"
              >
                <Camera size={20} />
              </TouchableOpacity>
            </Link>
            <IconButton
              onPress={onConfirm}
              className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center"
              disabled={is_checked}
            >
              <Check size={20} />
            </IconButton>
          </View>
        </View>
      )}
    </View>
  );
};

export default BrigaderProductRow;
