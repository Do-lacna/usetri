// components/ui/SkeletonCategoryCard.tsx
import { View } from 'react-native';

export function SkeletonCategoryCard() {
  return (
    <View className="flex-1 mx-2">
      <View className="bg-muted/50 rounded-2xl p-4 h-[160px] justify-between">
        {/* Skeleton icon container */}
        <View className="w-16 h-16 rounded-full bg-muted/70 mb-3" />

        {/* Skeleton text lines */}
        <View>
          <View className="h-4 bg-muted/70 rounded mb-2" />
          <View className="h-4 bg-muted/70 rounded w-2/3" />
        </View>
      </View>
    </View>
  );
}
