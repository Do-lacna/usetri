import clsx from "clsx";
import { Store } from "lucide-react-native";
import React from "react";
import { Image, View } from "react-native";
import { getShopLogo } from "../../utils/logo-utils";

export type PriceSummaryProps = {
  storeId?: number;
  containerClassname?: string;
  imageClassname?: string;
};

const StoreLogo = ({
  storeId,
  containerClassname,
  imageClassname,
}: PriceSummaryProps) => {
  return (
    <View
      className={clsx(
        "w-10 h-10 justify-center items-center rounded-full shadow-sm shadow-foreground/10 ",
        containerClassname
      )}
    >
      {storeId ? (
        <Image
          {...getShopLogo(storeId as any)}
          className="w-[80%] h-[80%] rounded-full"
          resizeMode="contain"
        />
      ) : (
        <Store size={24} />
      )}
    </View>
  );
};

export default StoreLogo;
