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
import * as Location from "expo-location";

const LocationAccuracy = () => {
  const { settings, update } = useSettingsStore();
  const isCity = useSharedValue(0);
  const animatedBtnStyle = useAnimatedStyle(() => {
    const inputRange = [0, 0.25, 0.5, 0.75, 1];
    const left = withTiming(
      interpolate(isCity.value, inputRange, [0, 70, 140, 210, 280])
    );
    return {
      left,
    };
  });

  React.useEffect(() => {
    const { locationAccuracy } = settings.location;
    isCity.value =
      locationAccuracy === Location.LocationAccuracy.Balanced
        ? 0
        : locationAccuracy === Location.LocationAccuracy.Low
          ? 0.25
          : locationAccuracy === Location.LocationAccuracy.Lowest
            ? 0.5
            : locationAccuracy === Location.LocationAccuracy.High
              ? 0.75
              : 1;
  }, [settings]);
  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        width: 350,
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
              locationAccuracy: Location.LocationAccuracy.Balanced,
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.locationAccuracy ===
                Location.LocationAccuracy.Balanced
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          Balanced
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
              locationAccuracy: Location.LocationAccuracy.Low,
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.locationAccuracy ===
                Location.LocationAccuracy.Low
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          Low
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
              locationAccuracy: Location.LocationAccuracy.Lowest,
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.locationAccuracy ===
                Location.LocationAccuracy.Lowest
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          Lowest
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
              locationAccuracy: Location.LocationAccuracy.High,
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.locationAccuracy ===
                Location.LocationAccuracy.High
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          High
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
              locationAccuracy: Location.LocationAccuracy.Highest,
            },
          });
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: FONTS.bold,
              color:
                settings.location.locationAccuracy ===
                Location.LocationAccuracy.Highest
                  ? COLORS.white
                  : COLORS.black,
            },
          ]}
        >
          Highest
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationAccuracy;

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
    width: 400 / 5,
    borderRadius: 10,
  },
});
