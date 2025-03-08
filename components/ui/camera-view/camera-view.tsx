import {
  CameraType,
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import checkAnimation from "~/assets/animations/check-transparent-animation.json";
import { ScanBarcode } from "~/lib/icons/ScanBarcode";

export default function CameraView() {
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
        onBarcodeScanned={(data) => {
          console.log(data?.data);
          Toast.show({
            type: "success",
            text1: `Barcode scanned - ${data?.data}`,
            position: "bottom",
          });
        }}
      >
        <View style={styles.buttonContainer}>
          <ScanBarcode
            // size={250}
            style={styles.barcodeIcon}
            className="h-40 w-40"
            // className="absolute inset-0 text-white w-40 h-40"
          />
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
              backgroundColor: "#eee",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={checkAnimation}
          />
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
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    height: 230,
    transform: [
      { translateX: "-50%" }, // React Native uses an array of transform objects
      { translateY: "-60%" },
    ],
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
