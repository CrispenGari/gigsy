import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";

const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          padding: 10,
          borderRadius: 10,
          elevation: 1,
          backgroundColor: COLORS.white,
          shadowColor: COLORS.lightGray,
          shadowOffset: { width: 2, height: 2 },
          shadowRadius: 4,
          shadowOpacity: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
