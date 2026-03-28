import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Text } from '../ui/text';

const EmptyShoppingListPlaceholderScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="absolute w-full h-full justify-center items-center top-12 -z-10 gap-4">
      <Image
        source={require('~/assets/images/other/kosik.png')}
        style={{ width: '100%', height: 150 }}
        resizeMode="contain"
      />
      <Text className="text-2xl w-3/4 text-center font-sans text-muted-foreground">
        {t('shopping_list.empty_cart_message')}
      </Text>
      <Text className="text-sm w-3/4 text-center font-sans text-muted-foreground/70">
        {t('shopping_list.empty_cart_hint')}
      </Text>
    </View>
  );
};

export default EmptyShoppingListPlaceholderScreen;
