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
import { router, Stack, useLocalSearchParams } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { isValidEmail } from "@crispengari/regex-validator";

type StateType = {
  error: string;
  loading: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};
const Page = () => {
  const { setContact, form } = useCreateFormStore();
  const { os } = usePlatform();
  const { from } = useLocalSearchParams<{ from: string }>();
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

  const clear = () => {
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    }));
    setContact({ contactEmail: "", contactName: "", contactPhone: "" });
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

  const saveAndGoToNext = () => {
    if (state.contactName.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "The Contact name must contain at least 3 characters.",
      }));
    }

    if (!isValidEmail(state.contactEmail.trim())) {
      return setState((s) => ({
        ...s,
        error: "The email address is invalid.",
      }));
    }

    const { error, loading, ...rest } = state;
    setContact(rest);
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    }));
    router.navigate({
      pathname: "/(tabs)/create/other",
      params: {
        from: "Contact",
      },
    });
  };

  React.useEffect(() => {
    const { error, loading, ...rest } = state;
    const hasValues = Object.values(rest).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state]);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      contactEmail: form.contactEmail,
      contactName: form.contactName,
      contactPhone: form.contactPhone ?? "",
    }));
  }, [form]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderBackButton title={from!} />,
          headerTitle: "Contact Information",
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
                onPress={saveAndGoToNext}
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
