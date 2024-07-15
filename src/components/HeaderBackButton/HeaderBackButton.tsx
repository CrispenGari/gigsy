import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { useNavigation } from "expo-router";

const HeaderBackButton = ({
  title,
  onBackButtonPress,
}: {
  title: string;
  onBackButtonPress?: () => void;
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
      }}
      onPress={() => {
        if (typeof onBackButtonPress !== "undefined") {
          onBackButtonPress();
        } else {
          navigation.goBack();
        }
      }}
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
