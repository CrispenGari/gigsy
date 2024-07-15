import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Profile = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const router = useRouter();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate("/login");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    ></ScrollView>
  );
};

export default Profile;
