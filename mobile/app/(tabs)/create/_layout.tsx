import React from "react";
import { Stack, Tabs, useRouter } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { useAuth } from "@clerk/clerk-expo";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

const Layout = () => {
  const router = useRouter();
  const { settings } = useSettingsStore();
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
                onBackButtonPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  router.replace("/");
                }}
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
