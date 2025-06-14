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
      androidClientId:
        "504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com",
      iosClientId:
        "504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com",
      webClientId:
        "504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com",
    },
    {
      path: "/(app)/(auth)/sign-in",
      scheme: "usetri",
    }
  );

  console.log(response);

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
        className="w-[18px] h-[18px] mr-2"
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
