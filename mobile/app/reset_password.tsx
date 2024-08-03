import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { AppLogo, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";

const ResetPassword = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const { settings } = useSettingsStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [state, setState] = React.useState({
    code: "",
    error_msg: "",
    loading: false,
    conf: "",
    password: "",
  });

  const resetPassword = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    setState((s) => ({ ...s, loading: true }));

    try {
      if (state.password !== state.conf) {
        setState((s) => ({
          ...s,
          loading: false,
          password: "",
          conf: "",
          error_msg: "The two passwords must match.",
        }));
        return;
      }

      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: state.code,
        password: state.password,
      });
      if (res.status === "complete") {
        setActive({ session: res.createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
          password: "",
          conf: "",
        }));
        router.replace("/");
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "Failed to change the password try again.",
          password: "",
          conf: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          password: "",
          conf: "",
          error_msg: error.message,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          password: "",
          conf: "",
          error_msg: "Failed to create an account.",
          loading: false,
        }));
      }
    }
  };

  return (
    <>
      <Spinner visible={state.loading} animation="fade" />
      <KeyboardAvoidingViewWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.white,
            padding: 10,
          }}
        >
          <AppLogo />
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 400,
              alignSelf: "center",
            }}
            entering={SlideInLeft.duration(200).delay(200)}
          >
            <Typography
              style={{
                color: COLORS.black,
                fontSize: 16,
                marginBottom: 10,
              }}
              variant="p"
            >
              Please Enter the reset password code that has been sent to{" "}
              <Text
                style={{
                  color: COLORS.green,
                  fontSize: 16,
                  textAlign: "right",
                  fontFamily: FONTS.regular,
                  textDecorationLine: "underline",
                }}
              >
                {params.email_address}
              </Text>{" "}
              together with your new password.
            </Typography>
            <CustomTextInput
              placeholder="000-000"
              keyboardType="phone-pad"
              text={state.code}
              onChangeText={(text) =>
                setState((state) => ({ ...state, code: text }))
              }
              leftIcon={
                <Ionicons name="keypad" size={24} color={COLORS.green} />
              }
              inputStyle={{
                fontSize: 20,
                textAlign: "center",
              }}
              containerStyles={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                paddingBottom: 0,
              }}
            />

            <CustomTextInput
              placeholder="New Password"
              leftIcon={
                <Ionicons name="lock-closed" size={24} color={COLORS.green} />
              }
              inputStyle={{ fontSize: 20 }}
              containerStyles={{
                borderRadius: 0,
                paddingBottom: 0,
              }}
              text={state.password}
              onChangeText={(text) =>
                setState((state) => ({ ...state, password: text }))
              }
              secureTextEntry={true}
            />
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Confirm New Password"
              leftIcon={
                <Ionicons name="lock-closed" size={24} color={COLORS.green} />
              }
              inputStyle={{ fontSize: 20 }}
              containerStyles={{
                borderRadius: 0,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}
              text={state.conf}
              onChangeText={(text) =>
                setState((state) => ({ ...state, conf: text }))
              }
              onSubmitEditing={resetPassword}
            />

            <Text
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.replace({
                  pathname: "/forgot_password",
                  params: {
                    email_address: params.email_address,
                  },
                });
              }}
              style={styles.linkText}
            >
              Did not recieve a code?
            </Text>
            {!!state.error_msg ? (
              <Typography
                style={{
                  color: COLORS.red,
                  fontSize: 20,
                  textAlign: "center",
                }}
                variant="p"
              >
                {state.error_msg}
              </Typography>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={resetPassword}
              style={styles.btn}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                }}
              >
                UPDATE PASSWORD
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    marginVertical: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    maxWidth: 200,
    padding: 10,
    alignSelf: "flex-end",
    borderRadius: 5,
  },
  linkText: {
    color: COLORS.green,
    fontSize: 18,
    marginVertical: 20,
    alignSelf: "flex-end",
    fontFamily: FONTS.bold,
    textDecorationLine: "underline",
    maxWidth: 200,
  },
});
