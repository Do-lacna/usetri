// hooks/useDrawerMenu.ts
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

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

export const useDrawerMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Example menu sections with items
  const menuSections: MenuSection[] = [
    {
      id: "account",
      title: "Account",
      items: [
        {
          id: "profile",
          label: "My Profile",
          onPress: () => router.push("/profile"),
        },
        {
          id: "password",
          label: "Change Password",
          onPress: () => router.push("/change-password"),
        },
        {
          id: "logout",
          label: "Log Out",
          onPress: () => {
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Log Out",
                style: "destructive",
                onPress: () => {
                  // Implement your logout logic here
                  // For example: logout() and then redirect
                  router.replace("/login");
                },
              },
            ]);
          },
        },
      ],
    },
    {
      id: "app",
      title: "Application",
      items: [
        {
          id: "settings",
          label: "Settings",
          onPress: () => router.push("/settings"),
        },
        {
          id: "notifications",
          label: "Notifications",
          onPress: () => router.push("/notifications"),
        },
        {
          id: "help",
          label: "Help & Support",
          onPress: () => router.push("/support"),
        },
      ],
    },
  ];

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    menuSections,
  };
};
