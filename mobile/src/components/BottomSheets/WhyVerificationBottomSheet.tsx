import { StyleSheet, Text } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FONTS } from "@/src/constants";

const WhyVerificationBottomSheet = React.forwardRef<BottomSheetModal, {}>(
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
            Why Profile Picture Verification Important?
          </Text>
          <BottomSheetScrollView
            contentContainerStyle={{
              padding: 10,
              paddingBottom: 50,
            }}
            style={{ flex: 1 }}
          >
            <Text style={styles.sectionTitle}>Importance for Job Seekers:</Text>
            <Text style={styles.text}>
              1. Builds trust with potential employers by providing a verified
              identity.
            </Text>
            <Text style={styles.text}>
              2. Enhances the credibility of your profile, making you stand out.
            </Text>
            <Text style={styles.text}>
              3. Helps prevent impersonation and fraudulent activities.
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Importance for Advertisers:
            </Text>
            <Text style={styles.text}>
              • Ensures the authenticity of job seekers applying for positions.
            </Text>
            <Text style={styles.text}>
              • Reduces the risk of fake profiles and scams, creating a safer
              hiring process.
            </Text>
            <Text style={styles.text}>
              • Builds a trusted platform where both parties can confidently
              interact.
            </Text>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default WhyVerificationBottomSheet;

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
});
