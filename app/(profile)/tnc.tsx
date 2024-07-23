import { Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
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
          headerTitle: "Terms of Service",
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
          Terms of Service
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>1. Introduction</Text>
            <Text style={styles.bulletPoint}>
              Welcome to the Gigsy App. By using our app, you agree to these
              terms of service. Please read them carefully.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>2. User Accounts</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Account Creation:</Text> Users must
              provide accurate information when creating an account.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Account Security:</Text> Users are
              responsible for maintaining the security of their account and
              password.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>3. Job Listings</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Job Creation:</Text> Users can create
              job listings based on their location.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Job Accuracy:</Text> Users must ensure
              that all job details are accurate and up-to-date.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>4. Privacy</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Personal Information:</Text> We value
              your privacy and will protect your personal information as
              described in our Privacy Policy.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Data Sharing:</Text> Your email and
              city will be visible to other users upon publishing a job.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>5. Messaging</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Encryption:</Text> Messages between
              users are encrypted to ensure privacy.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>6. Modifications</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Changes to Terms:</Text> We may modify
              these terms at any time. Users will be notified of significant
              changes.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>7. Termination</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Termination of Accounts:</Text> We
              reserve the right to terminate accounts that violate these terms.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Effect of Termination:</Text> Upon
              termination, users will lose access to their accounts and all
              associated data.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>8. Contact Us</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Support:</Text> If you have any
              questions or concerns, please contact our support team.
            </Text>
          </Card>
        </Animated.View>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>10. Contact Details</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Support Team Email:</Text>{" "}
              crispengari@gmail.com
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
    maxWidth: 400,
    borderRadius: 5,
    width: "100%",
    paddingVertical: 20,
    alignSelf: "center",
    marginBottom: 10,
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
