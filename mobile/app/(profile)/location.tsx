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
import CityFilter from "@/src/components/CityFilter/CityFilter";
import LocationMetric from "@/src/components/LocationMetric/LocationMetric";
import LocationAccuracy from "@/src/components/LocationAccuracy/LocationAccuracy";

const Page = () => {
  const { settings, update } = useSettingsStore();
  const router = useRouter();
  const infoBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const defaultJobListingLocationBottomSheetRef =
    React.useRef<BottomSheetModal>(null);
  const distanceBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const locationAccuracyBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const preferredMetricBottomSheetRef = React.useRef<BottomSheetModal>(null);

  const [distance, setDistance] = React.useState(
    settings.location.distanceRadius
  );
  React.useEffect(() => {
    setDistance(settings.location.distanceRadius || 0);
  }, [settings]);

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
        onChangeValue={() => {}}
        value={null}
        values={[]}
        title={"Default Job Listing"}
        ref={defaultJobListingLocationBottomSheetRef}
      >
        <View style={{ alignSelf: "center", marginTop: 10 }}>
          <CityFilter />
        </View>
      </LocationOptionsBottomSheet>
      <LocationOptionsBottomSheet
        onChangeValue={() => {}}
        value={null}
        values={[]}
        title={"Preferred Distance Metric"}
        ref={preferredMetricBottomSheetRef}
      >
        <View style={{ alignSelf: "center", marginTop: 10 }}>
          <LocationMetric />
        </View>
      </LocationOptionsBottomSheet>
      <LocationOptionsBottomSheet
        onChangeValue={() => {}}
        value={null}
        values={locationAccuracies.map((loc) => loc.title)}
        title={"Preferred Location Accuracy"}
        ref={locationAccuracyBottomSheetRef}
      >
        <View style={{ alignSelf: "center", marginTop: 10 }}>
          <LocationAccuracy />
        </View>
      </LocationOptionsBottomSheet>
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
          {convertSelectedDistance(distance, settings.location.metric)}
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
            value={distance}
            onValueChange={(value) => {
              setDistance(value);
            }}
            onSlidingComplete={(value) => {
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
              maxWidth: 500,
              alignSelf: "flex-start",
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
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
