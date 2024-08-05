import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { BlurView } from "expo-blur";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useMediaPermission } from "@/src/hooks";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type TAttachment = {
  type: "document" | "image" | "audio";
  uri: string;
  base64?: string;
};

interface Props {
  onShouldSend: (message: string) => void;
  onNewAttachment: (attachment: TAttachment) => void;
  sending: boolean;
}

const MessageInput = ({ onShouldSend, onNewAttachment, sending }: Props) => {
  const [message, setMessage] = React.useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const inputRef = React.useRef<TextInput>(null);

  const { settings } = useSettingsStore();
  const { camera, gallery } = useMediaPermission();
  const expandItems = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    expanded.value = withTiming(1, { duration: 400 });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };
  const expandButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const width = interpolate(
      expanded.value,
      [0, 1],
      [30, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      width,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expanded.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width,
      opacity: expanded.value,
    };
  });

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const onSend = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    onShouldSend(message);
    setMessage("");
  };

  const record = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const selectImage = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (gallery) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
      });
      if (result.canceled) return;
      const [asset] = result.assets;
      onNewAttachment({
        base64: "data:image/jpeg;base64," + asset.base64,
        type: "image",
        uri: asset.uri,
      });
    }
  };
  const takeImage = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (camera) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        base64: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
      });
      if (result.canceled) return;
      const [asset] = result.assets;
      onNewAttachment({
        base64: "data:image/jpeg;base64," + asset.base64,
        type: "image",
        uri: asset.uri,
      });
    }
  };
  const selectFile = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const [asset] = result.assets;
    onNewAttachment({
      type: "document",
      uri: asset.uri,
    });
  };

  return (
    <BlurView
      intensity={90}
      tint="extraLight"
      style={{
        paddingBottom: bottom,
        paddingTop: 10,
      }}
    >
      <View style={styles.row}>
        <ATouchableOpacity
          onPress={expandItems}
          style={[styles.roundBtn, expandButtonStyle]}
        >
          <Ionicons name="add" size={24} color={"gray"} />
        </ATouchableOpacity>

        <Animated.View style={[styles.buttonView, buttonViewStyle]}>
          <TouchableOpacity onPress={takeImage}>
            <Ionicons name="camera-outline" size={24} color={COLORS.gray} />
          </TouchableOpacity>
          <TouchableOpacity onPress={selectImage}>
            <Ionicons name="image-outline" size={24} color={COLORS.gray} />
          </TouchableOpacity>
          <TouchableOpacity onPress={selectFile}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </Animated.View>

        <TextInput
          autoFocus
          ref={inputRef}
          placeholder="Message"
          style={styles.messageInput}
          onFocus={collapseItems}
          onChangeText={onChangeText}
          value={message}
          multiline
          placeholderTextColor={COLORS.black}
          selectionColor={COLORS.green}
        />
        {sending ? (
          <ActivityIndicator
            size={20}
            color={COLORS.green}
            shouldRasterizeIOS
          />
        ) : message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="arrow-up-circle" size={24} color={COLORS.green} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={record}>
            <Ionicons name="mic" size={24} color={COLORS.green} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: Platform.select({
      ios: 8,
      android: 3,
    }),
    borderColor: "lightgray",
    backgroundColor: "white",
    fontFamily: FONTS.bold,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
export default MessageInput;
