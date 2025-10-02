import auth, { signInWithCredential } from "@react-native-firebase/auth";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { useSession } from "~/context/authentication-context";
import { resetAndRedirect } from "~/utils/navigation-utils";

maybeCompleteAuthSession();

export function GoogleSignIn() {
  const [_, response, promptAsync] = useAuthRequest(
    {
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    },
    {
      path: "/(app)/(auth)/sign-in",
      scheme: "usetri",
    }
  );

  const { setUser } = useSession();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = auth.GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );

        console.log("Signing with google");

        signInWithCredential(auth(), credential)
          .then(({ user }) => {
            console.log("Successfull sign in " + user);
            setUser(user);
            resetAndRedirect("/main");
          })
          .catch((error) => {
            console.error("Google Sign-In Error", error);
          });
      }
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    await promptAsync();
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center bg-white border border-gray-300 rounded-md py-3 px-4 shadow-sm active:opacity-80 mb-2"
      style={{ width: 250, height: 44 }}
      onPress={handleGoogleSignIn}
    >
      <Image
        source={require("~/assets/images/logos/google_logo.png")}
        className="w-[16px] h-[16px] mr-2"
      />
      <Text
        className="text-gray-700 text-lg text-center"
        style={{ lineHeight: 18 }}
      >
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
