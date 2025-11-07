import { router } from 'expo-router';
import { getProductByBarcode } from '~/network/query/query';
import BarcodeSearchCameraView from '../../../../components/barcode-search-camera-view/barcode-search-camera-view';

export default function BarcodeSearchScreen() {
  const handleBarcodeScanned = async (data: { data: string }) => {
    // Fetch product by barcode to get product ID
    try {
      const productData = await getProductByBarcode(data.data);
      if (productData?.detail?.id) {
        router.navigate(`/product/${productData.detail.id}`);
      } else {
        // Navigate to not-found if product doesn't exist
        router.replace('/+not-found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Navigate to not-found if product doesn't exist
      router.replace('/+not-found');
    }
  };

  return (
    <BarcodeSearchCameraView onBarcodeScanned={handleBarcodeScanned} />
  );
}
