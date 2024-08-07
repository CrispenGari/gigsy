import { View, Text, NativeScrollEvent, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/meStore";
import { useOderStore } from "@/src/store/useOrderStore";
import { FlatList } from "react-native";
import { COLORS, FONTS } from "@/src/constants";
import Chat, { SkeletonChat } from "@/src/components/Chat/Chat";
import { Ionicons } from "@expo/vector-icons";

const PAGE_SIZE = 30;

const Page = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { order } = useOderStore();
  const { me } = useMeStore();
  const user = useQuery(api.api.user.get, { id: me?.id || "" });
  const router = useRouter();

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

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.api.chat.get,
    {
      _id: user?._id,
      order,
    },
    { initialNumItems: PAGE_SIZE }
  );

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      {status === "LoadingFirstPage" ? (
        <FlatList
          data={Array(PAGE_SIZE).fill(null)}
          keyExtractor={(_, _id) => _id.toString()}
          renderItem={() => <SkeletonChat />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : results.length === 0 ? (
        <NoChats />
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
          renderItem={({ item }) => <Chat _id={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Page;

const NoChats = () => (
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
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.gray,
          alignItems: "center",
        }}
      >
        No Chats. <Ionicons name="chatbox-outline" size={20} />
      </Text>
    </View>
  </View>
);
