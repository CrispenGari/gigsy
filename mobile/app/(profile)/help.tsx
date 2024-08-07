import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/src/components/Card/Card";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";

const Page = () => {
  const { settings } = useSettingsStore();
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Help",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 20,
            marginLeft: 10,
          }}
        >
          Features
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>User Authentication</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Login with Socials:</Text> Users can
              log in using their social media accounts.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Email Login/Registration:</Text> Users
              can log in or register with their email.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>Job Management</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Create Job:</Text> Users can create a
              new job based on their location.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>View Jobs:</Text> Users can view the
              list of jobs without logging in.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Add to Wishlist:</Text> Users can add
              jobs to their wishlist for future reference.
            </Text>
          </Card>
        </Animated.View>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>User Profile</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Update Profile:</Text> Users can
              update their password and profile details.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Location Settings:</Text> Users can
              update their location settings.
            </Text>
          </Card>
        </Animated.View>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>Job Details</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Publisher Information:</Text> Upon
              publishing a job, other users can view the publisher's email and
              city (but not the exact location).
            </Text>
          </Card>
        </Animated.View>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>Messaging</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>End-to-End Encryption:</Text> Messages
              between users during negotiations are encrypted for privacy.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    padding: 10,
    maxWidth: 500,
    alignSelf: "flex-start",
    borderRadius: 5,
    width: "100%",
    paddingVertical: 20,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: FONTS.regular,
  },
  bold: {
    fontFamily: FONTS.bold,
  },
});
