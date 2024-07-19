import React from "react";
import { IMAGES } from "@/src/constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSettingsStore } from "@/src/store/settingsStore";

const AppLogo = () => {
  const { settings } = useSettingsStore();
  const scale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startZoomIn = React.useCallback(() => {
    scale.value = withTiming(1, { duration: 1000 });
  }, []);

  React.useEffect(() => {
    startZoomIn();
  }, []);
  return (
    <Animated.Image
      source={IMAGES.logo}
      style={[{ width: 100, height: 100, marginVertical: 20 }, animatedStyle]}
    />
  );
};

export default AppLogo;
