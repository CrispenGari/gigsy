import { Image, Text, View } from "react-native";
import React from "react";
import { COLORS, IMAGES } from "@/src/constants";

import { LinearGradient } from "expo-linear-gradient";
import Divider from "@/src/components/Divider/Divider";
const Login = () => {
  return (
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
      <View style={{ flex: 0.2 }}>
        <Image source={IMAGES.logo} style={{ width: 100, height: 100 }} />
      </View>

      <View style={{ flex: 0.4 }}>
        <Divider title="Sign In with" position="left" />
      </View>
      <View style={{ flex: 0.4 }}>
        <Divider title="Sign Up with" position="left" />
      </View>
    </LinearGradient>
  );
};

export default Login;
