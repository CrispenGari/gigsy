import { FlatList, View } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeJob, { SkeletonHomeJob } from "@/src/components/HomeJob/HomeJob";
import NoJobs from "@/src/components/NoJobs/NoJobs";
import { useOderStore } from "@/src/store/useOrderStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useLocationStore } from "@/src/store/locationStore";

const Home = () => {
  const { order } = useOderStore();
  const { location } = useLocationStore();
  const {
    settings: {
      location: { distanceRadius, showJobsGlobally, defaultJobListingLocation },
    },
  } = useSettingsStore();
  const jobs = useQuery(api.api.job.get, {
    limit: 10,
    order,
    filters: {
      defaultJobListingLocation,
      showJobsGlobally,
    },
    filterValues: {
      distanceRadius: distanceRadius || 0,
      defaultJobListingLocation:
        defaultJobListingLocation === "city"
          ? location.address.city || ""
          : defaultJobListingLocation === "country"
            ? location.address.isoCountryCode || ""
            : location.address.region || "",

      coords: {
        lat: location.lat,
        lon: location.lon,
      },
    },
  });

  return (
    <View collapsable={false} style={{ flex: 1 }}>
      {typeof jobs === "undefined" ? (
        <FlatList
          data={Array(10).fill(null)}
          keyExtractor={(_, _id) => _id.toString()}
          renderItem={() => <SkeletonHomeJob />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : jobs.length === 0 ? (
        <NoJobs />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(_id) => _id}
          renderItem={({ item }) => <HomeJob _id={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default Home;
