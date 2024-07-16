import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const Activity = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);
  return (
    <View>
      <Text>Activity</Text>
    </View>
  );
};

export default Activity;
