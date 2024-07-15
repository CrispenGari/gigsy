import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { FONTS, COLORS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card/Card";
import Animated, { SlideInLeft, ZoomInUp } from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const ProfileCard = () => {
  const { me } = useMeStore();
  return (
    <Card
      style={{
        paddingTop: 80,
        paddingHorizontal: 50,
        borderRadius: 0,
      }}
    >
      <Animated.Text
        style={{ fontFamily: FONTS.bold, fontSize: 25, marginBottom: 20 }}
        entering={ZoomInUp.duration(200).delay(100)}
      >
        Profile
      </Animated.Text>
      <AnimatedTouchableOpacity
        style={{
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 5,
          paddingBottom: 10,
        }}
        entering={SlideInLeft.delay(100).duration(200)}
      >
        <Animated.Image
          source={{ uri: me?.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
            {me?.firstName} {me?.lastName}
          </Text>
          <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
            {me?.email}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={COLORS.gray}
        />
      </AnimatedTouchableOpacity>
    </Card>
  );
};

export default ProfileCard;
