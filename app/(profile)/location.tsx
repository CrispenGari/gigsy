import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import {
  locationAccuracies,
  useSettingsStore,
} from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Stack, useRouter } from "expo-router";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Animated, { SlideInLeft } from "react-native-reanimated";
import Card from "@/src/components/Card/Card";
import HowLocationIsUsedBottomSheet from "@/src/components/BottomSheets/HowLocationIsUsedBottomSheet";
import LocationOptionsBottomSheet from "@/src/components/BottomSheets/LocationOptionsBottomSheet";
import { Slider } from "react-native-elements";
import { convertSelectedDistance } from "@/src/utils/distance";

const Page = () => {
  const { settings, update } = useSettingsStore();
  const router = useRouter();
  const infoBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const defaultJobListingLocationBottomSheetRef =
    React.useRef<BottomSheetModal>(null);
  const distanceBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const locationAccuracyBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const preferredMetricBottomSheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Location Preferences",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 35,
                height: 35,
                alignItems: "center",
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                borderRadius: 35,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                infoBottomSheetRef.current?.present();
              }}
            >
              <Ionicons name="help-outline" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />

      <HowLocationIsUsedBottomSheet ref={infoBottomSheetRef} />
      <LocationOptionsBottomSheet
        onChangeValue={(value) => {
          update({
            ...settings,
            location: {
              ...settings.location,
              defaultJobListingLocation: value as any,
            },
          });
        }}
        value={settings.location.defaultJobListingLocation}
        values={["city", "region", "country"]}
        title={"Default Job Listing"}
        ref={defaultJobListingLocationBottomSheetRef}
      />
      <LocationOptionsBottomSheet
        onChangeValue={(value) => {
          update({
            ...settings,
            location: {
              ...settings.location,
              metric: value as any,
            },
          });
        }}
        value={settings.location.metric}
        values={["km", "mi", "m"]}
        title={"Preferred Distance Metric"}
        ref={preferredMetricBottomSheetRef}
      />
      <LocationOptionsBottomSheet
        onChangeValue={(value) => {
          const locationAccuracy = locationAccuracies.find(
            (loc) => loc.title === value
          )!.value;
          update({
            ...settings,
            location: {
              ...settings.location,
              locationAccuracy,
            },
          });
        }}
        value={
          locationAccuracies.find(
            (loc) => loc.value === settings.location.locationAccuracy
          )!.title
        }
        values={locationAccuracies.map((loc) => loc.title)}
        title={"Preferred Location Accuracy"}
        ref={locationAccuracyBottomSheetRef}
      />
      <LocationOptionsBottomSheet
        onChangeValue={() => {}}
        value={""}
        values={[]}
        title={"Preferred Distance Radius"}
        ref={distanceBottomSheetRef}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            alignSelf: "center",
          }}
        >
          {convertSelectedDistance(
            settings.location.distanceRadius,
            settings.location.metric
          )}
        </Text>
        <View
          style={{
            flexDirection: "row",
            maxWidth: 400,
            alignItems: "center",
            marginVertical: 10,
            gap: 5,
          }}
        >
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
            0 {settings.location.metric}
          </Text>
          <Slider
            style={{
              width: "100%",
              height: 40,
              flex: 1,
            }}
            minimumValue={0}
            maximumValue={160_000}
            minimumTrackTintColor={COLORS.green}
            maximumTrackTintColor={COLORS.gray}
            thumbStyle={{
              width: 10,
              height: 10,
            }}
            animationType="spring"
            allowTouchTrack
            thumbTintColor={COLORS.green}
            value={settings.location.distanceRadius}
            onValueChange={(value) => {
              update({
                ...settings,
                location: {
                  ...settings.location,
                  distanceRadius: value,
                },
              });
            }}
          />
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
            {convertSelectedDistance(160_000, settings.location.metric)}
          </Text>
        </View>
      </LocationOptionsBottomSheet>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Change Settings
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 400,
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  location: {
                    ...settings.location,
                    showJobsGlobally: !settings.location.showJobsGlobally,
                  },
                });
              }}
            >
              <Ionicons name={"globe-outline"} size={24} color={COLORS.gray} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Show Jobs Globally
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.location.showJobsGlobally ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                defaultJobListingLocationBottomSheetRef.current?.present();
              }}
            >
              <Ionicons name={"map-outline"} size={24} color={COLORS.gray} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Default Job Listing
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {settings.location.defaultJobListingLocation}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  location: {
                    ...settings.location,
                    showDistanceToAdvertiser:
                      !settings.location.showDistanceToAdvertiser,
                  },
                });
              }}
            >
              <MaterialCommunityIcons
                name={"map-marker-distance"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Show Distance to the Advertiser
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {settings.location.showDistanceToAdvertiser
                    ? "Enabled"
                    : "Disabled"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                distanceBottomSheetRef.current?.present();
              }}
            >
              <MaterialCommunityIcons
                name={"map-marker-radius-outline"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Distance Radius
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {convertSelectedDistance(
                    settings.location.distanceRadius,
                    settings.location.metric
                  )}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                locationAccuracyBottomSheetRef.current?.present();
              }}
            >
              <Ionicons name={"locate-outline"} size={24} color={COLORS.gray} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Location Accuracy
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {
                    locationAccuracies.find(
                      (loc) => loc.value === settings.location.locationAccuracy
                    )!.title
                  }
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                  preferredMetricBottomSheetRef.current?.present();
                }
              }}
            >
              <MaterialCommunityIcons
                name={"location-enter"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Preferred Location Metric
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.location.metric}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </View>
    </>
  );
};

export default Page;

// export type TLocation = {
//   showJobsGlobally: boolean;
//   defaultJobListingLocation: "city" | "region" | "country";
//   showDistanceToAdvertiser: boolean;
//   distanceRadius: number;
//   locationAccuracy: Location.LocationAccuracy;
//   metric: "km" | "mi" | "m";
// };
