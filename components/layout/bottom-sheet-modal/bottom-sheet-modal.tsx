import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, type ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { NAV_THEME } from '~/lib/constants';
import { toastConfig } from '../../../utils/toast-config';

export type CustomBottomSheetModalProps = {
  children: ReactNode;
  index?: number;
};

export const CustomBottomSheetModal = forwardRef<
  BottomSheetModal,
  CustomBottomSheetModalProps
>(({ children, index = 1 }: CustomBottomSheetModalProps, ref) => {
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use theme colors from NAV_THEME
  const theme = isDark ? NAV_THEME.dark : NAV_THEME.light;

  const renderBackdrop = useCallback(
    (props: any) => (
      <React.Fragment>
        <BottomSheetBackdrop
          {...props}
          //   disappearsOnIndex={1}
          //   appearsOnIndex={2}
        />
        <Toast position="top" config={toastConfig} />
      </React.Fragment>
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      index={index}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: theme.card,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? theme.text : theme.border,
        width: 40,
        height: 4,
      }}
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
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    // flex: 1,
    // minHeight: 300,
    alignItems: 'center',
  },
});
