import "react-native-reanimated";
import { COLORS, FONTS, Fonts } from "@/src/constants";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { ClerkProvider } from "@/src/providers";
import { useAuth } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorProperties } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [loaded] = useFonts(Fonts);
  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ClerkProvider>
        <RootLayout />
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default Layout;

const RootLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate("/(modals)/login");
    }
  }, [isLoaded]);

  return (
    <Stack>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: "Authenticate",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.common.white,
          },
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
              }}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons
                name="close-outline"
                size={30}
                color={COLORS.common.white}
              />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: COLORS.dark.main },
          statusBarAnimation: "slide",
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
        }}
        name="(modals)/login"
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
