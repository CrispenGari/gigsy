import { api } from "@/convex/_generated/api";
import HomeHeader from "@/src/components/HomeHeader/HomeHeader";
import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { useLocationStore } from "@/src/store/locationStore";
import { useMeStore } from "@/src/store/meStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
const Layout = () => {
  const { os } = usePlatform();
  const location = useCurrentLocation();
  const { update } = useLocationStore();
  const { setLocation } = useCreateFormStore();
  const { addAll } = useWishlistStore();
  const { me } = useMeStore();
  const wishlists = useQuery(api.api.wishlist.getMyWishLists, {
    id: me?.id || "",
  });

  React.useEffect(() => {
    if (!!wishlists) {
      addAll(wishlists);
    }
  }, [wishlists]);

  React.useEffect(() => {
    if (location) {
      update(location);
      setLocation(location);
    }
  }, [location]);
  return (
    <Tabs
      initialRouteName="create"
      screenOptions={{
        tabBarStyle: {
          height: os === "ios" ? 100 : 80,
          backgroundColor: COLORS.transparent,
          position: "absolute",
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: true,
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 12,
          marginTop: -10,
          marginBottom: 10,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          header: (props) => <HomeHeader {...props} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          title: "Publish",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default Layout;