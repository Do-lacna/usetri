import {
  CameraView as CameraViewExpo,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, Vibration, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import { getShopLogo } from "../../../utils/logo-utils";
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from "../../../utils/toast-utils";
import IconButton from "../../icon-button";
import { Button } from "../button";
import { UploadProgressIndicator } from "./upload-progress-indicator";
import { useBackgroundUpload } from "./use-background-upload";

export type CameraViewProps = {
  shopId?: string;
  scannedProductBarcode?: string;
};

export default function BrigaderCameraView({
  shopId,
  scannedProductBarcode,
}: CameraViewProps) {
  // Always call all hooks at the top level, in the same order
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(
    scannedProductBarcode ?? null
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState(0);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [recentlyScanned, setRecentlyScanned] = useState<string[]>([]);
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const {
    addToQueue,
    progress,
    isProcessing,
    retryFailedUploads,
    removeCompletedItems,
  } = useBackgroundUpload();

  // Auto-clear recent scans after 30 seconds
  useEffect(() => {
    if (recentlyScanned.length > 0) {
      const timer = setTimeout(() => {
        setRecentlyScanned([]);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [recentlyScanned]);

  // All useEffect hooks together
  useEffect(() => {
    // Auto-clear recent scans after 30 seconds
    if (recentlyScanned.length > 0) {
      const timer = setTimeout(() => {
        setRecentlyScanned([]);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [recentlyScanned]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      setCapturedImage(null);
    };
  }, []);

  // All useCallback hooks together
  const addToUploadQueue = useCallback(
    (imageBase64: string, barcodeValue: string) => {
      if (!shopId) {
        displayErrorToastMessage("Chýba ID obchodu");
        return;
      }

      const uploadId = addToQueue(barcodeValue, imageBase64, Number(shopId));

      // Add to recently scanned list
      setRecentlyScanned((prev) => {
        const updated = [
          barcodeValue,
          ...prev.filter((b) => b !== barcodeValue),
        ];
        return updated.slice(0, 10); // Keep only last 10
      });

      displaySuccessToastMessage(
        `Obrázok pre ${barcodeValue} sa pridáva do frontu`
      );

      // Vibrate on successful scan
      Vibration.vibrate(100);

      return uploadId;
    },
    [shopId, addToQueue]
  );

  // Debounced barcode scanning to prevent multiple scans
  const handleBarcodeScanned = useCallback(
    (data: { data: string }) => {
      const now = Date.now();
      const scannedBarcode = data?.data;

      // Prevent scanning same barcode within 3 seconds or if recently scanned
      if (
        now - lastScannedTime < 3000 ||
        recentlyScanned.includes(scannedBarcode)
      ) {
        return;
      }

      setLastScannedTime(now);
      setBarcode(scannedBarcode);

      // Auto-capture after barcode is detected (optional)
      // setTimeout(() => takePicture(), 500);
    },
    [lastScannedTime, recentlyScanned]
  );

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isCapturing || !barcode) {
      return;
    }

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
        skipProcessing: false,
        exif: false,
      });

      if (photo?.base64) {
        // Validate base64 string
        if (photo.base64.length > 10 * 1024 * 1024) {
          // 10MB limit
          displayErrorToastMessage("Obrázok je príliš veľký");
          return;
        }

        setCapturedImage(photo.base64);
      } else {
        throw new Error("No base64 data received");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      displayErrorToastMessage("Nepodarilo sa odfotiť obrázok");
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, barcode]);

  const handleConfirmUpload = useCallback(() => {
    if (!capturedImage || !barcode) {
      displayErrorToastMessage("Chýbajú potrebné údaje");
      return;
    }

    // Add to background upload queue
    addToUploadQueue(capturedImage, barcode);

    // Reset for next scan
    setCapturedImage(null);
    setBarcode(null);
  }, [capturedImage, barcode, addToUploadQueue]);

  const resetImageData = useCallback(() => {
    setCapturedImage(null);
    setBarcode(scannedProductBarcode ?? null);
    setIsCapturing(false);
  }, [scannedProductBarcode]);

  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const handleGoBack = useCallback(() => {
    setCapturedImage(null);
    router.back();
  }, []);

  const handleQuickScan = useCallback(() => {
    // Quick scan: immediately take picture and add to queue
    if (!barcode || isCapturing) return;

    takePicture().then(() => {
      // Auto-confirm after a short delay
      setTimeout(() => {
        if (capturedImage && barcode) {
          addToUploadQueue(capturedImage, barcode);
          setCapturedImage(null);
          setBarcode(null);
        }
      }, 1000);
    });
  }, [barcode, isCapturing, capturedImage, addToUploadQueue, takePicture]);

  // Early returns after all hooks are called
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

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View className="flex flex-1 items-center justify-center bg-muted-foreground px-2">
          <IconButton style={styles.cancelIcon} onPress={resetImageData}>
            <X size={25} color="white" strokeWidth={2} />
          </IconButton>
          <Image
            source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
            className="h-[70%] w-full shadow-md"
            resizeMode="contain"
            onError={(error) => {
              console.error("Image display error:", error);
              displayErrorToastMessage("Chyba pri zobrazení obrázka");
              resetImageData();
            }}
          />
          <View className="flex flex-col items-center justify-center w-full gap-4 mt-4">
            <Text className="text-white text-center font-bold">
              Čiarový kód: {barcode}
            </Text>
            <View className="flex flex-row items-center justify-center w-full gap-4">
              <Button onPress={resetImageData} className="bg-red-500 flex-1">
                <Text className="text-white text-lg">Odfoť znova</Text>
              </Button>
              <Button
                onPress={handleConfirmUpload}
                className="bg-green-500 flex-1"
                disabled={!capturedImage || !barcode}
              >
                <Text className="text-white text-lg">Pridaj do frontu</Text>
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <CameraViewExpo
          ref={cameraRef}
          style={styles.camera}
          ratio="1:1"
          onBarcodeScanned={
            !!barcode || !isCameraReady || isCapturing
              ? undefined
              : handleBarcodeScanned
          }
          onCameraReady={handleCameraReady}
        >
          <IconButton style={styles.cancelIcon} onPress={handleGoBack}>
            <X size={25} color="white" strokeWidth={2} />
          </IconButton>

          {/* Recent scans indicator */}
          {recentlyScanned.length > 0 && (
            <View style={styles.recentScansContainer}>
              <Text style={styles.recentScansText}>
                Nedávno naskenované: {recentlyScanned.slice(0, 3).join(", ")}
                {recentlyScanned.length > 3 &&
                  ` +${recentlyScanned.length - 3}`}
              </Text>
            </View>
          )}

          <View className="flex-1 bg-transparent absolute bottom-16 gap-4 w-full px-4">
            <View className="flex flex-row gap-2">
              <Button
                className="flex-row gap-2 items-center justify-center flex-1"
                onPress={takePicture}
                disabled={!isCameraReady || !barcode || isCapturing}
              >
                <Text className="text-lg">
                  {isCapturing ? "Fotím..." : "Odfotím"}
                </Text>
                <Image
                  resizeMode="contain"
                  className="h-8 w-8 rounded-full"
                  {...getShopLogo(shopId as any)}
                />
              </Button>

              {/* Quick scan button for power users */}
              <Button
                className="bg-blue-500 px-4"
                onPress={handleQuickScan}
                disabled={!isCameraReady || !barcode || isCapturing}
              >
                <Text className="text-white text-sm">Rýchlo</Text>
              </Button>
            </View>

            <Text className="text-lg text-gray-100 font-bold w-full text-center bg-black bg-opacity-50 p-2 rounded">
              {barcode ? `✓ ${barcode}` : `Naskenujte štítok produktu`}
            </Text>
          </View>
        </CameraViewExpo>
      )}

      {/* Upload Progress Indicator */}
      <UploadProgressIndicator
        progress={progress}
        isVisible={progress.total > 0}
        onRetryFailed={retryFailedUploads}
        onClearCompleted={removeCompletedItems}
        onToggleDetails={() => setShowProgressDetails(!showProgressDetails)}
      />
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
  recentScansContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 8,
    zIndex: 50,
  },
  recentScansText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
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
