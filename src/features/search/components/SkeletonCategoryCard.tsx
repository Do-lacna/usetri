import { View } from 'react-native';

export function SkeletonCategoryCard() {
  return (
    <View className="flex-1 mx-2">
      <View className="bg-accent/30 rounded-2xl h-[180px] overflow-hidden border border-primary/10">
        <View className="flex-1 bg-accent/40" />

        <View className="bg-primary/20 px-3 py-3">
          <View className="h-4 bg-primary/30 rounded-md mb-1.5 mx-4" />
          <View className="h-3 bg-primary/20 rounded-md mx-8" />
        </View>
      </View>
    </View>
  );
}
