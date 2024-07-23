import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

const LocationMetric = () => {
  const { settings, update } = useSettingsStore();
  const isCity = useSharedValue(0);
  const animatedBtnStyle = useAnimatedStyle(() => {
    const left = withTiming(
      interpolate(isCity.value, [0, 0.5, 1], [0, 100, 200])
    );
    return {
      left,
    };
  });
  React.useEffect(() => {
    const { metric } = settings.location;
    isCity.value = metric === "km" ? 0 : metric === "mi" ? 0.5 : 1;
  }, [settings]);
  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        width: 300,
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
            location: {
              ...settings.location,
              metric: "km",
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.metric === "km" ? COLORS.white : COLORS.black,
            },
          ]}
        >
          KM
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
            location: {
              ...settings.location,
              metric: "mi",
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.metric === "mi" ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Mi
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
            location: {
              ...settings.location,
              metric: "m",
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.metric === "m" ? COLORS.white : COLORS.black,
            },
          ]}
        >
          M
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationMetric;

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
