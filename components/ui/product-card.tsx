import React from "react";
import { Image, Text, View } from "react-native";
import { Card, CardContent, CardDescription, CardFooter } from "./card"; // Assuming Card component is in the same folder

interface ProductCardProps {
  brand: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  brand,
  name,
  price,
  description,
  imageUrl,
}) => {
  return (
    <Card className="w-1/3 h-60">
      <View className="w-full h-1/2">
        <Image
          source={{
            uri: "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
          }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <View className="h-1/2 w-full">
        <Text className="text-md">Kelt</Text>
        <Text className="text-md">Svetle pivo</Text>

        <CardContent>
          <View className="flex-row justify-around gap-3">
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Dimension</Text>
              <Text className="text-xl font-semibold">C-137</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Age</Text>
              <Text className="text-xl font-semibold">70</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Species</Text>
              <Text className="text-xl font-semibold">Human</Text>
            </View>
            <CardDescription className="text-base font-semibold">
              Scientist
            </CardDescription>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3 pb-0">
          <View className="flex-row items-center overflow-hidden">
            <Text className="text-sm text-muted-foreground">Productivity:</Text>
          </View>
        </CardFooter>
      </View>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";

export { ProductCard };
