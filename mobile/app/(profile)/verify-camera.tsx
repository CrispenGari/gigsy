import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLORS, FONTS, IMAGES } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { onImpact } from "@/src/utils";
import { Link, Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Card from "@/src/components/Card/Card";
import WhyVerificationBottomSheet from "@/src/components/BottomSheets/WhyVerificationBottomSheet";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Animated, {
  interpolate,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Page = () => {
  const { settings } = useSettingsStore();
  const whyVerificationBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();
  const [granted, requestPermission] = useCameraPermissions();
  const hasImage = useSharedValue(0);
  const cameraRef = React.useRef<CameraView>(null);
  const [state, setState] = React.useState<{
    facing: CameraType;
    flashMode: FlashMode;
    ready: boolean;
    image: string | null;
  }>({
    facing: "front",
    flashMode: "auto",
    ready: true,
    image: null,
  });

  const animatedReTakeImageBtnStyle = useAnimatedStyle(() => {
    const width = withTiming(interpolate(hasImage.value, [0, 1], [0, 150]));
    const padding = withTiming(interpolate(hasImage.value, [0, 1], [0, 10]));
    const height = withTiming(interpolate(hasImage.value, [0, 1], [0, 35]));
    return {
      width,
      height,
      padding,
    };
  });
  const animatedVerifyImageBtnStyle = useAnimatedStyle(() => {
    const width = withTiming(interpolate(hasImage.value, [0, 1], [150, 0]));
    const padding = withTiming(interpolate(hasImage.value, [0, 1], [10, 0]));
    const height = withTiming(interpolate(hasImage.value, [0, 1], [35, 0]));
    return {
      width,
      height,
      padding,
    };
  });

  const shoot = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    cameraRef.current
      ?.takePictureAsync()
      .then((value) => {
        if (value) setState((s) => ({ ...s, image: value.uri }));
      })
      .catch((err) => console.log(err));
  };

  const verifyProfile = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };
  const flipCamera = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({ ...s, facing: s.facing === "back" ? "front" : "back" }));
  };
  const switchFlashMode = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({
      ...s,
      flashMode:
        s.flashMode === "auto" ? "on" : s.flashMode === "on" ? "off" : "auto",
    }));
  };

  React.useEffect(() => {
    if (!!!granted?.granted) {
      requestPermission();
    }
  }, [granted]);
  React.useEffect(() => {
    hasImage.value = !!state.image ? 1 : 0;
  }, [state]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Verify Profile",
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
          }}
        >
          <Animated.View
            style={{
              width: 100,
              height: 100,
              overflow: "hidden",
              borderRadius: 10,
              alignSelf: "flex-end",
            }}
            entering={SlideInRight.delay(500).duration(200)}
          >
            <Animated.Image
              source={IMAGES.pose}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Animated.View>

          <Text
            style={{
              fontFamily: FONTS.bold,
              marginVertical: 20,
              alignSelf: "flex-start",
            }}
          >
            Copy the pose on your top right conner.
          </Text>
          {!!state.image ? (
            <View
              style={{
                width: 250,
                height: 300,
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <Animated.Image
                source={{ uri: state.image }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>
          ) : (
            <>
              <View
                style={{
                  width: 250,
                  height: 300,
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                {!state.ready ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: COLORS.gray,
                      alignItems: "center",
                      justifyContent: "center",
                      bottom: 0,
                    }}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={30}
                      color={COLORS.green}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                ) : null}
                <CameraView
                  style={{
                    width: "100%",
                    height: "100%",
                    opacity: state.ready ? 1 : 0,
                  }}
                  facing={state.facing}
                  flash={state.flashMode}
                  mode="picture"
                  ref={cameraRef}
                  onCameraReady={() => setState((s) => ({ ...s, ready: true }))}
                />
              </View>
              <View
                style={{ flexDirection: "row", gap: 20, paddingVertical: 20 }}
              >
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={switchFlashMode}
                >
                  {state.flashMode === "auto" ? (
                    <MaterialIcons
                      name="flash-auto"
                      size={15}
                      color={COLORS.black}
                    />
                  ) : (
                    <Ionicons
                      name={
                        state.flashMode === "on"
                          ? "flash-outline"
                          : "flash-off-outline"
                      }
                      size={15}
                      color={COLORS.black}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconBtn,
                    {
                      width: 50,
                      height: 50,
                      backgroundColor: COLORS.gray,
                    },
                  ]}
                  onPress={shoot}
                >
                  <MaterialIcons
                    name="enhance-photo-translate"
                    size={18}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={flipCamera}>
                  <Ionicons
                    name="camera-reverse-outline"
                    size={15}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          <View style={{ flexDirection: "row" }}>
            <AnimatedTouchableOpacity
              onPress={verifyProfile}
              style={[
                styles.btn,
                {
                  backgroundColor: COLORS.green,
                },
                animatedVerifyImageBtnStyle,
              ]}
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
            </AnimatedTouchableOpacity>
            <AnimatedTouchableOpacity
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setState((s) => ({ ...s, image: null }));
              }}
              style={[
                styles.btn,
                {
                  backgroundColor: COLORS.gray,
                },
                animatedReTakeImageBtnStyle,
              ]}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.white,
                  fontSize: 16,
                }}
              >
                Retake
              </Text>
            </AnimatedTouchableOpacity>
          </View>
        </Card>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.semiGray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  btn: {
    borderRadius: 5,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});