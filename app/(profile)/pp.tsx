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
          headerTitle: "Privacy Policy",
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
          Privacy Policy
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>1. Introduction</Text>
            <Text style={styles.bulletPoint}>
              Welcome to the Gigsy App. We value your privacy and are committed
              to protecting your personal information.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>2. Information Collection</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Personal Information:</Text> We
              collect personal information that you provide to us, such as your
              name, email address, profile avatar, names, and location.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Usage Data:</Text> We collect
              information on how you use our app, including the features you use
              and the actions you take.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>3. Use of Information</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>To Provide Services:</Text> We use
              your information to provide and improve our services.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Communication:</Text> We use your
              information to communicate with you about your account and our
              services.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>4. Sharing of Information</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>With Other Users:</Text> Your email,
              image, names and city will be visible to other users upon
              publishing a job.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>With Service Providers:</Text> We may
              share your information with service providers who help us operate
              our app.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>5. Data Security</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Protection Measures:</Text> We
              implement appropriate security measures to protect your
              information.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Data Encryption:</Text> We use
              encryption to protect your data during transmission.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInRight.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>6. User Rights</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Access and Update:</Text> You can
              access and update your personal information through your account
              settings.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Deletion:</Text> You can request the
              deletion of your account and personal information.
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>
              7. Changes to Privacy Policy
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Modifications:</Text> We may update
              this privacy policy from time to time. Users will be notified of
              significant changes.
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
            <Text style={styles.sectionHeader}>9. Contact Details</Text>
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
