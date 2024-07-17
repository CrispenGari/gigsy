import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { RootSiblingParent } from "react-native-root-siblings";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ImageInfoBottomSheet from "@/src/components/BottomSheets/ImageInfoBottomSheet";
import { Id } from "@/convex/_generated/dataModel";
import { usePlatform } from "@/src/hooks";
import { saveImageToLibrary, shareSomething } from "@/src/utils";
import Spinner from "react-native-loading-spinner-overlay";

const Page = () => {
  const { os } = usePlatform();
  const [state, setState] = React.useState({ loading: false });
  const infoBottomSheet = React.useRef<BottomSheetModal>(null);
  const { uri, fullName, uid } = useLocalSearchParams<{
    uri: string;
    fullName: string;
    uid: Id<"users">;
  }>();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const share = async () => {
    if (!!!uri) return;
    setState((s) => ({ ...s, loading: true }));
    await shareSomething(uri, "Sharing Image");
    setState((s) => ({ ...s, loading: false }));
  };
  const report = () => {};
  const save = async () => {
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
          headerTitle: fullName || "Profile Picture",
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
              onPress={() => router.back()}
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
      <Spinner visible={state.loading} animation="fade" />
      <RootSiblingParent>
        {uid && <ImageInfoBottomSheet ref={infoBottomSheet} id={uid} />}

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
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => infoBottomSheet.current?.present()}
              >
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={COLORS.green}
                />
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.green }}>
                  Info
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
