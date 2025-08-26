import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRevenueCat } from "~/context/revenue-cat-provider";
import ProfileHeader from "../../../../components/profile/profile-header";
import { SavedCartCard } from "../../../../components/profile/saved-cart-card";
import { TotalSavedCard } from "../../../../components/profile/total-saved-card";
import Divider from "../../../../components/ui/divider";
import { useSession } from "../../../../context/authentication-context";
import { useDrawerMenu } from "../../../../hooks/use-drawer-menu";
import { useGetArchivedCart } from "../../../../network/customer/customer";
import type { ShortArchivedCartDto } from "../../../../network/model";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  console.log(i18n?.languages?.[0]);
  const { isDrawerOpen, openDrawer, closeDrawer, menuSections } =
    useDrawerMenu();
  const { user } = useSession();
  const {
    data: { archived_carts = [] } = {},
    isLoading: areArchivedCartsLoading,
  } = useGetArchivedCart();
  const { customerInfo, packages } = useRevenueCat();
  const subscriptions = customerInfo?.activeSubscriptions;

  const renderShopCardCart = ({
    cart_id,
    created_at,
    total_price,
    selected_shop_id,
    price_difference,
  }: ShortArchivedCartDto) => (
    <SavedCartCard
      key={cart_id}
      id={Number(cart_id)}
      shopId={Number(selected_shop_id)}
      totalPrice={Number(total_price)}
      createdDate={String(created_at)}
      savedAmount={Number(price_difference)}
    />
  );

  const isLoading = areArchivedCartsLoading;

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      // edges={["bottom", "left", "right"]}
    >
      <ScrollView
        className="px-6"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      >
        <ProfileHeader userEmail={user?.email} />

        <TotalSavedCard />

        <Divider className="my-8" />

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-foreground">
              História nákupov
            </Text>
            <Text className="text-sm text-muted-foreground">
              {t("nakup", { count: archived_carts?.length ?? 0 })}
            </Text>
          </View>

          {(archived_carts ?? []).length > 0 ? (
            archived_carts?.map(renderShopCardCart)
          ) : (
            <View className="bg-card rounded-2xl p-8 items-center shadow-sm border border-border">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text className="text-muted-foreground text-center mt-4 text-base">
                Žiadne nákupné zoznamy
              </Text>
              <Text className="text-muted-foreground text-center mt-2 text-sm opacity-75">
                Vytvorte si svoj prvý nákupný zoznam a uložte ho aby ste videli
                koľko ušetríte
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
