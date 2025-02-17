import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ShoppingCart } from "~/lib/icons/Cart";
import { UserIcon } from "~/lib/icons/User";
import { TotalSavedCard } from "../../../../components/ui/profile/total-saved-card";
import { useSession } from "../../../../context/authentication-context";
import { useGetArchivedCart } from "../../../../network/customer/customer";

export default function ProfileScreen() {
  const { signOut } = useSession();
  const { data: { archived_carts = [] } = {} } = useGetArchivedCart();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-6">
        {/* Profile Section */}
        <View className="relative -mx-6">
          {/* Cover Photo Area */}
          <View className="w-full h-40 bg-green-100" />

          {/* Profile Photo Container - positioned to overlap */}
          <View className="absolute left-0 right-0 top-20 items-center">
            <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center border-4 border-white">
              <UserIcon size={64} color="#6B7280" />
            </View>

            {/* Email - positioned below profile photo */}
            <View className="mt-2 items-center bg-white w-full pb-4">
              <Text className="text-gray-600 mt-4">thefaston@gmail.com</Text>
            </View>
          </View>

          {/* Spacer to push content below profile section */}
          <View className="h-28" />
        </View>

        <TotalSavedCard />

        <View className="flex-row items-center gap-2 my-4">
          <Text className="text-2xl font-bold">Uložené košíky</Text>
          <ShoppingCart size={20} />
        </View>

        <View className="space-y-3 gap-3">
          {(archived_carts ?? []).length > 0 ? (
            archived_carts?.map(({ cart_id, created_at, owner_id }) => (
              <TouchableOpacity
                key={cart_id}
                onPress={() =>
                  router.navigate(`/main/archived-cart/${cart_id}`)
                }
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <View className="flex-row items-center space-x-3">
                  {/* <Cart size={20} color="#3B82F6" /> */}
                  <View>
                    <Text className="font-semibold">{owner_id}</Text>
                    {/* <Text className="text-gray-600">${cart.total}</Text> */}
                    <Text className="text-gray-400 text-xs">{created_at}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="my-2 text-center text-gray-600">
              Nemáte žiadne uložené košíky
            </Text>
          )}
        </View>

        {/* <Button onPress={performSignOut}>
          <Text>Sign Out</Text>
        </Button> */}
      </ScrollView>
    </SafeAreaView>
  );
}
