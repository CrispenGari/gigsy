import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, {
  interpolate,
  interpolateColor,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Card from "@/src/components/Card/Card";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import { useMeStore } from "@/src/store/meStore";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Keyboard } from "react-native";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const PersonalInformation = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const updateMutation = useMutation(api.api.user.update);
  const { os } = usePlatform();
  const { me } = useMeStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { settings } = useSettingsStore();
  const { user } = useUser();
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    loading: false,
    edit: false,
    error: "",
  });
  const editable = useSharedValue(0);

  const editButtonStyle = useAnimatedStyle(() => {
    const width = withTiming(interpolate(editable.value, [0, 1], [100, 0]));
    const height = withTiming(interpolate(editable.value, [0, 1], [40, 0]));
    const marginBottom = withTiming(
      interpolate(editable.value, [0, 1], [10, 0])
    );
    const paddingVertical = withTiming(
      interpolate(editable.value, [0, 1], [8, 0])
    );
    return {
      width,
      height,
      marginBottom,
      paddingVertical,
    };
  });
  const saveButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(interpolate(editable.value, [0, 1], [0, 40]));
    const marginBottom = withTiming(
      interpolate(editable.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(editable.value, [0, 1], [0, 8])
    );

    const backgroundColor = withTiming(
      interpolateColor(editable.value, [0, 1], [COLORS.tertiary, COLORS.green])
    );
    return {
      backgroundColor,
      height,
      marginBottom,
      paddingVertical,
    };
  });

  const save = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!user || !!!me) return;
    setState((s) => ({ ...s, loading: true }));
    if (state.firstName.trim().length < 3 || state.lastName.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "First name and Last name are required.",
        loading: false,
        edit: false,
      }));
    }
    await user.update({
      firstName: state.firstName,
      lastName: state.lastName,
    });
    await updateMutation({
      id: me.id,
      values: {
        email: me.email,
        firstName: state.firstName,
        lastName: state.lastName,
      },
    });
    setState((s) => ({
      ...s,
      loading: false,
      edit: false,
    }));
  };

  React.useEffect(() => {
    editable.value = state.edit ? 1 : 0;
  }, [state]);

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  React.useEffect(() => {
    if (!!me) {
      setState((s) => ({
        ...s,
        firstName: me.firstName!,
        lastName: me.lastName!,
      }));
    }
  }, [me]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Personal Information",
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={100}
          behavior={os === "ios" ? "padding" : "height"}
          style={{
            padding: 10,
            paddingBottom: 100,
            paddingTop: os === "ios" ? headerHeight + 50 : 10,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Edit Personal Information
          </Text>
          <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
            <Card
              style={{
                padding: 10,
                maxWidth: 500,
                borderRadius: 5,
                width: "100%",
                paddingVertical: 20,
                alignSelf: "flex-start",
              }}
            >
              <AnimatedTouchableOpacity
                onPress={save}
                style={[
                  saveButtonStyle,
                  {
                    borderRadius: 5,
                    alignItems: "center",
                    maxWidth: 400,
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
                  Save
                </Text>
              </AnimatedTouchableOpacity>
              <AnimatedTouchableOpacity
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  setState((s) => ({ ...s, edit: true }));
                }}
                style={[
                  editButtonStyle,
                  {
                    alignSelf: "flex-end",
                    backgroundColor: COLORS.gray,

                    borderRadius: 5,
                    alignItems: "center",
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
                  Edit
                </Text>
              </AnimatedTouchableOpacity>
              <CustomTextInput
                placeholder="First Name"
                keyboardType="default"
                text={state.firstName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, firstName: text }))
                }
                leftIcon={
                  <Ionicons name="person" size={18} color={COLORS.gray} />
                }
                editable={state.edit}
                inputStyle={{ fontSize: 16 }}
                containerStyles={{
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingVertical: 5,
                }}
              />
              <CustomTextInput
                placeholder="Last Name"
                keyboardType="default"
                text={state.lastName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, lastName: text }))
                }
                leftIcon={
                  <Ionicons name="person" size={18} color={COLORS.gray} />
                }
                inputStyle={{ fontSize: 16 }}
                containerStyles={{
                  borderRadius: 0,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  paddingVertical: 5,
                }}
                editable={state.edit}
              />
              <Text
                style={{
                  color: COLORS.red,
                  marginVertical: 5,
                  fontFamily: FONTS.regular,
                }}
              >
                {state.error}
              </Text>
            </Card>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default PersonalInformation;
