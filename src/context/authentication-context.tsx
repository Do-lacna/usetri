import { getAuth, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { deleteItemAsync, setItemAsync } from 'expo-secure-store';
import i18n from 'i18next';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  clearAnalyticsUser,
  logBreadcrumb,
  logContinueAsGuest,
  logError,
  setAnalyticsUser,
} from '~/src/utils/analytics';
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from '~/src/utils/toast-utils';
import { AUTH_TOKEN, USER_ID } from '../network/api-client';
import {
  clearGuestMode,
  isGuestMode,
  setGuestMode,
} from '../persistence/guest-storage';
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
  isGuest: boolean;
  continueAsGuest: () => void;
}>({
  signIn: () => null,
  signOut: () => null,
  deleteUserAccount: () => null,
  setUser: () => {},
  isLoading: false,
  isGuest: false,
  continueAsGuest: () => null,
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
  const [isGuest, setIsGuest] = useState(false);

  const reactToChangedAuthState = async (user: User | null) => {
    setInitializing(true);
    try {
      if (!user) {
        setUser(undefined);
        // Don't redirect if user is in guest mode
        if (!isGuestMode()) {
          resetAndRedirect('/sign-in');
        }
        return;
      }
      if (user?.emailVerified) {
        const token = await user.getIdToken(true);
        await setItemAsync(USER_ID, user.uid);
        await setItemAsync(AUTH_TOKEN, token);
        setUser(user);
        setAnalyticsUser(user.uid);
        clearGuestMode();
        setIsGuest(false);
      }
    } catch (e) {
      logError(e, 'reactToChangedAuthState');
    } finally {
      setInitializing(false);
    }
  };

  // Refresh token when app comes to foreground
  const refreshTokenOnForeground = async () => {
    const currentUser = getAuth().currentUser;
    if (currentUser?.emailVerified) {
      try {
        // Force refresh the token
        const token = await currentUser.getIdToken(true);
        await setItemAsync(AUTH_TOKEN, token);
      } catch (e) {
        logError(e, 'refreshTokenOnForeground');
      }
    }
  };

  useEffect(() => {
    // Listen to auth state changes
    const authSubscriber = getAuth().onAuthStateChanged(
      reactToChangedAuthState,
    );

    // Listen to token changes (handles automatic refresh)
    const tokenSubscriber = getAuth().onIdTokenChanged(async user => {
      if (user?.emailVerified) {
        try {
          const token = await user.getIdToken();
          await setItemAsync(AUTH_TOKEN, token);
        } catch (e) {
          logError(e, 'onIdTokenChanged');
        }
      }
    });

    // Listen to app state changes to refresh token when app returns from background
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          refreshTokenOnForeground();
        }
      },
    );

    const brigaderActive = isBrigaderActive() ?? false;
    setBrigaderActive(brigaderActive);

    // Initialize guest mode from storage
    const guestMode = isGuestMode();
    setIsGuest(guestMode);

    return () => {
      authSubscriber();
      tokenSubscriber();
      appStateSubscription.remove();
    };
  }, []);

  const performSignOut = async () => {
    try {
      await deleteItemAsync('authToken');
      clearGuestMode();
      setIsGuest(false);
      await getAuth().signOut();
      setUser(undefined);
      clearAnalyticsUser();
      logBreadcrumb('User signed out');
    } catch (e) {
      logError(e, 'performSignOut');
    }
  };

  const continueAsGuest = () => {
    setGuestMode(true);
    setIsGuest(true);
    setInitializing(false);
    logContinueAsGuest();
    resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
  };

  const deleteUserAccount = async () => {
    try {
      await user?.delete();
      clearAnalyticsUser();
      displaySuccessToastMessage(i18n.t('auth.account_deleted'));
      resetAndRedirect('/');
    } catch (e) {
      logError(e, 'deleteUserAccount');
      displayErrorToastMessage(i18n.t('auth.account_delete_error'));
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
        isGuest,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
