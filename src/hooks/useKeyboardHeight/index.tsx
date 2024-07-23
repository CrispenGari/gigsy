import React from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return { keyboardHeight };
};
