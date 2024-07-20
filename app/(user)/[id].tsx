import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/src/components/Card/Card";
import Animated from "react-native-reanimated";
import UserAdverts from "@/src/components/ProfileComponents/UserAdverts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";

const Page = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{
    id: Id<"users">;
  }>();
  const { settings } = useSettingsStore();
  const user = useQuery(api.api.user.getById, { id: id! });
  const [loaded, setLoaded] = React.useState(true);

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
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),
        }}
      />

      {!!!user ? (
        <ProfileSkeleton />
      ) : (
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
              {!loaded ? (
                <ContentLoader
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 150,
                    display: loaded ? "flex" : "none",
                    backgroundColor: COLORS.lightGray,
                    overflow: "hidden",
                  }}
                />
              ) : null}
              <Link
                asChild
                href={{
                  pathname: "/(user)/picture",
                  params: {
                    uri: user?.image,
                    fullName: `${user?.firstName} ${user?.lastName}`.trim(),
                    uid: user?._id,
                  },
                }}
              >
                <TouchableOpacity>
                  <Animated.Image
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 150,
                      display: loaded ? "flex" : "none",
                    }}
                    source={{
                      uri: user?.image,
                    }}
                    sharedTransitionTag="user-profile-image"
                    onError={(_error) => {
                      setLoaded(true);
                    }}
                    onLoadEnd={() => {
                      setLoaded(true);
                    }}
                    onLoadStart={() => {
                      setLoaded(false);
                    }}
                    onLoad={() => {
                      setLoaded(true);
                    }}
                  />
                </TouchableOpacity>
              </Link>
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
      )}
    </>
  );
};

export default Page;

const ProfileSkeleton = () => (
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
      <ContentLoader
        style={{
          width: 150,
          height: 150,
          borderRadius: 150,
          marginBottom: 20,
        }}
      />
      <ContentLoader
        style={{
          width: 150,
          height: 15,
          borderRadius: 5,
          marginBottom: 5,
        }}
      />
      <ContentLoader
        style={{
          width: 200,
          height: 8,
          borderRadius: 5,
        }}
      />
    </View>
  </Card>
);
