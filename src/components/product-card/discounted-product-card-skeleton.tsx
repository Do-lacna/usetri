import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export const DiscountedProductCardSkeleton = () => {
  return (
    <View className="flex-1 px-1 mb-4">
      <View className="bg-card rounded-xl p-2 shadow-sm shadow-foreground/10">
        {/* Image skeleton */}
        <View className="w-full h-32 rounded-lg relative">
          <Skeleton className="w-full h-32 rounded-lg bg-muted" />

          {/* Shop logo badges skeleton at bottom of image */}
          <View className="absolute bottom-4 flex-row gap-x-2">
            <Skeleton className="w-5 h-5 rounded-full bg-muted" />
            <Skeleton className="w-5 h-5 rounded-full bg-muted" />
          </View>
        </View>

        {/* Unit badge skeleton (top-left) */}
        <View className="absolute top-2 left-2">
          <Skeleton className="w-16 h-6 rounded-md bg-muted" />
        </View>

        {/* Discount badge skeleton (top-right) */}
        <View className="absolute top-2 right-2">
          <Skeleton className="w-12 h-6 rounded-md bg-muted" />
        </View>

        {/* Product info skeleton */}
        <View className="mt-2 space-y-1">
          {/* Brand */}
          <Skeleton className="w-20 h-3 rounded bg-muted" />
          {/* Product name */}
          <Skeleton className="w-full h-4 rounded bg-muted mt-1" />
          {/* Price */}
          <Skeleton className="w-16 h-4 rounded bg-muted mt-1" />
        </View>
      </View>
    </View>
  );
};
