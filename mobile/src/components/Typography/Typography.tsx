import { Text, TextStyle, StyleProp } from "react-native";
import React from "react";
import { styles } from "@/src/styles";

interface Props {
  variant?: "h1" | "h2" | "p" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}
const Typography: React.FunctionComponent<Props> = ({
  variant = "p",
  children,
  style,
}) => {
  return <Text style={[styles[variant], style]}>{children}</Text>;
};

export default Typography;
