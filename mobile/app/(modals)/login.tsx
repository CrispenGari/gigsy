import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import Divider from "@/src/components/Divider/Divider";
import { AppLogo, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft, SlideInDown } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import Ripple from "@/src/components/Ripple/Ripple";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { usePlatform, useWarmUpBrowser } from "@/src/hooks";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

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
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [state, setState] = React.useState({
    email: "",
    password: "",
    showPassword: false,
    loading: false,
    error_msg: "",
  });
  const { os } = usePlatform();
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

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{
          minHeight: Dimensions.get("window").height,
        }}
        behavior={os === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        enabled
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
          <AppLogo />
          <Animated.View
            style={[
              {
                flex: 1,
                width: "100%",
                maxWidth: 400,
              },
            ]}
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
              style={{
                color: COLORS.green,
                fontSize: 18,
                marginVertical: 20,
                alignSelf: "flex-end",
                fontFamily: FONTS.regular,
                textDecorationLine: "underline",
                maxWidth: 150,
              }}
            >
              Forgot Password?
            </Link>
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
              onPress={login}
              style={[
                {
                  width: "100%",
                  marginTop: 30,
                  marginBottom: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: state.loading
                    ? COLORS.tertiary
                    : COLORS.green,
                  maxWidth: 200,
                  padding: 10,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                },
              ]}
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
                LOGIN
              </Text>
              {state.loading ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
            <Animated.View
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 30,
              }}
              entering={SlideInDown.duration(400).delay(200).mass(1)}
            >
              <Divider
                title="or"
                position="center"
                titleStyles={{
                  color: COLORS.black,
                }}
              />
              <TouchableOpacity
                disabled={state.loading}
                activeOpacity={0.7}
                style={{
                  borderRadius: 999,
                  maxWidth: 300,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  backgroundColor: COLORS.green,
                  padding: 10,
                  gap: 10,
                  marginTop: 20,
                }}
                onPress={google}
              >
                <Ionicons name="logo-google" size={30} color={COLORS.white} />
                <Text style={[styles.p, { color: COLORS.white, fontSize: 18 }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={github}
                style={{
                  borderRadius: 999,
                  maxWidth: 300,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  backgroundColor: COLORS.white,
                  padding: 10,
                  gap: 10,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: COLORS.green,
                }}
                disabled={state.loading}
              >
                <Ionicons name="logo-github" size={30} />
                <Text style={[styles.p, { color: COLORS.black, fontSize: 18 }]}>
                  Continue with Github
                </Text>
              </TouchableOpacity>

              <Link href={"(modals)/register"} style={{ marginVertical: 30 }}>
                <Text
                  style={[
                    styles.p,
                    {
                      textDecorationStyle: "solid",
                      textDecorationLine: "underline",
                      color: COLORS.green,
                      fontSize: 16,
                      position: "absolute",
                      bottom: 0,
                    },
                  ]}
                >
                  Create a new Account.
                </Text>
              </Link>
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;