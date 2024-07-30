import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FONTS } from "@/src/constants";

const verificationTips = [
  {
    sectionTitle: "Here are some of the reasons why your avatar is invalid.",
    tips: [
      "Make sure your face is visible.",
      "Make sure you look straight at the camera.",
      "If you were wearing glasses, consider removing them.",
      "Ensure there is adequate lighting.",
      "If you were wearing a hat, consider removing it.",
      "Remove any facial coverings, such as masks.",
      "Ensure the background is not too cluttered.",
      "Avoid using filters or heavy makeup.",
      "Ensure the photo is in focus and not blurry.",
    ],
  },
];

const InvalidProfileImageBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["50%"], []);

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
            Invalid profile avatar.
          </Text>
          <BottomSheetScrollView
            contentContainerStyle={{
              padding: 10,
              paddingBottom: 100,
            }}
            style={{ flex: 1 }}
          >
            {verificationTips.map((section, index) => (
              <React.Fragment key={index}>
                <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
                {section.tips.map((tip, index) => (
                  <Text style={[styles.text]} key={index}>
                    {index + 1}. {tip}
                  </Text>
                ))}
                <View style={{ height: 30 }} />
              </React.Fragment>
            ))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default InvalidProfileImageBottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginVertical: 5,
  },
  text: {
    fontFamily: FONTS.regular,
    marginVertical: 3,
  },
  btn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    maxWidth: 400,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    height: 40,
  },
});
