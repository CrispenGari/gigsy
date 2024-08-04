import {
  View,
  Text,
  NativeScrollEvent,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOderStore } from "@/src/store/useOrderStore";
import { useMeStore } from "@/src/store/meStore";
import Notification, {
  SkeletonNotification,
} from "@/src/components/Notification/Notification";
import { Stack } from "expo-router";
import { COLORS, FONTS } from "@/src/constants";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
const PAGE_SIZE = 10;

const Page = () => {
  const { order } = useOderStore();
  const { me } = useMeStore();
  const user = useQuery(api.api.user.get, { id: me?.id || "" });
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.api.notifications.get,
    {
      order,
      _id: user?._id as any,
    },
    { initialNumItems: PAGE_SIZE }
  );
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 100;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Notifications",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => <HeaderBackButton title={"Explore"} />,
          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />
      <View style={{ flex: 1 }}>
        {status === "LoadingFirstPage" ? (
          <FlatList
            data={Array(PAGE_SIZE).fill(null)}
            keyExtractor={(_, _id) => _id.toString()}
            renderItem={() => <SkeletonNotification />}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : results.length === 0 ? (
          <NoNotifications />
        ) : (
          <FlatList
            scrollEventThrottle={16}
            onScroll={({ nativeEvent }) => {
              if (
                isCloseToBottom(nativeEvent) &&
                status !== "LoadingMore" &&
                status === "CanLoadMore" &&
                !isLoading
              ) {
                loadMore(PAGE_SIZE);
              }
            }}
            data={results}
            keyExtractor={(_id) => _id}
            renderItem={({ item }) => <Notification _id={item} />}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

export default Page;

const NoNotifications = () => (
  <View style={{ flex: 1, alignItems: "center" }}>
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
        height: 300,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontFamily: FONTS.bold, color: COLORS.gray }}>
        No Notifications.
      </Text>
    </View>
  </View>
);
