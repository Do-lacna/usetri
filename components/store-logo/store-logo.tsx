import clsx from 'clsx';
import { Store } from 'lucide-react-native';
import { Image, type StyleProp, View, type ViewStyle } from 'react-native';
import { SHOP_LOGOS } from '../../utils/logo-utils';

export type PriceSummaryProps = {
  storeId?: number;
  containerClassname?: string;
  imageClassname?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const StoreLogo = ({
  storeId,
  containerClassname,
  containerStyle,
  imageClassname,
}: PriceSummaryProps) => {
  return (
    <View
      className={clsx(
        'w-10 h-10 justify-center items-center rounded-full shadow-sm shadow-foreground/10 ',
        containerClassname,
      )}
      style={containerStyle}
    >
      {storeId ? (
        <Image
          source={SHOP_LOGOS[storeId as keyof typeof SHOP_LOGOS]}
          className="w-[80%] h-[80%] rounded-full"
          resizeMode="contain"
        />
      ) : (
        <Store size={24} />
      )}
    </View>
  );
};

export default StoreLogo;
