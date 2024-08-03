import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import Divider from "@/src/components/Divider/Divider";
import { AppLogo, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft, SlideInDown } from "react-native-reanimated";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Spinner from "react-native-loading-spinner-overlay";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";
import { StackActions } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();
const Register = () => {
  useWarmUpBrowser();
  const { settings } = useSettingsStore();

  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: "oauth_google",
  });

  const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({
    strategy: "oauth_github",
  });
  const { isLoaded, signUp } = useSignUp();
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [state, setState] = React.useState({
    email: params?.email_address ? (params.email_address as string) : "",
    password: "",
    conf: "",
    error_msg: "",
    loading: false,
  });
  const register = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    setState((state) => ({
      ...state,
      loading: true,
    }));
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

      await signUp.create({
        emailAddress: state.email,
        password: state.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setState((state) => ({
        ...state,
        loading: false,
        error_msg: "",
        password: "",
        conf: "",
      }));
      navigation.dispatch(StackActions.pop());
      router.push({
        pathname: "/verify",
        params: {
          email_address: state.email,
        },
      });
    } catch (err: any) {
      console.log(err);
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
            <CustomTextInput
              placeholder="Email Address"
              keyboardType="email-address"
              text={state.email}
              onChangeText={(text) =>
                setState((state) => ({ ...state, email: text }))
              }
              leftIcon={
                <Ionicons
                  name="mail-open-outline"
                  size={24}
                  color={COLORS.green}
                />
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
                  color={COLORS.green}
                />
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
              placeholder="Confirm Password"
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={COLORS.green}
                />
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
              onSubmitEditing={register}
            />

            {!!state.error_msg ? (
              <Typography
                style={{
                  color: COLORS.red,
                  fontSize: 20,
                  textAlign: "center",
                  marginTop: 10,
                }}
                variant="p"
              >
                {state.error_msg}
              </Typography>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={register}
              style={styles.btn}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                }}
              >
                REGISTER
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              alignSelf: "center",
            }}
          >
            <Divider
              title="Or register with"
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
              height: 200,
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

export default Register;

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
    marginVertical: 20,
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
