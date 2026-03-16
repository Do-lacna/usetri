import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export const DiscountedProductCardSkeleton = ({
  className,
}: { className?: string }) => {
  return (
    <View className={className ?? 'flex-1'}>
      <View className="bg-card rounded-xl p-2 shadow-sm border border-border mx-1">
        {/* Image placeholder */}
        <Skeleton className="w-full h-32 rounded-lg " />

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
