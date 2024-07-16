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
import { COLORS, FONTS } from "@/src/constants";
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

const HomeHeader = ({}: BottomTabHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const { os } = usePlatform();
  const [state, setState] = React.useState({
    query: "",
    focused: false,
  });
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
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 20,
            marginVertical: 14,
            textAlign: "center",
          }}
        >
          gigsy
        </Text>
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
