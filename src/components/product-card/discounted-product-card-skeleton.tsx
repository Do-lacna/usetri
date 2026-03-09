import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

cssInterop(Image, { className: 'style' });

const CATEGORY_BLURHASH =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const DiscountedProductCardSkeleton = ({
  className,
}: { className?: string }) => {
  return (
    <View className={className ?? 'flex-1'}>
      <View className="bg-card rounded-xl p-2 shadow-sm border border-border mx-1">
        {/* Image placeholder with blurhash */}
        <View className="w-full h-32 rounded-lg overflow-hidden relative">
          <Image
            source={{ blurhash: CATEGORY_BLURHASH }}
            className="w-full h-32 rounded-lg"
            contentFit="cover"
          />

          {/* Shop logo badges skeleton at bottom of image */}
          <View className="absolute bottom-4 flex-row gap-x-2">
            <Skeleton className="w-5 h-5 rounded-full bg-white/30" />
            <Skeleton className="w-5 h-5 rounded-full bg-white/30" />
          </View>
        </View>

        {/* Unit badge skeleton (top-left) */}
        <View className="absolute top-2 left-2">
          <Skeleton className="w-16 h-6 rounded-md bg-primary/15" />
        </View>

        {/* Discount badge skeleton (top-right) */}
        <View className="absolute top-2 right-2">
          <Skeleton className="w-12 h-6 rounded-md bg-primary/15" />
        </View>

        {/* Product info skeleton */}
        <View className="mt-2 space-y-1">
          {/* Brand */}
          <Skeleton className="w-20 h-3 rounded bg-primary/15" />
          {/* Product name */}
          <Skeleton className="w-full h-4 rounded bg-primary/15 mt-1" />
          {/* Price */}
          <Skeleton className="w-16 h-4 rounded bg-primary/15 mt-1" />
        </View>
      </View>
    </View>
  );
};
