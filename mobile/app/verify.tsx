import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { AppLogo, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";

const Verify = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const { settings } = useSettingsStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [state, setState] = React.useState({
    code: "",
    error_msg: "",
    loading: false,
  });

  const verify = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: state.code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setState((s) => ({ ...s, loading: false, error_msg: "", code: "" }));
        router.replace("/profile");
      } else {
        setState((s) => ({
          ...s,
          loading: false,
          error_msg: "Failed to verify your email.",
          code: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        setState((s) => ({
          ...s,
          error_msg: "Incorrect verification code.",
          loading: false,
          code: "",
        }));
      } else {
        setState((s) => ({
          ...s,
          error_msg: "Failed to create an account.",
          loading: false,
          code: "",
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
            }}
            entering={SlideInLeft.duration(200).delay(200)}
          >
            <Typography
              style={{
                color: COLORS.black,
                fontSize: 16,
                marginVertical: 20,
              }}
              variant="p"
            >
              Please Enter the verification code that has been sent to{" "}
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
              </Text>
              .
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
              inputStyle={{ fontSize: 20, textAlign: "center" }}
              onSubmitEditing={verify}
            />

            <Text
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.replace({
                  pathname: "/register",
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
              onPress={verify}
              style={styles.btn}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                }}
              >
                VERIFY
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </>
  );
};

export default Verify;
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
