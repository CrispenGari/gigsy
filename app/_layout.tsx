import "react-native-reanimated";
import { COLORS, FONTS, Fonts } from "@/src/constants";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { ClerkProvider } from "@/src/providers";
import { useUser } from "@clerk/clerk-expo";
import { TouchableOpacity, LogBox, StatusBar, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/src/components";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { usePlatform } from "@/src/hooks";
import { useMeStore } from "@/src/store/meStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { api } from "@/convex/_generated/api";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs;
LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
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
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ConvexProvider client={convex}>
            <ClerkProvider>
              <RootLayout />
            </ClerkProvider>
          </ConvexProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default Layout;

const RootLayout = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { os } = usePlatform();
  const { save } = useMeStore();
  const { settings } = useSettingsStore();
  const { me } = useMeStore();
  const createUserOrFailMutation = useMutation(
    api.api.user.findUserOrCreateOne
  );
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  React.useEffect(() => {
    if (!isSignedIn) {
      save(null);
    }
    if (!!user) {
      const me = {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        imageUrl: user.imageUrl,
        lastLoginAt: user.lastSignInAt,
        email: user.emailAddresses[0].emailAddress,
      };
      save(me);
    } else {
      save(null);
    }
  }, [user, isSignedIn]);

  // Try to save a user to convex if not exists
  React.useEffect(() => {
    if (!!me) {
      createUserOrFailMutation({
        email: me.email,
        firstName: me.firstName || "",
        id: me.id,
        image: me.imageUrl,
        lastName: me.lastName || "",
      });
    }
  }, [me]);

  return (
    <Stack>
      <Stack.Screen
        options={{
          presentation: os === "ios" ? "modal" : "fullScreenModal",
          headerTitle: "Sign In",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
          },
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
              }}
              activeOpacity={0.7}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.replace("/");
              }}
            >
              <Ionicons name="close-outline" size={30} color={COLORS.black} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
        }}
        name="(modals)/login"
      />

      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: "Forgot Password",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
          },
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
              }}
              activeOpacity={0.7}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="close-outline" size={30} color={COLORS.black} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
        }}
        name="(modals)/forgot_password"
      />

      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: "Sign Up",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
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
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={30} color={COLORS.green} />
              <Typography
                variant="h5"
                style={{
                  color: COLORS.green,
                  fontSize: 20,
                }}
              >
                Sign In
              </Typography>
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
        }}
        name="(modals)/register"
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          title: "Profile",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
          },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          headerShown: true,
          title: "Verify Email",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
          },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={30} color={COLORS.green} />
              <Typography
                variant="h5"
                style={{
                  color: COLORS.green,
                  fontSize: 20,
                }}
              >
                Sign Up
              </Typography>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="reset_password"
        options={{
          headerShown: true,
          title: "Update Password",
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 24,
            color: COLORS.black,
          },
          headerTitleAlign: "center",
          navigationBarHidden: true,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: ({}) => (
            <TouchableOpacity
              style={{
                marginRight: 20,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={30} color={COLORS.green} />
              <Typography
                variant="h5"
                style={{
                  color: COLORS.green,
                  fontSize: 20,
                }}
              >
                Forgot Pwd
              </Typography>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
