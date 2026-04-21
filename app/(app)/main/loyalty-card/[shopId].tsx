import { useLocalSearchParams } from 'expo-router';
import { LoyaltyCardDetail } from '~/src/features/loyalty-cards';

export default function LoyaltyCardScreen() {
  const { shopId } = useLocalSearchParams<{ shopId: string }>();
  return <LoyaltyCardDetail shopId={Number(shopId)} />;
}
