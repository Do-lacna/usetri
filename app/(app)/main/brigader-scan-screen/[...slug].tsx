import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import BrigaderCameraView from '../../../../src/features/brigader/components/brigader-camera-view';

export default function BrigaderScanScreen() {
  const params = useLocalSearchParams<{ slug: string[] }>();

  // Extract the parameters from the slug array
  const slug = params.slug || []; // Ensure slug is always an array

  let shopId: string | undefined = undefined;
  let barcode: string | undefined = undefined;

  if (slug.length >= 1) {
    shopId = slug[0];
  }
  if (slug.length >= 2) {
    barcode = slug[1];
  }

  // If shopId or barcode is not provided, you might want to handle it
  if (!shopId) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Missing shop ID </Text>
      </View>
    );
  }

  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return <BrigaderCameraView shopId={shopId} scannedProductBarcode={barcode} />;
}
