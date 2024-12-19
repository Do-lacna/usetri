import { useRootNavigationState } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged, signOut,User as FirebaseUser} from "firebase/auth";
import {
  createContext,
  useContext,
  type PropsWithChildren, useState, useEffect, Dispatch, SetStateAction,
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
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<any>>;
  session?: string | null;
  user?: FirebaseUser;
}>({
  signIn: () => null,
  signOut: () => null,
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
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseUser>();
  const navigationState = useRootNavigationState();

    const reactToChangedAuthState=async (user: FirebaseUser|null)=> {
    setInitializing(true)
    try {
      if (user) {
        const token = await user.getIdToken();
        await SecureStore.setItemAsync(USER_ID, user.uid);
        await SecureStore.setItemAsync(AUTH_TOKEN, token);
        setUser(user);
      }
    } catch (e) {
      console.error(e)
    }
    finally {
      setInitializing(false)
    }

    // if (initializing) setInitializing(false);
  }

  // React.useEffect(() => {
  //   // const inAuthGroup = segments[0] === "(auth)";
  //   if (!navigatorReady) {
  //     return;
  //   }
  //   if (user && authToken) {
  //     router.replace("/");
  //   }
  // }, [user, authToken, navigatorReady]);

  // React.useEffect(() => {
  //   // const inAuthGroup = segments[0] === "(auth)";
  //   if (user && authToken && navigationState?.key) {
  //     router.replace("/");
  //   }
  // }, [user, authToken, navigationState?.key]);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, reactToChangedAuthState);
    return subscriber; // unsubscribe on unmount
  }, []);

  const performSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await signOut(auth);
      setUser(undefined);
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
        isLoading:isLoading || initializing,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
