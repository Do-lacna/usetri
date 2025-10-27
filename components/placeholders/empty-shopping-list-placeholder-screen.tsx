import LogoSVG from 'assets/images/empty-cart.svg';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from '../ui/text';

const EmptyShoppingListPlaceholderScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="absolute w-full h-full justify-center items-center absolute top-12 -z-10 gap-4">
      {/* <Svg
        source={require("../../assets/images/empty-cart.svg")}
        className="w-60 h-60 mb-1"
        resizeMode="contain"
      /> */}
      <LogoSVG width={'100%'} height={150} />
      <Text className="text-2xl w-3/4 text-center text-muted-foreground">
        {t('shopping_list.empty_cart_message')}
      </Text>
    </View>
  );
};

export default EmptyShoppingListPlaceholderScreen;
