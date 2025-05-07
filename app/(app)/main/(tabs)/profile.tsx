import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRevenueCat } from '~/context/revenue-cat-provider';
import { Menu } from '~/lib/icons/Menu';
import { UserIcon } from '~/lib/icons/User';
import { Button } from '../../../../components/ui/button';
import { SavedCartCard } from '../../../../components/ui/profile/saved-cart-card';
import { Subscriptions } from '../../../../components/ui/profile/subscriptions';
import { TotalSavedCard } from '../../../../components/ui/profile/total-saved-card';
import { useSession } from '../../../../context/authentication-context';
import { useDrawerMenu } from '../../../../hooks/use-drawer-menu';
import { useGetArchivedCart } from '../../../../network/customer/customer';
import { ShortArchivedCartDto } from '../../../../network/model';

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
    item: { cart_id, created_at, total_price, selected_shop_id } = {},
  }: ListRenderItemInfo<ShortArchivedCartDto>) => (
    <View className="w-80">
      <SavedCartCard
        id={Number(cart_id)}
        shopId={Number(selected_shop_id)}
        totalPrice={Number(total_price)}
        createdDate={String(created_at)}
      />
    </View>
  );

  const isLoading = areArchivedCartsLoading;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="px-6"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      >
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
              <Text className="text-gray-600 mt-4">{user?.email}</Text>
            </View>
          </View>

          {/* Spacer to push content below profile section */}
          <View className="h-28" />
        </View>

        <TotalSavedCard />

        <Link asChild href="/main/menu-screen/menu-screen">
          <Button
            onPress={openDrawer}
            className="my-4 flex-row gap-2 p-2 mr-2 w-1/3 self-center"
          >
            <Text>Menu</Text>
            <Menu className="w-6 h-6 text-gray-800" />
          </Button>
        </Link>

        <Text>
          Active subscriptions{' '}
          <View>{subscriptions?.map((sub) => (
            <Text className='font-bold' key={sub}>{sub}</Text>
          ))}
          </View>
        </Text>

        <Subscriptions />

        <View className="flex-row items-center gap-2 mt-4 mb-2">
          <Text className="text-2xl font-bold">História zoznamov</Text>
          {/* <ShoppingCart size={20} /> */}
        </View>

        <View className="space-y-3 gap-3">
          {(archived_carts ?? []).length > 0 ? (
            <FlatList
              horizontal
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
