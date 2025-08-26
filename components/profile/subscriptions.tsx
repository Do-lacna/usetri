import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type React from "react";
import { useRef } from "react";
import { displaySuccessToastMessage } from "~/utils/toast-utils";
import { useRevenueCat } from "../../context/revenue-cat-provider";
import { CustomBottomSheetModal } from "../layout/bottom-sheet-modal/bottom-sheet-modal";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import SubscriptionPaywall from "../usetri-paywall/usetri-paywall";

export type SavedCartCardProps = {};

const Subscriptions: React.FC<SavedCartCardProps> = ({}) => {
  const subscriptionModalRef = useRef<BottomSheetModal>(null);
  const { customerInfo, packages } = useRevenueCat();

  const subscriptions = customerInfo?.activeSubscriptions;
  const entitlements = customerInfo?.entitlements?.all || {};
  const activeEntitlements = customerInfo?.entitlements?.active || {};

  console.log("Active subscriptions:", subscriptions);

  const handlePurchaseComplete = (customerInfo: any) => {
    console.log("Purchase completed:", customerInfo);
    displaySuccessToastMessage(
      "Predplatné bolo úspešne aktivované, najdete ho v profile"
    );
    subscriptionModalRef?.current?.dismiss();
  };

  return (
    <>
      <CustomBottomSheetModal ref={subscriptionModalRef} index={2}>
        {/* <View className="w-full flex items-center justify-center p-4 bg-green-50">
          <Text>All entitlements</Text>
          <Text>{Object.entries(entitlements)?.map(([k, v]) => `${k} : ${v}`)}</Text>
          <Text>Active entitlements</Text>
          <Text>{Object.entries(activeEntitlements)?.map(([k, v]) => `${k} : ${v}`)}</Text>
        </View> */}

        <SubscriptionPaywall
          onPurchaseComplete={handlePurchaseComplete}
          onClose={() => subscriptionModalRef?.current?.dismiss()}
        />
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
