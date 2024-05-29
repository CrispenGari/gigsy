import { View, Text, StyleProp, TextStyle, StyleSheet } from "react-native";
import React from "react";
import { styles } from "@/src/styles";
import { COLORS } from "@/src/constants";

const Divider = ({
  position = "left",
  title,
  titleStyles,
}: {
  position?: "left" | "right" | "center";
  title: string;
  titleStyles?: StyleProp<TextStyle>;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
      }}
    >
      {position === "center" || position === "right" ? (
        <View
          style={{
            borderBottomColor: COLORS.common.white,
            borderBottomWidth: 0.34,
            flex: 1,
          }}
        />
      ) : null}
      <Text style={[styles.p, titleStyles]}>{title}</Text>
      {position === "center" || position === "left" ? (
        <View
          style={{
            borderBottomColor: COLORS.common.white,
            borderBottomWidth: 0.34,
            flex: 1,
          }}
        />
      ) : null}
    </View>
  );
};

export default Divider;
