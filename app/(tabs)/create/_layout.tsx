import React from "react";
import { Stack, Tabs } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";

const Layout = () => {
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
            headerLeft: () => <HeaderBackButton title="Explore" />,
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
