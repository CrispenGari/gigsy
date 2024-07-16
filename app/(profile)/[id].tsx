import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Card from "@/src/components/Card/Card";
import Spinner from "react-native-loading-spinner-overlay";

const Page = () => {
  const { id } = useLocalSearchParams<{
    id: Id<"jobs">;
  }>();
  const job = useQuery(api.api.job.getById, { id: id! });
  const router = useRouter();
  const [state, setState] = React.useState({
    loading: false,
  });
  const deleteMutation = useMutation(api.api.job.deleteById);

  const deleteJob = async () => {
    setState((s) => ({ ...s, loading: true }));
    const { success } = await deleteMutation({ id: id! });
    setState((s) => ({ ...s, loading: false }));
    if (success) {
      router.back();
    } else {
      Alert.alert(
        "Failed Operation",
        "Failed to delete a Job Advert from gigsy."
      );
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: job?.title,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),
          // headerTransparent: true,
        }}
      />
      <Spinner visible={state.loading} animation="fade" />
      <Animated.ScrollView
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 100,
        }}
        style={{}}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>Basic Information</Text>
        <Card
          style={{
            padding: 10,
            maxWidth: 400,
            borderRadius: 5,
            width: "100%",
          }}
        >
          <Animated.View
            entering={SlideInLeft.duration(100).delay(100)}
            style={{}}
          >
            <Animated.Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              Position: {job?.title}
            </Animated.Text>
            <Text style={{ fontFamily: FONTS.regular }}>
              {job?.description}
            </Text>
            <Text
              style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 10 }}
            >
              Company: {job?.company}
            </Text>
            <Text style={{ fontFamily: FONTS.regular }}>
              {job?.companyDescription ||
                "No company or individual description provided."}
            </Text>
            <Text
              style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 10 }}
            >
              Location: {job?.location.address.city}
            </Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
              {job?.location.address.streetNumber}{" "}
              {job?.location.address.street}, {job?.location.address.district}
            </Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.black }}>
              {job?.location.address.country} (
              {job?.location.address.isoCountryCode?.toLocaleLowerCase()})
            </Text>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.green,
                padding: 10,
                alignItems: "center",
                borderRadius: 5,
                maxWidth: 200,
                marginTop: 20,
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 20,
                  fontFamily: FONTS.bold,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Card>

        <Text style={styles.headerText}>Contact Information</Text>
        <Card
          style={{
            padding: 10,
            maxWidth: 400,
            borderRadius: 5,
            width: "100%",
          }}
        >
          <Animated.View
            entering={SlideInLeft.duration(100).delay(100)}
            style={{}}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                  Contact Name
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  {job?.contactName}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                  }}
                >
                  Contact Email
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  {job?.contactEmail}
                </Text>
              </View>
            </View>

            <Text
              style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 10 }}
            >
              Contact Phone Number
            </Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
              {job?.contactPhone || "None."}
            </Text>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.green,
                padding: 10,
                alignItems: "center",
                borderRadius: 5,
                maxWidth: 200,
                marginTop: 20,
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 20,
                  fontFamily: FONTS.bold,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Card>

        <Text style={styles.headerText}>Job Payment Information</Text>
        <Card
          style={{
            padding: 10,
            maxWidth: 400,
            borderRadius: 5,
            width: "100%",
          }}
        >
          <Animated.View
            entering={SlideInLeft.duration(100).delay(100)}
            style={{}}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              Job Type
            </Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
              {job?.type === "full-time" ? "Full Time" : "Part Time"}
            </Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Minimum Salary
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  R {job?.salaryRange.min || 0}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Maximum Salary
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  R {job?.salaryRange.max}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.green,
                padding: 10,
                alignItems: "center",
                borderRadius: 5,
                maxWidth: 200,
                marginTop: 20,
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 20,
                  fontFamily: FONTS.bold,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Card>

        <Text style={styles.headerText}>Additional Information</Text>
        <Card
          style={{
            padding: 10,
            maxWidth: 400,
            borderRadius: 5,
            width: "100%",
          }}
        >
          <Animated.View
            entering={SlideInLeft.duration(100).delay(100)}
            style={{}}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              Skills Required
            </Text>
            {job?.skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={{ flexDirection: "row", gap: 10 }}
              >
                <MaterialIcons
                  name="clean-hands"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{skill}</Text>
              </TouchableOpacity>
            ))}
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              Job Benefits
            </Text>
            {job?.benefits?.map((bene) => (
              <TouchableOpacity
                key={bene}
                style={{ flexDirection: "row", gap: 10 }}
              >
                <Ionicons
                  name="bag-add-outline"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{bene}</Text>
              </TouchableOpacity>
            ))}
            <Text
              style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 10 }}
            >
              Job Experience
            </Text>
            {job?.experience.map((exp) => (
              <View key={exp} style={{ flexDirection: "row", gap: 10 }}>
                <Ionicons name="star-outline" size={16} color={COLORS.gray} />
                <Text style={{ fontFamily: FONTS.bold }}>{exp}</Text>
              </View>
            ))}
            <Text
              style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 10 }}
            >
              Education Qualifications
            </Text>
            {job?.educationLevels.map((level) => {
              return (
                <View key={level} style={{ flexDirection: "row", gap: 10 }}>
                  <MaterialIcons name="padding" size={16} color={COLORS.gray} />
                  <Text style={{ fontFamily: FONTS.bold }}>{level}</Text>
                </View>
              );
            })}

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.green,
                padding: 10,
                alignItems: "center",
                borderRadius: 5,
                maxWidth: 200,
                marginTop: 20,
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 20,
                  fontFamily: FONTS.bold,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Card>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: COLORS.red,
            padding: 10,
            alignItems: "center",
            borderRadius: 5,
            maxWidth: 200,
            marginTop: 40,
            alignSelf: "center",
            width: "100%",
          }}
          onPress={deleteJob}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontFamily: FONTS.bold,
            }}
          >
            Delete Advert
          </Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
  row: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
