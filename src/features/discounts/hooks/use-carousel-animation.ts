import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import type { ShopExtendedDto } from "~/src/network/model";

interface UseCarouselAnimationProps {
  animatedScale?: Animated.AnimatedInterpolation<number>;
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  carouselRef: React.RefObject<any>;
  cardWidth: number;
  cardMargin: number;
}

interface UseCarouselAnimationReturn {
  itemWidth: number;
  horizontalPadding: number;
  snapEnabled: boolean;
  isAdjustingScrollRef: React.MutableRefObject<boolean>;
}

export const useCarouselAnimation = ({
  animatedScale,
  shops,
  activeStoreId,
  carouselRef,
  cardWidth,
  cardMargin,
}: UseCarouselAnimationProps): UseCarouselAnimationReturn => {
  const { width: screenWidth } = Dimensions.get("window");
  const baseItemWidth = cardWidth + cardMargin * 2;

  const [itemWidth, setItemWidth] = useState(baseItemWidth);
  const [horizontalPadding, setHorizontalPadding] = useState(
    (screenWidth - baseItemWidth) / 2
  );
  const [snapEnabled, setSnapEnabled] = useState(true);

  const isAdjustingScrollRef = useRef(false);
  const currentStateRef = useRef<"full" | "downsized">("full");
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!animatedScale) return;

    const TRANSITION_POINTS = {
      UPSIZE_THRESHOLD: 0.95,
      DOWNSIZE_THRESHOLD: 0.85,
    };

    const listenerId = animatedScale.addListener(({ value }) => {
      const scaledWidth = cardWidth * value + cardMargin * 2 * value;

      const centerPadding = (screenWidth - scaledWidth) / 2;
      const leftPadding = cardMargin * 2;

      let newState = currentStateRef.current;

      if (
        currentStateRef.current === "downsized" &&
        value >= TRANSITION_POINTS.UPSIZE_THRESHOLD
      ) {
        newState = "full";
      } else if (
        currentStateRef.current === "full" &&
        value <= TRANSITION_POINTS.DOWNSIZE_THRESHOLD
      ) {
        newState = "downsized";
      }

      const stateChanged = newState !== currentStateRef.current;

      if (stateChanged) {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        transitionTimeoutRef.current = setTimeout(() => {
          if (carouselRef.current && shops && activeStoreId) {
            const activeIndex = shops.findIndex((s) => s.id === activeStoreId);

            if (activeIndex >= 0) {
              const targetWidth =
                newState === "full" ? baseItemWidth : scaledWidth;
              const newScrollX = activeIndex * targetWidth;

              isAdjustingScrollRef.current = true;
              carouselRef.current.scrollTo({
                x: Math.max(0, newScrollX),
                animated: newState === "full",
              });

              setTimeout(
                () => {
                  isAdjustingScrollRef.current = false;
                },
                newState === "full" ? 350 : 50
              );
            }
          }

          currentStateRef.current = newState;
          transitionTimeoutRef.current = null;
        }, 50);
      }

      const shouldSnapBeEnabled = currentStateRef.current === "full";
      const paddingInterpolation = shouldSnapBeEnabled
        ? centerPadding
        : leftPadding;

      setItemWidth(scaledWidth);
      setHorizontalPadding(paddingInterpolation);
      setSnapEnabled(shouldSnapBeEnabled);
    });

    return () => {
      animatedScale.removeListener(listenerId);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [animatedScale, cardWidth, cardMargin, screenWidth, shops, activeStoreId]);

  return {
    itemWidth,
    horizontalPadding,
    snapEnabled,
    isAdjustingScrollRef,
  };
};
