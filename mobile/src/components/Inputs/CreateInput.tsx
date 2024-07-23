import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";

import {
  StyleProp,
  ViewStyle,
  View,
  TextInput,
  Text,
  TextStyle,
  KeyboardTypeOptions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
  AnimatedStyle,
} from "react-native-reanimated";

import { TouchableOpacity } from "react-native-gesture-handler";
interface CreateInputProps {
  label: string;
  placeholder?: string;
  Icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  onIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
  inputContainerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  inputStyle?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
}

const CreateInput: React.FC<CreateInputProps> = ({
  label,
  placeholder,
  Icon,
  onChangeText,
  value,
  containerStyle,
  onIconPress,
  multiline,
  inputContainerStyle,
  inputStyle,
  keyboardType,
  iconStyle,
  editable,
}) => {
  const focused = useSharedValue(0);
  const { os } = usePlatform();
  const animatedTextInputStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      focused.value,
      [0, 1],
      [COLORS.semiGray, COLORS.lightGray]
    );
    return {
      backgroundColor: bg,
    };
  });
  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      <Text style={{ fontFamily: FONTS.bold }}>{label}</Text>
      <Animated.View
        style={[
          animatedTextInputStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 3,
          },
          inputContainerStyle,
        ]}
      >
        <TouchableOpacity
          style={[iconStyle]}
          onPress={() => {
            if (typeof onIconPress !== "undefined") {
              onIconPress();
            }
          }}
        >
          {Icon}
        </TouchableOpacity>
        <TextInput
          placeholder={placeholder}
          style={[
            { flex: 1, minWidth: 40, paddingVertical: os === "ios" ? 6 : 0 },
            inputStyle,
          ]}
          onFocus={() => (focused.value = withTiming(1, { duration: 400 }))}
          onBlur={() => (focused.value = withTiming(0, { duration: 400 }))}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.black}
          editable={editable}
        />
      </Animated.View>
    </View>
  );
};

export default CreateInput;
