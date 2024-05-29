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
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = () => {
  const [state, setState] = React.useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const login = () => {};

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={{ backgroundColor: COLORS.dark.tertiary }}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={[COLORS.dark.main, COLORS.dark.tertiary]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.dark.main,
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
                leftIcon={
                  <Ionicons name="mail" size={24} color={COLORS.common.green} />
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
                    name="lock-closed"
                    size={24}
                    color={COLORS.common.green}
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
                    name={!state.showPassword ? "eye-off" : "eye"}
                    size={24}
                    color={COLORS.common.green}
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

              <Typography
                style={{
                  color: COLORS.common.red,
                  fontSize: 20,
                  marginVertical: 20,
                }}
                variant="p"
              >
                Invalid login credentials.
              </Typography>
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
                    backgroundColor: COLORS.dark.tertiary,
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
                    { fontSize: 20, color: COLORS.common.white },
                  ]}
                >
                  LOGIN
                </Text>
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
                  color: COLORS.common.white,
                }}
              />
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
                  backgroundColor: COLORS.dark.tertiary,
                  padding: 15,
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <Ionicons
                  name="logo-google"
                  size={30}
                  color={COLORS.common.white}
                />
                <Text
                  style={[
                    styles.p,
                    { color: COLORS.common.white, fontSize: 20 },
                  ]}
                >
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
                  backgroundColor: COLORS.common.white,
                  padding: 15,
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <Ionicons name="logo-github" size={30} />
                <Text
                  style={[
                    styles.p,
                    { color: COLORS.common.black, fontSize: 20 },
                  ]}
                >
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
                      color: COLORS.common.white,
                      fontSize: 22,
                    },
                  ]}
                >
                  Create a new Account.
                </Text>
              </Link>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
