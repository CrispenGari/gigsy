import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React from "react";
import { Link, Stack, useRouter } from "expo-router";
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
import { Keyboard } from "react-native";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { useLocationStore } from "@/src/store/locationStore";
import { useWishlistStore } from "@/src/store/wishlistStore";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Security = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clearForm } = useCreateFormStore();
  const { clear } = useWishlistStore();
  const { os } = usePlatform();
  const { me } = useMeStore();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [state, setState] = React.useState({
    email: "",
    currentPassword: "",
    loading: false,
    editEmail: false,
    editPassword: false,
    passwordError: "",
    emailError: "",
    confirmNewPassword: "",
    newPassword: "",
    showCurrentPassword: false,
  });
  const editablePassword = useSharedValue(0);
  const editableEmail = useSharedValue(0);

  const editPasswordButtonStyle = useAnimatedStyle(() => {
    const width = withTiming(
      interpolate(editablePassword.value, [0, 1], [100, 0])
    );
    const height = withTiming(
      interpolate(editablePassword.value, [0, 1], [40, 0])
    );
    const marginBottom = withTiming(
      interpolate(editablePassword.value, [0, 1], [10, 0])
    );
    const paddingVertical = withTiming(
      interpolate(editablePassword.value, [0, 1], [8, 0])
    );
    return {
      width,
      height,
      marginBottom,
      paddingVertical,
    };
  });
  const savePasswordButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 40])
    );
    const marginBottom = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 8])
    );
    const backgroundColor = withTiming(
      interpolateColor(
        editablePassword.value,
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

  const savePassword = async () => {
    if (!!!me || !!!user) return;
    setState((s) => ({ ...s, loading: true }));
    if (state.newPassword !== state.confirmNewPassword) {
      return setState((s) => ({
        ...s,
        passwordError: "The two password must match.",
        currentPassword: "",
        newPassword: "",
        editPassword: false,
        confirmNewPassword: "",
        loading: false,
      }));
    }

    user
      .updatePassword({
        newPassword: state.newPassword,
        currentPassword: state.currentPassword,
        signOutOfOtherSessions: true,
      })
      .then((res) => {
        // the password has been updated
        setState((s) => ({
          ...s,
          passwordError: "",
          currentPassword: "",
          newPassword: "",
          editPassword: false,
          confirmNewPassword: "",
          loading: false,
        }));

        signOut().then(() => {
          destroy();
          reset();
          clearForm();
          clear();
          router.replace("/login");
        });
      })
      .catch((error) => {
        return setState((s) => ({
          ...s,
          passwordError: error.errors[0].message,
          currentPassword: "",
          newPassword: "",
          editPassword: false,
          confirmNewPassword: "",
          loading: false,
        }));
      });
  };

  React.useEffect(() => {
    editablePassword.value = state.editPassword ? 1 : 0;
    editableEmail.value = state.editEmail ? 1 : 0;
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
        email: me.email,
      }));
    }
  }, [me]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Account and Security",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={() => router.back()}
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
              Change Email
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
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.green,
                    marginBottom: 5,
                  }}
                >
                  Your email address can not be changed.
                </Text>
                <CustomTextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  text={state.email}
                  onChangeText={(text) =>
                    setState((state) => ({ ...state, email: text }))
                  }
                  leftIcon={
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={COLORS.gray}
                    />
                  }
                  editable={state.editEmail}
                  inputStyle={{ fontSize: 16 }}
                  containerStyles={{
                    borderRadius: 5,
                    paddingVertical: 5,
                  }}
                />
              </Card>
            </Animated.View>

            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Change Password
            </Text>
            <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
              <Card
                style={{
                  padding: 10,
                  maxWidth: 400,
                  borderRadius: 5,
                  width: "100%",
                  paddingVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.green,
                    marginBottom: 5,
                  }}
                >
                  Note that changing password is a sensitive action, you will be
                  logged out of all sessions to login with your new password.
                </Text>
                <AnimatedTouchableOpacity
                  onPress={savePassword}
                  style={[
                    savePasswordButtonStyle,
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
                  onPress={() =>
                    setState((s) => ({
                      ...s,
                      editEmail: false,
                      editPassword: true,
                    }))
                  }
                  style={[
                    editPasswordButtonStyle,
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
                  placeholder="Current Account Password"
                  keyboardType="default"
                  text={state.currentPassword}
                  onChangeText={(text) =>
                    setState((state) => ({ ...state, currentPassword: text }))
                  }
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={COLORS.gray}
                    />
                  }
                  secureTextEntry={!state.showCurrentPassword}
                  editable={state.editPassword}
                  inputStyle={{ fontSize: 16 }}
                  containerStyles={{
                    borderRadius: 5,
                    paddingVertical: 5,
                  }}
                  rightIcon={
                    <Ionicons
                      name={
                        !state.showCurrentPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={18}
                      color={COLORS.gray}
                    />
                  }
                  onRightIconPress={() => {
                    if (!state.editPassword) return;
                    setState((state) => ({
                      ...state,
                      showCurrentPassword: !state.showCurrentPassword,
                    }));
                  }}
                />

                <CustomTextInput
                  placeholder="New Password"
                  keyboardType="default"
                  text={state.newPassword}
                  onChangeText={(text) =>
                    setState((state) => ({ ...state, newPassword: text }))
                  }
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={COLORS.gray}
                    />
                  }
                  secureTextEntry={true}
                  editable={state.editPassword}
                  inputStyle={{ fontSize: 16 }}
                  containerStyles={{
                    borderRadius: 0,
                    paddingVertical: 5,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    marginTop: 20,
                  }}
                />
                <CustomTextInput
                  placeholder="Confirm New Password"
                  keyboardType="default"
                  text={state.confirmNewPassword}
                  onChangeText={(text) =>
                    setState((state) => ({
                      ...state,
                      confirmNewPassword: text,
                    }))
                  }
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={COLORS.gray}
                    />
                  }
                  secureTextEntry={true}
                  editable={state.editPassword}
                  inputStyle={{ fontSize: 16 }}
                  containerStyles={{
                    borderRadius: 0,
                    paddingVertical: 5,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                  onSubmitEditing={savePassword}
                />
                <Text
                  style={{
                    color: COLORS.red,
                    marginVertical: 5,
                    fontFamily: FONTS.regular,
                  }}
                >
                  {state.passwordError}
                </Text>
              </Card>
            </Animated.View>

            <Link
              asChild
              href={{
                pathname: "(profile)/delete",
              }}
            >
              <TouchableOpacity style={{ alignSelf: "center", marginTop: 100 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.gray,
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  Delete Account
                </Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Security;
