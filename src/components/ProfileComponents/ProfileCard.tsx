import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { FONTS, COLORS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card/Card";
import Animated, { SlideInLeft, ZoomInUp } from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import { Link } from "expo-router";
import { sharedElementTransition } from "@/src/utils/SharedTransition";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ProfileCardProps {
  cardStyle?: StyleProp<ViewStyle>;
  title?: string;
}
const ProfileCard = ({ cardStyle, title }: ProfileCardProps) => {
  const { me } = useMeStore();
  return (
    <Card
      style={[
        {
          paddingTop: 80,
          paddingHorizontal: 50,
          borderRadius: 0,
        },
        cardStyle,
      ]}
    >
      <Animated.Text
        style={{ fontFamily: FONTS.bold, fontSize: 25, marginBottom: 20 }}
        entering={ZoomInUp.duration(200).delay(100)}
      >
        {title ? title : "Profile"}
      </Animated.Text>
      <Link href={"/(profile)/me"} asChild>
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
            sharedTransitionTag="me-profile-avatar"
            sharedTransitionStyle={sharedElementTransition}
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
      </Link>
    </Card>
  );
};

export default ProfileCard;
