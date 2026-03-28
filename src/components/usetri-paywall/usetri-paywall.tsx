import type React from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import { useRevenueCat } from '../../context/revenue-cat-provider';
import { displayErrorToastMessage } from '../../utils/toast-utils';

type SubscriptionPaywallProps = {
  onPurchaseComplete?: (customerInfo: CustomerInfo) => void;
  onClose: () => void;
};

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  onPurchaseComplete,
  onClose,
}) => {
  const { customerInfo, packages } = useRevenueCat();
  const subscriptions = customerInfo?.activeSubscriptions;
  const entitlements = customerInfo?.entitlements?.all || {};
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchase = async (): Promise<void> => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      // Check if user has access to the entitlement
      const entitlementInfo = customerInfo.entitlements.active;
      if (
        entitlementInfo.premium ||
        entitlementInfo.pro ||
        entitlementInfo.Pro
      ) {
        // Purchase successful
        onPurchaseComplete?.(customerInfo);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        displayErrorToastMessage(
          'Nepodarilo sa spracovať platbu. Skúste to znova.',
        );
        setErrorMessage('Nepodarilo sa spracovať platbu. Skúste to znova.');
        console.error('Purchase error:', error);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const renderPackageOption = (pkg: PurchasesPackage) => {
    const isSelected =
      selectedPackage && selectedPackage.identifier === pkg.identifier;

    return (
      <TouchableOpacity
        key={pkg.identifier}
        className={`p-4 border rounded-lg mb-3 ${
          isSelected ? 'border-success bg-success/10' : 'border-border'
        }`}
        onPress={() => setSelectedPackage(pkg)}
      >
        <Text className="text-base font-bold mb-1">{pkg.product.title}</Text>
        <Text className="text-lg font-bold text-terciary mb-1">
          {pkg.product.priceString}
        </Text>
        {pkg.product.introPrice && (
          <Text className="text-sm text-success mb-1">
            {`${pkg.product.introPrice.periodNumberOfUnits} ${pkg.product.introPrice.periodUnit} trial at ${pkg.product.introPrice.priceString}`}
          </Text>
        )}
        <Text className="text-sm text-muted-foreground">{pkg.product.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView className="w-full p-4">
      <View className="flex-row justify-center items-center py-4 border-b border-border relative">
        <Text className="text-lg font-bold">Zvoľte si predplatné</Text>
      </View>

      {packages?.map(renderPackageOption)}

      <View className="p-4 border-t border-border">
        <TouchableOpacity
          className={`py-4 rounded-lg items-center justify-center mb-4 ${
            !selectedPackage || isPurchasing ? 'opacity-50 bg-primary' : 'bg-primary'
          }`}
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-primary-foreground font-bold text-base">
              {selectedPackage
                ? `Odoberať za ${selectedPackage.product.priceString}`
                : 'Zvoľte si predplatné'}
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-xs text-muted-foreground text-center">
          Payment will be charged to your Apple ID or Google Play account at
          confirmation of purchase. Subscriptions automatically renew unless
          canceled at least 24 hours before the end of the current period.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SubscriptionPaywall;
