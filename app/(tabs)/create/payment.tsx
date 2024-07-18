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
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useCreateFormStore } from "@/src/store/createFormStore";
import Spinner from "react-native-loading-spinner-overlay";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/meStore";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";

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
  const publishMutation = useMutation(api.api.job.publish);
  const findUserMutation = useMutation(api.api.user.findUserOrCreateOne);
  const { me } = useMeStore();
  const { os } = usePlatform();
  const { setPayment, form, clearForm } = useCreateFormStore();
  const { from } = useLocalSearchParams<{ from: string }>();
  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    type: "part-time",
    salaryRange: { max: "", min: "" },
  });

  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const gap = useSharedValue(0);
  const { settings } = useSettingsStore();
  React.useEffect(() => {
    const hasValues = Object.values(state.salaryRange).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state.salaryRange]);

  const clear = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      type: "part-time",
      salaryRange: { min: "", max: "" },
    }));
    setPayment({
      type: "part-time",
      salaryRange: { min: "", max: "" },
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

  const publishJob = async () => {
    if (settings.haptics) {
      await onImpact();
    }
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
    const { error, loading, ...rest } = state;
    setPayment(rest);
    const { _id } = await findUserMutation({
      email: me.email,
      firstName: me.firstName || "",
      lastName: me.lastName || "",
      id: me.id,
      image: me.imageUrl,
    });

    if (!!!_id)
      return setState((s) => ({
        ...s,
        error: "Failed to find the user in our gigsy system.",
        loading: false,
      }));
    const { success } = await publishMutation({
      ...form,
      userId: _id,
      salaryRange: {
        max: state.salaryRange.max,
        min: state.salaryRange.min,
      },
      type: state.type,
    });
    if (success) {
      setState((s) => ({ ...s, loading: false }));
      clearForm();
      router.replace({
        pathname: "/(tabs)/create",
        params: {
          action: "published",
        },
      });
    } else {
      setState((s) => ({
        ...s,
        error: "Failed to publish your job advert try again.",
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      type: form.type,
      salaryRange: {
        min: form.salaryRange.min ?? "",
        max: form.salaryRange.max,
      },
    }));
  }, [form]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderBackButton title={from!} />,
          headerTitle: "Payments",
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
                onPress={async (isChecked: boolean) => {
                  if (settings.haptics) {
                    await onImpact();
                  }
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
                onPress={publishJob}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 20,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Publish
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
