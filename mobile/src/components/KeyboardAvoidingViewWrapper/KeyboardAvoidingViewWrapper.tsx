import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { usePlatform } from "@/src/hooks";
import { useHeaderHeight } from "@react-navigation/elements";

const KeyboardAvoidingViewWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { os } = usePlatform();
  const headerHeight = useHeaderHeight();
  if (os === "ios")
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled
          keyboardVerticalOffset={headerHeight}
        >
          {children}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, minHeight: Dimensions.get("window").height }}
        behavior={undefined}
        enabled
        keyboardVerticalOffset={headerHeight}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardAvoidingViewWrapper;
