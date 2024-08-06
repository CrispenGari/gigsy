import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import Animated from "react-native-reanimated";
import { FONTS, COLORS } from "@/src/constants";
import { onImpact, saveImageToLibrary, shareSomething } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePlatform } from "@/src/hooks";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { RootSiblingParent } from "react-native-root-siblings";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { os } = usePlatform();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({ loading: false });
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [loaded, setLoaded] = React.useState(true);
  const share = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!uri) return;
    setState((s) => ({ ...s, loading: true }));
    await shareSomething(uri, "Sharing Image");
    setState((s) => ({ ...s, loading: false }));
  };
  const report = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };
  const save = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!uri) return;
    setState((s) => ({ ...s, loading: true }));
    saveImageToLibrary(uri);
    setState((s) => ({ ...s, loading: false }));
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: os === "ios" ? undefined : "transparentModal",
          headerShadowVisible: false,
          headerTitle: "Photo",
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
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
              <Ionicons name="chevron-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Animated.Image
              style={{ width: 40, height: 40, borderRadius: 40 }}
              source={{
                uri,
              }}
              sharedTransitionTag="user-profile-image"
            />
          ),
        }}
      />
      <Spinner visible={state.loading || !loaded} animation="fade" />
      <RootSiblingParent>
        <BlurView
          intensity={100}
          tint="dark"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageZoom
            uri={uri}
            minScale={0.7}
            maxScale={5}
            minPanPointers={1}
            doubleTapScale={2}
            isSingleTapEnabled
            isDoubleTapEnabled
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
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

          <BlurView
            intensity={95}
            tint={"dark"}
            style={{ paddingBottom: bottom, width: "100%" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 30,
              }}
            >
              <TouchableOpacity style={{ alignItems: "center" }} onPress={save}>
                <MaterialIcons name="download" size={24} color={COLORS.white} />
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                  Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={share}
              >
                <MaterialIcons
                  name="ios-share"
                  size={24}
                  color={COLORS.white}
                />
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                  Share
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={report}
              >
                <MaterialIcons
                  name="report-gmailerrorred"
                  size={24}
                  color={COLORS.red}
                />
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.red }}>
                  Report
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </BlurView>
      </RootSiblingParent>
    </>
  );
};

export default Page;
