import { StyleSheet, Text } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FONTS } from "@/src/constants";

const HowLocationIsUsedBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["60%"], []);
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
            Location Help
          </Text>
          <BottomSheetScrollView
            contentContainerStyle={{
              padding: 10,
              paddingBottom: 50,
            }}
            style={{ flex: 1 }}
          >
            <Text style={styles.sectionTitle}>
              What the Location is Used For:
            </Text>
            <Text style={styles.text}>
              1. Shows jobs around you based on your current location.
            </Text>
            <Text style={styles.text}>
              2. We don't share your exact location address with other users.
            </Text>
            <Text style={styles.text}>
              3. Publishes jobs based on your specified location.
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Settings:
            </Text>
            <Text style={styles.text}>
              • Show jobs globally if you want to view job listings from around
              the world.
            </Text>
            <Text style={styles.text}>
              • Specify the metric you prefer for distance measurements (e.g.,
              miles or kilometers).
            </Text>
            <Text style={styles.text}>
              • Change the location accuracy to determine the precision of your
              location data (e.g., high, basic, low).
            </Text>
            <Text style={styles.text}>
              • Set your preferred distance metric to control how distances are
              measured and displayed.
            </Text>
            <Text style={styles.text}>
              • Choose the job listing based on location type: city, region, or
              country.
            </Text>
            <Text style={styles.text}>
              • Show or hide the distance between you and the advertiser.
            </Text>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default HowLocationIsUsedBottomSheet;

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
