import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, type ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { NAV_THEME } from '~/src/lib/constants';
import { toastConfig } from '../../../utils/toast-config';

export interface CustomBottomSheetModalProps extends BottomSheetModalProps {
  children: ReactNode;
}

export const CustomBottomSheetModal = forwardRef<
  BottomSheetModal,
  CustomBottomSheetModalProps
>(({ children, snapPoints: propSnapPoints, ...props }, ref) => {
  const defaultSnapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const snapPoints = propSnapPoints || defaultSnapPoints;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use theme colors from NAV_THEME
  const theme = isDark ? NAV_THEME.dark : NAV_THEME.light;

  const renderBackdrop = useCallback(
    (props: any) => (
      <React.Fragment>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
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
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: theme.card,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? theme.text : theme.border,
        width: 40,
        height: 4,
      }}
      {...props}
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
