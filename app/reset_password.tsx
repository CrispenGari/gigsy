import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { AppLogo, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import Ripple from "@/src/components/Ripple/Ripple";

const ResetPassword = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
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
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.white,
          padding: 10,
        }}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 0.4 }}
        >
          <AppLogo />
        </View>
        <View
          style={[
            {
              flex: 0.6,
              width: "100%",
              maxWidth: 400,
            },
          ]}
        >
          <Animated.View
            entering={SlideInRight}
            exiting={SlideInLeft}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Typography
              style={{
                color: COLORS.black,
                fontSize: 16,
                marginVertical: 20,
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
              inputStyle={{ fontSize: 20, textAlign: "center" }}
            />

            <CustomTextInput
              placeholder="New Password"
              leftIcon={
                <Ionicons name="lock-closed" size={24} color={COLORS.green} />
              }
              inputStyle={{ fontSize: 20 }}
              containerStyles={{
                borderRadius: 0,
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
              onPress={() =>
                router.replace({
                  pathname: "/forgot_password",
                  params: {
                    email_address: params.email_address,
                  },
                })
              }
              style={{
                color: COLORS.green,
                fontSize: 18,
                marginVertical: 20,
                textAlign: "right",
                fontFamily: FONTS.regular,
                textDecorationLine: "underline",
              }}
            >
              Did not recieve a code?
            </Text>

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
              onPress={resetPassword}
              style={[
                {
                  width: "100%",
                  marginTop: 30,
                  marginBottom: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                  backgroundColor: state.loading
                    ? COLORS.tertiary
                    : COLORS.green,
                  maxWidth: 250,
                  padding: 10,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                  alignItems: "center",
                },
              ]}
              disabled={state.loading}
            >
              <Text
                style={[
                  styles.p,
                  {
                    fontSize: 20,
                    color: COLORS.white,
                    marginRight: state.loading ? 10 : 0,
                  },
                ]}
              >
                UPDATE PASSWORD
              </Text>
              {state.loading ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ResetPassword;
