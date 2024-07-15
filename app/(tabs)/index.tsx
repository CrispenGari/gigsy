import { ScrollView, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const jobs = useQuery(api.api.job.get, { limit: 10 });
  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {jobs?.jobs.map((job) => (
        <TouchableOpacity key={job._id}>
          <Text>{job.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Home;
