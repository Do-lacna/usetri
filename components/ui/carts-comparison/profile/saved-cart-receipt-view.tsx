import type React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { CartComparisonDto } from "../../../../network/model";

const SavedCartReceiptView: React.FC<CartComparisonDto> = ({
  shop: { name: shopName } = {},
  specific_products: groceries = [],
  total_price,
}) => {
  const formatPrice = (price = 0): string => {
    return `${price.toFixed(2)} €`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pb-6">
        <Card className="bg-card shadow-lg mb-4 border border-border">
          <CardHeader className="pb-4">
            <View className="items-center border-b border-border pb-4">
              <Text className="text-xl font-bold text-card-foreground mb-1">
                {shopName}
              </Text>
              <View className="flex-row justify-between w-full"></View>
            </View>
          </CardHeader>

          <CardContent className="pt-0">
            <View className="mb-4">
              {groceries?.map(
                (
                  {
                    price = 1,
                    detail: { name, barcode, brand } = {},
                    quantity = 1,
                  },
                  index
                ) => (
                  <View key={barcode}>
                    <View className="flex-row justify-between items-start py-3">
                      <View className="flex-1 pr-4">
                        <Text className="text-base font-medium text-card-foreground mb-1">
                          {name}
                        </Text>
                        <Text className="text-sm text-muted-foreground mb-1">
                          {brand}
                        </Text>
                        <Text className="text-xs text-muted-foreground opacity-75">
                          Počet: {2}
                        </Text>
                      </View>
                      <Text className="text-base font-semibold text-card-foreground">
                        {formatPrice(price * quantity)}
                      </Text>
                    </View>
                    {index < groceries?.length - 1 && (
                      <Separator className="bg-border" />
                    )}
                  </View>
                )
              )}
            </View>

            {/* Total Section */}
            <Separator className="bg-border mb-4" />
            <View className="flex-row justify-between items-center bg-muted p-4 rounded-lg">
              <Text className="text-lg font-bold text-card-foreground">
                Celková suma
              </Text>
              <Text className="text-xl font-bold text-green-600">
                {formatPrice(total_price)}
              </Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedCartReceiptView;
