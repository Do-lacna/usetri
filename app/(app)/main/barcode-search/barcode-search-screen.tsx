import { router } from "expo-router";
import BarcodeSearchCameraView from "../../../../components/ui/barcode-search-camera-view/barcode-search-camera-view";

export default function BarcodeSearchScreen() {
  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return (
    <BarcodeSearchCameraView
      onBarcodeScanned={(data) => router.navigate(`/product/${data?.data}`)}
    />
  );
}
