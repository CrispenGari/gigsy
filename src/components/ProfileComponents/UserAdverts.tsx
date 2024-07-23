import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { useMeStore } from "@/src/store/meStore";
import Card from "../Card/Card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { Link } from "expo-router";
import Animated, { SlideInRight } from "react-native-reanimated";
import Spinner from "react-native-loading-spinner-overlay";
import { TJob } from "@/convex/tables/job";
import JobDetailsBottomSheet from "../BottomSheets/JobDetailsBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import ContentLoader from "../ContentLoader/ContentLoader";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface UserAdvertsProps {
  id?: string;
}
const UserAdverts = ({ id }: UserAdvertsProps) => {
  const { me } = useMeStore();
  const jobs = useQuery(api.api.user.userAdverts, {
    id: id ? id : me?.id || "",
  });

  if (typeof jobs === "undefined") return <UserAdvertSkeleton />;
  return (
    <Card style={{ flex: 1, marginVertical: 10 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: FONTS.bold, marginBottom: 10, fontSize: 20 }}
        >
          {id ? "Job Adverts" : "Your Adverts"}
        </Text>

        {jobs?.jobs.length === 0 ? (
          <Animated.View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
            }}
            entering={SlideInRight.duration(200).delay(200)}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              No jobs adverts.
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={jobs?.jobs}
            keyExtractor={({ _id }) => _id}
            renderItem={({ item }) => {
              if (!!id) {
                return <PressableItem item={item as any} />;
              } else {
                return <SwipableItem item={item as any} />;
              }
            }}
          />
        )}
      </View>
    </Card>
  );
};

export default UserAdverts;

const PressableItem = ({ item }: { item: TJob }) => {
  const jobBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { settings } = useSettingsStore();
  return (
    <>
      <JobDetailsBottomSheet ref={jobBottomSheetRef} id={item._id} />
      <TouchableOpacity
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          jobBottomSheetRef.current?.present();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.gray,
          paddingBottom: 5,
          backgroundColor: COLORS.white,
          marginBottom: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              paddingVertical: 5,
            }}
          >
            {item.title}
          </Animated.Text>
          <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
            {item.type === "full-time" ? "Full Time" : "Part Time"} ●{" "}
            {dayjs(new Date(item._creationTime)).fromNow()} ago ●{" "}
            {item.location.address.city}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={COLORS.gray}
        />
      </TouchableOpacity>
    </>
  );
};

const SwipableItem = ({ item }: { item: TJob }) => {
  const [state, setState] = React.useState({
    loading: false,
  });
  const { settings } = useSettingsStore();
  const deleteMutation = useMutation(api.api.job.deleteById);
  const deleteJob = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({ ...s, loading: true }));
    const { success } = await deleteMutation({ id: item._id });
    setState((s) => ({ ...s, loading: false }));
    if (!success) {
      Alert.alert(
        "Failed Operation",
        "Failed to delete a Job Advert from gigsy."
      );
    }
  };
  return (
    <>
      <Spinner visible={state.loading} animation="fade" />

      <Swipeable
        overshootLeft={false}
        friction={3}
        overshootFriction={8}
        enableTrackpadTwoFingerGesture
        renderRightActions={(_progress, _dragX) => {
          return (
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                backgroundColor: COLORS.red,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              onPress={deleteJob}
            >
              <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
          );
        }}
        renderLeftActions={(_progress, _dragX) => {
          return (
            <Link
              href={{
                pathname: "/(profile)/[id]",
                params: {
                  id: item._id,
                },
              }}
              asChild
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 50,
                  backgroundColor: COLORS.green,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                  Open
                </Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      >
        <Link
          href={{
            pathname: "/(profile)/[id]",
            params: {
              id: item._id,
            },
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: COLORS.gray,
              paddingBottom: 5,
              backgroundColor: COLORS.white,
              marginBottom: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Animated.Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  paddingVertical: 5,
                }}
              >
                {item.title}
              </Animated.Text>
              <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                {item.type === "full-time" ? "Full Time" : "Part Time"} ●{" "}
                {dayjs(new Date(item._creationTime)).fromNow()} ago ●{" "}
                {item.location.address.city}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </Link>
      </Swipeable>
    </>
  );
};

const AdvertSkeleton = () => (
  <View>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray,
        paddingBottom: 5,
        backgroundColor: COLORS.white,
        marginBottom: 1,
      }}
    >
      <View style={{ flex: 1, gap: 3 }}>
        <ContentLoader style={{ width: 200, height: 15, borderRadius: 5 }} />
        <ContentLoader style={{ width: 200, height: 8, borderRadius: 5 }} />
      </View>
      <ContentLoader style={{ width: 40, height: 40, borderRadius: 5 }} />
    </View>
  </View>
);

const UserAdvertSkeleton = () => (
  <Card style={{ flex: 1, marginVertical: 10 }}>
    <View style={{ flex: 1 }}>
      <ContentLoader style={{ width: 150, height: 20, borderRadius: 5 }} />
      <FlatList
        data={Array(3).fill(null)}
        keyExtractor={(item, _id) => _id.toString()}
        renderItem={({ item }) => <AdvertSkeleton />}
      />
    </View>
  </Card>
);
