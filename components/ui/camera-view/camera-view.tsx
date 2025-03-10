import {
  BarcodeScanningResult,
  CameraType,
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScanBarcode } from "~/lib/icons/ScanBarcode";

export type CameraViewProps = {
  onBarcodeScanned?: (data: BarcodeScanningResult) => void;
};

export default function CameraView({ onBarcodeScanned }: CameraViewProps) {
  const animation = useRef<LottieView>(null);
  // useEffect(() => {
  //   // You can control the ref programmatically, rather than using autoPlay
  //   // animation.current?.play();
  // }, []);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

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
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraViewExpo
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "ean13", "ean8"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.barcodeIcon}>
            <ScanBarcode
              size={250}
              color="white"
              strokeWidth={2}
              // style={styles.barcodeIcon}
              // className="h-40 w-40"
              // className="absolute inset-0 text-white w-40 h-40"
            />
          </View>
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
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
            {/* <Text style={styles.text}>Barcode scanned</Text> */}
          </TouchableOpacity>
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
