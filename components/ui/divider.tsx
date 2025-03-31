import React from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils";

export interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => {
  return <View className={cn("my-2 border-divider border-2", className)} />;
};

export default Divider;
