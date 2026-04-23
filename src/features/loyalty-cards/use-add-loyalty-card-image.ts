import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useLoyaltyCards } from '~/src/hooks/use-loyalty-cards';
import { logError } from '~/src/utils/analytics';

export const useAddLoyaltyCardImage = () => {
  const { saveCard } = useLoyaltyCards();
  const { t } = useTranslation();
  const [isPicking, setIsPicking] = useState(false);

  const pickAndSave = useCallback(
    async (shopId: number) => {
      if (isPicking) return;
      setIsPicking(true);
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            t('loyalty_cards.permission_title'),
            t('loyalty_cards.permission_message'),
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.9,
        });

        if (result.canceled || !result.assets?.[0]?.uri) return;

        await saveCard(shopId, result.assets[0].uri);
      } catch (error) {
        logError(error, 'loyaltyCards:saveImage');
        Alert.alert(
          t('loyalty_cards.save_error_title'),
          t('loyalty_cards.save_error_message'),
        );
      } finally {
        setIsPicking(false);
      }
    },
    [isPicking, saveCard, t],
  );

  return { pickAndSave, isPicking };
};
