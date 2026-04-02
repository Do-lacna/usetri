import { router } from 'expo-router';
import { MoveLeft } from 'lucide-react-native';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  Camera,
  type CameraRuntimeError,
  type PhotoFile,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useUploadProductImage } from '~/src/network/imports/imports';
import { logBarcodeScan, logError } from '~/src/utils/analytics';
import { Button } from '~/src/components/ui/button';

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

const BrigaderCameraView: React.FC<CameraViewProps> = ({
  shopId,
  scannedProductBarcode,
  onBack,
}: CameraViewProps) => {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<BarcodeData | null>(
    null,
  );
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

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

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'granted');
  };

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
      'aztec',
    ],
    onCodeScanned: codes => {
      if (codes.length > 0 && !scannedBarcode) {
        const code = codes[0];
        const barcodeValue = code.value || '';
        runOnJS(setScannedBarcode)({
          value: barcodeValue,
          type: code.type || 'unknown',
        });
        if (barcodeValue) runOnJS(logBarcodeScan)(barcodeValue);
      }
    },
  });

  const onError = (error: CameraRuntimeError) => {
    logError(error, 'brigader:camera');
    Alert.alert(t('camera.error'), t('camera.error_message'));
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || !scannedBarcode) return;

    try {
      const photo: PhotoFile = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      if (photo) {
        setCapturedPhoto(photo.path);
      }
    } catch (error) {
      logError(error, 'brigader:capturePhoto');
      Alert.alert(t('camera.error'), t('camera.capture_error'));
    }
  };

  const submitBase64Data = async () => {
    if (!scannedBarcode || !capturedPhoto) return;
    setIsSubmitting(true);

    try {
      const result = await fetch(`file://${capturedPhoto}`);
      const data = await result.blob();
      const base64 = (await blobToBase64(data)) as string;
      const base64Data = base64.split(',')[1];

      await sendUploadCapturedImageBase64({
        data: {
          file_base64: base64Data,
          shop_id: Number(shopId),
          barcode: scannedBarcode.value,
        },
      });
    } catch (error) {
      logError(error, 'brigader:submitData');
      Alert.alert(t('camera.error'), t('camera.submission_error'));
    } finally {
      setIsSubmitting(false);
      resetScreen();
    }
  };

  if (!hasPermission) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">
          {t('camera.permission_message')}
        </Text>
        <Button onPress={requestCameraPermission}>
          <Text>{t('camera.continue')}</Text>
        </Button>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">{t('camera.no_device')}</Text>
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

        {!scannedBarcode && (
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-64 h-64 border-2 border-white border-dashed rounded-lg">
              <Text className="text-white text-center mt-4">
                {t('camera.scan_barcode_hint')}
              </Text>
            </View>
          </View>
        )}

        {scannedBarcode && (
          <View className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 p-3 rounded-lg">
            <Text className="text-success font-bold text-sm">
              {t('camera.barcode_scanned')}
            </Text>
            <Text className="text-white text-lg font-mono">
              {scannedBarcode.value}
            </Text>
            <Text className="text-n6 text-xs mt-1">
              {t('camera.type', { type: scannedBarcode.type })}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="bg-black p-6 pb-8">
        <View className="mb-4">
          {scannedBarcode ? (
            <View className="bg-success/20 p-3 rounded-lg">
              <Text className="text-white font-bold">{t('camera.barcode_confirmed')}</Text>
              <Text className="text-white text-sm mt-1">
                {scannedBarcode.type}: {scannedBarcode.value}
              </Text>
            </View>
          ) : (
            <View className="bg-i4 p-3 rounded-lg">
              <Text className="text-white">
                {t('camera.scan_to_continue')}
              </Text>
            </View>
          )}
        </View>

        {scannedBarcode && (
          <View className="mb-4">
            {capturedPhoto ? (
              <View className="bg-green-800 p-3 rounded-lg">
                <Text className="text-white font-bold">{t('camera.photo_captured')}</Text>
                <Text className="text-white text-sm mt-1">
                  {t('camera.ready_to_send')}
                </Text>
              </View>
            ) : (
              <View className="bg-gray-700 p-3 rounded-lg">
                <Text className="text-white">
                  {t('camera.take_photo_hint')}
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="space-y-3">
          {scannedBarcode && !capturedPhoto && (
            <TouchableOpacity
              onPress={capturePhoto}
              className="bg-green-600 p-4 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                {t('camera.take_photo')}
              </Text>
            </TouchableOpacity>
          )}

          {scannedBarcode && capturedPhoto && (
            <TouchableOpacity
              onPress={submitBase64Data}
              disabled={isSubmitting}
              className={`p-4 rounded-lg ${
                isSubmitting ? 'bg-gray-600' : 'bg-green-600'
              }`}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white text-center font-bold text-lg ml-2">
                    {t('camera.sending')}
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  {t('camera.send_photo')}
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
                {t('camera.scan_again')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BrigaderCameraView;
