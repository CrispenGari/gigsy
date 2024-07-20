import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Card from "@/src/components/Card/Card";
import * as Linking from "expo-linking";
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
import { onFetchUpdateAsync, onImpact, rateApp } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

const Profile = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const { settings, restore } = useSettingsStore();
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clearForm } = useCreateFormStore();
  const { clear } = useWishlistStore();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  const logout = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    signOut().then(() => {
      destroy();
      reset();
      clearForm();
      clear();
      restore();
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
      <ProfileCard isLoading={!isLoaded} />
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/pi");
          }}
          title="Personal Information"
          Icon={
            <Ionicons name="person-outline" size={18} color={COLORS.gray} />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/notifications");
          }}
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/location");
          }}
          title="Location Settings"
          Icon={
            <Ionicons name="location-outline" size={18} color={COLORS.gray} />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/sound-haptics");
          }}
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await onFetchUpdateAsync();
          }}
          title="Check for Updates"
          Icon={<MaterialIcons name="update" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/storage");
          }}
          title="Storage and Network"
          Icon={
            <MaterialIcons
              name="compare-arrows"
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/feedback");
          }}
          title="Give us Feedback"
          Icon={<MaterialIcons name="feedback" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await Share.share(
              {
                url: "https://github.com/CrispenGari/gigsy",
                message:
                  "An awesome app for job hunting: Download at https://github.com/CrispenGari/gigsy",
                title: "Share Gigsy with a Friend",
              },
              { dialogTitle: "Share Gigsy", tintColor: COLORS.green }
            );
          }}
          title="Tell a friend"
          Icon={<Ionicons name="heart-outline" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await rateApp();
          }}
          title="Rate gigys"
          Icon={<Ionicons name="star-outline" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/help");
          }}
          title="How does gigsy works"
          Icon={<Ionicons name="help" size={18} color={COLORS.gray} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            const res = await Linking.canOpenURL(
              "https://github.com/CrispenGari/gigsy/issues"
            );
            if (res) {
              Linking.openURL("https://github.com/CrispenGari/gigsy/issues");
            }
          }}
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/tnc");
          }}
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
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/pp");
          }}
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
