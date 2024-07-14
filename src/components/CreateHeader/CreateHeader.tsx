import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";

import { Ionicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { usePlatform } from "@/src/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const CreateHeader = ({ navigation }: NativeStackHeaderProps) => {
  const { os } = usePlatform();
  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
      }}
    >
      <View
        style={{
          paddingTop: os === "ios" ? 10 : top + 10,
          paddingBottom: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.lightGray,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginHorizontal: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={COLORS.green}
          />
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: COLORS.green,
              fontSize: 18,
            }}
          >
            Explore
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateHeader;
