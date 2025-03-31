import { router } from "expo-router";
import CameraView from "../../../../components/ui/camera-view/camera-view";

export default function ScanScreen() {
  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return <CameraView onCancelButtonPress={() => router.back()} />;
}
