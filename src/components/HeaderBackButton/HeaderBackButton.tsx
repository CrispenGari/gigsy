import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { useNavigation } from "expo-router";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

const HeaderBackButton = ({
  title,
  onBackButtonPress,
}: {
  title: string;
  onBackButtonPress?: () => void;
}) => {
  const navigation = useNavigation();
  const { settings } = useSettingsStore();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
      }}
      onPress={async () => {
        if (settings.haptics) {
          await onImpact();
        }
        if (typeof onBackButtonPress !== "undefined") {
          onBackButtonPress();
        } else {
          navigation.goBack();
        }
      }}
    >
      <Ionicons name="chevron-back-outline" size={18} color={COLORS.gray} />
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.gray,
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default HeaderBackButton;
