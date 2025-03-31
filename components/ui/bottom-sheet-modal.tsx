import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

export type CustomBottomSheetModalProps = {
  children: ReactNode;
  index?: number;
};

export const CustomBottomSheetModal = forwardRef<
  BottomSheetModal,
  CustomBottomSheetModalProps
>(({ children, index = 1 }: CustomBottomSheetModalProps, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        //   disappearsOnIndex={1}
        //   appearsOnIndex={2}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      index={index}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    // flex: 1,
    // minHeight: 300,
    alignItems: "center",
  },
});
