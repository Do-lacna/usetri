import { View } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { Text } from "../components/ui/text";

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: any) => (
    <BaseToast
      {...props}
      // contentContainerStyle={{ paddingHorizontal: 15 }}
      // text1Style={{
      //   fontSize: 15,
      //   fontWeight: "400",
      // }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: any) => (
    <ErrorToast
      {...props}

      // contentContainerStyle={{ zIndex: 99 }}
      // style={{
      //   zIndex: 99,
      //   backgroundColor: "green",
      //   // position: "absolute",
      //   // bottom: 400,
      // }}
    />
  ),

  customBottomSheet: ({ text1, props }: any) => (
    <View
      style={{
        flex: 1,
        height: 60,
        width: "100%",
        backgroundColor: "gray",
        zIndex: 999,
      }}
    >
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
  // /*
  //   Or create a completely new type - `tomatoToast`,
  //   building the layout from scratch.

  //   I can consume any custom `props` I want.
  //   They will be passed when calling the `show` method (see below)
  // */
  // tomatoToast: ({ text1, props }) => (
  //   <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
  //     <Text>{text1}</Text>
  //     <Text>{props.uuid}</Text>
  //   </View>
  // )
};
