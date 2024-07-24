import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { FONTS, COLORS } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Card from "../Card/Card";
import Animated, { SlideInLeft, ZoomInUp } from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import { Link } from "expo-router";
import { sharedElementTransition } from "@/src/utils/SharedTransition";
import ContentLoader from "../ContentLoader/ContentLoader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ProfileCardProps {
  cardStyle?: StyleProp<ViewStyle>;
  title?: string;
  isLoading?: boolean;
}
const ProfileCard = ({ cardStyle, title, isLoading }: ProfileCardProps) => {
  const { me } = useMeStore();
  const [loaded, setLoaded] = React.useState(true);
  const user = useQuery(api.api.user.get, { id: me?.id || "" });

  const { settings } = useSettingsStore();

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
      {isLoading ? (
        <SkeletonProfileCard />
      ) : (
        <>
          {!loaded ? (
            <ContentLoader
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                display: loaded ? "none" : "flex",
                backgroundColor: COLORS.lightGray,
                overflow: "hidden",
              }}
            />
          ) : null}
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
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
              }}
            >
              <Animated.Image
                source={{ uri: me?.imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  display: loaded ? "flex" : "none",
                }}
                sharedTransitionTag="me-profile-avatar"
                sharedTransitionStyle={sharedElementTransition}
                onError={(_error) => {
                  setLoaded(true);
                }}
                onLoadEnd={() => {
                  setLoaded(true);
                }}
                onLoadStart={() => {
                  setLoaded(false);
                }}
                onLoad={() => {
                  setLoaded(true);
                }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                    {me?.firstName} {me?.lastName}{" "}
                  </Text>
                  {user?.verified && (
                    <MaterialIcons
                      name="verified"
                      size={14}
                      color={COLORS.green}
                    />
                  )}
                </View>

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
        </>
      )}

      {!!user && !!!user.verified ? (
        <Link
          asChild
          href={{
            pathname: "/(profile)/verify",
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
            }}
            style={{
              backgroundColor: COLORS.green,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
              width: 150,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
              Get Verified
            </Text>
          </TouchableOpacity>
        </Link>
      ) : null}
    </Card>
  );
};

export default ProfileCard;

const SkeletonProfileCard = () => (
  <View
    style={{
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingBottom: 10,
    }}
  >
    <ContentLoader style={{ width: 50, height: 50, borderRadius: 50 }} />
    <View style={{ flex: 1, gap: 3 }}>
      <ContentLoader style={{ width: 150, height: 15, borderRadius: 5 }} />
      <ContentLoader style={{ width: 100, height: 10, borderRadius: 5 }} />
    </View>
    <ContentLoader style={{ width: 20, height: 20, borderRadius: 5 }} />
  </View>
);
