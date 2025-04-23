import {
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import { useUploadProductImage } from "../../../network/imports/imports";
import { getShopLogo } from "../../../utils/logo-utils";
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from "../../../utils/toast-utils";
import IconButton from "../../icon-button";
import { Button } from "../button";

export type PictureScannedProps = {
  barcode: string | null;
  file_base64: string;
};

export type CameraViewProps = {};

export default function BrigaderCameraView({}: CameraViewProps) {
  const params = useLocalSearchParams();
  const shopId = params?.["shop-id"];

  const { mutate: submitProductImage, isPending } = useUploadProductImage({
    mutation: {
      onSuccess: () => {
        setBarcode(null);
        setCapturedImage(null);
        displaySuccessToastMessage("Obrázok bol úspešne nahraný");
      },
      onError: () => {
        displayErrorToastMessage("Obrázok sa nepodarilo nahrať");
      },
    },
  });

  const handleSubmitScannedPicture = () => {
    submitProductImage({
      data: {
        barcode,
        file_base64: capturedImage,
        shop_id: Number(shopId),
      },
    });
  };

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <Text>Grant permission</Text>
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const base64Photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });

        setCapturedImage(base64Photo.base64);
      } catch (error) {
        console.error("Error taking picture:", error);
        displayErrorToastMessage("Failed to take picture");
      }
    }
  };

  const resetImageData = () => {
    setCapturedImage(null);
    setBarcode(null);
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View className="flex flex-1 items-center justify-center bg-muted-foreground px-2">
          <IconButton style={styles.cancelIcon} onPress={resetImageData}>
            <X size={25} color="white" strokeWidth={2} />
          </IconButton>
          <Image
            source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
            className="h-[80%] w-full shadow-md"
            resizeMode="contain"
          />
          <View className="flex flex-row items-center justify-center w-full gap-8 mt-4">
            <Button
              onPress={resetImageData}
              className="bg-red-200"
              disabled={isPending}
            >
              <Text className="text-xl">Odfoť znova</Text>
            </Button>
            <Button onPress={handleSubmitScannedPicture} disabled={isPending}>
              <Text className="text-xl">Odošli fotku</Text>
            </Button>
          </View>
        </View>
      ) : (
        <CameraViewExpo
          ref={cameraRef}
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "code128", "ean13", "ean8"],
          }}
          onBarcodeScanned={
            !!barcode || !isCameraReady
              ? undefined
              : (data) => {
                  setBarcode(data?.data);
                }
          }
          onCameraReady={() => setIsCameraReady(true)}
        >
          <IconButton style={styles.cancelIcon} onPress={() => router.back()}>
            <X size={25} color="white" strokeWidth={2} />
          </IconButton>
          <View className="flex-1 bg-transparent absolute bottom-16 gap-4 w-full px-4">
            <Button
              className="flex-row gap-2 items-center justify-center"
              onPress={takePicture}
              disabled={!isCameraReady || !barcode || isPending}
            >
              <Text className="text-xl">Naskenuj</Text>
              <Image
                resizeMode="contain"
                className="h-full w-12 rounded-full"
                {...getShopLogo(shopId as any)}
              />
            </Button>
            <Text className="text-lg text-gray-600 font-bold w-full text-center">
              Naskenujte štítok produktu (tlačítko sa sprístupní hneď ako bude
              rozpoznaný čiarový kód)
            </Text>
          </View>
        </CameraViewExpo>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  cancelIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 100,
  },
  barcodeIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
