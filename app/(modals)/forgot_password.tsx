import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/constants";
import { AppLogo, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ripple from "@/src/components/Ripple/Ripple";
import { useSignIn } from "@clerk/clerk-expo";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

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
                <Ionicons name="mail-outline" size={24} color={COLORS.green} />
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
                  padding: 12,
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
                REQUEST CODE
              </Text>
              {state.loading ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ width: "100%", alignItems: "center" }}>
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

export default ForgotPassword;
