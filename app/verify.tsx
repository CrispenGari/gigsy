import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";
import { LinearGradient } from "expo-linear-gradient";
import { AppLogo, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";

const Verify = () => {
  const router = useRouter();
  const [state, setState] = React.useState({
    code: "",
  });

  const verify = () => {
    router.navigate("/profile");
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
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={[styles.h1, { color: COLORS.white, marginBottom: 20 }]}>
            Verify your email.
          </Text>
          <AppLogo />
        </View>

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
              onPress={verify}
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
                VERIFY
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Verify;
