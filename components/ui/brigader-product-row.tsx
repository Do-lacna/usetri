import { Text, TouchableOpacity, View } from 'react-native';
import { Camera } from '~/lib/icons/Camera';
import { Check } from '~/lib/icons/Check';
import IconButton from '../icon-button';
import { Link } from 'expo-router';
import { Button } from './button';

interface IShoppingListItemProps {
  label: string | null;
  description?: string;
  price?: number;
  shopId?: number;
  barcode?: string;
  onConfirm?: () => void;
}

const BrigaderProductRow = ({
  label,
  description,
  price = 0,
  shopId,
  barcode,
  onConfirm,
}: IShoppingListItemProps) => {
  return (
    <View className="w-full bg-white rounded-lg shadow-md mb-2 relative flex-row items-center justify-between p-4">
      {/* Text content container with flex-1 to take available space and shrink if needed */}
      <View className="flex-1 mr-4">
        <Text
          className="text-base font-medium text-gray-800"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        {!!description && (
          <Text
            className="text-sm font-medium text-gray-600"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}
      </View>

      {/* Buttons container with flex-shrink-0 to prevent shrinking */}
      <View className="flex items-center gap-2">
        <Text className="font-bold">{price} €</Text>
        <View className="flex-row items-center gap-4 flex-shrink-0">
          <Link
            href={{
              pathname: '/main/brigader-scan-screen/[...slug]',
              params: { slug: [String(shopId), String(barcode)] },
            }}
            asChild
          >
            <TouchableOpacity className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center">
              <Camera size={20} />
            </TouchableOpacity>
          </Link>
          <IconButton
            onPress={onConfirm}
            className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center"
          >
            <Check size={20} />
          </IconButton>
        </View>
      </View>
    </View>
  );
};

export default BrigaderProductRow;
