import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Card from "@/src/components/Card/Card";
import Animated from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/meStore";
import ProfileCard from "@/src/components/ProfileComponents/ProfileCard";
import SettingItem from "@/src/components/ProfileComponents/SettingItem";

const Profile = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate("/login");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: headerHeight }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
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
          onPress={() => {}}
          title="Personal Information"
          Icon={
            <Ionicons name="person-outline" size={18} color={COLORS.gray} />
          }
        />
        <SettingItem
          onPress={() => {}}
          title="Login and Security"
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
          title="How does gisgy works"
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
