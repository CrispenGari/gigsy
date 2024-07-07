import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";
import Divider from "@/src/components/Divider/Divider";
import { AppLogo, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, {
  SlideInRight,
  SlideInLeft,
  SlideInUp,
  SlideInDown,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ripple from "@/src/components/Ripple/Ripple";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/src/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();
const Register = () => {
  useWarmUpBrowser();

  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startOAuthFlowGitHub } = useOAuth({
    strategy: "oauth_github",
  });
  const { isLoaded, signUp } = useSignUp();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [state, setState] = React.useState({
    email: params?.email_address ? (params.email_address as string) : "",
    password: "",
    conf: "",
    error_msg: "",
    loading: false,
  });
  const register = async () => {
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
      router.navigate({
        pathname: "/verify",
        params: {
          email_address: state.email,
        },
      });
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

  const google = React.useCallback(async () => {
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
        <AppLogo />
        <View
          style={[
            {
              flex: 1,
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
            <CustomTextInput
              placeholder="Email Address"
              keyboardType="email-address"
              text={state.email}
              onChangeText={(text) =>
                setState((state) => ({ ...state, email: text }))
              }
              leftIcon={<Ionicons name="mail" size={24} color={COLORS.green} />}
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
              placeholder="Confirm Password"
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
              onSubmitEditing={register}
            />

            {state.error_msg ? (
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
              onPress={register}
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
                  maxWidth: 200,
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
                REGISTER
              </Text>
              {state.loading ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={SlideInUp}
            exiting={SlideInDown}
            style={{ width: "100%", alignItems: "center" }}
          >
            <Divider
              title="or"
              position="center"
              titleStyles={{
                color: COLORS.black,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={state.loading}
              style={{
                borderRadius: 999,
                maxWidth: 400,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
                backgroundColor: COLORS.green,
                padding: 15,
                gap: 10,
                marginTop: 20,
              }}
              onPress={google}
            >
              <Ionicons name="logo-google" size={30} color={COLORS.white} />
              <Text style={[styles.p, { color: COLORS.white, fontSize: 20 }]}>
                Register with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 999,
                maxWidth: 400,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
                backgroundColor: COLORS.white,
                padding: 15,
                gap: 10,
                marginTop: 20,
                borderWidth: 1,
                borderColor: COLORS.green,
                marginBottom: 20,
              }}
              disabled={state.loading}
              onPress={github}
            >
              <Ionicons name="logo-github" size={30} />
              <Text style={[styles.p, { color: COLORS.black, fontSize: 20 }]}>
                Register with Github
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;
