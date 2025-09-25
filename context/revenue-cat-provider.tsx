import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesEntitlementInfos,
  type PurchasesPackage,
} from "react-native-purchases";
// Provide RevenueCat functions to our app

// Use your RevenueCat API keys
const APIKeys = {
  apple: "appl_fDaggXpWHKktWRRTrtIaKYSJFQT",
  google: "goog_MfhxZabLgqWiOyplBAiWLWKAUQj",
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

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};

export const RevenueCatProvider = ({ children }: any) => {
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
        if (Platform.OS === "android") {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }
        setIsReady(true);

        // Use more logging during debug if want!
        //TODO enable this when setting up revenuecat
        // Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // Listen for customer updates
        Purchases.addCustomerInfoUpdateListener(async (info) => {
          // console.log(info);
          updateCustomerInformation(info);
        });

        // Load all offerings and the user object with entitlements
        await loadOfferings();
      } catch (e) {
        console.error("Error initializing RevenueCat: ", e);
      }
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      console.log(offerings);
      if (offerings.current) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.error("Error loading offerings: ", e);
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    setCustomerInfo(customerInfo);
    const newUser: UserState = {
      cookies: user.cookies,
      items: [],
      pro: false,
      entitlements: {} as PurchasesEntitlementInfos,
    };
    newUser.entitlements = customerInfo.entitlements;

    // if (customerInfo?.entitlements.active["Epic Wand"] !== undefined) {
    //   newUser.items.push(
    //     customerInfo?.entitlements.active["Epic Wand"].identifier
    //   );
    // }

    // if (customerInfo?.entitlements.active["Magic Boots"] !== undefined) {
    //   newUser.items.push(
    //     customerInfo?.entitlements.active["Magic Boots"].identifier
    //   );
    // }

    // if (customerInfo?.entitlements.active["PRO Features"] !== undefined) {
    //   newUser.pro = true;
    // }

    setUser(newUser);
  };

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pack);

      // Directly add our consumable product
      if (pack.product.identifier === "rca_299_consume") {
        setUser({ ...user, cookies: (user.cookies += 5) });
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  // // Restore previous purchases
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

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <Fragment></Fragment>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
