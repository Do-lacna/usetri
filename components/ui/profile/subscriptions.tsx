import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { View } from "react-native";
import { useRevenueCat } from "../../../context/revenue-cat-provider";
import { CustomBottomSheetModal } from "../bottom-sheet-modal";
import { Button } from "../button";
import { Text } from "../text";

export interface SavedCartCardProps {}

const Subscriptions: React.FC<SavedCartCardProps> = ({}) => {
  const subscriptionModalRef = useRef<BottomSheetModal>(null);
  const { customerInfo, packages } = useRevenueCat();

  const subscriptions = customerInfo?.activeSubscriptions;
  const entitlements = customerInfo?.entitlements?.all || {};

  return (
    <>
      <CustomBottomSheetModal ref={subscriptionModalRef} index={2}>
        <View className="w-full flex items-center justify-center p-4 bg-green-50">
          <Text className="text-lg font-bold mb-4">Offerings</Text>
          {packages?.map((pack, index) => (
            <Text key={index} className="text-lg font-bold mb-4">
              {pack?.identifier}
            </Text>
          ))}
          <Text className="text-lg font-bold mb-4">Subscriptions</Text>
          {subscriptions?.map((subscription, index) => (
            <Text key={index} className="text-lg font-bold mb-4">
              {subscription}
            </Text>
          ))}
          <Text className="text-lg  font-bold mb-4">Entitlements</Text>

          {Object.entries(entitlements)?.map(([k, v]) => (
            <Text className="text-lg font-bold mb-4">
              {k} - {v?.identifier}
            </Text>
          ))}
        </View>
      </CustomBottomSheetModal>

      <Button
        onPress={() => subscriptionModalRef?.current?.present()}
        className="my-6 bg-terciary"
      >
        <Text>Predplatné</Text>
      </Button>
    </>
  );
};

Subscriptions.displayName = "Subscriptions";

export { Subscriptions };
