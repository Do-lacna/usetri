import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type React from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { displaySuccessToastMessage } from '~/src/utils/toast-utils';
import { useRevenueCat } from '../../context/revenue-cat-provider';
import { CustomBottomSheetModal } from '../layout/bottom-sheet-modal/bottom-sheet-modal';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import SubscriptionPaywall from '../usetri-paywall/usetri-paywall';

const Subscriptions: React.FC = () => {
  const { t } = useTranslation();
  const subscriptionModalRef = useRef<BottomSheetModal>(null);
  const { customerInfo, packages } = useRevenueCat();

  const handlePurchaseComplete = () => {
    displaySuccessToastMessage(t('paywall.subscription_activated'));
    subscriptionModalRef?.current?.dismiss();
  };

  return (
    <>
      <CustomBottomSheetModal ref={subscriptionModalRef} index={2}>
        <SubscriptionPaywall
          onPurchaseComplete={handlePurchaseComplete}
          onClose={() => subscriptionModalRef?.current?.dismiss()}
        />
      </CustomBottomSheetModal>

      <Button
        onPress={() => subscriptionModalRef?.current?.present()}
        className="my-6 bg-terciary"
      >
        <Text>{t('paywall.subscription')}</Text>
      </Button>
    </>
  );
};

Subscriptions.displayName = 'Subscriptions';

export { Subscriptions };
