import { View } from "react-native";
import React from "react";
import Typography from "@/src/components/Typography/Typography";

const Home = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Typography
        variant="h3"
        style={{
          textDecorationStyle: "solid",
          textDecorationLine: "underline",
        }}
      >
        null
      </Typography>
    </View>
  );
};

export default Home;
