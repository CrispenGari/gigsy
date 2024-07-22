import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Card from "../Card/Card";
import { Ionicons } from "@expo/vector-icons";

interface FilterBottomSheetProps {
  onChangeValue: (value: string) => void;
}
const FilterBottomSheet = React.forwardRef<
  BottomSheetModal,
  FilterBottomSheetProps
>(({}, ref) => {
  const { os } = usePlatform();
  const snapPoints = React.useMemo(() => ["50%"], []);

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
    >
      <BottomSheetView style={{ flex: 1, padding: 10 }}>
        <Card
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            width: "100%",
            padding: 10,
            backgroundColor: COLORS.lightGray,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              backgroundColor: COLORS.green,
            }}
          >
            <Ionicons
              name="information-outline"
              size={18}
              color={COLORS.white}
            />
          </View>
          <Text
            style={{
              fontFamily: FONTS.bold,
              marginBottom: 5,
              color: COLORS.green,
              flex: 1,
            }}
          >
            Note that changing filters will also automatically change your
            settings.
          </Text>
        </Card>
        <Card>
          <Text style={{ fontFamily: FONTS.bold, marginBottom: 5 }}>Order</Text>
        </Card>
        <Card>
          <Text style={{ fontFamily: FONTS.bold, marginBottom: 5 }}>Order</Text>
        </Card>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default FilterBottomSheet;
