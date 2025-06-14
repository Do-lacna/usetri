import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data - replace with your actual data source
const mockUserData = {
  email: "john.doe@email.com",
  savingsThisMonth: 45.67,
  totalSavings: 287.43,
  shoppingHistory: [
    {
      id: "1",
      store: "Walmart",
      amount: 89.43,
      savings: 12.3,
      date: "2025-06-12",
      time: "14:30",
    },
    {
      id: "2",
      store: "Target",
      amount: 67.21,
      savings: 8.95,
      date: "2025-06-10",
      time: "16:45",
    },
    {
      id: "3",
      store: "Kroger",
      amount: 124.78,
      savings: 15.6,
      date: "2025-06-08",
      time: "11:20",
    },
    {
      id: "4",
      store: "Costco",
      amount: 203.45,
      savings: 28.7,
      date: "2025-06-05",
      time: "13:15",
    },
    {
      id: "5",
      store: "Whole Foods",
      amount: 156.89,
      savings: 19.25,
      date: "2025-06-03",
      time: "10:30",
    },
  ],
};

interface ShoppingHistoryItem {
  id: string;
  store: string;
  amount: number;
  savings: number;
  date: string;
  time: string;
}

interface ProfileScreenProps {
  onSettingsPress?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSettingsPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderShoppingHistoryItem = (item: ShoppingHistoryItem) => (
    <View
      key={item.id}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {item.store}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {formatDate(item.date)} • {item.time}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-gray-900">
            {formatCurrency(item.amount)}
          </Text>
          <View className="bg-green-100 px-2 py-1 rounded-full mt-1">
            <Text className="text-xs font-medium text-green-700">
              Saved {formatCurrency(item.savings)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Profile</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {mockUserData.email}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onSettingsPress}
            className="bg-gray-100 p-3 rounded-full"
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Savings Summary Cards */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900">
            Vaše úspory
          </Text>

          <View className="flex-row space-x-4 mb-6">
            <View className="flex-1 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={20} />
                <Text className="text-sm font-medium ml-2">Tento mesiac</Text>
              </View>
              <Text className="text-2xl font-bold">
                {formatCurrency(mockUserData.savingsThisMonth)}
              </Text>
            </View>

            {/* Total Savings */}
            <View className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center mb-2">
                <Ionicons name="trending-up-outline" size={20} />
                <Text className="text-sm font-medium ml-2">Celkovo</Text>
              </View>
              <Text className="text-2xl font-bold">
                {formatCurrency(mockUserData.totalSavings)}
              </Text>
              <Text className="text-blue-100 text-xs mt-1">
                All time savings
              </Text>
            </View>
          </View>
        </View>

        {/* Shopping History */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Shopping History
            </Text>
            <Text className="text-sm text-gray-500">
              {mockUserData.shoppingHistory.length} trips
            </Text>
          </View>

          {mockUserData.shoppingHistory.length > 0 ? (
            <View>
              {mockUserData.shoppingHistory.map(renderShoppingHistoryItem)}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4 text-base">
                No shopping history yet
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                Start saving on your grocery trips to see them here
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
