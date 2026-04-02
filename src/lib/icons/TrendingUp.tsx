import { Ionicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

const TrendingUp = (
  props: Omit<React.ComponentProps<typeof Ionicons>, 'name'>,
) => <Ionicons name="trending-up-outline" {...props} />;

cssInterop(TrendingUp, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
      opacity: true,
    },
  },
});

export { TrendingUp };
