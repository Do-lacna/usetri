import Toast, { type ToastPosition } from "react-native-toast-message";

export const displaySuccessToastMessage = (message: string) => {
  Toast.show({
    type: "success",
    text1: message,
    position: "bottom",
  });
};

export const displayErrorToastMessage = (
  message: string,
  position = "bottom" as ToastPosition
) => {
  Toast.show({
    type: "error",
    text1: message,
    position,
  });
};
