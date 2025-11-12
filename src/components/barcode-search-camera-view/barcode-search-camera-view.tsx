import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  Camera,
  type CameraRuntimeError,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';
import { X } from '~/src/lib/icons/Cancel';
import IconButton from '../icon-button/icon-button';
import { Button } from '../ui/button';

export type BarcodeScanningResult = {
  data: string;
  type: string;
};

export type CameraViewProps = {
  onBarcodeScanned?: (data: BarcodeScanningResult) => void;
};

export default function BarcodeSearchCameraView({
  onBarcodeScanned,
}: CameraViewProps) {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const format = useCameraFormat(device, [
    { photoResolution: { width: 1280, height: 720 } },
  ]);

  // Request camera permission
  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    };

    requestCameraPermission();
  }, []);

  // Barcode scanner configuration
  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',
      'ean-8',
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'upc-a',
      'upc-e',
    ],
    onCodeScanned: codes => {
      if (codes.length > 0 && !barcode && isCameraReady) {
        const code = codes[0];
        const barcodeData = code.value || '';

        runOnJS(setBarcode)(barcodeData);
        runOnJS(() => {
          onBarcodeScanned?.({
            data: barcodeData,
            type: code.type || 'unknown',
          });
        })();
      }
    },
  });

  // Handle camera errors
  const onError = (error: CameraRuntimeError) => {
    console.error('Camera error:', error);
  };

  if (!hasPermission) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          <Text>
            To scan product barcodes, this app uses your device's camera
          </Text>
        </Text>
        <Button
          onPress={async () => {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === 'granted');
          }}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        format={format}
        isActive={true}
        codeScanner={barcode ? undefined : codeScanner}
        onError={onError}
        onInitialized={() => setIsCameraReady(true)}
      >
        <IconButton style={styles.cancelIcon} onPress={() => router.back()}>
          <X size={25} color="white" strokeWidth={2} />
        </IconButton>
        <View className="flex-1 bg-transparent relative mb-16">
          <Text className="text-lg text-gray-600 font-bold absolute bottom-4 w-full text-center">
            Naskenujte čiarový kód produktu a budete automaticky presmerovaný na
            daný produkt
          </Text>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  cancelIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  barcodeIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
