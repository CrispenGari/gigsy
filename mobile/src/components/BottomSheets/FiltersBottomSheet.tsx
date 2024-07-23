import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Card from "../Card/Card";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { convertSelectedDistance } from "@/src/utils/distance";
import { Slider } from "react-native-elements";
import { useOderStore } from "@/src/store/useOrderStore";
import GlobalFilter from "../GlobalFilter/GlobalFilter";
import CityFilter from "../CityFilter/CityFilter";

const FilterBottomSheet = React.forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const { update, settings } = useSettingsStore();
  const { setOrder } = useOderStore();
  const snapPoints = React.useMemo(() => ["65%"], []);
  const [distance, setDistance] = React.useState(
    settings.location.distanceRadius
  );
  React.useEffect(() => {
    setDistance(settings.location.distanceRadius || 0);
  }, [settings]);

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
      <BottomSheetView style={{ flex: 1, padding: 10 }}>
        <Card
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            width: "100%",
            padding: 10,
            backgroundColor: COLORS.lightGray,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              backgroundColor: COLORS.green,
            }}
          >
            <Ionicons
              name="information-outline"
              size={18}
              color={COLORS.white}
            />
          </View>
          <Text
            style={{
              fontFamily: FONTS.bold,
              marginBottom: 5,
              color: COLORS.green,
              flex: 1,
            }}
          >
            Note that changing filters will also automatically change your
            settings.
          </Text>
        </Card>
        <Card style={{ marginBottom: 10 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>Filters</Text>
          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontFamily: FONTS.bold, marginBottom: 10 }}>
              Show jobs
            </Text>
            <GlobalFilter />
          </View>
          <View style={{ marginVertical: 20, marginTop: 0 }}>
            <Text style={{ fontFamily: FONTS.bold, marginBottom: 10 }}>
              Show jobs within a
            </Text>
            <CityFilter />
          </View>
          <Text
            style={{
              fontFamily: FONTS.bold,
            }}
          >
            Location Radius:{" "}
            {convertSelectedDistance(distance, settings.location.metric)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              maxWidth: 400,
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
              0 {settings.location.metric}
            </Text>
            <Slider
              style={{
                width: "100%",
                height: 40,
                flex: 1,
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
            />
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
              {convertSelectedDistance(160_000, settings.location.metric)}
            </Text>
          </View>
        </Card>
        <Card style={{}}>
          <Text
            style={{ fontFamily: FONTS.bold, marginBottom: 5, fontSize: 18 }}
          >
            Sort By
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              setOrder("desc");
            }}
          >
            <MaterialCommunityIcons
              name="sort-descending"
              size={14}
              color={COLORS.gray}
            />
            <Text style={{ fontFamily: FONTS.bold }}>New Adverts First</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              setOrder("asc");
            }}
          >
            <MaterialCommunityIcons
              name="sort-ascending"
              size={14}
              color={COLORS.gray}
            />
            <Text style={{ fontFamily: FONTS.bold }}>Old Adverts First</Text>
          </TouchableOpacity>
        </Card>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default FilterBottomSheet;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
});
