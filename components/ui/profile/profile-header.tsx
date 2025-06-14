import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  userEmail?: string | null;
  userImage?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userEmail = "user@example.com",
  userImage,
}) => {
  return (
    <View className="relative overflow-hidden bg-white">
      {/* Subtle Gradient Background */}
      <LinearGradient
        colors={["#f8fafc", "#e2e8f0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Decorative Elements */}
      <View className="absolute -top-10 -right-10 w-32 h-32 bg-gray-100/50 rounded-full" />
      <View className="absolute -bottom-5 -left-5 w-20 h-20 bg-gray-50/80 rounded-full" />

      {/* Content Container */}
      <View className="flex-row items-center justify-between px-6 py-8 pt-12">
        {/* Left Side - Profile Info */}
        <View className="flex-row items-center flex-1">
          {/* Profile Image */}
          <View className="relative">
            <View className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden">
              {userImage ? (
                <Image
                  source={{ uri: userImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-100 items-center justify-center">
                  <Ionicons name="person" size={24} color="#6b7280" />
                </View>
              )}
            </View>
            {/* Online Status Indicator */}
            <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
          </View>

          {/* User Info */}
          <View className="ml-4 flex-1">
            <Text className="text-gray-500 text-sm font-medium mb-1">
              Vítaj späť
            </Text>
            <Text
              className="text-gray-900 text-lg font-semibold"
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
            className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color="#374151" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default ProfileHeader;
