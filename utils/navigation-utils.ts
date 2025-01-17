import { type Href, router } from "expo-router";

export const resetAndRedirect = (route: Href) => {
	if (router.canGoBack()) router.dismissAll();
	router.replace(route);
};
