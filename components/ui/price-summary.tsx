import { Link } from "expo-router";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ArrowRight } from "../../lib/icons/ArrowRight";
import { useGetHybridCart } from "../../network/hybrid-cart/hybrid-cart";
import IconButton from "../icon-button";

export type PriceSummaryProps = {
  onPress?: () => void;
};

const PriceSummary = ({ onPress }: PriceSummaryProps) => {
  const screenWidth = Dimensions.get("window").width;
  const {
    data: { cart: { total_price = 0 } = {} } = {},
    isLoading: isCartLoading,
  } = ({} = useGetHybridCart());

  return (
    <Link
      asChild
      href={"/main/price-comparison-modal/price-comparison-modal-screen"}
    >
      <Pressable
        style={{ width: screenWidth }}
        className="bg-primary absolute bottom-0 left-0 right-0 p-2 rounded-t-xl h-16"
        onPress={onPress}
      >
        <View className="p-2 shadow-sm shadow-foreground/10 flex flex-row justify-between items-center">
          <View>
            <Text className="text-foreground font-bold text-xl">
              Celková suma
            </Text>
            {/* {[...(available_shop_ids ?? [])].length > 0 && (
              <View className="relative flex-row  gap-x-2 mt-1">
                {available_shop_ids?.map((retailer, index) => (
                  <View
                    key={retailer}
                    style={{ width: 16, height: 16 }}
                    //   className="border-2"
                  >
                    <Image
                      {...getShopLogo(retailer as any)}
                      key={index}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 50,
                        position: "absolute",
                        right: index * 10,
                        zIndex: index + 1,
                        backgroundColor: "white",
                        borderColor: "grey",
                        borderWidth: 1,
                        // borderColor: "grey",
                        // borderWidth: 1,
                        //TODO add here some elevation to visually differentiate the shop logos
                      }}
                    />
                  </View>
                ))}
              </View>
            )} */}
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-foreground font-bold text-xl">
              {total_price?.toFixed(2)} €
            </Text>
            <IconButton className="bg-secondary rounded-full p-2">
              <ArrowRight size={20} />
            </IconButton>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default PriceSummary;
