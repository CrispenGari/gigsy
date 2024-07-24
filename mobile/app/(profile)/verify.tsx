import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS, IMAGES } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { onImpact } from "@/src/utils";
import { Link, Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Card from "@/src/components/Card/Card";
import Animated, { ZoomIn } from "react-native-reanimated";
import WhyVerificationBottomSheet from "@/src/components/BottomSheets/WhyVerificationBottomSheet";

const Page = () => {
  const { settings } = useSettingsStore();
  const whyVerificationBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Verify Your Profile",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 35,
                height: 35,
                alignItems: "center",
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                borderRadius: 35,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                whyVerificationBottomSheetRef.current?.present();
              }}
            >
              <Ionicons name="help-outline" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),
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
      <WhyVerificationBottomSheet ref={whyVerificationBottomSheetRef} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 10,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            alignItems: "center",
            justifyContent: "center",
            height: 400,
            gap: 20,
          }}
        >
          <Text
            style={{
              alignItems: "center",
              flexDirection: "row",
              fontFamily: FONTS.bold,
            }}
          >
            All you need is your camera and your face to get verified!{" "}
          </Text>
          <Animated.View
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              overflow: "hidden",
            }}
            entering={ZoomIn.delay(500).duration(100)}
          >
            <Animated.Image
              source={IMAGES.verify}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Animated.View>

          <Text
            style={{
              alignItems: "center",
              flexDirection: "row",
              fontFamily: FONTS.bold,
            }}
          >
            Get yourself a green tick.{" "}
            <MaterialIcons name="verified" size={14} color={COLORS.green} />
          </Text>

          <Link
            asChild
            href={{
              pathname: "/(profile)/verify-camera",
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
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.white,
                  fontSize: 16,
                }}
              >
                Get Verified
              </Text>
            </TouchableOpacity>
          </Link>
        </Card>
      </View>
    </>
  );
};

export default Page;
