import { FlatList, View, Text } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeJob, { SkeletonHomeJob } from "@/src/components/HomeJob/HomeJob";
import NoJobs from "@/src/components/NoJobs/NoJobs";

const Home = () => {
  const jobs = useQuery(api.api.job.get, { limit: 10 });
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
