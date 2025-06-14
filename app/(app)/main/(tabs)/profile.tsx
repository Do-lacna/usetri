import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";

import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRevenueCat } from "~/context/revenue-cat-provider";
import Divider from "../../../../components/ui/divider";
import ProfileHeader from "../../../../components/ui/profile/profile-header";
import { SavedCartCard } from "../../../../components/ui/profile/saved-cart-card";
import { TotalSavedCard } from "../../../../components/ui/profile/total-saved-card";
import { useSession } from "../../../../context/authentication-context";
import { useDrawerMenu } from "../../../../hooks/use-drawer-menu";
import { useGetArchivedCart } from "../../../../network/customer/customer";
import { ShortArchivedCartDto } from "../../../../network/model";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
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
      className="flex-1 bg-gray-50"
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
        {/* <View>
          <View className="items-center">
            <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center border-4 border-white">
              <UserIcon size={52} color="#6B7280" />
            </View>
            <View className="items-center w-full pb-4">
              <Text className="text-lg underline mt-4 shadow-lg">
                {user?.email}
              </Text>
            </View>
          </View>
          <Link
            asChild
            href="/main/menu-screen/menu-screen"
            className="absolute top-12 right-6"
          >
            <IconButton onPress={openDrawer}>
              <Menu className="w-6 h-6 text-gray-800" />
            </IconButton>
          </Link>
        </View> */}

        <ProfileHeader userEmail={user?.email} />

        {/* <Divider className="my-8" /> */}

        <TotalSavedCard />

        <Divider className="my-8" />

        {/* <View className="flex-row items-center gap-2  mb-2">
          <Text className="text-2xl font-bold">História nákupov</Text>
        </View> */}

        {/* <View className="space-y-3 gap-3">
          {(archived_carts ?? []).length > 0 ? (
            <FlatList
              // horizontal
              data={archived_carts}
              ItemSeparatorComponent={() => <View className="w-4" />}
              renderItem={renderShopCardCart}
              keyExtractor={(cart) => String(cart?.cart_id)}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingVertical: 8,
              }}
            />
          ) : (
            <Text className="my-2 text-center text-gray-600">
              Nemáte žiadne uložené košíky
            </Text>
          )}
        </View> */}

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              História nákupov
            </Text>
            <Text className="text-sm text-gray-500">
              {(archived_carts ?? []).length} nákup
            </Text>
          </View>

          {(archived_carts ?? []).length > 0 ? (
            archived_carts?.map(renderShopCardCart)
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4 text-base">
                No shopping history yet
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                Start saving on your grocery trips to see them here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
