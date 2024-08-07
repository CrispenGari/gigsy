import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Animated, { SlideInLeft } from "react-native-reanimated";
import Card from "@/src/components/Card/Card";

const Page = () => {
  const router = useRouter();
  const { settings, update } = useSettingsStore();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Notification Settings",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          General Notification
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
              maxWidth: 500,
              alignSelf: "flex-start",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 10,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    messages: !settings.notifications.messages,
                  },
                });
              }}
            >
              <MaterialCommunityIcons
                name={
                  settings.notifications.messages
                    ? "message-outline"
                    : "message-off-outline"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Messages
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.notifications.messages ? "ONN" : "OFF"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    jobs: !settings.notifications.jobs,
                  },
                });
              }}
            >
              <MaterialCommunityIcons
                name={
                  settings.notifications.jobs
                    ? "briefcase-outline"
                    : "briefcase-off-outline"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Jobs
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.notifications.jobs ? "ONN" : "OFF"}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </View>
    </>
  );
};

export default Page;
