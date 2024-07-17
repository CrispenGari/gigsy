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

import { usePlatform } from "@/src/hooks";
import { Keyboard } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Spinner from "react-native-loading-spinner-overlay";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/meStore";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "@/convex/_generated/dataModel";

type StateType = {
  error: string;
  loading: boolean;
  salaryRange: {
    min: string;
    max: string;
  };
  type: "part-time" | "full-time";
};
const Page = () => {
  const router = useRouter();
  const { me } = useMeStore();
  const { os } = usePlatform();
  const { id } = useLocalSearchParams<{ id: Id<"jobs"> }>();
  const updateJobMutation = useMutation(api.api.job.update);
  const job = useQuery(api.api.job.getById, { id: id! });
  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    type: "part-time",
    salaryRange: { max: "", min: "" },
  });

  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const gap = useSharedValue(0);
  React.useEffect(() => {
    const hasValues = Object.values(state.salaryRange).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state.salaryRange]);

  const clear = () => {
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      type: "part-time",
      salaryRange: { min: "", max: "" },
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
    if (!!!job) return;
    setState((s) => ({
      ...s,
      loading: true,
    }));
    if (!!!state.salaryRange.max.trim().length) {
      return setState((s) => ({
        ...s,
        error: "The maximum salary should be set.",
        loading: false,
      }));
    }
    if (!!!me) {
      return setState((s) => ({
        ...s,
        error: "You are not authenticated.",
        loading: false,
      }));
    }

    const { _creationTime, _id, userId, ...rest } = job;
    const { success } = await updateJobMutation({
      id: job._id,
      values: {
        ...rest,
        salaryRange: { min: state.salaryRange.min, max: state.salaryRange.max },
        type: state.type,
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
    if (!!job) {
      setState((s) => ({
        ...s,
        type: job.type,
        salaryRange: {
          min: job.salaryRange.min ?? "",
          max: job.salaryRange.max,
        },
      }));
    }
  }, [job]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Payment Information",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={() => router.back()}
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
                  label="Maximum(*)"
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

              <BouncyCheckbox
                isChecked={state.type === "part-time"}
                size={18}
                fillColor={COLORS.gray}
                unFillColor={COLORS.white}
                textComponent={
                  <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                    {state.type === "full-time"
                      ? "It is a full time job."
                      : "It is a part time job."}
                  </Text>
                }
                iconStyle={{
                  borderColor: COLORS.tertiary,
                  backgroundColor: COLORS.gray,
                  width: 18,
                  height: 18,
                  borderRadius: 2,
                }}
                innerIconStyle={{ borderWidth: 0, padding: 2 }}
                onPress={(isChecked: boolean) => {
                  setState((s) => ({
                    ...s,
                    type: isChecked ? "part-time" : "full-time",
                  }));
                }}
                style={{ gap: 5, marginTop: 10 }}
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
