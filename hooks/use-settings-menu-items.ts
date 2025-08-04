// hooks/useDrawerMenu.ts
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSession } from "~/context/authentication-context";
import { WEBPAGE_LINKS } from "../lib/constants";
import {
  activateBrigader,
  deactivateBrigader,
} from "../persistence/theme-storage";

export interface MenuItem {
  id: string;
  label: string;
  onPress: () => void;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export const useSettingsMenuItems = () => {
  const { signOut, deleteUserAccount, setBrigaderActive, brigaderActive } =
    useSession();

  const menuSections: MenuSection[] = [
    {
      id: "ucet",
      title: "Nastavenia účtu",
      items: [
        {
          id: "email",
          label: "Email a heslo",
          onPress: () => router.push("/profile"),
        },
        {
          id: "predplatne",
          label: "Predplatné",
          onPress: () => router.push("/change-password"),
        },
        {
          id: "brigader",
          label: `${brigaderActive ? "Dea" : "A"}ktivuj profil brigadera`,
          onPress: () => {
            if (brigaderActive) {
              deactivateBrigader();
              setBrigaderActive?.(false);
              return router.back();
            }
            activateBrigader();
            setBrigaderActive?.(true);
            return router.back();
          },
        },
        {
          id: "odhlasit",
          label: "Odhlásiť sa",
          onPress: signOut,
        },
        {
          id: "vymazatucet",
          label: "Vymazať účet",
          onPress: deleteUserAccount,
        },
      ],
    },
    {
      id: "aplikacia",
      title: "Aplikácia",
      items: [
        {
          id: "preferencie",
          label: "Preferencie",
          onPress: () => router.push("/settings"),
        },
        {
          id: "jazyk",
          label: "Jazyk",
          onPress: () => router.push("/notifications"),
        },
      ],
    },
    {
      id: "informacieapodpora",
      title: "Informácie a podpora",
      items: [
        {
          id: "akotofunguje",
          label: "Ako to funguje",
          onPress: async () => {
            await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.HOW_IT_WORKS);
          },
        },
        {
          id: "politikacookies",
          label: "Cookies",
          onPress: async () => {
            await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.COOKIES);
          },
        },
        {
          id: "ochranaosobnychudajov",
          label: "Ochrana osobných údajov",
          onPress: async () => {
            await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.PRIVACTY_POLICY);
          },
        },
        {
          id: "podmienkypouzivania",
          label: "Podmienky používania",
          onPress: async () => {
            await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.TERMS_OF_SERVICE);
          },
        },
        {
          id: "kontakt",
          label: "Kontakt",
          onPress: async () => {
            await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.CONTACT);
          },
        },
      ],
    },
  ];

  return {
    menuSections,
  };
};
