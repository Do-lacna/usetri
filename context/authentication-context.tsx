import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { deleteItemAsync, setItemAsync } from 'expo-secure-store';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { displaySuccessToastMessage } from '~/utils/toast-utils';
import { AUTH_TOKEN, USER_ID } from '../network/api-client';
import { isBrigaderActive } from '../persistence/theme-storage';
import { resetAndRedirect } from '../utils/navigation-utils';
import { useStorageState } from './useStorageState';

type User = FirebaseAuthTypes.User;

export const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
  setUser: (user: User) => void;
  session?: string | null;
  brigaderActive?: boolean;
  setBrigaderActive?: (active: boolean) => void;
  user?: User;
  deleteUserAccount: () => void;
}>({
  signIn: () => null,
  signOut: () => null,
  deleteUserAccount: () => null,
  setUser: () => {},
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User>();
  const [brigaderActive, setBrigaderActive] = useState(false);

  const reactToChangedAuthState = async (user: User | null) => {
    setInitializing(true);
    try {
      if (!user) {
        setUser(undefined);
        resetAndRedirect('/sign-in');
      }
      if (user?.emailVerified) {
        const token = await user.getIdToken();
        await setItemAsync(USER_ID, user.uid);
        await setItemAsync(AUTH_TOKEN, token);
        setUser(user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(reactToChangedAuthState);
    //TODO maybe use for token changes (refresh)
    // const sub2 = auth().onIdTokenChanged(reactToChangedAuthState);

    const brigaderActive = isBrigaderActive() ?? false;
    setBrigaderActive(brigaderActive);

    return () => {
      subscriber();
    }; // unsubscribe on unmount
  }, []);

  const performSignOut = async () => {
    try {
      await deleteItemAsync('authToken');
      await auth().signOut();
      setUser(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteUserAccount = async () => {
    try {
      await user?.delete();
      displaySuccessToastMessage('Účet bol úspešne zmazaný');
      resetAndRedirect('/');
    } catch (e) {
      displaySuccessToastMessage('Účet sa nepodarilo zmazať');
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        signOut: performSignOut,
        session,
        isLoading: isLoading || initializing,
        setUser,
        user,
        brigaderActive,
        setBrigaderActive,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
