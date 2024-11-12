import { ScrollView, Text, View } from "react-native";
import ProductCardNew from "../../components/ui/product-card-new";
import { products } from "../../test/test-data";

export default function Page() {
  return (
    <View className="px-2">
      <View className="flex-row ">
        <Text className="text-3xl">Discounts in</Text>
        <Text className="text-3xl font-semibold text-primary ml-1">Tesco</Text>
      </View>
      <View className="flex-row px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12, // This adds 24 pixels of space between items
            paddingVertical: 8,
          }}
          className="flex-row space-x-4"
        >
          {products.map((product, index) => (
            <ProductCardNew
              key={index}
              product={product}
              onPress={() => {
                console.log("Product selected:", product);
              }}
            />
          ))}
        </ScrollView>
      </View>
      {/* const ProductList = ({ products }) => {
  return (
    <View className="flex-row px-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            onPress={() => {
              // Handle product selection
              console.log("Product selected:", product);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}; */}
    </View>
  );
}
