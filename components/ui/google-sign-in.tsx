import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React from "react";
import { Text } from "react-native";
import { auth } from "~/firebase.config";
import { AuthContext } from "../../context/authentication-context";
import { Button } from "./button";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com",
    iosClientId:
      "504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com",
    webClientId:
      "504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com",
  });

  //   const { setUser } = useSession();
  const { setUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(
        authentication?.idToken,
        authentication?.accessToken
      );

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          return user;
          //   setUser(user);
        })
        .catch((error) => {
          console.error("Google Sign-In Error", error);
        });
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    await promptAsync();
  };

  return (
    <Button onPress={handleGoogleSignIn}>
      <Text>Sign in with Google </Text>
    </Button>
  );
}
