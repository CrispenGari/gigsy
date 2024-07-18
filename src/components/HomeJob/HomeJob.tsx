import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <>
      {!!job ? <JobDetailsBottomSheet ref={jobBottomSheet} id={_id} /> : null}
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.gray,
          maxWidth: 500,
          width: "100%",
          paddingBottom: 20,
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
              : { pathname: "/(user)/[id]", params: { id: job?.user?._id } }
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
            <Animated.Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{
                uri: job?.user?.image,
              }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                {job?.user?.firstName} {job?.user?.lastName}
              </Text>
              <Text style={styles.mutedText}>
                {job?.user?.email} {job?.user?.id === me?.id && "● you"}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Text
          style={{ fontSize: 18, fontFamily: FONTS.regular, marginBottom: 10 }}
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
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
          >
            <Ionicons name="location-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>{job?.location?.address.city}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
          >
            <Ionicons name="time-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              Listed {dayjs(new Date(job?._creationTime!)).fromNow()} ago.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
          >
            <Ionicons name="timer-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              {job?.type === "part-time" ? "Part Time" : "Full Time"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
          >
            <Ionicons
              name="accessibility-outline"
              color={COLORS.gray}
              size={14}
            />
            <Text style={styles.mutedText}>{job?.company}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
          >
            <Ionicons name="cash-outline" color={COLORS.gray} size={14} />
            <Text style={styles.mutedText}>
              R{" "}
              {Number(job?.salaryRange?.min).toFixed(2) || Number(0).toFixed(2)}{" "}
              - R {Number(job?.salaryRange?.max).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default HomeJob;

const styles = StyleSheet.create({
  mutedText: { fontFamily: FONTS.regular, color: COLORS.gray },
});
