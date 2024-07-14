import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { useNavigation } from "expo-router";

const HeaderBackButton = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
      }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back-outline" size={18} color={COLORS.green} />
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.green,
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default HeaderBackButton;
