import auth, { signInWithCredential } from "@react-native-firebase/auth";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect } from "react";
import { Text } from "react-native";
import { useSession } from "~/context/authentication-context";
import { resetAndRedirect } from "~/utils/navigation-utils";
import { Button } from "./button";

maybeCompleteAuthSession();

export function GoogleSignIn() {
  const [_, response, promptAsync] = useAuthRequest({
    androidClientId:
      "504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com",
    iosClientId:
      "504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com",
    webClientId:
      "504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com",
  });

  const { setUser } = useSession();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = auth.GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );

        signInWithCredential(auth(), credential)
          .then(({ user }) => {
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
    <Button onPress={handleGoogleSignIn} className="w-[80%] mt-4">
      <Text>Prihlásiť sa pomocou Google </Text>
    </Button>
  );
}
