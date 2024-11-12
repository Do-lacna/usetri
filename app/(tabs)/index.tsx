import { ScrollView, View } from "react-native";
import ProductCardNew from "../../components/ui/product-card-new";
import { products } from "../../test/test-data";

export default function Page() {
  return (
    <View>
      {/* <ProductCardNew
        onPress={() => console.log("Product selected:")}
        product={{
          imageUrl:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
          name: "Svetle pivo",
          brand: "Kelt",
          amount: "0.5 l",
          price: "15.50",
        }}
      /> */}
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
