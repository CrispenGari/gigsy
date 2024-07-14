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
import { Stack, useLocalSearchParams } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import BouncyCheckbox from "react-native-bouncy-checkbox";

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
  const { os } = usePlatform();
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

  const publishJob = () => {};

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderBackButton title={from!} />,
          headerTitle: "Payments",
        }}
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
                    clear
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
                  next
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
