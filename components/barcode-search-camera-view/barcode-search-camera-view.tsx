import {
  type BarcodeScanningResult,
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import IconButton from "../icon-button/icon-button";
import { Button } from "../ui/button";

export type CameraViewProps = {
  onBarcodeScanned?: (data: BarcodeScanningResult) => void;
};

export default function BarcodeSearchCameraView({
  onBarcodeScanned,
}: CameraViewProps) {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef<any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          <Text>
            To scan product barcodes, this app uses your device's camera
          </Text>
        </Text>
        <Button onPress={requestPermission}>
          <Text>Continue</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraViewExpo
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        // barcodeScannerSettings={{
        //   barcodeTypes: ["qr", "code128", "ean13", "ean8"],
        // }}
        onBarcodeScanned={
          !!barcode || !isCameraReady
            ? undefined
            : (data) => {
                setBarcode(data?.data);
                onBarcodeScanned?.(data);
              }
        }
        onCameraReady={() => setIsCameraReady(true)}
      >
        <IconButton style={styles.cancelIcon} onPress={() => router.back()}>
          <X size={25} color="white" strokeWidth={2} />
        </IconButton>
        <View className="flex-1 bg-transparent relative mb-16">
          {/* <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
              backgroundColor: "#eee",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={checkAnimation}
          /> */}
          {/* <Button
              className="absolute bottom-4 w-full"
              onPress={takePicture}
              disabled={!isCameraReady || !isBarcodeScanned}
            >
              <Text className="text-xl">Naskenuj</Text>
            </Button> */}
          <Text className="text-lg text-gray-600 font-bold absolute bottom-4 w-full text-center">
            Naskenujte čiarový kód produktu a budete automaticky presmerovaný na
            daný produkt
          </Text>
        </View>
      </CameraViewExpo>
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
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    position: "relative",
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
