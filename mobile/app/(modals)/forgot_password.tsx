import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { COLORS, FONTS } from "@/src/constants";
import { AppLogo, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";

const ForgotPassword = () => {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  const params = useLocalSearchParams();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    email: params?.email_address ? (params.email_address as string) : "",
    error_msg: "",
    loading: false,
  });

  const requestCode = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    setState((s) => ({
      ...s,
      loading: true,
    }));
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: state.email,
      });
      setState((s) => ({
        ...s,
        error_msg: "",
        loading: false,
      }));
      router.replace({
        pathname: "/reset_password",
        params: {
          email_address: state.email,
        },
      });
    } catch (err: any) {
      if (err.errors) {
        setState((s) => ({
          ...s,
          error_msg:
            "Invalid email address or the email does not have an account.",
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          error_msg: "Failed to send the reset password link.",
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
          <View
            style={[
              {
                flex: 1,
                width: "100%",
                maxWidth: 400,
                zIndex: 1,
              },
            ]}
          >
            <Animated.View
              entering={SlideInRight}
              exiting={SlideInLeft}
              style={{ flex: 1 }}
            >
              <Typography
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  marginVertical: 20,
                }}
                variant="p"
              >
                Please Enter the email address for your gigsy account.
              </Typography>
              <CustomTextInput
                placeholder="Email Address"
                keyboardType="email-address"
                text={state.email}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, email: text }))
                }
                leftIcon={
                  <Ionicons
                    name="mail-outline"
                    size={24}
                    color={COLORS.green}
                  />
                }
                inputStyle={{ fontSize: 20 }}
                containerStyles={{
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
                onSubmitEditing={requestCode}
              />

              {!!state.error_msg ? (
                <Typography
                  style={{
                    color: COLORS.red,
                    fontSize: 20,
                    marginVertical: 20,
                    textAlign: "center",
                  }}
                  variant="p"
                >
                  {state.error_msg}
                </Typography>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={requestCode}
                style={styles.btn}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                  }}
                >
                  REQUEST CODE
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ width: "100%", alignItems: "center" }}>
              <Link href={"/(modals)/register"} style={{ marginVertical: 30 }}>
                <Text
                  style={{
                    textDecorationStyle: "solid",
                    textDecorationLine: "underline",
                    color: COLORS.green,
                    fontSize: 20,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Create a new Account.
                </Text>
              </Link>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </>
  );
};

export default ForgotPassword;

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
});
