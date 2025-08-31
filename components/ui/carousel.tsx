import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { cn } from '../../lib/utils';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  children: React.ReactNode[];
  width?: number;
  height?: number;
  onSnapToItem?: (index: number) => void;
  className?: string;
  itemWidth?: number;
}

interface CarouselContextType {
  currentIndex: number;
  totalItems: number;
}

const CarouselContext = React.createContext<CarouselContextType | null>(null);

const CarouselRoot = React.forwardRef<ScrollView, CarouselProps>(
  ({
    children,
    width = screenWidth,
    height = 200,
    onSnapToItem,
    className,
    itemWidth = 304, // Default card width (288) + margin (16)
    ...props
  }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const totalItems = React.Children.count(children);

    const handleScroll = (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const containerWidth = event.nativeEvent.layoutMeasurement.width;

      // Calculate which card is most centered in the viewport
      const newIndex = Math.round((scrollPosition + containerWidth / 2 - itemWidth / 2) / itemWidth);

      if (newIndex >= 0 && newIndex < totalItems && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onSnapToItem?.(newIndex);
      }
    };

    const contextValue: CarouselContextType = {
      currentIndex,
      totalItems,
    };

    return (
      <CarouselContext.Provider value={contextValue}>
        <View className={cn('w-full', className)} style={{ height }}>
          <ScrollView
            ref={ref}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={itemWidth}
            snapToAlignment="center"
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - itemWidth) / 2,
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            {...props}
          >
            {children}
          </ScrollView>
        </View>
      </CarouselContext.Provider>
    );
  }
);

CarouselRoot.displayName = 'Carousel';

const CarouselItem = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn('justify-center items-center', className)} {...props}>
      {children}
    </View>
  )
);
CarouselItem.displayName = 'CarouselItem';

const CarouselIndicators = React.forwardRef<
  View,
  React.ComponentProps<typeof View> & {
    indicatorClassName?: string;
    activeIndicatorClassName?: string;
  }
>(({ className, indicatorClassName, activeIndicatorClassName, ...props }, ref) => {
  const context = React.useContext(CarouselContext);

  if (!context) return null;

  return (
    <View
      ref={ref}
      className={cn('flex-row justify-center items-center mt-4', className)}
      {...props}
    >
      {Array.from({ length: context.totalItems }).map((_, index) => (
        <View
          key={index}
          className={cn(
            'w-2 h-2 rounded-full mx-1 transition-all duration-300',
            index === context.currentIndex
              ? cn('bg-primary scale-125', activeIndicatorClassName)
              : cn('bg-gray-300', indicatorClassName)
          )}
        />
      ))}
    </View>
  );
});
CarouselIndicators.displayName = 'CarouselIndicators';

const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel');
  }
  return context;
};

export {
  CarouselRoot as Carousel,
  CarouselItem,
  CarouselIndicators,
  useCarousel,
  type CarouselProps,
};
