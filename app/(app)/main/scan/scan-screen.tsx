import { router } from "expo-router";
import CameraView, {
  PictureScannedProps,
} from "../../../../components/ui/camera-view/camera-view";
import { useUploadProductImage } from "../../../../network/admin/admin";
import { displaySuccessToastMessage } from "../../../../utils/toast-utils";

export default function ScanScreen() {
  const { mutate: submitProductImage, isPending } = useUploadProductImage({
    mutation: {
      onSuccess: () => {
        displaySuccessToastMessage("Obrázok bol úspešne nahraný");
      },
      onError: () => {
        displaySuccessToastMessage("Obrázok sa nepodarilo nahrať");
      },
    },
  });

  const handlePictureTaken = ({
    barcode,
    file_base64,
  }: PictureScannedProps) => {
    if (!barcode || !file_base64) return;
    submitProductImage({
      data: {
        barcode,
        file_base64,
        shop: "Billa",
      },
    });
  };

  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return (
    <CameraView
      onCancelButtonPress={() => router.back()}
      onPictureTaken={handlePictureTaken}
    />
  );
}
