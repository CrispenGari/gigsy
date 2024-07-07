import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const Layout = () => {
  const { os } = usePlatform();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: os === "ios" ? 100 : 80,
          backgroundColor: COLORS.white,
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: true,
        headerStyle: { height: 100 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabelStyle: {
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
          },
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarLabelStyle: {
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
          },
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
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
        name="activity"
        options={{
          tabBarLabelStyle: {
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
          },
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-graph" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabelStyle: {
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
          },
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
