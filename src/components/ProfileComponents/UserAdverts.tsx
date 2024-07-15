import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useMeStore } from "@/src/store/meStore";
import Card from "../Card/Card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Ionicons } from "@expo/vector-icons";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const UserAdverts = () => {
  const { me } = useMeStore();
  const jobs = useQuery(api.api.user.userAdverts, { id: me?.id || "" });

  return (
    <Card style={{ flex: 1, marginVertical: 10 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: FONTS.bold, marginBottom: 10, fontSize: 20 }}
        >
          Your Adverts
        </Text>
        <FlatList
          data={jobs?.jobs}
          keyExtractor={({ _id }) => _id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 18,
                      paddingVertical: 5,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                  >
                    {item.type === "full-time" ? "Full Time" : "Part Time"} ●{" "}
                    {dayjs(new Date(item._creationTime)).fromNow()} ago
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Card>
  );
};

export default UserAdverts;
