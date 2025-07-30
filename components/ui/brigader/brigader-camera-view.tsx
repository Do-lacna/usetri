import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { runOnJS } from "react-native-reanimated";
import {
  Camera,
  CameraRuntimeError,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from "react-native-vision-camera";
import { useUploadProductImage } from "../../../network/imports/imports";

interface BarcodeData {
  value: string;
  type: string;
}

export type CameraViewProps = {
  shopId?: string;
  scannedProductBarcode?: string;
  onBack?: () => void; // Add onBack prop for navigation
};

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const BarcodeScannerScreen: React.FC<CameraViewProps> = ({
  shopId,
  scannedProductBarcode,
  onBack, // Destructure onBack prop
}: CameraViewProps) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<BarcodeData | null>(
    null
  );
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");

  const format = useCameraFormat(device, [
    { photoResolution: { width: 1280, height: 720 } },
  ]);

  const resetScreen = () => {
    setScannedBarcode(null);
    setCapturedPhoto(null);
    setIsCameraActive(true);
  };

  const {
    data: base64data,
    isPending: isBase64pending,
    mutateAsync: sendUploadCapturedImageBase64,
  } = useUploadProductImage({
    mutation: {
      onSuccess: () => {
        resetScreen();
      },
    },
  });

  // Request camera permission
  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "granted");
    };
    requestCameraPermission();
  }, []);

  // Barcode scanner configuration
  const codeScanner = useCodeScanner({
    codeTypes: [
      "qr",
      "ean-13",
      "ean-8",
      "code-128",
      "code-39",
      "code-93",
      "codabar",
      "upc-a",
      "upc-e",
      "aztec",
    ],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !scannedBarcode) {
        const code = codes[0];
        runOnJS(setScannedBarcode)({
          value: code.value || "",
          type: code.type || "unknown",
        });
      }
    },
  });

  // Handle camera errors
  const onError = (error: CameraRuntimeError) => {
    console.error("Camera error:", error);
    Alert.alert("Camera Error", "An error occurred while using the camera.");
  };

  // Capture photo when user decides to take it
  const capturePhoto = async () => {
    if (!cameraRef.current || !scannedBarcode) return;

    try {
      const photo: PhotoFile = await cameraRef.current.takePhoto({
        flash: "off",
      });

      if (photo) {
        setCapturedPhoto(photo.path);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const submitBase64Data = async () => {
    if (!scannedBarcode || !capturedPhoto) return;
    setIsSubmitting(true);

    try {
      const result = await fetch(`file://${capturedPhoto}`);
      const data = await result.blob();
      const base64 = (await blobToBase64(data)) as string;
      const base64Data = base64.split(",")[1];

      await sendUploadCapturedImageBase64({
        data: {
          file_base64: base64Data,
          shop_id: Number(shopId),
          barcode: scannedBarcode.value,
        },
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert(
        "Submission Error",
        "Failed to submit data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      resetScreen();
    }
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">
          Camera permission is required to use this feature.
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">Nenájdená žiadna kamera</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Camera View */}
      <View className="flex-1 relative">
        <Camera
          format={format}
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={isCameraActive}
          codeScanner={scannedBarcode ? undefined : codeScanner}
          onError={onError}
          photo={true}
        />

        {/* Back Button - positioned in upper left corner */}
        <View className="absolute top-12 left-4 z-10">
          <TouchableOpacity
            onPress={() => {
              onBack?.();
              router.back();
            }}
            className="bg-black bg-opacity-60 p-1 h-12 w-12 rounded-full flex items-center justify-center"
            activeOpacity={0.8}
          >
            <MoveLeft color="white" size={14} />
          </TouchableOpacity>
        </View>

        {/* Scanning overlay */}
        {!scannedBarcode && (
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-64 h-64 border-2 border-white border-dashed rounded-lg">
              <Text className="text-white text-center mt-4">
                Nasnímajte čiarový kód alebo QR kód
              </Text>
            </View>
          </View>
        )}

        {/* Scanned barcode display */}
        {scannedBarcode && (
          <View className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 p-3 rounded-lg">
            <Text className="text-green-400 font-bold text-sm">
              Nasnímaný barcode:
            </Text>
            <Text className="text-white text-lg font-mono">
              {scannedBarcode.value}
            </Text>
            <Text className="text-gray-300 text-xs mt-1">
              Typ: {scannedBarcode.type}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="bg-black p-6 pb-8">
        {/* Barcode Status */}
        <View className="mb-4">
          {scannedBarcode ? (
            <View className="bg-green-800 p-3 rounded-lg">
              <Text className="text-white font-bold">✓ Barcode Nasnímaný</Text>
              <Text className="text-white text-sm mt-1">
                {scannedBarcode.type}: {scannedBarcode.value}
              </Text>
            </View>
          ) : (
            <View className="bg-gray-700 p-3 rounded-lg">
              <Text className="text-white">
                Naskenujte barcode pre pokračovanie
              </Text>
            </View>
          )}
        </View>

        {/* Photo Status */}
        {scannedBarcode && (
          <View className="mb-4">
            {capturedPhoto ? (
              <View className="bg-green-800 p-3 rounded-lg">
                <Text className="text-white font-bold">✓ Nasnímaná foto</Text>
                <Text className="text-white text-sm mt-1">
                  Pripravené na odoslanie
                </Text>
              </View>
            ) : (
              <View className="bg-gray-700 p-3 rounded-lg">
                <Text className="text-white">
                  Odfoťte štítok pre pokračovanie
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View className="space-y-3">
          {scannedBarcode && !capturedPhoto && (
            <TouchableOpacity
              onPress={capturePhoto}
              className="bg-blue-600 p-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                📸 Odfoťte štítok
              </Text>
            </TouchableOpacity>
          )}

          {scannedBarcode && capturedPhoto && (
            <TouchableOpacity
              onPress={submitBase64Data}
              disabled={isSubmitting}
              className={`p-4 rounded-lg ${
                isSubmitting ? "bg-gray-600" : "bg-green-600"
              }`}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white text-center font-bold text-lg ml-2">
                    Odosielam...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  🚀 Odoslať fotku base 64
                </Text>
              )}
            </TouchableOpacity>
          )}

          {scannedBarcode && (
            <TouchableOpacity
              onPress={resetScreen}
              className="bg-red-200 p-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                🔄 Nasnímať znova
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BarcodeScannerScreen;
