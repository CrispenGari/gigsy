import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CreateHeader from "@/src/components/CreateHeader/CreateHeader";
import { usePlatform } from "@/src/hooks";
import { COLORS, FONTS } from "@/src/constants";
import Card from "@/src/components/Card/Card";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import CreateInput from "@/src/components/Inputs/CreateInput";
import SkillsBottomSheet from "@/src/components/BottomSheets/SkillsBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import BenefitsBottomSheet from "@/src/components/BottomSheets/BenefitsBottomSheet";
import EducationBottomSheet from "@/src/components/BottomSheets/EducationBottomSheet";

type StateType = {
  description: string;
  error: string;
  loading: boolean;
  title: string;
  company: string;
  location: string;
  skills: string[];
  educationLevels: string[];
  benefits: string[];
  experience: string[];
  salaryRange: {
    min: string;
    max: string;
  };
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyDescription: string;
};
const Create = () => {
  const { os } = usePlatform();
  const skillsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const benefitsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const educationBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const experienceBottomSheetRef = React.useRef<BottomSheetModal>(null);

  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    title: "",
    description: "",
    company: "",
    location: "",
    skills: [],
    salaryRange: { min: "", max: "" },
    type: "part-time",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    companyDescription: "",
    benefits: [],
    educationLevels: [],
    experience: [],
  });

  return (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle: { display: "none" },
          header: (props) => <CreateHeader {...props} />,
        }}
      />
      <SkillsBottomSheet
        ref={skillsBottomSheetRef}
        onChangeValue={(skills) =>
          setState((s) => ({
            ...s,
            skills,
          }))
        }
      />
      <BenefitsBottomSheet
        ref={benefitsBottomSheetRef}
        onChangeValue={(benefits) =>
          setState((s) => ({
            ...s,
            benefits,
          }))
        }
      />
      <EducationBottomSheet
        ref={benefitsBottomSheetRef}
        onChangeValue={(educationLevels) =>
          setState((s) => ({
            ...s,
            educationLevels,
          }))
        }
      />
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontFamily: FONTS.bold }}>Basic Information</Text>
        <Card style={{ marginTop: 5, marginBottom: 10 }}>
          <>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CreateInput
                label="Job Title"
                placeholder="Job Title"
                Icon={
                  <TouchableOpacity>
                    <MaterialIcons
                      name="perm-identity"
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                value={state.title}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, title: text }))
                }
                containerStyle={{ flex: 1 }}
              />
              <CreateInput
                label="Company Name"
                placeholder="Company Name"
                Icon={
                  <TouchableOpacity>
                    <Ionicons
                      name="accessibility-outline"
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                value={state.company}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, company: text }))
                }
                containerStyle={{ flex: 1 }}
              />
            </View>

            <CreateInput
              label="Job Description"
              placeholder="Job Description"
              Icon={
                <TouchableOpacity>
                  <MaterialIcons name="animation" size={16} color="black" />
                </TouchableOpacity>
              }
              value={state.title}
              onChangeText={(text) => setState((s) => ({ ...s, title: text }))}
              containerStyle={{ marginTop: 5 }}
              inputStyle={{ maxHeight: 80 }}
              inputContainerStyle={{ alignItems: "flex-start" }}
              multiline={true}
              iconStyle={{ marginTop: 5 }}
            />
            <CreateInput
              label="Company Description"
              placeholder="Company Description"
              Icon={
                <TouchableOpacity>
                  <Ionicons name="git-commit-outline" size={16} color="black" />
                </TouchableOpacity>
              }
              value={state.companyDescription}
              onChangeText={(text) =>
                setState((s) => ({ ...s, companyDescription: text }))
              }
              containerStyle={{ marginTop: 5 }}
              inputStyle={{ maxHeight: 80 }}
              inputContainerStyle={{ alignItems: "flex-start" }}
              multiline={true}
              iconStyle={{ marginTop: 5 }}
            />
          </>
        </Card>
        <Text style={{ fontFamily: FONTS.bold }}>Payment Information</Text>
        <Card style={{ marginTop: 5, marginBottom: 10 }}>
          <>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CreateInput
                label="Minimum"
                placeholder="0.00"
                Icon={
                  <TouchableOpacity>
                    <Text style={{ fontFamily: FONTS.bold }}>R</Text>
                  </TouchableOpacity>
                }
                value={state.salaryRange.min}
                onChangeText={(text) =>
                  setState((s) => ({
                    ...s,
                    salaryRange: { ...s.salaryRange, min: text },
                  }))
                }
                containerStyle={{ flex: 1 }}
                keyboardType="decimal-pad"
              />
              <CreateInput
                label="Maximum"
                placeholder="10 000"
                Icon={
                  <TouchableOpacity>
                    <Text style={{ fontFamily: FONTS.bold }}>R</Text>
                  </TouchableOpacity>
                }
                value={state.salaryRange.max}
                onChangeText={(text) =>
                  setState((s) => ({
                    ...s,
                    salaryRange: { ...s.salaryRange, max: text },
                  }))
                }
                containerStyle={{ flex: 1 }}
                keyboardType="decimal-pad"
              />
            </View>
          </>
        </Card>

        <Text style={{ fontFamily: FONTS.bold }}>Skills Required</Text>
        <Card style={styles.list}>
          <TouchableOpacity
            onPress={() => skillsBottomSheetRef.current?.present()}
            style={styles.iconBtn}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>

          <FlatList
            bounces={false}
            data={state.skills}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons
                  name="clean-hands"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </Card>

        <Text style={{ fontFamily: FONTS.bold }}>Job Benefits</Text>
        <Card style={styles.list}>
          <TouchableOpacity
            onPress={() => benefitsBottomSheetRef.current?.present()}
            style={styles.iconBtn}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>

          <FlatList
            bounces={false}
            data={state.benefits}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons
                  name="clean-hands"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </Card>

        <Text style={{ fontFamily: FONTS.bold }}>Experience Required</Text>
        <Card style={styles.list}>
          <TouchableOpacity
            onPress={() => experienceBottomSheetRef.current?.present()}
            style={styles.iconBtn}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>

          <FlatList
            bounces={false}
            data={state.experience}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons
                  name="clean-hands"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </Card>

        <Text style={{ fontFamily: FONTS.bold }}>Qualifications</Text>
        <Card style={styles.list}>
          <TouchableOpacity
            onPress={() => educationBottomSheetRef.current?.present()}
            style={styles.iconBtn}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>

          <FlatList
            bounces={false}
            data={state.educationLevels}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons
                  name="clean-hands"
                  size={16}
                  color={COLORS.gray}
                />
                <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </Card>
        <Text style={{ fontFamily: FONTS.bold }}>Contact Information</Text>
        <Card style={{ marginTop: 5, marginBottom: 10 }}>
          <>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CreateInput
                label="Contact Name"
                placeholder="Contact Name"
                Icon={
                  <TouchableOpacity>
                    <MaterialIcons
                      name="person-outline"
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                value={state.contactName}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, contactName: text }))
                }
                containerStyle={{ flex: 1 }}
              />
              <CreateInput
                label="Email"
                placeholder="Email"
                keyboardType="email-address"
                Icon={
                  <TouchableOpacity>
                    <Ionicons name="mail-outline" size={16} color="black" />
                  </TouchableOpacity>
                }
                value={state.contactEmail}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, contactEmail: text }))
                }
                containerStyle={{ flex: 1 }}
              />
            </View>

            <CreateInput
              label="Contact Phone Number"
              placeholder="Contact Phone Number"
              Icon={
                <TouchableOpacity>
                  <Text style={{ fontFamily: FONTS.bold }}>+27</Text>
                </TouchableOpacity>
              }
              value={state.contactPhone}
              onChangeText={(text) =>
                setState((s) => ({ ...s, contactPhone: text }))
              }
              containerStyle={{ marginTop: 5 }}
              keyboardType="phone-pad"
            />
          </>
        </Card>
        <Card style={{ marginTop: 10, marginBottom: 10 }}>
          <>
            <Text style={{ fontFamily: FONTS.bold }}>Controls.</Text>
            {/* i will put animated buttons */}
          </>
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 40,
  },
  list: {
    marginTop: 5,
    gap: 5,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default Create;
