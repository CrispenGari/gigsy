import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const GlobalFilter = () => {
  const { settings, update } = useSettingsStore();
  const isGlobally = useSharedValue(0);
  const animatedBtnStyle = useAnimatedStyle(() => {
    const left = withTiming(interpolate(isGlobally.value, [0, 1], [100, 0]));
    return {
      left,
    };
  });

  React.useEffect(() => {
    isGlobally.value = settings.location.showJobsGlobally ? 1 : 0;
  }, [settings]);

  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        width: 200,
        position: "relative",
        overflow: "hidden",
        borderColor: COLORS.gray,
        alignItems: "center",
      }}
    >
      <Animated.View style={[styles.tabIndicator, animatedBtnStyle]} />
      <TouchableOpacity
        style={[styles.tabBtn]}
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          update({
            ...settings,
            location: { ...settings.location, showJobsGlobally: true },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color: settings.location.showJobsGlobally
                ? COLORS.white
                : COLORS.black,
            },
          ]}
        >
          Globally
        </Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabBtn]}
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          update({
            ...settings,
            location: { ...settings.location, showJobsGlobally: false },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color: !settings.location.showJobsGlobally
                ? COLORS.white
                : COLORS.black,
            },
          ]}
        >
          Locally
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default GlobalFilter;

const styles = StyleSheet.create({
  tabBtn: {
    padding: 10,
    paddingVertical: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIndicator: {
    backgroundColor: COLORS.green,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 100,
    borderRadius: 10,
  },
});
