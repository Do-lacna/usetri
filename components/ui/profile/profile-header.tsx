import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import type React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../../../lib/useColorScheme";

interface ProfileHeaderProps {
  userEmail?: string | null;
  userImage?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userEmail = "user@example.com",
  userImage,
}) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280";
  const settingsIconColor = colorScheme === "dark" ? "#F3F4F6" : "#374151";

  return (
    <View className="relative overflow-hidden bg-background">
      {/* Subtle Gradient Background */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#1f2937", "#374151"]
            : ["#f8fafc", "#e2e8f0"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Decorative Elements */}
      <View className="absolute -top-10 -right-10 w-32 h-32 bg-muted/20 rounded-full" />
      <View className="absolute -bottom-5 -left-5 w-20 h-20 bg-muted/30 rounded-full" />

      {/* Content Container */}
      <View className="flex-row items-center justify-between px-6 py-8 pt-12">
        {/* Left Side - Profile Info */}
        <View className="flex-row items-center flex-1">
          {/* Profile Image */}
          <View className="relative">
            <View className="w-16 h-16 rounded-full bg-muted border-2 border-border overflow-hidden">
              {userImage ? (
                <Image
                  source={{ uri: userImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-muted items-center justify-center">
                  <Ionicons name="person" size={24} color={iconColor} />
                </View>
              )}
            </View>
          </View>

          {/* User Info */}
          <View className="ml-4 flex-1">
            <Text className="text-muted-foreground text-sm font-medium mb-1">
              Vítaj späť
            </Text>
            <Text
              className="text-foreground text-lg font-semibold"
              numberOfLines={1}
            >
              {userEmail}
            </Text>
          </View>
        </View>

        <Link
          asChild
          href="/main/menu-screen/menu-screen"
          className="absolute top-12 right-6"
        >
          <TouchableOpacity
            //   onPress={onSettingsPress}
            className="w-12 h-12 bg-card rounded-full items-center justify-center border border-border"
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={settingsIconColor}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default ProfileHeader;
