// hooks/useBackgroundUpload.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useUploadProductImage } from "../../../network/imports/imports";

export interface UploadItem {
  id: string;
  barcode: string;
  file_base64: string;
  shop_id: number;
  status: "pending" | "uploading" | "success" | "error";
  timestamp: number;
  retryCount: number;
}

export interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  uploading: number;
  pending: number;
}

const MAX_RETRY_COUNT = 3;
const MAX_CONCURRENT_UPLOADS = 2;
const RETRY_DELAY = 2000;

export const useBackgroundUpload = () => {
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const activeUploadsRef = useRef(0);

  const { mutate: uploadImage } = useUploadProductImage({
    mutation: {
      onSuccess: (data, variables) => {
        // const itemId = variables.itemId as string;
      },
      onError: (error, variables) => {
        // const itemId = variables.itemId as string;
      },
    },
  });

  // Handle app state changes to pause/resume uploads
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && uploadQueue.length > 0) {
        processNextInQueue();
      }
    });

    return () => subscription?.remove();
  }, [uploadQueue.length]);

  const updateItemStatus = useCallback(
    (id: string, status: UploadItem["status"]) => {
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    },
    []
  );

  const removeCompletedItems = useCallback(() => {
    setUploadQueue((prev) =>
      prev.filter(
        (item) => item.status === "pending" || item.status === "uploading"
      )
    );
  }, []);

  const handleUploadError = useCallback((itemId: string, error: any) => {
    setUploadQueue((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newRetryCount = item.retryCount + 1;
          if (newRetryCount >= MAX_RETRY_COUNT) {
            return { ...item, status: "error" as const };
          } else {
            // Schedule retry
            setTimeout(() => {
              setUploadQueue((queue) =>
                queue.map((qItem) =>
                  qItem.id === itemId
                    ? {
                        ...qItem,
                        status: "pending" as const,
                        retryCount: newRetryCount,
                      }
                    : qItem
                )
              );
              processNextInQueue();
            }, RETRY_DELAY * newRetryCount);
            return {
              ...item,
              status: "pending" as const,
              retryCount: newRetryCount,
            };
          }
        }
        return item;
      })
    );
  }, []);

  const processNextInQueue = useCallback(() => {
    if (
      processingRef.current ||
      activeUploadsRef.current >= MAX_CONCURRENT_UPLOADS
    ) {
      return;
    }

    processingRef.current = true;

    setUploadQueue((prev) => {
      const pendingItems = prev.filter((item) => item.status === "pending");
      const availableSlots = MAX_CONCURRENT_UPLOADS - activeUploadsRef.current;
      const itemsToProcess = pendingItems.slice(0, availableSlots);

      if (itemsToProcess.length === 0) {
        processingRef.current = false;
        setIsProcessing(false);
        return prev;
      }

      setIsProcessing(true);

      // Start uploads for selected items
      itemsToProcess.forEach((item) => {
        activeUploadsRef.current++;
        uploadImage({
          data: {
            barcode: item.barcode,
            file_base64: item.file_base64,
            shop_id: item.shop_id,
          },
        });
      });

      processingRef.current = false;

      return prev.map((item) =>
        itemsToProcess.find((processItem) => processItem.id === item.id)
          ? { ...item, status: "uploading" as const }
          : item
      );
    });
  }, [uploadImage]);

  const addToQueue = useCallback(
    (barcode: string, file_base64: string, shop_id: number) => {
      const newItem: UploadItem = {
        id: `${Date.now()}-${Math.random()}`,
        barcode,
        file_base64,
        shop_id,
        status: "pending",
        timestamp: Date.now(),
        retryCount: 0,
      };

      setUploadQueue((prev) => [...prev, newItem]);

      // Start processing immediately
      setTimeout(() => processNextInQueue(), 100);

      return newItem.id;
    },
    [processNextInQueue]
  );

  const retryFailedUploads = useCallback(() => {
    setUploadQueue((prev) =>
      prev.map((item) =>
        item.status === "error"
          ? { ...item, status: "pending", retryCount: 0 }
          : item
      )
    );
    processNextInQueue();
  }, [processNextInQueue]);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
    activeUploadsRef.current = 0;
    setIsProcessing(false);
  }, []);

  const getProgress = useCallback((): UploadProgress => {
    const total = uploadQueue.length;
    const completed = uploadQueue.filter(
      (item) => item.status === "success"
    ).length;
    const failed = uploadQueue.filter((item) => item.status === "error").length;
    const uploading = uploadQueue.filter(
      (item) => item.status === "uploading"
    ).length;
    const pending = uploadQueue.filter(
      (item) => item.status === "pending"
    ).length;

    return { total, completed, failed, uploading, pending };
  }, [uploadQueue]);

  return {
    addToQueue,
    uploadQueue,
    isProcessing,
    progress: getProgress(),
    retryFailedUploads,
    clearQueue,
    removeCompletedItems,
  };
};
