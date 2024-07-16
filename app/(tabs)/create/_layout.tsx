import React from "react";
import { Stack, Tabs, useRouter } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { useAuth } from "@clerk/clerk-expo";

const Layout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);
  return (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle: { display: "none" },
          headerStyle: { elevation: 0 },
        }}
      />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Basic Information",
            headerLeft: () => (
              <HeaderBackButton
                title="Explore"
                onBackButtonPress={() => router.replace("/")}
              />
            ),
          }}
        />
        <Stack.Screen name="contact" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="other" />
      </Stack>
    </>
  );
};

export default Layout;
