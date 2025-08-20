import LogoSVG from "assets/images/empty-cart.svg";
import { View } from "react-native";
import { Text } from "../ui/text";

const EmptyShoppingListPlaceholderScreen = () => {
  return (
    <View className="absolute w-full h-full justify-center items-center absolute top-12 -z-10 gap-4">
      {/* <Svg
        source={require("../../assets/images/empty-cart.svg")}
        className="w-60 h-60 mb-1"
        resizeMode="contain"
      /> */}
      <LogoSVG width={"100%"} height={150} />
      <Text className="text-2xl w-3/4 text-center text-muted-foreground">
        Tvoj nákupný zoznam je prázdny
      </Text>
    </View>
  );
};

export default EmptyShoppingListPlaceholderScreen;
