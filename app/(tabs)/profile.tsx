import { Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Card from "@/src/components/Card/Card";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { COLORS, FONTS } from "@/src/constants";
import ProfileCard from "@/src/components/ProfileComponents/ProfileCard";
import SettingItem from "@/src/components/ProfileComponents/SettingItem";
import * as Constants from "expo-constants";
import { useMeStore } from "@/src/store/meStore";
import { useLocationStore } from "@/src/store/locationStore";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import Spinner from "react-native-loading-spinner-overlay";
const Profile = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clearForm } = useCreateFormStore();
  const { clear } = useWishlistStore();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  const logout = () => {
    signOut().then(() => {
      destroy();
      reset();
      clearForm();
      clear();
      router.replace("/");
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: headerHeight }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Spinner visible={!isLoaded} animation="fade" />
      <ProfileCard />
      <Text style={styles.headerText}>Settings</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={() => {
            router.navigate("/(profile)/pi");
          }}
          title="Personal Information"
          Icon={
            <Ionicons name="person-outline" size={18} color={COLORS.gray} />
          }
        />
        <SettingItem
          onPress={() => {
            router.navigate("/(profile)/security");
          }}
          title="Account and Security"
          Icon={
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.gray}
            />
          }
        />
        <SettingItem
          onPress={() => {}}
          title="Notifications"
          Icon={
            <Ionicons
              name="notifications-outline"
              size={18}
              color={COLORS.gray}
            />
          }
        />
        <SettingItem
          onPress={() => {}}
          title="Location Settings"
          Icon={
            <Ionicons name="location-outline" size={18} color={COLORS.gray} />
          }
        />
        <SettingItem
          onPress={() => {}}
          title="App Sound and Haptics"
          Icon={
            <MaterialIcons name="vibration" size={18} color={COLORS.gray} />
          }
        />
      </Card>

      <Text style={styles.headerText}>Misc</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={() => {}}
          title="Check for Updates"
          Icon={<MaterialIcons name="update" size={18} color={COLORS.gray} />}
        />

        <SettingItem
          onPress={() => {}}
          title="Customize App Icon"
          Icon={
            <MaterialIcons
              name="insert-emoticon"
              size={18}
              color={COLORS.gray}
            />
          }
        />
      </Card>
      <Text style={styles.headerText}>Support</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={() => {}}
          title="Give us Feedback"
          Icon={<MaterialIcons name="feedback" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={() => {}}
          title="Rate gigys"
          Icon={<Ionicons name="star-outline" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={() => {}}
          title="How does gigsy works"
          Icon={<Ionicons name="help" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={() => {}}
          title="Report an Issue"
          Icon={<Ionicons name="logo-github" size={18} color={COLORS.gray} />}
        />
      </Card>
      <Text style={styles.headerText}>Legal</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={() => {}}
          title="Terms of Service"
          Icon={
            <Ionicons
              name="document-text-outline"
              size={18}
              color={COLORS.gray}
            />
          }
        />
        <SettingItem
          onPress={() => {}}
          title="Privacy Policy"
          Icon={
            <Ionicons
              name="document-text-outline"
              size={18}
              color={COLORS.gray}
            />
          }
        />
      </Card>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 20 }}
        onPress={logout}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.red,
            textDecorationLine: "underline",
            fontSize: 16,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: FONTS.regular,
          color: COLORS.gray,
          padding: 10,
          textAlign: "center",
        }}
      >
        {Constants.default.expoConfig?.name}
        {" version: "}
        {Constants.default.expoConfig?.version}
      </Text>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
});
