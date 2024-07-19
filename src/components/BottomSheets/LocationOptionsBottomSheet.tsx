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

interface LocationOptionsBottomSheetProps {
  onChangeValue: (value: string) => void;
  value: any;
  values: string[];
  title: string;
  children?: React.ReactNode;
}
const LocationOptionsBottomSheet = React.forwardRef<
  BottomSheetModal,
  LocationOptionsBottomSheetProps
>(({ onChangeValue, value, values, title, children }, ref) => {
  const { os } = usePlatform();
  const snapPoints = React.useMemo(() => [os === "ios" ? "20%" : "15%"], [os]);
  const [state, setState] = React.useState(value);
  React.useEffect(() => {
    setState(value);
  }, [value]);
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
        <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>{title}</Text>
        {!!children ? (
          children
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {values.map((value) => (
              <Item
                key={value}
                active={value === state}
                onPress={() => {
                  onChangeValue(value);
                }}
                value={value}
              />
            ))}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LocationOptionsBottomSheet;

const Item = ({
  onPress,
  value,
  active,
}: {
  onPress: () => void;
  value: string;
  active: boolean;
}) => {
  const { settings } = useSettingsStore();
  return (
    <TouchableOpacity
      onPress={async () => {
        if (settings.haptics) {
          await onImpact();
        }
        onPress();
      }}
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: active ? COLORS.transparent : COLORS.green,
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: active ? COLORS.secondary : COLORS.transparent,
        width: 80,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 12,
        }}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
};
