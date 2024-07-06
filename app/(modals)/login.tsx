import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";

import { LinearGradient } from "expo-linear-gradient";
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
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ripple from "@/src/components/Ripple/Ripple";
import { useSignIn } from "@clerk/clerk-expo";

const Login = () => {
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
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}
              rightIcon={
                <Ionicons
                  name={!state.showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={COLORS.green}
                />
              }
              onRightIconPress={() =>
                setState((state) => ({
                  ...state,
                  showPassword: !state.showPassword,
                }))
              }
              text={state.password}
              onChangeText={(text) =>
                setState((state) => ({ ...state, password: text }))
              }
              secureTextEntry={!state.showPassword}
              onSubmitEditing={login}
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
              disabled={state.loading}
              activeOpacity={0.7}
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
            >
              <Ionicons name="logo-google" size={30} color={COLORS.white} />
              <Text style={[styles.p, { color: COLORS.white, fontSize: 20 }]}>
                Continue with Google
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
              }}
              disabled={state.loading}
            >
              <Ionicons name="logo-github" size={30} />
              <Text style={[styles.p, { color: COLORS.black, fontSize: 20 }]}>
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
                  },
                ]}
              >
                Create a new Account.
              </Text>
            </Link>
          </Animated.View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
