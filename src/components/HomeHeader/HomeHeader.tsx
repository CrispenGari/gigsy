import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, IMAGES } from "@/src/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePlatform } from "@/src/hooks";
import { jobCategories } from "@/src/constants/categories";
import { onImpact } from "@/src/utils";
import { useRouter } from "expo-router";
import { useCreateFormStore } from "@/src/store/createFormStore";
import { useLocationStore } from "@/src/store/locationStore";
import { useMeStore } from "@/src/store/meStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useAuth } from "@clerk/clerk-expo";

const HomeHeader = ({}: BottomTabHeaderProps) => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const { settings, restore } = useSettingsStore();
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clearForm } = useCreateFormStore();
  const { clear } = useWishlistStore();

  const { top } = useSafeAreaInsets();
  const { os } = usePlatform();
  const [state, setState] = React.useState({
    query: "",
    focused: false,
  });

  const scale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const logout = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    signOut().then(() => {
      destroy();
      reset();
      clearForm();
      clear();
      restore();
      router.replace("/");
    });
  };
  const startZoomIn = React.useCallback(() => {
    scale.value = withTiming(1, { duration: 1000 });
  }, []);

  React.useEffect(() => {
    startZoomIn();
  }, []);
  const textInputRef = React.useRef<TextInput>(null);
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
      }}
    >
      <View
        style={{
          paddingTop: os === "ios" ? 0 : top,
          paddingBottom: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.lightGray,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Animated.Image
            source={IMAGES.logo}
            style={[{ width: 50, height: 50 }, animatedStyle]}
          />
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            gigsy
          </Text>
          {isLoaded && !isSignedIn ? (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.replace("/(modals)/login");
              }}
            >
              <Ionicons name="log-in-outline" size={24} color={COLORS.green} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={logout}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.red} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Animated.View
            style={[
              animatedTextInputStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                width: "100%",
                maxWidth: 450,
                borderRadius: 10,
                gap: 10,
                paddingHorizontal: 20,
                elevation: 5,
                marginVertical: 5,
                shadowColor: COLORS.gray,
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 5,
                shadowOpacity: 1,
              },
            ]}
          >
            <TextInput
              style={{
                flex: 1,
                fontFamily: FONTS.regular,
                fontSize: 16,
                backgroundColor: COLORS.transparent,
                paddingHorizontal: 10,
              }}
              placeholderTextColor={COLORS.black}
              placeholder="Search jobs"
              onFocus={onFocus}
              onBlur={onBlur}
              ref={textInputRef}
              value={state.query}
              onChangeText={(query) => setState((s) => ({ ...s, query }))}
            />
            <TouchableOpacity style={{}}>
              <Ionicons name="search-outline" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 10,
            paddingTop: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                backgroundColor: COLORS.lightGray,
                borderRadius: 999,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold }}>{item.category}</Text>
            </TouchableOpacity>
          )}
          data={jobCategories}
          keyExtractor={({ id }) => id}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;
