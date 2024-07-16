import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";

import Card from "@/src/components/Card/Card";
import Animated from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import UserAdverts from "@/src/components/ProfileComponents/UserAdverts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const Page = () => {
  const router = useRouter();
  const { me } = useMeStore();
  const { id } = useLocalSearchParams<{
    id: Id<"users">;
  }>();

  const user = useQuery(api.api.user.getById, { id: id! });
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FONTS.bold },
          headerTitle: "Profile",
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.green} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={{ padding: 10, flex: 1 }}>
        <Card
          style={{
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 400,
            borderRadius: 20,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Animated.Image
              style={{ width: 150, height: 150, borderRadius: 150 }}
              source={{
                uri: user?.image,
              }}
            />

            <Text
              style={{ fontSize: 18, fontFamily: FONTS.bold, marginTop: 20 }}
            >
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
              {user?.email}
            </Text>
          </View>
        </Card>
        <UserAdverts id={user?.id} />
      </View>
    </>
  );
};

export default Page;
