import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useMeStore } from "@/src/store/meStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import JobDetailsBottomSheet from "../BottomSheets/JobDetailsBottomSheet";
import { Link } from "expo-router";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import { calculateDistance } from "@/src/utils/distance";
import { useLocationStore } from "@/src/store/locationStore";
import ContentLoader from "../ContentLoader/ContentLoader";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface HomeJobProps {
  _id: Id<"jobs">;
}
const HomeJob: React.FunctionComponent<HomeJobProps> = ({ _id }) => {
  const job = useQuery(api.api.job.getJobById, { id: _id });
  const { me } = useMeStore();
  const jobBottomSheet = React.useRef<BottomSheetModal>(null);
  const { settings } = useSettingsStore();
  const { location } = useLocationStore();
  const [loaded, setLoaded] = React.useState(true);
  if (!!!job) return <SkeletonHomeJob />;
  return (
    <>
      {!!job ? <JobDetailsBottomSheet ref={jobBottomSheet} id={_id} /> : null}
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.gray,
          width: "100%",
          paddingBottom: 20,
          maxWidth: 500,
        }}
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          jobBottomSheet.current?.present();
        }}
      >
        <Link
          href={
            me?.id === job?.user?.id
              ? {
                  pathname: "/(profile)/me",
                }
              : { pathname: "/(user)/[id]", params: { id: job?.user?._id! } }
          }
          asChild
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 10,
              marginBottom: 5,
              alignItems: "flex-start",
            }}
          >
            {!loaded ? (
              <ContentLoader
                style={{
                  zIndex: 1,
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  display: loaded ? "none" : "flex",
                  backgroundColor: COLORS.lightGray,
                  overflow: "hidden",
                }}
              />
            ) : null}

            <Animated.Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                display: loaded ? "flex" : "none",
              }}
              onError={(_error) => {
                setLoaded(true);
              }}
              onLoadEnd={() => {
                setLoaded(true);
              }}
              onLoadStart={() => {
                setLoaded(false);
              }}
              onLoad={() => {
                setLoaded(true);
              }}
              source={{
                uri: job?.user?.image,
              }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                {job?.user?.firstName} {job?.user?.lastName}
                {job?.user?.verified && (
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color={COLORS.green}
                  />
                )}
              </Text>
              <Text style={styles.mutedText}>
                {job?.user?.email} {job?.user?.id === me?.id && "● you"}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONTS.regular,
            marginBottom: 10,
          }}
        >
          {job?.description}
        </Text>
        <View
          style={{
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name="location-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>{job?.location?.address.city}</Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name="time-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              Listed {dayjs(new Date(job?._creationTime!)).fromNow()} ago.
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name="timer-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              {job?.type === "part-time" ? "Part Time" : "Full Time"}
            </Text>
          </View>

          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons
              name="accessibility-outline"
              color={COLORS.gray}
              size={14}
            />
            <Text style={styles.mutedText}>{job?.company}</Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Ionicons name="cash-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              R{" "}
              {Number(job?.salaryRange?.min).toFixed(2) || Number(0).toFixed(2)}{" "}
              - R {Number(job?.salaryRange?.max).toFixed(2)}
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <MaterialCommunityIcons
              name={"map-marker-distance"}
              color={COLORS.gray}
              size={14}
            />
            <Text style={styles.mutedText}>
              {calculateDistance(
                {
                  longitude: location.lon,
                  latitude: location.lat,
                },
                {
                  latitude: job?.location?.lat!,
                  longitude: job?.location?.lon!,
                },
                settings.location.metric
              )}{" "}
              away
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default HomeJob;

const styles = StyleSheet.create({
  mutedText: { fontFamily: FONTS.regular, color: COLORS.gray },
});

export const SkeletonHomeJob = () => {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: COLORS.white,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.gray,
        width: "100%",
        paddingBottom: 20,
        maxWidth: 500,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 5,
          alignItems: "flex-start",
        }}
      >
        <ContentLoader
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <ContentLoader style={{ width: 200, height: 25, borderRadius: 5 }} />
          <ContentLoader
            style={{ width: 150, height: 15, borderRadius: 999 }}
          />
        </View>
      </View>

      <View style={{ gap: 2 }}>
        <ContentLoader
          style={{ width: "100%", height: 10, borderRadius: 999 }}
        />
        <ContentLoader
          style={{ width: "100%", height: 10, borderRadius: 999 }}
        />
        <ContentLoader style={{ width: 200, height: 10, borderRadius: 999 }} />
      </View>

      <View
        style={{
          gap: 5,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        <ContentLoader style={{ width: 100, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 100, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 80, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 70, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 120, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 130, height: 15, borderRadius: 5 }} />
      </View>
    </View>
  );
};
