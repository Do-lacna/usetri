import { useCallback, useMemo } from "react";
import { Animated, Dimensions } from "react-native";

interface UseCarouselAnimationProps {
  cardWidth: number;
  cardMargin: number;
  scrollY?: Animated.Value;
  carouselRef: React.RefObject<any>;
}

interface UseCarouselAnimationReturn {
  itemWidth: number;
  horizontalPadding: number;
  handleStoreSelect: (storeId: number, index: number) => void;
}

export const useCarouselAnimation = ({
  cardWidth,
  cardMargin,
  scrollY,
  carouselRef,
}: UseCarouselAnimationProps): UseCarouselAnimationReturn => {
  const { width: screenWidth } = Dimensions.get("window");

  const itemWidth = useMemo(
    () => cardWidth + cardMargin * 2,
    [cardWidth, cardMargin]
  );

  const horizontalPadding = useMemo(
    () => (screenWidth - itemWidth) / 2,
    [screenWidth, itemWidth]
  );

  const handleStoreSelect = useCallback(
    (storeId: number, index: number) => {
      if (scrollY) {
        Animated.timing(scrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          if (carouselRef.current) {
            carouselRef.current.scrollTo({
              x: index * itemWidth,
              animated: true,
            });
          }
        });
      } else {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            x: index * itemWidth,
            animated: true,
          });
        }
      }
    },
    [scrollY, itemWidth, carouselRef]
  );

  return {
    itemWidth,
    horizontalPadding,
    handleStoreSelect,
  };
};
