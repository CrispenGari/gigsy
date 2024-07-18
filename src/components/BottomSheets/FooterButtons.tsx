import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { BlurView } from "expo-blur";
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FooterButtonsProps<TItem extends { selected: string[] }> {
  state: TItem;
  onClear: () => void;
  onDone: () => void;
}

const FooterButtons = <T extends { selected: string[] }>({
  state,
  onClear,
  onDone,
}: FooterButtonsProps<T>) => {
  const { bottom } = useSafeAreaInsets();
  const { settings } = useSettingsStore();
  return (
    <BlurView tint="extraLight" intensity={80}>
      <Animated.View
        //   entering={shouldAnimate ? SlideInLeft.duration(200) : undefined}
        //   exiting={SlideInRight.duration(200)}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            padding: 10,
            gap: 10,
            paddingBottom: bottom + 10,
          },
        ]}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: !!!state.selected.length
              ? COLORS.tertiary
              : COLORS.secondary,
            alignItems: "center",
            borderRadius: 5,
            width: 150,
          }}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            onClear();
          }}
        >
          <Text
            style={[
              {
                fontFamily: FONTS.bold,
                color: !!!state.selected.length ? COLORS.white : COLORS.black,
                fontSize: 20,
              },
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            onDone();
          }}
          style={{
            flex: 1,
            backgroundColor: COLORS.green,
            padding: 10,
            alignItems: "center",
            borderRadius: 5,
            maxWidth: 300,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: COLORS.white,
              fontSize: 20,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </BlurView>
  );
};

export default FooterButtons;
