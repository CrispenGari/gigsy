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
import { Typography } from "@/src/components";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ClerkProvider>
            <RootLayout />
          </ClerkProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default Layout;

const RootLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate("/verify");
    }
  }, [isLoaded]);

  return (
    <Stack>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: "Sign In",
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

      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: "Sign Up",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.common.white,
          },
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={30}
                color={COLORS.common.white}
              />
              <Typography
                variant="h5"
                style={{
                  color: COLORS.common.white,
                }}
              >
                Sign In
              </Typography>
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: COLORS.dark.main },

          statusBarAnimation: "slide",
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
        }}
        name="(modals)/register"
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
