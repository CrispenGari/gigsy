import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import Divider from "@/src/components/Divider/Divider";
import { AppLogo, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft, SlideInDown } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { useOAuth, useSignIn, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/src/hooks";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";

WebBrowser.maybeCompleteAuthSession();
const Login = () => {
  useWarmUpBrowser();
  const { settings } = useSettingsStore();
  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({
    strategy: "oauth_github",
  });
  const { isLoaded: isLoadedUser, user } = useUser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [state, setState] = React.useState({
    email: "",
    password: "",
    showPassword: false,
    loading: false,
    error_msg: "",
  });
  const login = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));

    try {
      const signInAttempt = await signIn.create({
        identifier: state.email,
        password: state.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          email: "",
          password: "",
          error_msg: "",
          showPassword: false,
        }));
        router.replace("/");
      } else {
        setState((s) => ({
          ...s,
          password: "",
          error_msg: "Failed to login to your account.",
          loading: false,
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          password: "",
          error_msg: error.message,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          password: "",
          error_msg: "Failed to login to your account.",
          loading: false,
        }));
      }
    }
  }, [isLoaded, state]);

  const google = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));
    try {
      const { createdSessionId, setActive } = await startOAuthFlowGoogle({
        redirectUrl: Linking.createURL("/", { scheme: "gigsy" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
          password: "",
          conf: "",
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
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
  }, []);

  const github = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));
    try {
      const { createdSessionId, setActive } = await startOAuthFlowGitHub({
        redirectUrl: Linking.createURL("/", { scheme: "gigsy" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
          password: "",
          conf: "",
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
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
  }, []);

  React.useEffect(() => {
    if (!!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <>
      <Spinner
        visible={state.loading || !isLoaded || !isLoadedUser}
        animation="fade"
      />
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
            <CustomTextInput
              placeholder="Email Address"
              keyboardType="email-address"
              text={state.email}
              onChangeText={(text) =>
                setState((state) => ({ ...state, email: text }))
              }
              leftIcon={
                <Ionicons name="mail-outline" size={24} color={COLORS.gray} />
              }
              inputStyle={{ fontSize: 20 }}
              containerStyles={{
                borderRadius: 0,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                paddingBottom: 0,
              }}
            />
            <CustomTextInput
              placeholder="Password"
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={COLORS.gray}
                />
              }
              inputStyle={{ fontSize: 20 }}
              containerStyles={{
                borderRadius: 0,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}
              rightIcon={
                <Ionicons
                  name={!state.showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.gray}
                />
              }
              onRightIconPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setState((state) => ({
                  ...state,
                  showPassword: !state.showPassword,
                }));
              }}
              text={state.password}
              onChangeText={(text) =>
                setState((state) => ({ ...state, password: text }))
              }
              secureTextEntry={!state.showPassword}
              onSubmitEditing={login}
            />

            <Link
              href={{
                pathname: "/forgot_password",
                params: {
                  email_address: state.email,
                },
              }}
              style={styles.linkText}
            >
              Forgot Password?
            </Link>
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
              onPress={login}
              style={styles.btn}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                }}
              >
                LOGIN
              </Text>
            </TouchableOpacity>
            <Link
              href={"/(modals)/register"}
              style={{
                marginVertical: 10,
                bottom: 0,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  textDecorationStyle: "solid",
                  textDecorationLine: "underline",
                  color: COLORS.green,
                  fontSize: 20,
                  fontFamily: FONTS.bold,
                }}
              >
                I don't have an account.
              </Text>
            </Link>
          </Animated.View>
          <View style={{ width: "100%", maxWidth: 400, alignSelf: "center" }}>
            <Divider
              title="Or continue with"
              position="center"
              titleStyles={{
                color: COLORS.black,
              }}
            />
          </View>
          <Animated.View
            style={{
              width: "100%",
              alignItems: "flex-start",
              flexDirection: "row",
              height: 150,
              justifyContent: "center",
              gap: 20,
              padding: 0,
            }}
            entering={SlideInDown.duration(400).delay(200).mass(1)}
          >
            <TouchableOpacity
              disabled={state.loading}
              activeOpacity={0.7}
              style={[styles.roundBtn, {}]}
              onPress={google}
            >
              <Ionicons name="logo-google" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={github}
              style={[
                styles.roundBtn,
                {
                  backgroundColor: COLORS.white,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.green,
                },
              ]}
              disabled={state.loading}
            >
              <Ionicons name="logo-github" size={20} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  roundBtn: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: COLORS.green,
    padding: 10,
    gap: 10,
  },
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
    maxWidth: 150,
  },
});
