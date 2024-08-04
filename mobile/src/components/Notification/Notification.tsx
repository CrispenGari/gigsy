import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import Spinner from "react-native-loading-spinner-overlay";
import { Swipeable } from "react-native-gesture-handler";
import { Link } from "expo-router";
import ContentLoader from "../ContentLoader/ContentLoader";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Notification = ({ _id }: { _id: Id<"notifications"> }) => {
  const { settings } = useSettingsStore();
  const notification = useQuery(api.api.notifications.getById, { _id });
  const [state, setState] = React.useState({ loading: false });
  const deleteMutation = useMutation(api.api.notifications.deleteNotification);
  const deleteNotification = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!notification?._id) return;
    setState({ loading: true });
    deleteMutation({ _id: notification._id }).finally(() => {
      setState({ loading: false });
    });
  };

  if (!!!notification) return <SkeletonNotification />;
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
              onPress={deleteNotification}
            >
              <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
          );
        }}
        renderLeftActions={(_progress, _dragX) => {
          return (
            <Link
              href={{
                pathname: "/(notifications)/[id]",
                params: {
                  id: notification._id,
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
        containerStyle={{ maxWidth: 500, width: "100%", alignSelf: "center" }}
      >
        <Link
          href={{
            pathname: "/(notifications)/[id]",
            params: {
              id: notification._id,
            },
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              backgroundColor: notification?.read
                ? COLORS.white
                : COLORS.primary,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.gray,
              maxWidth: 500,
              width: "100%",
              flexDirection: "row",
              gap: 5,
              padding: 10,
              alignSelf: "center",
            }}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
            }}
          >
            <View style={{ gap: 2, alignItems: "center", width: 50 }}>
              <MaterialIcons
                name="notifications"
                size={24}
                color={COLORS.gray}
              />
              <MaterialIcons name="verified" size={12} color={COLORS.green} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                {notification?.title}
              </Text>
              <Text
                style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                numberOfLines={1}
              >
                {notification?.body}
              </Text>
            </View>
            <View>
              <Text style={{ fontFamily: FONTS.bold, color: COLORS.gray }}>
                {dayjs(new Date(notification?._creationTime!)).fromNow()} ago
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </Swipeable>
    </>
  );
};

export default Notification;

export const SkeletonNotification = () => (
  <View
    style={{
      backgroundColor: COLORS.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: COLORS.gray,
      maxWidth: 500,
      width: "100%",
      flexDirection: "row",
      gap: 5,
      padding: 10,
    }}
  >
    <View style={{ gap: 2, alignItems: "center", width: 50 }}>
      <ContentLoader
        style={{
          width: 25,
          height: 25,
          borderRadius: 10,
        }}
      />
      <ContentLoader
        style={{
          width: 10,
          height: 10,
          borderRadius: 10,
        }}
      />
    </View>

    <View style={{ flex: 1 }}>
      <ContentLoader
        style={{
          width: 250,
          height: 10,
          borderRadius: 10,
          marginBottom: 5,
        }}
      />
      <ContentLoader
        style={{
          width: "100%",
          height: 10,
          borderRadius: 10,
        }}
      />
    </View>
    <View>
      <ContentLoader
        style={{
          width: 20,
          height: 10,
          borderRadius: 10,
        }}
      />
    </View>
  </View>
);
