import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/src/components/Card/Card";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import { COLORS, FONTS } from "@/src/constants";
import { ProfileAvatar } from "@/src/components";
import { useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [state, setState] = React.useState({
    loading: false,
  });
  const router = useRouter();
  const [image, setImage] = React.useState<string | undefined | null>(null);
  const { me, save } = useMeStore();
  const hasNewImage = useSharedValue(0);
  const updateProfilePictureMutation = useMutation(
    api.api.user.updateProfilePicture
  );

  const updateAvatar = async () => {
    if (!!!user || !isLoaded || !isSignedIn || !!!me) return;
    setState((s) => ({ ...s, loading: true }));
    if (!!image) {
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
    const width = interpolate(hasNewImage.value, [0, 1], [0, 200]);
    const height = interpolate(hasNewImage.value, [0, 1], [0, 40]);
    return {
      width,
      height,
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
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={18} />
            </TouchableOpacity>
          ),
        }}
      />
      <Spinner visible={state.loading} animation="fade" />
      <View style={{ padding: 10 }}>
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
            <View style={{}}>
              <ProfileAvatar setBase64={setImage} uri={me?.imageUrl} />
            </View>
            <Text
              style={{ fontSize: 18, fontFamily: FONTS.bold, marginTop: 20 }}
            >
              {me?.firstName} {me?.lastName}
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
                marginTop: 20,
                backgroundColor: COLORS.green,
                maxWidth: 200,
                borderRadius: 5,
                paddingVertical: 10,
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
      </View>
    </>
  );
};

export default Page;
