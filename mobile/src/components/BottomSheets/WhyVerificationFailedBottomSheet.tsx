import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetFooter,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS, IMAGES } from "@/src/constants";
import Animated, { SlideInDown, ZoomIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useRouter } from "expo-router";

const verificationTips = [
  {
    sectionTitle:
      "Here are some of the reasons we couldn't verify your profile avatar.",
    tips: [
      "Make sure your face is visible.",
      "Try to copy the pose provided.",
      "Make sure you look straight at the camera.",
      "If you were wearing glasses, consider removing them.",
      "Ensure there is adequate lighting.",
      "If you were wearing a hat, consider removing it.",
      "Remove any facial coverings, such as masks.",
      "Ensure the background is not too cluttered.",
      "Avoid using filters or heavy makeup.",
      "Ensure the photo is in focus and not blurry.",
    ],
  },
  {
    sectionTitle: "Tried the above and it still didn't work?",
    tips: [
      "Change your profile avatar and try again.",
      "If you continue to experience issues, please contact support for further assistance.",
      "Ensure your new profile avatar meets the guidelines above and try again.",
    ],
  },
];

const WhyVerificationFailedBottomSheet = React.forwardRef<
  BottomSheetModal,
  {
    onRetakeImage: () => void;
  }
>(({ onRetakeImage }, ref) => {
  const snapPoints = React.useMemo(() => ["80%"], []);
  const { bottom } = useSafeAreaInsets();
  const { settings } = useSettingsStore();
  const { dismiss } = useBottomSheetModal();
  const router = useRouter();
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      footerComponent={(p) => (
        <BottomSheetFooter {...p}>
          <Animated.View entering={SlideInDown.duration(200).delay(200)}>
            <BlurView intensity={80} tint="extraLight">
              <Animated.View
                style={{
                  backgroundColor: "rgba(255, 255, 255, .5)",
                  padding: 10,
                  paddingBottom: bottom,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: COLORS.gray,
                  height: 100,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: COLORS.gray,
                    },
                  ]}
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    dismiss();
                    onRetakeImage();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 20,
                      fontFamily: FONTS.bold,
                    }}
                  >
                    Retake
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: COLORS.green,
                      flex: 1,
                    },
                  ]}
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    dismiss();
                    router.navigate({
                      pathname: "/(profile)/me",
                    });
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 20,
                      fontFamily: FONTS.bold,
                    }}
                  >
                    Change Avatar
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </BlurView>
          </Animated.View>
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <Text style={[styles.title, { paddingHorizontal: 10 }]}>
          Verification Failed.
        </Text>

        <Animated.View
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            overflow: "hidden",
            alignSelf: "center",
            marginBottom: 10,
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
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 100,
          }}
          style={{ flex: 1 }}
        >
          {verificationTips.map((section, index) => (
            <React.Fragment key={index}>
              <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
              {section.tips.map((tip, index) => (
                <Text style={[styles.text]} key={index}>
                  {index + 1}. {tip}
                </Text>
              ))}
              <View style={{ height: 30 }} />
            </React.Fragment>
          ))}
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default WhyVerificationFailedBottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginVertical: 5,
  },
  text: {
    fontFamily: FONTS.regular,
    marginVertical: 3,
  },
  btn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    maxWidth: 400,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    height: 40,
  },
});
