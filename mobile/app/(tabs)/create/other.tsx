import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePlatform } from "@/src/hooks";
import { Keyboard } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router, Stack, useLocalSearchParams } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BenefitsBottomSheet from "@/src/components/BottomSheets/BenefitsBottomSheet";
import EducationBottomSheet from "@/src/components/BottomSheets/EducationBottomSheet";
import ExperienceBottomSheet from "@/src/components/BottomSheets/ExperienceBottomSheet";
import SkillsBottomSheet from "@/src/components/BottomSheets/SkillsBottomSheet";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

type StateType = {
  error: string;
  loading: boolean;
  skills: string[];
  educationLevels: string[];
  benefits: string[];
  experience: string[];
};
const Page = () => {
  const { setAdditional, form } = useCreateFormStore();
  const { os } = usePlatform();
  const { settings } = useSettingsStore();
  const skillsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const benefitsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const educationBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const experienceBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { from } = useLocalSearchParams<{ from: string }>();
  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    skills: [],
    benefits: [],
    educationLevels: [],
    experience: [],
  });
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const gap = useSharedValue(0);

  const clear = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      skills: [],
      benefits: [],
      educationLevels: [],
      experience: [],
    }));

    setAdditional({
      benefits: [],
      educationLevels: [],
      experience: [],
      skills: [],
    });
  };

  const animatedWidth = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
    };
  });
  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const gapStyle = useAnimatedStyle(() => {
    return {
      gap: gap.value,
    };
  });

  const saveAndGoToNext = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (state.skills.length === 0) {
      return setState((s) => ({
        ...s,
        error: "You should at least add 1 job skill.",
      }));
    }
    if (state.experience.length === 0) {
      return setState((s) => ({
        ...s,
        error: "You should at least add 1 job experience.",
      }));
    }
    if (state.educationLevels.length === 0) {
      return setState((s) => ({
        ...s,
        error: "You should at least add 1 job qualification.",
      }));
    }
    const { error, loading, ...rest } = state;
    setAdditional(rest);

    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      skills: [],
      benefits: [],
      educationLevels: [],
      experience: [],
    }));
    router.navigate({
      pathname: "/(tabs)/create/payment",
      params: {
        from: "Additional Info",
      },
    });
  };

  React.useEffect(() => {
    const { error, loading, ...rest } = state;
    const hasValues = Object.values(rest)
      .map((s) => s.length)
      .filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state]);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      skills: form.skills,
      benefits: form.benefits,
      educationLevels: form.educationLevels,
      experience: form.experience,
    }));
  }, [form]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderBackButton title={from!} />,
          headerTitle: "Additional Information",
        }}
      />
      <SkillsBottomSheet
        ref={skillsBottomSheetRef}
        initialState={state.skills}
        onChangeValue={(skills) =>
          setState((s) => ({
            ...s,
            skills,
          }))
        }
      />
      <BenefitsBottomSheet
        initialState={state.benefits}
        ref={benefitsBottomSheetRef}
        onChangeValue={(benefits) =>
          setState((s) => ({
            ...s,
            benefits,
          }))
        }
      />
      <EducationBottomSheet
        initialState={state.educationLevels}
        ref={educationBottomSheetRef}
        onChangeValue={(educationLevels) =>
          setState((s) => ({
            ...s,
            educationLevels,
          }))
        }
      />
      <ExperienceBottomSheet
        initialState={state.experience}
        ref={experienceBottomSheetRef}
        onChangeValue={(experience) =>
          setState((s) => ({
            ...s,
            experience,
          }))
        }
      />
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ padding: 10, flex: 1 }}
          behavior={os === "ios" ? "padding" : "height"}
        >
          <Card style={{ marginTop: 5, marginBottom: 10 }}>
            <>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.gray,
                  marginBottom: 10,
                }}
              >
                Field marked (*) are required to have at least 1 value.
              </Text>

              <Text style={{ fontFamily: FONTS.bold }}>Skills Required(*)</Text>
              <Card style={styles.list}>
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    skillsBottomSheetRef.current?.present();
                  }}
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
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    benefitsBottomSheetRef.current?.present();
                  }}
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
                      <Ionicons
                        name="bag-add-outline"
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                />
              </Card>

              <Text style={{ fontFamily: FONTS.bold }}>
                Experience Required(*)
              </Text>
              <Card style={styles.list}>
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    experienceBottomSheetRef.current?.present();
                  }}
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
                      <Ionicons
                        name="star-outline"
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                />
              </Card>

              <Text style={{ fontFamily: FONTS.bold }}>
                Qualifications Required(*)
              </Text>
              <Card style={styles.list}>
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    educationBottomSheetRef.current?.present();
                  }}
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
                        name="padding"
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={{ fontFamily: FONTS.bold }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                />
              </Card>

              <Text
                style={{
                  fontFamily: FONTS.regular,
                  color: COLORS.red,
                  marginTop: 10,
                }}
              >
                {state.error}
              </Text>
            </>
          </Card>
          <Card style={{ marginTop: 5, marginBottom: 10 }}>
            <Animated.View
              style={[
                gapStyle,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                  height: 50,
                },
              ]}
            >
              <Animated.View
                style={[
                  animatedWidth,
                  {
                    backgroundColor: COLORS.semiGray,
                    alignItems: "center",
                    borderRadius: 5,
                  },
                ]}
              >
                <TouchableOpacity style={{ padding: 10 }} onPress={clear}>
                  <Animated.Text
                    style={[
                      animatedText,
                      {
                        color: COLORS.black,
                        fontSize: 20,
                        fontFamily: FONTS.bold,
                      },
                    ]}
                  >
                    Clear
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.green,
                  padding: 10,
                  alignItems: "center",
                  borderRadius: 5,
                  maxWidth: 400,
                }}
                onPress={saveAndGoToNext}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 20,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Card>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Page;

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
