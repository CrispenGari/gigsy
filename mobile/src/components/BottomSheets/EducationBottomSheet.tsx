import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetFooter,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { educationRequirements as data } from "@/src/constants/education";
import { COLORS, FONTS } from "@/src/constants";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { usePlatform } from "@/src/hooks";
import FooterButtons from "./FooterButtons";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

interface EducationBottomSheetProps {
  onChangeValue: (value: string[]) => void;
  initialState: string[];
}
const EducationBottomSheet = React.forwardRef<
  BottomSheetModal,
  EducationBottomSheetProps
>(({ onChangeValue, initialState }, ref) => {
  const { os } = usePlatform();
  const snapPoints = React.useMemo(() => ["80%"], []);
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState<{
    education: string;
    selected: string[];
  }>({ education: "", selected: initialState });
  const { dismiss } = useBottomSheetModal();
  const requirements = React.useMemo(() => {
    if (state.education.trim().length === 0) return data;
    const educationLowerCase = state.education.toLowerCase();
    return data
      .map((cate) => {
        const filtered = cate.requirements.filter((s) =>
          s.toLowerCase().includes(educationLowerCase)
        );
        if (filtered.length > 0) return { ...cate, data: filtered };
        return null;
      })
      .filter(Boolean) as {
      category: string;
      requirements: string[];
    }[];
  }, [state.education]);

  const focused = useSharedValue(0);
  const animatedTextInputStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focused.value,
      [0, 1],
      [COLORS.semiGray, COLORS.lightGray]
    );
    return {
      backgroundColor,
    };
  });

  const onFocus = () => {
    focused.value = withTiming(1, { duration: 400 });
  };
  const onBlur = () => {
    focused.value = withTiming(0, { duration: 400 });
  };
  const removeEducation = (val: string) => {
    const value = state.selected.filter(
      (s) => s.toLowerCase().trim() !== val.toLowerCase().trim()
    );
    setState((state) => ({
      ...state,
      selected: value,
    }));
    onChangeValue(Array.from(new Set(value)));
  };
  const setEducation = (val: string) => {
    const unique = Array.from(new Set(state.selected));
    const found = unique.find(
      (s) => s.toLowerCase().trim() === val.toLowerCase().trim()
    );
    if (unique.length === 5) {
      if (found) return removeEducation(val);
      return;
    }

    if (!!found) {
      removeEducation(val);
    } else {
      const value = [...state.selected, val];
      setState((state) => ({
        ...state,
        selected: value,
      }));
      onChangeValue(Array.from(new Set(value)));
    }
  };

  const clear = () => {
    setState((s) => ({ ...s, selected: [] }));
    onChangeValue([]);
  };

  React.useEffect(() => {
    setState((s) => ({ ...s, selected: initialState }));
  }, [initialState]);
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      footerComponent={(p) => (
        <BottomSheetFooter {...p}>
          <FooterButtons
            state={state}
            onClear={clear}
            onDone={() => {
              dismiss();
            }}
          />
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <BottomSheetView style={{ padding: 10 }}>
          <BottomSheetView style={{ padding: 10 }}>
            <Animated.View
              style={[
                animatedTextInputStyle,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  padding: os === "ios" ? 10 : 5,
                  width: "100%",
                  maxWidth: 400,
                  borderRadius: 10,
                  gap: 10,
                  paddingHorizontal: 10,
                  elevation: 5,
                  marginVertical: 5,
                  shadowColor: COLORS.gray,
                  shadowOffset: { width: 2, height: 2 },
                  shadowRadius: 5,
                  shadowOpacity: 1,
                },
              ]}
            >
              {!!state.education ? (
                <TouchableOpacity>
                  <Ionicons
                    name="close-outline"
                    size={16}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Ionicons
                    name="search-outline"
                    size={16}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              )}
              <TextInput
                style={{
                  flex: 1,
                  fontFamily: FONTS.regular,
                  backgroundColor: COLORS.transparent,
                }}
                placeholderTextColor={COLORS.black}
                placeholder="Search education level"
                onFocus={onFocus}
                onBlur={onBlur}
                value={state.education}
                onChangeText={(education) =>
                  setState((s) => ({ ...s, education }))
                }
              />
            </Animated.View>

            <BottomSheetView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 4,
                marginVertical: 10,
              }}
            >
              {Array.from(new Set(state.selected)).map((education) => (
                <BottomSheetView
                  key={education}
                  style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: COLORS.green,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    borderRadius: 999,
                    backgroundColor: COLORS.green,
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 12,
                      color: COLORS.white,
                    }}
                  >
                    {education}
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      if (settings.haptics) {
                        await onImpact();
                      }
                      setEducation(education);
                    }}
                    key={education}
                  >
                    <Ionicons
                      name="close-outline"
                      size={14}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </BottomSheetView>
              ))}
            </BottomSheetView>
          </BottomSheetView>
        </BottomSheetView>

        <BottomSheetFlatList
          data={requirements}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <BottomSheetView style={{ flex: 1, marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  marginBottom: 5,
                }}
              >
                {item.category}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 3,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {item.requirements.map((education) => {
                  const found = state.selected.find(
                    (s) =>
                      s.toLowerCase().trim() === education.toLowerCase().trim()
                  );
                  return (
                    <TouchableOpacity
                      onPress={async () => {
                        if (settings.haptics) {
                          await onImpact();
                        }
                        setEducation(education);
                      }}
                      key={education}
                      style={{
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: found ? COLORS.transparent : COLORS.green,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        backgroundColor: found
                          ? COLORS.secondary
                          : COLORS.transparent,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONTS.regular,
                          fontSize: 12,
                        }}
                      >
                        {education}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BottomSheetView>
          )}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default EducationBottomSheet;
