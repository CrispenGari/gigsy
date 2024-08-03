import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { useUser } from "@clerk/clerk-expo";
import { useMeStore } from "@/src/store/meStore";
import Animated, {
  FadeIn,
  interpolate,
  interpolateColor,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Card from "@/src/components/Card/Card";
import { usePlatform } from "@/src/hooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { useLocationStore } from "@/src/store/locationStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { reasons } from "@/src/constants/reasons";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {
  const [state, setState] = React.useState({
    loading: false,
    reason: {
      id: 0,
      reason: "",
    },
  });
  const { settings, restore } = useSettingsStore();
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const { me } = useMeStore();
  const { os } = usePlatform();
  const headerHeight = useHeaderHeight();
  const deleteUserMutation = useMutation(api.api.user.deleteUser);
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clearForm } = useCreateFormStore();
  const { clear } = useWishlistStore();
  const reasonValue = useSharedValue(0);
  const deletePasswordButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(interpolate(reasonValue.value, [0, 1], [0, 40]));
    const marginBottom = withTiming(
      interpolate(reasonValue.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(reasonValue.value, [0, 1], [0, 8])
    );
    const backgroundColor = withTiming(
      interpolateColor(
        reasonValue.value,
        [0, 1],
        [COLORS.tertiary, COLORS.green]
      )
    );
    return {
      backgroundColor,
      height,
      marginBottom,
      paddingVertical,
    };
  });

  const deleteAccount = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!user || !!!me) return;
    setState((s) => ({ ...s, loading: true }));
    const val = await deleteUserMutation({
      id: me.id,
      reason: state.reason.reason,
    });

    if (val) {
      await user
        .delete()
        .then(() => {
          destroy();
          reset();
          clearForm();
          clear();
          restore();
          router.dismissAll();
          router.replace("/(modals)/login");
        })
        .catch(() => {
          setState((s) => ({ ...s, loading: false }));
          Alert.alert("Failed Operation", "Failed to delete an account.");
        });
    } else {
      setState((s) => ({ ...s, loading: false }));
      Alert.alert("Failed Operation", "Failed to delete an account.");
    }
  };

  React.useEffect(() => {
    if (state.reason.id === 15) {
      reasonValue.value = state.reason.reason.trim().length === 0 ? 0 : 1;
    } else {
      reasonValue.value = state.reason.id === 0 ? 0 : 1;
    }
  }, [state]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Delete Account",
          headerLargeTitle: true,
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
      <Spinner visible={state.loading || !isLoaded} animation="fade" />
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={10}
          behavior={os === "ios" ? "padding" : undefined}
          style={{
            padding: 10,
            paddingTop: os === "ios" ? headerHeight + 20 : 10,
            flex: 1,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Provide the reason for deleting your account.
            </Text>
            <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
              <Card
                style={{
                  padding: 10,
                  maxWidth: 400,
                  borderRadius: 5,
                  width: "100%",
                  paddingVertical: 15,
                }}
              >
                {reasons.map((reason) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      paddingVertical: 3,
                    }}
                    key={reason.id}
                    onPress={async () => {
                      if (settings.haptics) {
                        await onImpact();
                      }
                      if (reason.id === 15) {
                        setState((s) => ({
                          ...s,
                          reason: { id: 15, reason: "" },
                        }));
                      } else {
                        setState((s) => ({ ...s, reason }));
                      }
                    }}
                  >
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: COLORS.green,
                        padding: 2,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 15,
                          backgroundColor:
                            state.reason.id === reason.id
                              ? COLORS.green
                              : COLORS.white,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 16,
                        width: "100%",
                        flexWrap: "wrap",
                        flexShrink: 1,
                      }}
                    >
                      {reason.reason}
                    </Text>
                  </TouchableOpacity>
                ))}

                {state.reason.id === 15 && (
                  <Animated.View
                    style={{ marginTop: 20 }}
                    entering={FadeIn.duration(400).delay(200)}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        color: COLORS.green,
                        fontSize: 16,
                        marginBottom: 5,
                      }}
                    >
                      Specify Reason
                    </Text>
                    <TextInput
                      style={{
                        paddingVertical: 5,
                        padding: 10,
                        fontFamily: FONTS.regular,
                        fontSize: 16,
                        backgroundColor: COLORS.lightGray,
                        maxHeight: 80,
                      }}
                      value={
                        state.reason.id === 15 || state.reason.id === 0
                          ? state.reason.reason
                          : ""
                      }
                      multiline
                      placeholder="State reason for deleting this app"
                      placeholderTextColor={COLORS.gray}
                      onChangeText={(text) => {
                        if (state.reason.id === 15) {
                          setState((s) => ({
                            ...s,
                            reason: { ...s.reason, reason: text },
                          }));
                        }
                      }}
                    />
                  </Animated.View>
                )}

                <AnimatedTouchableOpacity
                  onPress={deleteAccount}
                  style={[
                    deletePasswordButtonStyle,
                    {
                      borderRadius: 5,
                      alignItems: "center",
                      maxWidth: 400,
                      marginTop: 20,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: FONTS.bold,
                      fontSize: 18,
                    }}
                  >
                    Delete Account
                  </Text>
                </AnimatedTouchableOpacity>
              </Card>
            </Animated.View>
            <TouchableOpacity
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setState({
                  loading: false,
                  reason: { id: 0, reason: "" },
                });
                deleteAccount();
              }}
              style={{ alignSelf: "center", marginTop: 100 }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.gray,
                  textDecorationLine: "underline",
                  fontSize: 16,
                }}
              >
                No Reason just delete account
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Page;
