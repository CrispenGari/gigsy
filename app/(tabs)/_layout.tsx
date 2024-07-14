import HomeHeader from "@/src/components/HomeHeader/HomeHeader";
import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
const Layout = () => {
  const { os } = usePlatform();
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
          tabBarItemStyle: {
            borderRadius: 90,
            width: 90,
            height: 90,
            top: -20,
            backgroundColor: COLORS.white,
            shadowOffset: { height: -2, width: 0 },
            shadowColor: COLORS.secondary,
            shadowOpacity: 0.25,
            shadowRadius: 5,
            elevation: 5,
            flex: 0,
          },
          tabBarLabelStyle: {
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
            display: "none",
          },
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="post-add" color={color} size={size + 15} />
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
        }}
      />
    </Tabs>
  );
};
export default Layout;
