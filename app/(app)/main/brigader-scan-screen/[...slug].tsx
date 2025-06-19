import { useLocalSearchParams } from "expo-router";
import BrigaderCameraView from "../../../../components/ui/brigader/brigader-camera-view";

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
  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return <BrigaderCameraView shopId={shopId} scannedProductBarcode={barcode} />;
}
