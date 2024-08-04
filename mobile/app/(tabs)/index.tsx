import {
  Button,
  FlatList,
  NativeScrollEvent,
  RefreshControl,
  View,
} from "react-native";
import React from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeJob, { SkeletonHomeJob } from "@/src/components/HomeJob/HomeJob";
import NoJobs from "@/src/components/NoJobs/NoJobs";
import { useOderStore } from "@/src/store/useOrderStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useLocationStore } from "@/src/store/locationStore";

const PAGE_SIZE = 5;
const Home = () => {
  const { order } = useOderStore();
  const { location } = useLocationStore();
  const {
    settings: {
      location: { distanceRadius, showJobsGlobally, defaultJobListingLocation },
    },
  } = useSettingsStore();
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.api.job.get,
    {
      order,
      distance: {
        coords: { lat: location.lat, lon: location.lon },
        radius: distanceRadius,
      },
      showGlobally: showJobsGlobally,
      withinCity: {
        filter: defaultJobListingLocation,
        value: location.address[defaultJobListingLocation]
          ? defaultJobListingLocation === "country"
            ? location.address.isoCountryCode || "za"
            : location.address[defaultJobListingLocation]
          : "",
      },
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
    <View collapsable={false} style={{ flex: 1, alignItems: "center" }}>
      {status === "LoadingFirstPage" ? (
        <FlatList
          data={Array(PAGE_SIZE).fill(null)}
          keyExtractor={(_, _id) => _id.toString()}
          renderItem={() => <SkeletonHomeJob />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : results.length === 0 ? (
        <NoJobs />
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
          renderItem={({ item }) => <HomeJob _id={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Home;
