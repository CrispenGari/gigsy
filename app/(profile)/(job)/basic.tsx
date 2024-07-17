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
import { TLoc, useLocationStore } from "@/src/store/locationStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LocationPickerBottomSheet from "@/src/components/BottomSheets/LocationPickerBottomSheet";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "react-native-loading-spinner-overlay";
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
  const { id } = useLocalSearchParams<{ id: Id<"jobs"> }>();
  const job = useQuery(api.api.job.getById, { id: id! });
  const updateJobMutation = useMutation(api.api.job.update);
  const { location } = useLocationStore();
  const { os } = usePlatform();
  const router = useRouter();

  const [state, setState] = React.useState<StateType>({
    error: "",
    loading: false,
    title: "",
    description: "",
    company: "",
    companyDescription: "",
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

  const clear = () => {
    setState((s) => ({
      ...s,
      error: "",
      loading: false,
      title: "",
      description: "",
      company: "",
      companyDescription: "",
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
    if (state.title.trim().length < 5) {
      return setState((s) => ({
        ...s,
        error: "The job description should contain at least 5 characters.",
        loading: false,
      }));
    }
    if (state.company.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "Company name should contain at least 3 characters.",
        loading: false,
      }));
    }
    if (state.description.trim().length < 30) {
      return setState((s) => ({
        ...s,
        error: "The job description should contain at least 30 characters.",
        loading: false,
      }));
    }
    const { _creationTime, _id, userId, ...rest } = job;
    const { success } = await updateJobMutation({
      id: job._id,
      values: {
        ...rest,
        location: state.location,
        title: state.title,
        description: state.description,
        company: state.company,
        companyDescription: state.companyDescription,
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

  const selectLocation = () => locationBottomSheetRef.current?.present();

  React.useEffect(() => {
    const { error, loading, location, ...rest } = state;
    const hasValues = Object.values(rest).filter(Boolean);
    flexWidth.value = withTiming(hasValues.length !== 0 ? 150 : 0);
    scale.value = withTiming(hasValues.length !== 0 ? 1 : 0);
    gap.value = withTiming(hasValues.length !== 0 ? 16 : 0);
  }, [state]);

  React.useEffect(() => {
    if (!!job) {
      setState((s) => ({
        ...s,
        title: job.title,
        description: job.description,
        company: job.company,
        companyDescription: job.companyDescription ?? "",
        location: job.location.address.isoCountryCode ? job.location : location,
      }));
    }
  }, [job]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Basic Information",
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
      <LocationPickerBottomSheet
        initialState={location}
        ref={locationBottomSheetRef}
        onChangeValue={(value) => {
          setState((s) => ({ ...s, location: value }));
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
