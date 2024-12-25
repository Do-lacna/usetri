import auth, { type FirebaseAuthTypes } from "@react-native-firebase/auth";
import { deleteItemAsync, setItemAsync } from "expo-secure-store";
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { AUTH_TOKEN, USER_ID } from "../network/api-client";
import { useStorageState } from "./useStorageState";

type User = FirebaseAuthTypes.User;

export const AuthContext = createContext<{
	signIn: () => void;
	signOut: () => void;
	isLoading: boolean;
	setUser: (user: User) => void;
	session?: string | null;
	user?: User;
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

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState("session");
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<User>();

	const reactToChangedAuthState = async (user: User | null) => {
		setInitializing(true);
		try {
			if (user) {
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: inside listener
	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(reactToChangedAuthState);
		const sub2 = auth().onIdTokenChanged(reactToChangedAuthState);
		return () => {
			subscriber();
			sub2();
		}; // unsubscribe on unmount
	}, []);

	const performSignOut = async () => {
		try {
			await deleteItemAsync("authToken");
			await auth().signOut();
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
				isLoading: isLoading || initializing,
				setUser,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
