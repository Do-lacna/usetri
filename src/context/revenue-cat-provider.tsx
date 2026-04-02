import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import i18n from 'i18next';
import { logError, logPurchase } from '~/src/utils/analytics';
import { displayErrorToastMessage } from '~/src/utils/toast-utils';
import Purchases, {
  type CustomerInfo,
  type PurchasesEntitlementInfos,
  type PurchasesPackage,
} from 'react-native-purchases';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '',
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY || '',
};

interface RevenueCatProps {
  purchasePackage?: (pack: PurchasesPackage) => Promise<void>;
  restorePermissions?: () => Promise<CustomerInfo>;
  user: UserState;
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
}

export interface UserState {
  cookies: number;
  items: string[];
  pro: boolean;
  entitlements?: PurchasesEntitlementInfos;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};

export const RevenueCatProvider = ({
  children,
}: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState>({
    cookies: 0,
    items: [],
    pro: false,
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }
        setIsReady(true);

        Purchases.addCustomerInfoUpdateListener(async info => {
          updateCustomerInformation(info);
        });

        await loadOfferings();
      } catch (e) {
        logError(e, 'RevenueCat:init');
        setIsReady(true);
      }
    };
    init();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(updateCustomerInformation);
    };
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      logError(e, 'RevenueCat:loadOfferings');
    }
  };

  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    setCustomerInfo(customerInfo);
    const newUser: UserState = {
      cookies: user.cookies,
      items: [],
      pro: false,
      entitlements: {} as PurchasesEntitlementInfos,
    };
    newUser.entitlements = customerInfo.entitlements;
    setUser(newUser);
  };

  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pack);
      logPurchase(
        pack.product.identifier,
        pack.product.price,
        pack.product.currencyCode,
      );
    } catch (e: any) {
      if (!e.userCancelled) {
        logError(e, 'RevenueCat:purchase');
        displayErrorToastMessage(i18n.t('paywall.purchase_error'));
      }
    }
  };

  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
    customerInfo,
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
