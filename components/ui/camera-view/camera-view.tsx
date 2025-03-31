import {
  BarcodeScanningResult,
  CameraType,
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import { displayErrorToastMessage } from "../../../utils/toast-utils";
import IconButton from "../../icon-button";
import { Button } from "../button";

export type CameraViewProps = {
  onBarcodeScanned?: (data: BarcodeScanningResult) => void;
  onCancelButtonPress?: () => void;
};

export default function CameraView({
  onBarcodeScanned,
  onCancelButtonPress,
}: CameraViewProps) {
  const animation = useRef<LottieView>(null);
  // useEffect(() => {
  //   // You can control the ref programmatically, rather than using autoPlay
  //   // animation.current?.play();
  // }, []);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isBarcodeScanned, setIsBarcodeScanned] = useState(false);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        setCapturedImage(photo.base64);
      } catch (error) {
        console.error("Error taking picture:", error);
        displayErrorToastMessage("Failed to take picture");
      }
    }
  };

  const uploadImage = async () => {
    if (!capturedImage) return;

    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare form data
      const formData = new FormData();
      formData.append("file", {
        uri: capturedImage,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      console.log(formData);
    } catch (error) {
      console.error("Upload error:", error);
      displayErrorToastMessage("Failed to upload image");
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraViewExpo
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "ean13", "ean8"],
        }}
        onBarcodeScanned={(data) => {
          onBarcodeScanned?.(data);
          setIsBarcodeScanned(true);
        }}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <IconButton style={styles.cancelIcon} onPress={onCancelButtonPress}>
          <X
            size={25}
            color="white"
            strokeWidth={2}
            // style={styles.barcodeIcon}
            // className="h-40 w-40"
            // className="absolute inset-0 text-white w-40 h-40"
          />
        </IconButton>
        <View style={styles.buttonContainer}>
          {/* <View style={styles.barcodeIcon}>
            <ScanBarcode
              size={250}
              color="white"
              strokeWidth={2}
              // style={styles.barcodeIcon}
              // className="h-40 w-40"
              // className="absolute inset-0 text-white w-40 h-40"
            />
          </View> */}

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
          <Button
            className="absolute bottom-4 w-full"
            onPress={takePicture}
            disabled={!isCameraReady || !isBarcodeScanned}
          >
            <Text className="text-xl">Naskenuj</Text>
            {/* <Text style={styles.text}>Barcode scanned</Text> */}
          </Button>
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
