import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Card from "@/src/components/Card/Card";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import { COLORS, FONTS } from "@/src/constants";
import { ProfileAvatar } from "@/src/components";
import { useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useMutation as useConvexMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UserAdverts from "@/src/components/ProfileComponents/UserAdverts";
import { generateRNFile, onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";
import { useMutation } from "@tanstack/react-query";
import { validateFace } from "@/src/utils/react-query";
import InvalidProfileImageBottomSheet from "@/src/components/BottomSheets/InvalidProfileImageBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Page = () => {
  const { settings } = useSettingsStore();
  const { isLoaded, isSignedIn, user } = useUser();
  const [state, setState] = React.useState({
    loading: false,
  });
  const router = useRouter();
  const [image, setImage] = React.useState<string | undefined | null>(null);
  const { me, save } = useMeStore();
  const invalidProfileImageBottomSheetRef =
    React.useRef<BottomSheetModal>(null);
  const hasNewImage = useSharedValue(0);
  const updateProfilePictureMutation = useConvexMutation(
    api.api.user.updateProfilePicture
  );
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["verify"],
    mutationFn: validateFace,
  });

  const userMe = useQuery(api.api.user.get, { id: me?.id || "" });
  const updateAvatar = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!user || !isLoaded || !isSignedIn || !!!me) return;
    setState((s) => ({ ...s, loading: true }));

    if (!!image) {
      const face = generateRNFile({ name: "picture", uri: image });
      const { valid } = await mutateAsync({ face });

      if (!valid) {
        invalidProfileImageBottomSheetRef.current?.present();
        return setState((s) => ({ ...s, loading: false }));
      }
      const { publicUrl } = await user.setProfileImage({ file: image });
      if (!!publicUrl) {
        await updateProfilePictureMutation({ id: me.id, url: publicUrl });
        save({ ...me, imageUrl: publicUrl });
      }
      setState((s) => ({ ...s, loading: false }));
      setImage(null);
    }
  };
  const animatedTextStyle = useAnimatedStyle(() => {
    const scale = interpolate(hasNewImage.value, [0, 1], [0, 1]);
    return {
      transform: [{ scale }],
    };
  });
  const animatedButtonStyles = useAnimatedStyle(() => {
    const width = withTiming(interpolate(hasNewImage.value, [0, 1], [0, 200]));
    const height = withTiming(interpolate(hasNewImage.value, [0, 1], [0, 40]));
    const paddingVertical = withTiming(
      interpolate(hasNewImage.value, [0, 1], [0, 10])
    );
    const marginTop = withTiming(
      interpolate(hasNewImage.value, [0, 1], [0, 10])
    );
    return {
      width,
      height,
      paddingVertical,
      marginTop,
    };
  });

  React.useEffect(() => {
    hasNewImage.value = withSpring(!!image ? 1 : 0);
  }, [image]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FONTS.bold },
          headerTitle: "Profile",
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
              <Ionicons name="chevron-back" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <InvalidProfileImageBottomSheet ref={invalidProfileImageBottomSheetRef} />
      <Spinner visible={state.loading || isPending} animation="fade" />
      {!isLoaded ? (
        <ProfileSkeleton />
      ) : (
        <View style={{ padding: 10, flex: 1 }}>
          <Card
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              maxWidth: 400,
              borderRadius: 20,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <ProfileAvatar
                setBase64={setImage}
                uri={me?.imageUrl}
                sharedTransitionTag="me-profile-avatar"
              />
              <Text
                style={{ fontSize: 18, fontFamily: FONTS.bold, marginTop: 20 }}
              >
                {me?.firstName} {me?.lastName}{" "}
                {userMe?.verified && (
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color={COLORS.green}
                  />
                )}
              </Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                {me?.email}
              </Text>
            </View>
            <AnimatedTouchableOpacity
              onPress={updateAvatar}
              style={[
                animatedButtonStyles,
                {
                  backgroundColor: COLORS.green,
                  maxWidth: 200,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 0,
                  flex: 0,
                },
              ]}
            >
              <Animated.Text
                style={[
                  animatedTextStyle,
                  {
                    color: COLORS.white,
                    fontFamily: FONTS.regular,
                    fontSize: 18,
                  },
                ]}
              >
                Update
              </Animated.Text>
            </AnimatedTouchableOpacity>
          </Card>
          <UserAdverts />
        </View>
      )}
    </>
  );
};

export default Page;

const ProfileSkeleton = () => (
  <Card
    style={{
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      maxWidth: 400,
      borderRadius: 20,
      alignSelf: "center",
      width: "100%",
    }}
  >
    <View style={{ alignItems: "center" }}>
      <ContentLoader
        style={{
          width: 250,
          height: 250,
          borderRadius: 250,
          marginBottom: 20,
        }}
      />
      <ContentLoader
        style={{
          width: 150,
          height: 15,
          borderRadius: 5,
          marginBottom: 5,
        }}
      />
      <ContentLoader
        style={{
          width: 200,
          height: 8,
          borderRadius: 5,
        }}
      />
    </View>
  </Card>
);
