import {
  BarcodeScanningResult,
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import IconButton from "../../icon-button";
import { Button } from "../button";

export type CameraViewProps = {
  onBarcodeScanned?: (data: BarcodeScanningResult) => void;
};

export default function BarcodeSearchCameraView({
  onBarcodeScanned,
}: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
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
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <Text>Grant permission</Text>
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
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "ean13", "ean8"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      >
        <IconButton style={styles.cancelIcon} onPress={() => router.back()}>
          <X size={25} color="white" strokeWidth={2} />
        </IconButton>
        <View style={styles.buttonContainer}>
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
    margin: 64,
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
