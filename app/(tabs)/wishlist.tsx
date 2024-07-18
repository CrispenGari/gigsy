import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Tabs, useRouter } from "expo-router";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import ProfileCard from "@/src/components/ProfileComponents/ProfileCard";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Spinner from "react-native-loading-spinner-overlay";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useMeStore } from "@/src/store/meStore";
import Card from "@/src/components/Card/Card";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import JobDetailsBottomSheet from "@/src/components/BottomSheets/JobDetailsBottomSheet";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Saved = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { wishlists, clear } = useWishlistStore();
  const [state, setState] = React.useState({
    loading: false,
  });
  const { me } = useMeStore();
  const clearAllMutation = useMutation(api.api.wishlist.clear);
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  const clearAll = async () => {
    if (!!!me) return;
    setState((s) => ({ ...s, loading: true }));
    const success = await clearAllMutation({ id: me.id });
    if (success) {
      clear();
    }
    setState((s) => ({ ...s, loading: false }));
  };
  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: "Wishlists",
          headerShadowVisible: false,
        }}
      />
      <Spinner visible={state.loading || !isLoaded} animation="fade" />
      <ScrollView style={{ flex: 1 }}>
        {wishlists.length !== 0 ? (
          <Animated.View
            style={{
              backgroundColor: COLORS.white,
              paddingHorizontal: 20,
            }}
            entering={SlideInLeft.duration(200).delay(100)}
            exiting={SlideOutLeft.duration(200).delay(100)}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                maxWidth: 100,
              }}
              onPress={clearAll}
            >
              <Text
                style={{
                  color: COLORS.red,
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                }}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
        <ProfileCard cardStyle={{ paddingTop: 40 }} title="Your Wishlists" />
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: COLORS.gray,
            marginTop: 20,
            marginBottom: 5,
            marginLeft: 10,
          }}
        >
          You can open or remove your wishlist items.
        </Text>
        {wishlists.length === 0 ? (
          <Card
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              height: 200,
              maxWidth: 400,
              marginHorizontal: 10,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, color: COLORS.gray }}>
              You don't have any wishlists Jobs.
            </Text>
          </Card>
        ) : (
          wishlists.map(({ _id, jobId }) => <Wishlist key={_id} id={jobId} />)
        )}
      </ScrollView>
    </>
  );
};

export default Saved;

const Wishlist = ({ id }: { id: Id<"jobs"> }) => {
  const jobDetailsBottomSheet = React.useRef<BottomSheetModal>(null);
  const job = useQuery(api.api.job.getById, { id });
  const [state, setState] = React.useState({
    loading: false,
  });
  const removeMutation = useMutation(api.api.wishlist.remove);
  const { remove } = useWishlistStore();
  const { me } = useMeStore();
  const openJobDetailsBottomSheet = () =>
    jobDetailsBottomSheet.current?.present();
  const removeFromWishList = () => {
    if (!!!job || !!!me) return;
    setState((s) => ({ ...s, loading: true }));
    removeMutation({ jobId: job._id!, userId: me.id })
      .then((wishlist) => {
        if (!!wishlist) {
          remove(wishlist);
        }
      })
      .finally(() => setState((s) => ({ ...s, loading: false })));
  };
  return (
    <>
      <Spinner visible={state.loading} animation="fade" />

      {job && (
        <JobDetailsBottomSheet ref={jobDetailsBottomSheet} id={job._id} />
      )}
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
                height: "100%",
              }}
              onPress={removeFromWishList}
            >
              <Ionicons name="remove-outline" size={24} color="white" />
            </TouchableOpacity>
          );
        }}
        renderLeftActions={(_progress, _dragX) => {
          return (
            <TouchableOpacity
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                backgroundColor: COLORS.green,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              onPress={openJobDetailsBottomSheet}
            >
              <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                Open
              </Text>
            </TouchableOpacity>
          );
        }}
      >
        <TouchableOpacity
          onPress={openJobDetailsBottomSheet}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: COLORS.gray,
            paddingBottom: 5,
            backgroundColor: COLORS.white,
            marginBottom: 1,
            maxWidth: 450,
            paddingHorizontal: 10,
            width: "100%",
            alignSelf: "center",
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
              {job?.title}
            </Animated.Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
              {job?.type === "full-time" ? "Full Time" : "Part Time"} ●{" "}
              {dayjs(new Date(job?._creationTime!)).fromNow()} ago ●{" "}
              {job?.location?.address?.city}
            </Text>
          </View>
          <Ionicons name="headset-outline" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </Swipeable>
    </>
  );
};
