import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/src/components/Card/Card";
import { Divider } from "@/src/components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Page = () => {
  const { id } = useLocalSearchParams<{ id: Id<"notifications"> }>();
  const { bottom } = useSafeAreaInsets();
  const { settings } = useSettingsStore();
  const notification = useQuery(api.api.notifications.getById, { _id: id! });
  const deleteMutation = useMutation(api.api.notifications.deleteNotification);
  const readMutation = useMutation(api.api.notifications.read);
  const router = useRouter();
  const [state, setState] = React.useState({ loading: false });
  const deleteNotification = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!notification?._id) return;
    setState({ loading: true });
    deleteMutation({ _id: notification._id }).finally(() => {
      setState({ loading: false });
      if (router.canGoBack()) {
        router.back();
      }
    });
  };

  React.useEffect(() => {
    if (!!id) {
      readMutation({ _id: id });
    }
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Notification",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => <HeaderBackButton title={"Notifications"} />,
          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },

          headerRight: () => (
            <TouchableOpacity
              onPress={deleteNotification}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: COLORS.lightGray,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="trash-bin" size={18} color={COLORS.red} />
            </TouchableOpacity>
          ),
        }}
      />
      <Spinner visible={state.loading} animation="fade" />
      {!!!notification ? (
        <View style={{ flex: 1 }}>
          <Divider
            position="center"
            title={`now ago`}
            titleStyles={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
              fontSize: 14,
            }}
          />
          <Card
            style={{
              width: "70%",
              maxWidth: 400,
              alignSelf: "flex-end",
            }}
          >
            <ContentLoader
              style={{
                width: "90%",
                height: 10,
                borderRadius: 10,
                marginBottom: 5,
              }}
            />
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ContentLoader
                  key={i}
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 5,
                    marginBottom: 5,
                  }}
                />
              ))}
            <ContentLoader
              style={{
                width: "50%",
                height: 8,
                borderRadius: 5,
                marginBottom: 5,
              }}
            />
          </Card>

          <View
            style={{
              position: "absolute",
              padding: 10,
              bottom: 0,
              backgroundColor: COLORS.tertiary,
              width: "100%",
              paddingBottom: 10 + bottom,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                textAlign: "center",
                color: COLORS.gray,
              }}
            >
              Notifications from gigsy.
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <Divider
              position="center"
              title={`${dayjs(new Date(notification._creationTime)).fromNow()} ago`}
              titleStyles={{
                fontFamily: FONTS.regular,
                color: COLORS.gray,
                fontSize: 14,
              }}
            />
            <Card
              style={{
                width: "70%",
                maxWidth: 400,
                alignSelf: "flex-end",
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                {notification.title}
              </Text>
              <Text style={{ fontFamily: FONTS.regular }}>
                {notification.body}
              </Text>
            </Card>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              padding: 10,
              bottom: 0,
              backgroundColor: COLORS.tertiary,
              width: "100%",
              paddingBottom: 10 + bottom,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                textAlign: "center",
                color: COLORS.gray,
              }}
            >
              Notifications from gigsy.
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default Page;
