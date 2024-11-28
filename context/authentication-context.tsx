import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { auth } from "~/firebase.config";
import { AUTH_TOKEN, USER_ID } from "../network/api-client";
import { useStorageState } from "./useStorageState";

export const firebaseConfig = {
  apiKey: "AIzaSyD-bsRkMTX6GYvp7CNEiqkcWEJsIhtdiec",
  authDomain: "dolacna-388d4.firebaseapp.com",
  projectId: "dolacna-388d4",
  storageBucket: "dolacna-388d4.appspot.com",
  messagingSenderId: "504961053140",
  appId: "1:504961053140:android:a31a3f46a792c807fbe641",
};

export const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  user?: FirebaseAuthTypes.User | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  user: null,
  setUser: () => {},
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

const listenToAuthState = () => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user);
    } else {
      // User is signed out
      console.log("User is signed out");
    }
  });

  // Return the unsubscribe function to clean up the listener
  return unsubscribe;
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [authToken, setAuthToken] = React.useState(null);

  async function reactToChangedAuthState(user: any) {
    const firebaseUser = user as FirebaseAuthTypes.User;
    console.log("User from context", user);
    if (user) {
      await SecureStore.setItemAsync(USER_ID, user?.uid);
      await SecureStore.setItemAsync(AUTH_TOKEN, user?.accessToken);
      setUser(user);
      setAuthToken(user?.accessToken);
      router.replace("/");
    }

    if (initializing) setInitializing(false);
  }

  //   React.useEffect(() => {

  //    }, [authToken])

  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, reactToChangedAuthState);
    return subscriber; // unsubscribe on unmount
  }, []);

  const performSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await signOut(auth);
      setAuthToken(null);
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession("xxx");
        },
        signOut: performSignOut,
        session,
        isLoading,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
