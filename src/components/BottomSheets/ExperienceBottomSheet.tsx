import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { experienceLevels as data } from "@/src/constants/experience";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import FooterButtons from "./FooterButtons";
import { usePlatform } from "@/src/hooks";

interface ExperienceBottomSheetProps {
  onChangeValue: (value: string[]) => void;
  initialState: string[];
}
const ExperienceBottomSheet = React.forwardRef<
  BottomSheetModal,
  ExperienceBottomSheetProps
>(({ onChangeValue, initialState }, ref) => {
  const { dismiss } = useBottomSheetModal();
  const { os } = usePlatform();
  const snapPoints = React.useMemo(() => [os === "ios" ? "30%" : "25%"], [os]);
  const [state, setState] = React.useState<{
    selected: string[];
  }>({ selected: initialState });
  const experiences = React.useMemo(() => {
    return data;
  }, []);

  const removeExperience = (experience: string) => {
    const value = state.selected.filter(
      (s) => s.toLowerCase().trim() !== experience.toLowerCase().trim()
    );
    setState((state) => ({
      ...state,
      selected: value,
    }));
    onChangeValue(Array.from(new Set(value)));
  };
  const selectExperience = (experience: string) => {
    const unique = Array.from(new Set(state.selected));
    if (unique.length === 5) {
      return;
    }
    const found = unique.find(
      (s) => s.toLowerCase().trim() === experience.toLowerCase().trim()
    );
    if (!!found) {
      removeExperience(experience);
    } else {
      const value = [...state.selected, experience];
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
      footerComponent={(props) => (
        <BottomSheetFooter {...props}>
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
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 16,
              marginBottom: 5,
            }}
          >
            Experience Levels
          </Text>
          <BottomSheetView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 4,
              marginVertical: 10,
            }}
          >
            {Array.from(new Set(state.selected)).map((experience) => (
              <BottomSheetView
                key={experience}
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
                  {experience}
                </Text>
                <TouchableOpacity
                  onPress={() => removeExperience(experience)}
                  key={experience}
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

        <View style={{}}>
          <FlatList
            data={experiences}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              gap: 5,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const found = state.selected.find(
                (s) =>
                  s.toLowerCase().trim() === item.level.toLowerCase().trim()
              );
              return (
                <TouchableOpacity
                  onPress={() => selectExperience(item.level)}
                  key={item.level}
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
                    {item.level}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ExperienceBottomSheet;
