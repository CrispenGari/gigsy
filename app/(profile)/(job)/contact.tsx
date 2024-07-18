import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import CreateInput from "@/src/components/Inputs/CreateInput";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePlatform } from "@/src/hooks";
import { Keyboard } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { isValidEmail } from "@crispengari/regex-validator";
import { useMeStore } from "@/src/store/meStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Spinner from "react-native-loading-spinner-overlay";

import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

type StateType = {
  error: string;
  loading: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};
const Page = () => {
  const { settings } = useSettingsStore();
  const { os } = usePlatform();
  const { me } = useMeStore();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: Id<"jobs"> }>();
  const updateJobMutation = useMutation(api.api.job.update);
  const job = useQuery(api.api.job.getById, { id: id! });
  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
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
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    }));
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

  const update = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!job) return;
    setState((s) => ({
      ...s,
      loading: true,
    }));
    if (state.contactName.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "The Contact name must contain at least 3 characters.",
        loading: false,
      }));
    }
    if (!isValidEmail(state.contactEmail.trim())) {
      return setState((s) => ({
        ...s,
        error: "The email address is invalid.",
        loading: false,
      }));
    }

    const { _creationTime, _id, userId, ...rest } = job;
    const { success } = await updateJobMutation({
      id: job._id,
      values: {
        ...rest,
        contactEmail: state.contactEmail,
        contactName: state.contactName,
        contactPhone: state.contactPhone,
      },
    });
    if (success) {
      setState((s) => ({
        ...s,
        error: "",
        loading: false,
      }));
      router.back();
    } else {
      setState((s) => ({
        ...s,
        error: "Failed to update the job advert.",
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    const { error, loading, ...rest } = state;
    const hasValues = Object.values(rest).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state]);

  React.useEffect(() => {
    if (!!job) {
      setState((s) => ({
        ...s,
        contactEmail: job.contactEmail || me?.email || "",
        contactName: job.contactName,
        contactPhone: job.contactPhone ?? "",
      }));
    }
  }, [job]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Contact Information",
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
      <Spinner visible={state.loading} animation="fade" />
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
                Field marked (*) are required.
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <CreateInput
                  label="Contact Name (*)"
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
                  label="Contact Email(*)"
                  placeholder="Contact Email"
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
                onPress={update}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 20,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Update
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
