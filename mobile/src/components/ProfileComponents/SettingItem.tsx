import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";

interface SettingItemProps {
  Icon: React.ReactNode;
  title: string;
  onPress: () => void;
}
const SettingItem = ({ Icon, title, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 2,
      }}
    >
      {Icon}
      <Text style={{ fontFamily: FONTS.bold, flexShrink: 18, flex: 1 }}>
        {title}
      </Text>
      <Ionicons name="chevron-forward-outline" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );
};

export default SettingItem;
