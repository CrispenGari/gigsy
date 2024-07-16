import { FlatList, View } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeJob from "@/src/components/HomeJob/HomeJob";

const Home = () => {
  const jobs = useQuery(api.api.job.get, { limit: 10 });
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={jobs}
        keyExtractor={(_id) => _id}
        renderItem={({ item }) => <HomeJob _id={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default Home;
