import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestScreen } from '~/src/components/guest-screen';
import ProfileHeader from '~/src/components/profile/profile-header';
import { SavedCartCard } from '~/src/components/profile/saved-cart-card';
import { TotalSavedCard } from '~/src/components/profile/total-saved-card';
import Divider from '~/src/components/ui/divider';
import { useSession } from '~/src/context/authentication-context';
import { useGetArchivedCart } from '~/src/network/customer/customer';
import type { ShortArchivedCartDto } from '~/src/network/model';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { user, isGuest } = useSession();

  // Show guest screen if user is not logged in
  if (isGuest) {
    return (
      <GuestScreen
        title="Váš profil"
        description="Prihláste sa pre zobrazenie vášho profilu, histórie nákupov a štatistík vašich úspor."
        showProfileImage
        showLogoutButton
      />
    );
  }

  const {
    data: { archived_carts = [] } = {},
    isLoading: areArchivedCartsLoading,
  } = useGetArchivedCart();

  const renderShopCardCart = ({ item }: { item: ShortArchivedCartDto }) => (
    <SavedCartCard
      id={Number(item.cart_id)}
      shopId={Number(item.selected_shop_id)}
      totalPrice={Number(item.total_price)}
      createdDate={String(item.created_at)}
      savedAmount={Number(item.price_difference)}
    />
  );

  const renderEmptyComponent = () => (
    <View className="bg-card rounded-2xl p-8 items-center shadow-sm border border-border">
      <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
      <Text className="text-muted-foreground text-center mt-4 text-base">
        Žiadne nákupné zoznamy
      </Text>
      <Text className="text-muted-foreground text-center mt-2 text-sm opacity-75">
        Vytvorte si svoj prvý nákupný zoznam a uložte ho aby ste videli koľko
        ušetríte
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <>
      <ProfileHeader userEmail={user?.email} />
      <TotalSavedCard />
      <Divider className="my-8" />
      <View className="mb-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-foreground">
            História nákupov
          </Text>
          <Text className="text-sm text-muted-foreground">
            {t('nakup', { count: archived_carts?.length ?? 0 })}
          </Text>
        </View>
      </View>
    </>
  );

  const isLoading = areArchivedCartsLoading;

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      // edges={["bottom", "left", "right"]}
    >
      <FlashList
        data={archived_carts}
        keyExtractor={item => item.cart_id?.toString() ?? ''}
        renderItem={renderShopCardCart}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      />
    </SafeAreaView>
  );
}
