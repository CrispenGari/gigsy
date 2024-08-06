import { StyleSheet, Text } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FONTS } from "@/src/constants";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const WhatIsEnd2EndEncryptionBottomSheet = React.forwardRef<
  BottomSheetModal,
  {}
>(({}, ref) => {
  const snapPoints = React.useMemo(() => ["35%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <Text style={[styles.title, { paddingHorizontal: 10 }]}>
          End-to-End Encryption
        </Text>
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 50,
          }}
          style={{ flex: 1 }}
        >
          <Animated.View
            entering={SlideInLeft.delay(200).duration(1000)}
            style={{
              paddingVertical: 20,
              alignSelf: "center",
            }}
          >
            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          </Animated.View>

          <Text style={styles.text}>
            1. End-to-end encryption ensures that only you and the person you're
            communicating with can read what's sent.
          </Text>
          <Text style={styles.text}>
            2. Messages are encrypted on your device and only decrypted on the
            recipient's device.
          </Text>
          <Text style={styles.text}>
            3. No third party, not even the service provider, can access the
            messages.
          </Text>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default WhatIsEnd2EndEncryptionBottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  text: {
    fontFamily: FONTS.regular,
    marginVertical: 3,
  },
});
