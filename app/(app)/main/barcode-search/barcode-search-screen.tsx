import { router } from 'expo-router';
import BarcodeSearchCameraView from '~/src/components/barcode-search-camera-view/barcode-search-camera-view';
import { getProductByBarcode } from '~/src/network/query/query';
import { logError } from '~/src/utils/analytics';

export default function BarcodeSearchScreen() {
  const handleBarcodeScanned = async (data: { data: string }) => {
    try {
      const productData = await getProductByBarcode(data.data);
      if (productData?.detail?.id) {
        router.navigate(`/product/${productData.detail.id}`);
      } else {
        router.replace('/+not-found');
      }
    } catch (error) {
      logError(error, 'barcodeSearch:fetchProduct');
      router.replace('/+not-found');
    }
  };

  return <BarcodeSearchCameraView onBarcodeScanned={handleBarcodeScanned} />;
}
