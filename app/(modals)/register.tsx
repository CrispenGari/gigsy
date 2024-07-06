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

const Register = () => {
  const [state, setState] = React.useState({
    email: "",
    password: "",
    conf: "",
  });

  const register = () => {};

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
            />
            <CustomTextInput
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

            <Typography
              style={{
                color: COLORS.red,
                fontSize: 20,
                marginVertical: 20,
                textAlign: "center",
              }}
              variant="p"
            >
              Invalid login credentials.
            </Typography>
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
                  backgroundColor: COLORS.green,
                  maxWidth: 200,
                  padding: 10,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                },
              ]}
            >
              <Text style={[styles.p, { fontSize: 20, color: COLORS.white }]}>
                REGISTER
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
                color: COLORS.black,
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
                backgroundColor: COLORS.green,
                padding: 15,
                gap: 10,
                marginTop: 20,
              }}
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
