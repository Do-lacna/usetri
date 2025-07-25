// hooks/useDrawerMenu.ts
import { router } from "expo-router";
import { useSession } from "~/context/authentication-context";
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

  console.log(brigaderActive);

  // Example menu sections with items
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
          id: "pomoc",
          label: "Pomoc",
          onPress: () => router.push("/settings"),
        },
        {
          id: "sukromie",
          label: "Súkromie",
          onPress: () => router.push("/notifications"),
        },
        {
          id: "oaplikacii",
          label: "O aplikácii",
          onPress: () => router.push("/notifications"),
        },
      ],
    },
  ];

  return {
    menuSections,
  };
};
