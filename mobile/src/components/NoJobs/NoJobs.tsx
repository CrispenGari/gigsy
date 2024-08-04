import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { convertSelectedDistance } from "@/src/utils/distance";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FilterBottomSheet from "../BottomSheets/FiltersBottomSheet";
import { onImpact } from "@/src/utils";
const NoJobs = () => {
  const { location } = useLocationStore();
  const { settings } = useSettingsStore();
  const filterBottomSheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <>
      <FilterBottomSheet ref={filterBottomSheetRef} />

      <View
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.gray,
          maxWidth: 500,
          width: "100%",
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            gap: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
            width: "100%",
          }}
        >
          <Text style={{ fontFamily: FONTS.bold }}>
            No jobs in your area, update your filters.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              filterBottomSheetRef.current?.present();
            }}
            style={{
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.semiGray,
              borderRadius: 30,
            }}
          >
            <Ionicons name="filter-outline" size={14} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 15 }}>
          Applied Filters
        </Text>
        <View
          style={{
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name="location-outline" color={COLORS.gray} size={14} />
            <Text style={{ fontFamily: FONTS.regular }}>
              {location.address.city}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <MaterialCommunityIcons
              name={"map-marker-radius-outline"}
              size={14}
              color={COLORS.gray}
            />
            <Text style={{ fontFamily: FONTS.regular }}>
              {convertSelectedDistance(
                settings.location.distanceRadius,
                settings.location.metric
              )}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name={"globe-outline"} size={14} color={COLORS.gray} />
            <Text style={{ fontFamily: FONTS.regular }}>
              {settings.location.showJobsGlobally ? "Globally" : "Locally"}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name={"map-outline"} size={14} color={COLORS.gray} />
            <Text
              style={{ fontFamily: FONTS.regular, textTransform: "capitalize" }}
            >
              {settings.location.defaultJobListingLocation}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: COLORS.gray,
            marginTop: 5,
          }}
        >
          {location.address.streetNumber} {location.address.street},{" "}
          {location.address.district} (
          {location.address.isoCountryCode?.toLowerCase()})
        </Text>
      </View>
    </>
  );
};

export default NoJobs;
