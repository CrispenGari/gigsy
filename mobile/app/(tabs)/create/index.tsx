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
import { useRouter } from "expo-router";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { TLoc, useLocationStore } from "@/src/store/locationStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LocationPickerBottomSheet from "@/src/components/BottomSheets/LocationPickerBottomSheet";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

type StateType = {
  error: string;
  loading: boolean;
  title: string;
  description: string;
  company: string;
  companyDescription: string;
  location: TLoc;
};
const Page = () => {
  const locationBottomSheetRef = React.useRef<BottomSheetModal>(null);

  const { location } = useLocationStore();
  const { os } = usePlatform();
  const router = useRouter();
  const { setBasic, form } = useCreateFormStore();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    title: form.title,
    description: form.description,
    company: form.company,
    companyDescription: form.companyDescription ?? "",
    location: {
      lat: 51.507351,
      lon: -0.127758,
      address: {
        city: null,
        country: null,
        district: null,
        isoCountryCode: null,
        name: null,
        postalCode: null,
        region: null,
        street: null,
        streetNumber: null,
      },
    },
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
      title: "",
      description: "",
      company: "",
      companyDescription: "",
    }));
    setBasic({
      company: "",
      description: "",
      title: "",
      companyDescription: "",
      location,
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
    if (state.title.trim().length < 5) {
      return setState((s) => ({
        ...s,
        error: "The job title should contain at least 5 characters.",
      }));
    }
    if (state.company.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "Company name should contain at least 3 characters.",
      }));
    }
    if (state.description.trim().length < 30) {
      return setState((s) => ({
        ...s,
        error: "The job description should contain at least 30 characters.",
      }));
    }
    const { error, loading, ...rest } = state;
    setBasic(rest);

    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      title: "",
      description: "",
      company: "",
      companyDescription: "",
    }));
    router.navigate({
      pathname: "/(tabs)/create/contact" as any,
      params: {
        from: "Basic",
      },
    });
  };

  const selectLocation = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    locationBottomSheetRef.current?.present();
  };

  React.useEffect(() => {
    const { error, loading, location, ...rest } = state;
    const hasValues = Object.values(rest).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state]);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      title: form.title,
      description: form.description,
      company: form.company,
      companyDescription: form.companyDescription ?? "",
      location: form.location.address.isoCountryCode ? form.location : location,
    }));
  }, [form, location]);

  return (
    <>
      <LocationPickerBottomSheet
        initialState={location}
        ref={locationBottomSheetRef}
        onChangeValue={(value) => {
          setState((s) => ({ ...s, location: value }));
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
                  label="Job Title(*)"
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
                  label="Company Name(*)"
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
                label="Job Description(*)"
                placeholder="Job Description"
                Icon={
                  <TouchableOpacity>
                    <MaterialIcons name="animation" size={16} color="black" />
                  </TouchableOpacity>
                }
                value={state.description}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, description: text }))
                }
                containerStyle={{ marginTop: 5 }}
                inputStyle={{ maxHeight: 80 }}
                inputContainerStyle={{ alignItems: "flex-start" }}
                multiline={true}
                iconStyle={{ marginTop: 5 }}
              />
              <CreateInput
                label="Location(*)"
                placeholder="Location"
                editable={false}
                onIconPress={selectLocation}
                Icon={
                  <TouchableOpacity>
                    <Ionicons name="location-outline" size={16} color="black" />
                  </TouchableOpacity>
                }
                value={state.location.address.city || ""}
                onChangeText={(text) =>
                  setState((s) => ({
                    ...s,
                    location: {
                      ...s.location,
                      address: {
                        ...s.location.address,
                        city: text,
                      },
                    },
                  }))
                }
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
                    <Ionicons
                      name="git-commit-outline"
                      size={16}
                      color="black"
                    />
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
          <Card
            style={{
              marginTop: 5,
              marginBottom: 10,
            }}
          >
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
